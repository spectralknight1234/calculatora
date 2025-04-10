
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface RecommendationCardProps {
  recommendations: string[];
}

const RecommendationCard = ({ recommendations }: RecommendationCardProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
          Recomendações Personalizadas
        </CardTitle>
        <CardDescription>
          Com base na sua pegada de carbono, aqui estão algumas sugestões para reduzir seu impacto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-sm">{recommendation}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
