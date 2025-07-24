
import { Button } from "@/components/ui/button";
import { RefreshCcw, FileText, Mail, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { exportEmissionsToPDF, sendPDFByEmail } from "@/services/pdfExportService";
import { EmissionCategory } from "@/utils/carbon-calculations";

interface DashboardActionsProps {
  emissionData: EmissionCategory[];
  totalEmissions: number;
  goal: number;
  onResetData: () => void;
}

const DashboardActions = ({ emissionData, totalEmissions, goal, onResetData }: DashboardActionsProps) => {
  const [email, setEmail] = useState("");
  const [isEmailSending, setIsEmailSending] = useState(false);
  
  const handleExportPDF = () => {
    exportEmissionsToPDF(emissionData, totalEmissions, goal);
  };
  
  const handleSendEmail = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Por favor, insira um endereço de e-mail válido.");
      return;
    }
    
    setIsEmailSending(true);
    try {
      await sendPDFByEmail(email, emissionData, totalEmissions, goal);
      setEmail("");
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center md:justify-end gap-3 mb-6 p-4 bg-card rounded-lg border shadow-sm">
      {/* Botão Exportar PDF - destacado */}
      <Button 
        variant="default" 
        size="sm" 
        onClick={handleExportPDF} 
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <FileText size={16} className="mr-2" />
        Exportar PDF
      </Button>
      
      {/* Botão Enviar por Email */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-blue-500 border-blue-200 hover:bg-blue-50 hover:text-blue-600">
            <Mail size={16} className="mr-2" />
            Enviar por Email
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar relatório por e-mail</DialogTitle>
            <DialogDescription>
              Insira o endereço de e-mail para receber o relatório de pegada de carbono.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="border rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Cancelar</Button>
            </DialogClose>
            <Button 
              onClick={handleSendEmail} 
              size="sm"
              className="bg-primary text-white"
              disabled={isEmailSending}
            >
              {isEmailSending ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>Enviar Relatório</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Botão Limpar Histórico */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
            <RefreshCcw size={16} className="mr-2" />
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
    </div>
  );
};

export default DashboardActions;
