
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
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Carbon Emissions by Category</CardTitle>
        <CardDescription>
          Breakdown of your carbon footprint by source
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis unit=" kg" />
            <Tooltip
              formatter={(value) => [`${value} kg CO₂e`, "Emissions"]}
              contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name="CO₂ Emissions"
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
