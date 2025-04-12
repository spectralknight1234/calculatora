
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { EmissionCategory, DEFAULT_EMISSION_DATA, calculateEmission, getCategoryName, getCategoryColor, getCategoryUnit } from "@/utils/carbon-calculations";

const STORAGE_KEY = 'carbon-emissions-data';

export function useEmissionData() {
  // Inicializa com dados do localStorage ou usa os dados padrão
  const [emissionData, setEmissionData] = useState<EmissionCategory[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : DEFAULT_EMISSION_DATA;
  });
  
  // Salva os dados no localStorage quando eles mudam
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emissionData));
  }, [emissionData]);

  const totalEmissions = emissionData.reduce(
    (sum, category) => sum + category.emissions,
    0
  );

  const chartData = emissionData.map((category) => ({
    name: category.name,
    value: category.emissions,
    color: category.color,
  }));

  const handleCalculate = (values: {
    category: string;
    amount: number;
    unit?: string;
  }) => {
    const emissionAmount = calculateEmission(values.category, values.amount);
    
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
  };

  const resetEmissionData = () => {
    // Zera apenas as emissões, preservando as categorias
    const resetData = emissionData.map(category => ({
      ...category,
      emissions: 0
    }));
    
    setEmissionData(resetData);
    toast.success("Histórico de cálculos zerado com sucesso!");
  };

  return {
    emissionData,
    totalEmissions,
    chartData,
    handleCalculate,
    resetEmissionData
  };
}
