
import { Leaf, Globe } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between pb-6">
      <div className="flex items-center space-x-2">
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
          <Leaf className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-2xl">Calculadora de Pegada de Carbono</h1>
          <p className="text-muted-foreground">Meça e reduza seu impacto ambiental</p>
        </div>
      </div>
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Globe className="h-4 w-4 mr-1" />
        <span>Emissões globais em Carbonum: 28,7 bilhões de toneladas por ano</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
