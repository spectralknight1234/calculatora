
import { useState } from "react";
import { Car, Lightbulb, ShoppingBag, Trash2, Utensils, FileText, RefreshCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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

  const resetEmissionData = () => {
    setEmissionData(DEFAULT_EMISSION_DATA);
    toast.success("Histórico de cálculos apagado com sucesso!");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Título do documento
    doc.setFontSize(20);
    doc.text("Relatório de Pegada de Carbono", 20, 20);
    
    // Data do relatório
    const today = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${today}`, 20, 30);
    
    // Informações gerais
    doc.setFontSize(14);
    doc.text("Resumo de Emissões", 20, 40);
    
    doc.setFontSize(12);
    doc.text(`Emissão Total: ${totalEmissions.toFixed(1)} kg CO₂e`, 20, 50);
    doc.text(`Meta: ${goal} kg CO₂e`, 20, 60);
    
    // Tabela de dados por categoria
    doc.setFontSize(14);
    doc.text("Detalhamento por Categoria", 20, 75);
    
    let yPosition = 85;
    
    // Cabeçalho da tabela
    doc.setFontSize(10);
    doc.text("Categoria", 20, yPosition);
    doc.text("Emissões (kg CO₂e)", 90, yPosition);
    yPosition += 5;
    
    // Linha separadora
    doc.line(20, yPosition, 180, yPosition);
    yPosition += 10;
    
    // Dados de cada categoria
    emissionData.forEach(category => {
      doc.text(category.name, 20, yPosition);
      doc.text(category.emissions.toFixed(1), 90, yPosition);
      yPosition += 10;
    });
    
    // Recomendações
    if (recommendations.length > 0) {
      yPosition += 10;
      doc.setFontSize(14);
      doc.text("Recomendações para Redução", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      recommendations.forEach(rec => {
        doc.text(`• ${rec.description}`, 20, yPosition);
        yPosition += 7;
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
    }
    
    // Salvar o PDF
    doc.save("relatorio-pegada-carbono.pdf");
    toast.success("Relatório PDF gerado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <DashboardHeader />

        <div className="flex justify-end gap-2 mb-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                <RefreshCcw size={16} className="mr-1" />
                Limpar Histórico
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar histórico de cálculos?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá apagar todas as emissões calculadas até o momento.
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={resetEmissionData} className="bg-red-500 hover:bg-red-600">
                  Sim, limpar histórico
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button variant="outline" size="sm" onClick={exportToPDF} className="text-primary border-primary/20 hover:bg-primary/5">
            <FileText size={16} className="mr-1" />
            Exportar para PDF
          </Button>
        </div>

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
