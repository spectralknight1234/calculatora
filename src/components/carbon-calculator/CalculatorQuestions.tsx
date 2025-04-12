
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalculatorQuestionProps {
  category: string;
}

const CalculatorQuestions = ({ category }: CalculatorQuestionProps) => {
  let question = "";
  let example = "";

  switch (category) {
    case "transportation":
      question = "Quantos quilômetros você percorreu?";
      example = "Ex: 20 km de carro ou 500 km de avião";
      break;
    case "electricity":
      question = "Quanto de energia elétrica você consumiu?";
      example = "Ex: 150 kWh no mês";
      break;
    case "food":
      question = "Qual a quantidade de alimento consumido?";
      example = "Ex: 1 kg de carne ou 2 kg de frutas/vegetais";
      break;
    case "shopping":
      question = "Qual o valor das suas compras?";
      example = "Ex: R$ 100 em roupas ou R$ 200 em eletrônicos";
      break;
    case "waste":
      question = "Quantos quilos de lixo você gerou?";
      example = "Ex: 5 kg de lixo doméstico ou 2 kg de material reciclável";
      break;
    default:
      question = "Selecione uma categoria e insira a quantidade";
      example = "";
  }

  return (
    <div className="flex items-center text-sm mb-1 text-muted-foreground">
      <span>{question}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="ml-1 inline-flex">
            <Info size={14} className="text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{example}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default CalculatorQuestions;
