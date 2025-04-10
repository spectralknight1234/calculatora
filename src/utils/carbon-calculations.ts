
export interface EmissionCategory {
  id: string;
  name: string;
  color: string;
  emissions: number;
  unit: string;
  factor: number;
}

// Fatores de emissão simples (kg CO2e por unidade)
const EMISSION_FACTORS = {
  transportation: 0.12, // por km
  electricity: 0.5, // por kWh
  food: 2.5, // por kg
  shopping: 0.5, // por real
  waste: 0.5, // por kg
};

export const calculateEmission = (
  category: string,
  amount: number
): number => {
  const factor = EMISSION_FACTORS[category as keyof typeof EMISSION_FACTORS] || 0;
  return factor * amount;
};

export const getCategoryUnit = (category: string): string => {
  switch (category) {
    case "transportation":
      return "km";
    case "electricity":
      return "kWh";
    case "food":
      return "kg";
    case "shopping":
      return "R$";
    case "waste":
      return "kg";
    default:
      return "";
  }
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "transportation":
      return "#6AAFDC"; // azul céu
    case "electricity":
      return "#FFB347"; // laranja claro
    case "food":
      return "#8ABA6F"; // verde claro 
    case "shopping":
      return "#B19CD9"; // roxo claro
    case "waste":
      return "#FF6B6B"; // vermelho claro
    default:
      return "#A9A9A9"; // cinza para desconhecido
  }
};

export const getCategoryName = (category: string): string => {
  switch (category) {
    case "transportation":
      return "Transporte";
    case "electricity":
      return "Eletricidade";
    case "food":
      return "Alimentação";
    case "shopping":
      return "Compras";
    case "waste":
      return "Resíduos";
    default:
      return category;
  }
};

export const getRecommendations = (data: EmissionCategory[]): string[] => {
  const recommendations: string[] = [];
  
  // Encontrar categoria com maior emissão
  if (data.length > 0) {
    const highest = [...data].sort((a, b) => b.emissions - a.emissions)[0];
    
    switch (highest.id) {
      case "transportation":
        recommendations.push("Considere usar transporte público, caronas ou bicicleta para seu deslocamento diário.");
        recommendations.push("Se possível, mude para um veículo híbrido ou elétrico na sua próxima compra de carro.");
        break;
      case "electricity":
        recommendations.push("Troque para lâmpadas LED em toda sua casa.");
        recommendations.push("Considere instalar um termostato programável para reduzir o aquecimento e resfriamento quando não forem necessários.");
        break;
      case "food":
        recommendations.push("Tente incorporar mais refeições à base de plantas em sua dieta.");
        recommendations.push("Compre produtos locais e sazonais para reduzir as emissões de transporte.");
        break;
      case "shopping":
        recommendations.push("Antes de comprar algo novo, considere se você pode reparar, emprestar ou comprar em segunda mão.");
        recommendations.push("Procure produtos com embalagem mínima ou embalagem feita de materiais reciclados.");
        break;
      case "waste":
        recommendations.push("Comece a compostar restos de comida para reduzir as emissões de metano dos aterros.");
        recommendations.push("Recicle corretamente e tente reduzir itens descartáveis em sua rotina diária.");
        break;
    }
  }
  
  // Recomendações gerais
  recommendations.push("Realize uma auditoria energética em casa para identificar áreas de melhoria.");
  recommendations.push("Considere compensar sua pegada de carbono através de programas de compensação de carbono verificados.");
  
  return recommendations;
};

export const DEFAULT_EMISSION_DATA: EmissionCategory[] = [
  {
    id: "transportation",
    name: "Transporte",
    color: getCategoryColor("transportation"),
    emissions: 120,
    unit: "km",
    factor: EMISSION_FACTORS.transportation,
  },
  {
    id: "electricity",
    name: "Eletricidade",
    color: getCategoryColor("electricity"),
    emissions: 80,
    unit: "kWh",
    factor: EMISSION_FACTORS.electricity,
  },
  {
    id: "food",
    name: "Alimentação",
    color: getCategoryColor("food"),
    emissions: 60,
    unit: "kg",
    factor: EMISSION_FACTORS.food,
  },
  {
    id: "shopping",
    name: "Compras",
    color: getCategoryColor("shopping"),
    emissions: 40,
    unit: "R$",
    factor: EMISSION_FACTORS.shopping,
  },
  {
    id: "waste",
    name: "Resíduos",
    color: getCategoryColor("waste"),
    emissions: 25,
    unit: "kg",
    factor: EMISSION_FACTORS.waste,
  },
];
