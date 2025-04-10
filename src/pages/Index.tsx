
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
  const [goal] = useState(250); // Carbon reduction goal in kg CO2e

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
        // Update existing category
        newData[categoryIndex] = {
          ...newData[categoryIndex],
          emissions: newData[categoryIndex].emissions + emissionAmount,
        };
      } else {
        // Add new category
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

    toast.success(`Added ${emissionAmount.toFixed(1)} kg of CO₂e from ${getCategoryName(values.category)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <DashboardHeader />

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EmissionsSummary totalEmissions={totalEmissions} goal={goal} />
              
              <StatCard
                title="Transportation"
                value={emissionData.find(c => c.id === "transportation")?.emissions || 0}
                unit="kg CO₂e"
                description="From travel and commuting"
                icon={<Car />}
                trend={{ value: 5, label: "from last month", positive: true }}
              />
              
              <StatCard
                title="Energy"
                value={emissionData.find(c => c.id === "electricity")?.emissions || 0}
                unit="kg CO₂e"
                description="From electricity and heating"
                icon={<Lightbulb />}
                trend={{ value: 2, label: "from last month", positive: false }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Food"
                value={emissionData.find(c => c.id === "food")?.emissions || 0}
                unit="kg CO₂e"
                description="From food consumption"
                icon={<Utensils />}
                trend={{ value: 3, label: "from last month", positive: true }}
              />
              
              <StatCard
                title="Shopping"
                value={emissionData.find(c => c.id === "shopping")?.emissions || 0}
                unit="kg CO₂e"
                description="From purchases"
                icon={<ShoppingBag />}
                trend={{ value: 1, label: "from last month", positive: false }}
              />
              
              <StatCard
                title="Waste"
                value={emissionData.find(c => c.id === "waste")?.emissions || 0}
                unit="kg CO₂e"
                description="From waste generation"
                icon={<Trash2 />}
                trend={{ value: 7, label: "from last month", positive: true }}
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
