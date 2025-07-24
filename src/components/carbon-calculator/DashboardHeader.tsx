
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Painel de Pegada Ecológica</h1>
        <p className="text-muted-foreground mt-1">Monitore sua pegada de carbono e tome decisões sustentáveis</p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Informações do usuário */}
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{user?.email}</span>
        </div>

        {/* Botão Admin */}
        {isAdmin && (
          <Button variant="outline" size="sm" asChild className="text-primary border-primary/20 hover:bg-primary/5">
            <Link to="/admin" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Área Admin
            </Link>
          </Button>
        )}

        {/* Botão Logout */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => signOut()}
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
