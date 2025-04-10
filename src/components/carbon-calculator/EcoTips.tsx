
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const tips = [
  {
    category: "Transporte",
    tip: "Opte por transporte público, bicicleta ou caminhada para trajetos curtos. Se precisar dirigir, considere caronas ou um veículo elétrico.",
  },
  {
    category: "Energia",
    tip: "Mude para lâmpadas LED, desligue eletrônicos quando não estiver usando e considere instalar painéis solares se possível.",
  },
  {
    category: "Alimentação",
    tip: "Reduza o consumo de carne, especialmente bovina, e opte por produtos locais e sazonais para reduzir a pegada de carbono dos alimentos.",
  },
  {
    category: "Compras",
    tip: "Escolha produtos com embalagem mínima, compre itens usados quando possível e invista em produtos de qualidade que duram mais tempo.",
  },
  {
    category: "Resíduos",
    tip: "Pratique os 3 Rs: Reduzir, Reutilizar, Reciclar. Faça compostagem de restos de comida e evite plásticos de uso único.",
  },
];

const EcoTips = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          Dicas Ecológicas
        </CardTitle>
        <CardDescription>
          Formas simples de reduzir sua pegada de carbono
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="pb-3 border-b last:border-0">
              <h4 className="font-semibold text-sm">{tip.category}</h4>
              <p className="text-sm text-muted-foreground">{tip.tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EcoTips;
