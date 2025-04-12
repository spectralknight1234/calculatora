
import { Button } from "@/components/ui/button";
import { RefreshCcw, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { exportEmissionsToPDF } from "@/services/pdfExportService";
import { EmissionCategory } from "@/utils/carbon-calculations";

interface DashboardActionsProps {
  emissionData: EmissionCategory[];
  totalEmissions: number;
  goal: number;
  onResetData: () => void;
}

const DashboardActions = ({ emissionData, totalEmissions, goal, onResetData }: DashboardActionsProps) => {
  const handleExportPDF = () => {
    exportEmissionsToPDF(emissionData, totalEmissions, goal);
  };

  return (
    <div className="flex justify-end gap-2 mb-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
            <RefreshCcw size={16} className="mr-1" />
            Limpar Histórico
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar histórico de cálculos?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá apagar todas as emissões calculadas até o momento.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onResetData} className="bg-red-500 hover:bg-red-600">
              Sim, limpar histórico
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Button variant="outline" size="sm" onClick={handleExportPDF} className="text-primary border-primary/20 hover:bg-primary/5">
        <FileText size={16} className="mr-1" />
        Exportar para PDF
      </Button>
    </div>
  );
};

export default DashboardActions;
