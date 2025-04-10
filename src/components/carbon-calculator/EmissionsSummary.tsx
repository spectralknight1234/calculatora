
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EmissionsSummaryProps {
  totalEmissions: number;
  goal: number;
}

const EmissionsSummary = ({ totalEmissions, goal }: EmissionsSummaryProps) => {
  const progress = Math.min(100, Math.max(0, (1 - totalEmissions / goal) * 100));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Carbon Footprint</CardTitle>
        <CardDescription>Your current carbon emissions and reduction target</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-4xl font-bold text-primary">{totalEmissions.toFixed(1)}</span>
          <span className="text-2xl ml-1">kg CO₂e</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current</span>
            <span>Goal: {goal} kg CO₂e</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="text-sm text-muted-foreground text-center mt-2">
            {progress >= 100 ? (
              <span className="text-green-600 font-medium">Goal achieved! 🎉</span>
            ) : (
              <span>You need to reduce by {(totalEmissions - goal).toFixed(1)} kg CO₂e to reach your goal</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmissionsSummary;
