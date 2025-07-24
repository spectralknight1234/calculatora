
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

type Profile = {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

const Admin = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const profilesData = data?.map(profile => ({
        id: profile.id,
        email: profile.email,
        role: profile.role as 'user' | 'admin',
        created_at: profile.created_at
      })) || [];
      
      setUsers(profilesData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar usuários';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (id: string, currentRole: 'user' | 'admin') => {
    try {
      const newRole = currentRole === 'user' ? 'admin' : 'user';
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Papel do usuário alterado para ${newRole}`);
      
      // Atualiza a lista de usuários
      setUsers(users.map(u => 
        u.id === id ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar papel do usuário';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel de Administração</h1>
          <p className="text-muted-foreground mt-1">Gerencie usuários e permissões do sistema</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-full">
          <Shield className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Usuários ({users.length})</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando usuários...</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        profile.role === 'admin' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-secondary/10 text-secondary-foreground'
                      }`}>
                        {profile.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(profile.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserRole(profile.id, profile.role)}
                        disabled={profile.id === user?.id}
                      >
                        {profile.role === 'user' ? 'Promover a Admin' : 'Remover Admin'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
