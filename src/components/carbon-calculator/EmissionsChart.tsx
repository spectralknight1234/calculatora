
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmissionsChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

const EmissionsChart = ({ data }: EmissionsChartProps) => {
  return (
    <Card className="col-span-2 shadow-sm">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Emissões de Carbono por Categoria</CardTitle>
        <CardDescription className="text-xs">
          Detalhamento da sua pegada de carbono por fonte
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" fontSize={11} />
            <YAxis unit=" kg" fontSize={11} />
            <Tooltip
              formatter={(value) => [`${value} kg CO₂e`, "Emissões"]}
              contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e2e8f0", fontSize: "12px" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", marginTop: "10px" }} />
            <Bar 
              dataKey="value" 
              name="Emissões de CO₂"
              fill="#8ABA6F"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmissionsChart;
