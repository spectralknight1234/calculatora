
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const tips = [
  {
    category: "Transportation",
    tip: "Opt for public transport, cycling, or walking for shorter trips. If you must drive, consider carpooling or switching to an electric vehicle.",
  },
  {
    category: "Energy",
    tip: "Switch to LED bulbs, unplug electronics when not in use, and consider installing solar panels if possible.",
  },
  {
    category: "Food",
    tip: "Reduce meat consumption, especially beef, and opt for locally sourced, seasonal produce to reduce food miles.",
  },
  {
    category: "Shopping",
    tip: "Choose products with minimal packaging, buy second-hand when possible, and invest in quality items that last longer.",
  },
  {
    category: "Waste",
    tip: "Practice the 3 Rs: Reduce, Reuse, Recycle. Compost food scraps and avoid single-use plastics.",
  },
];

const EcoTips = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          Eco-Friendly Tips
        </CardTitle>
        <CardDescription>
          Simple ways to reduce your carbon footprint
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
