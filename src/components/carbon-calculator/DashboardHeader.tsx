
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:justify-between lg:items-center">
      <div className="text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Painel de Pegada Ecológica</h1>
        <p className="text-muted-foreground mt-1 text-sm lg:text-base">Monitore sua pegada de carbono e tome decisões sustentáveis</p>
      </div>
      
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        {/* Informações do usuário */}
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg justify-center sm:justify-start">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium truncate">{user?.email}</span>
        </div>

        <div className="flex gap-2 justify-center sm:justify-start">
          {/* Botão Admin */}
          {isAdmin && (
            <Button variant="outline" size="sm" asChild className="text-primary border-primary/20 hover:bg-primary/5 flex-1 sm:flex-none">
              <Link to="/admin" className="flex items-center justify-center">
                <Shield className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Área Admin</span>
              </Link>
            </Button>
          )}

          {/* Botão Logout */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => signOut()}
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 flex-1 sm:flex-none"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
