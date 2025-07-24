
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EmissionCategory, DEFAULT_EMISSION_DATA, calculateEmission, getCategoryName, getCategoryColor, getCategoryUnit } from "@/utils/carbon-calculations";

export function useEmissionData() {
  const { user } = useAuth();
  const [emissionData, setEmissionData] = useState<EmissionCategory[]>(DEFAULT_EMISSION_DATA);
  const [loading, setLoading] = useState(true);

  // Carrega os dados do usuário do Supabase
  useEffect(() => {
    if (user) {
      loadUserEmissions();
    } else {
      // Se não há usuário, usar dados padrão zerados
      setEmissionData(DEFAULT_EMISSION_DATA.map(category => ({
        ...category,
        emissions: 0
      })));
      setLoading(false);
    }
  }, [user]);

  const loadUserEmissions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_emissions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        // Converte os dados do banco para o formato esperado
        const loadedData: EmissionCategory[] = data.map(item => ({
          id: item.category_id,
          name: item.category_name,
          color: item.category_color,
          emissions: parseFloat(item.emissions.toString()),
          unit: item.unit,
          factor: parseFloat(item.factor.toString())
        }));
        
        setEmissionData(loadedData);
      } else {
        // Se não há dados, inicializar com categorias padrão zeradas
        const initialData = DEFAULT_EMISSION_DATA.map(category => ({
          ...category,
          emissions: 0
        }));
        setEmissionData(initialData);
        
        // Salvar as categorias iniciais no banco
        await saveInitialCategories(initialData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de emissões:', error);
      toast.error('Erro ao carregar dados de emissões');
    } finally {
      setLoading(false);
    }
  };

  const saveInitialCategories = async (categories: EmissionCategory[]) => {
    if (!user) return;

    try {
      const categoriesData = categories.map(category => ({
        user_id: user.id,
        category_id: category.id,
        category_name: category.name,
        category_color: category.color,
        emissions: 0,
        unit: category.unit,
        factor: category.factor
      }));

      const { error } = await supabase
        .from('user_emissions')
        .insert(categoriesData);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao salvar categorias iniciais:', error);
    }
  };

  const totalEmissions = emissionData.reduce(
    (sum, category) => sum + category.emissions,
    0
  );

  const chartData = emissionData.map((category) => ({
    name: category.name,
    value: category.emissions,
    color: category.color,
  }));

  const handleCalculate = async (values: {
    category: string;
    amount: number;
    unit?: string;
  }) => {
    if (!user) {
      toast.error("Você precisa estar logado para calcular emissões");
      return;
    }

    const emissionAmount = calculateEmission(values.category, values.amount);
    
    try {
      // Atualiza no banco de dados
      const currentEmissions = emissionData.find(item => item.id === values.category)?.emissions || 0;
      const { error } = await supabase
        .from('user_emissions')
        .upsert({
          user_id: user.id,
          category_id: values.category,
          category_name: getCategoryName(values.category),
          category_color: getCategoryColor(values.category),
          emissions: currentEmissions + emissionAmount,
          unit: getCategoryUnit(values.category),
          factor: 0
        });

      if (error) throw error;

      // Atualiza o estado local
      setEmissionData((prevData) => {
        const newData = [...prevData];
        const categoryIndex = newData.findIndex(
          (item) => item.id === values.category
        );

        if (categoryIndex >= 0) {
          newData[categoryIndex] = {
            ...newData[categoryIndex],
            emissions: newData[categoryIndex].emissions + emissionAmount,
          };
        } else {
          newData.push({
            id: values.category,
            name: getCategoryName(values.category),
            color: getCategoryColor(values.category),
            emissions: emissionAmount,
            unit: getCategoryUnit(values.category),
            factor: 0,
          });
        }

        return newData;
      });

      toast.success(`Adicionado ${emissionAmount.toFixed(1)} kg de CO₂e de ${getCategoryName(values.category)}`);
    } catch (error) {
      console.error('Erro ao salvar dados de emissão:', error);
      toast.error('Erro ao salvar dados de emissão');
    }
  };

  const resetEmissionData = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para resetar os dados");
      return;
    }

    try {
      // Atualiza todas as emissões para 0 no banco
      const { error } = await supabase
        .from('user_emissions')
        .update({ emissions: 0 })
        .eq('user_id', user.id);

      if (error) throw error;

      // Atualiza o estado local
      const resetData = emissionData.map(category => ({
        ...category,
        emissions: 0
      }));
      
      setEmissionData(resetData);
      toast.success("Histórico de cálculos zerado com sucesso!");
    } catch (error) {
      console.error('Erro ao resetar dados:', error);
      toast.error('Erro ao resetar dados');
    }
  };

  return {
    emissionData,
    totalEmissions,
    chartData,
    handleCalculate,
    resetEmissionData,
    loading
  };
}
