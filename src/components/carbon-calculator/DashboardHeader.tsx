
import { Leaf } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between pb-6">
      <div className="flex items-center space-x-2">
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
          <Leaf className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-2xl">Carbon Footprint Calculator</h1>
          <p className="text-muted-foreground">Measure and reduce your environmental impact</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
