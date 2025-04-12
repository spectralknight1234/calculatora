
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/carbon-calculator/DashboardHeader";
import DashboardActions from "@/components/carbon-calculator/DashboardActions";
import DashboardTab from "@/components/carbon-calculator/DashboardTab";
import CalculatorTab from "@/components/carbon-calculator/CalculatorTab";
import { useEmissionData } from "@/hooks/useEmissionData";

const Index = () => {
  const { 
    emissionData, 
    totalEmissions, 
    chartData, 
    handleCalculate, 
    resetEmissionData 
  } = useEmissionData();
  
  const goal = 250; // Meta de redução de carbono em kg CO2e

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <DashboardHeader />

        <DashboardActions 
          emissionData={emissionData}
          totalEmissions={totalEmissions}
          goal={goal}
          onResetData={resetEmissionData}
        />

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="dashboard">Painel</TabsTrigger>
            <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <DashboardTab 
              emissionData={emissionData}
              totalEmissions={totalEmissions}
              chartData={chartData}
              goal={goal}
            />
          </TabsContent>
          
          <TabsContent value="calculator">
            <CalculatorTab onCalculate={handleCalculate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
