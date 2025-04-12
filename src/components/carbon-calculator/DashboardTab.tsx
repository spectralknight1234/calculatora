
import { Separator } from "@/components/ui/separator";
import EmissionsChart from "./EmissionsChart";
import EmissionsSummary from "./EmissionsSummary";
import EcoTips from "./EcoTips";
import StatCard from "./CategoryStats";
import RecommendationCard from "./RecommendationCard";
import { Car, Lightbulb, ShoppingBag, Trash2, Utensils } from "lucide-react";
import { EmissionCategory, getRecommendations } from "@/utils/carbon-calculations";

interface DashboardTabProps {
  emissionData: EmissionCategory[];
  totalEmissions: number;
  chartData: Array<{ name: string; value: number; color: string }>;
  goal: number;
}

const DashboardTab = ({ emissionData, totalEmissions, chartData, goal }: DashboardTabProps) => {
  const recommendations = getRecommendations(emissionData);

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default DashboardTab;
