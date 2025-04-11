
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EmissionsSummaryProps {
  totalEmissions: number;
  goal: number;
}

const EmissionsSummary = ({ totalEmissions, goal }: EmissionsSummaryProps) => {
  const progress = Math.min(100, Math.max(0, (1 - totalEmissions / goal) * 100));
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Pegada de Carbono Total</CardTitle>
        <CardDescription className="text-xs">Suas emissões atuais de carbono e meta de redução</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="text-center">
          <span className="text-3xl font-bold text-primary">{totalEmissions.toFixed(1)}</span>
          <span className="text-xl ml-1">kg CO₂e</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Atual</span>
            <span>Meta: {goal} kg CO₂e</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="text-xs text-muted-foreground text-center mt-1">
            {progress >= 100 ? (
              <span className="text-green-600 font-medium">Meta alcançada! 🎉</span>
            ) : (
              <span>Você precisa reduzir {(totalEmissions - goal).toFixed(1)} kg CO₂e para atingir sua meta</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmissionsSummary;
