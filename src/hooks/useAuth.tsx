
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar se o usuário é admin com tratamento de erro aprimorado
  const checkUserRole = async (userId: string) => {
    try {
      // Primeira tentativa - usando o método RPC para evitar problemas de RLS
      const { data, error } = await supabase
        .rpc('get_user_role', { user_id: userId });

      if (!error && data) {
        setIsAdmin(data === 'admin');
        return;
      }
      
      // Fallback - tentativa direta na tabela
      console.log("Usando método alternativo para verificar role do usuário");
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao verificar papel do usuário:', profileError);
        // Não falha completamente, apenas assume que não é admin
        setIsAdmin(false);
        return;
      }

      setIsAdmin(profileData?.role === 'admin');
    } catch (e) {
      console.error('Erro ao verificar papel do usuário:', e);
      // Em caso de erro, assumimos que o usuário não é admin para permitir o funcionamento da aplicação
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Usando setTimeout para evitar recursão infinita nas políticas RLS
          setTimeout(() => {
            checkUserRole(session.user.id);
          }, 100);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          checkUserRole(session.user.id);
        }, 100);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Erro ao fazer login';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        toast.success('Conta criada com sucesso! Verifique seu email.');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Erro ao criar conta';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        toast.error(error.message);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Erro ao sair';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, isAdmin, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
