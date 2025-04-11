
import { useState } from "react";
import { Car, Lightbulb, ShoppingBag, Trash2, Utensils } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import DashboardHeader from "@/components/carbon-calculator/DashboardHeader";
import CarbonCalculator from "@/components/carbon-calculator/CarbonCalculator";
import EmissionsChart from "@/components/carbon-calculator/EmissionsChart";
import EmissionsSummary from "@/components/carbon-calculator/EmissionsSummary";
import EcoTips from "@/components/carbon-calculator/EcoTips";
import StatCard from "@/components/carbon-calculator/CategoryStats";
import RecommendationCard from "@/components/carbon-calculator/RecommendationCard";

import {
  calculateEmission,
  DEFAULT_EMISSION_DATA,
  EmissionCategory,
  getCategoryColor,
  getCategoryName,
  getCategoryUnit,
  getRecommendations,
} from "@/utils/carbon-calculations";

const Index = () => {
  const [emissionData, setEmissionData] = useState<EmissionCategory[]>(DEFAULT_EMISSION_DATA);
  const [goal] = useState(250); // Meta de redução de carbono em kg CO2e

  const totalEmissions = emissionData.reduce(
    (sum, category) => sum + category.emissions,
    0
  );

  const chartData = emissionData.map((category) => ({
    name: category.name,
    value: category.emissions,
    color: category.color,
  }));

  const recommendations = getRecommendations(emissionData);

  const handleCalculate = (values: {
    category: string;
    amount: number;
    unit?: string;
  }) => {
    const emissionAmount = calculateEmission(values.category, values.amount);
    
    setEmissionData((prevData) => {
      const newData = [...prevData];
      const categoryIndex = newData.findIndex(
        (item) => item.id === values.category
      );

      if (categoryIndex >= 0) {
        // Atualiza categoria existente
        newData[categoryIndex] = {
          ...newData[categoryIndex],
          emissions: newData[categoryIndex].emissions + emissionAmount,
        };
      } else {
        // Adiciona nova categoria
        newData.push({
          id: values.category,
          name: getCategoryName(values.category),
          color: getCategoryColor(values.category),
          emissions: emissionAmount,
          unit: getCategoryUnit(values.category),
          factor: 0,
        });
      }

      return newData;
    });

    toast.success(`Adicionado ${emissionAmount.toFixed(1)} kg de CO₂e de ${getCategoryName(values.category)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <DashboardHeader />

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="dashboard">Painel</TabsTrigger>
            <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EmissionsSummary totalEmissions={totalEmissions} goal={goal} />
              
              <StatCard
                title="Transporte"
                value={emissionData.find(c => c.id === "transportation")?.emissions || 0}
                unit="kg CO₂e"
                description="De viagens e deslocamentos"
                icon={<Car />}
                trend={{ value: 5, label: "do mês anterior", positive: true }}
              />
              
              <StatCard
                title="Energia"
                value={emissionData.find(c => c.id === "electricity")?.emissions || 0}
                unit="kg CO₂e"
                description="De eletricidade e aquecimento"
                icon={<Lightbulb />}
                trend={{ value: 2, label: "do mês anterior", positive: false }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Alimentação"
                value={emissionData.find(c => c.id === "food")?.emissions || 0}
                unit="kg CO₂e"
                description="Do consumo de alimentos"
                icon={<Utensils />}
                trend={{ value: 3, label: "do mês anterior", positive: true }}
              />
              
              <StatCard
                title="Compras"
                value={emissionData.find(c => c.id === "shopping")?.emissions || 0}
                unit="kg CO₂e"
                description="De suas compras"
                icon={<ShoppingBag />}
                trend={{ value: 1, label: "do mês anterior", positive: false }}
              />
              
              <StatCard
                title="Resíduos"
                value={emissionData.find(c => c.id === "waste")?.emissions || 0}
                unit="kg CO₂e"
                description="Da geração de resíduos"
                icon={<Trash2 />}
                trend={{ value: 7, label: "do mês anterior", positive: true }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EmissionsChart data={chartData} />
              <EcoTips />
            </div>
            
            <Separator />
            
            <RecommendationCard recommendations={recommendations} />
          </TabsContent>
          
          <TabsContent value="calculator">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CarbonCalculator onCalculate={handleCalculate} />
              <EcoTips />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
