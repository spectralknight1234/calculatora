
export interface EmissionCategory {
  id: string;
  name: string;
  color: string;
  emissions: number;
  unit: string;
  factor: number;
}

// Simple emission factors (kg CO2e per unit)
const EMISSION_FACTORS = {
  transportation: 0.12, // per km
  electricity: 0.5, // per kWh
  food: 2.5, // per kg
  shopping: 0.5, // per dollar
  waste: 0.5, // per kg
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
      return "$";
    case "waste":
      return "kg";
    default:
      return "";
  }
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "transportation":
      return "#6AAFDC"; // sky blue
    case "electricity":
      return "#FFB347"; // light orange
    case "food":
      return "#8ABA6F"; // light green 
    case "shopping":
      return "#B19CD9"; // light purple
    case "waste":
      return "#FF6B6B"; // light red
    default:
      return "#A9A9A9"; // grey for unknown
  }
};

export const getCategoryName = (category: string): string => {
  switch (category) {
    case "transportation":
      return "Transportation";
    case "electricity":
      return "Electricity";
    case "food":
      return "Food";
    case "shopping":
      return "Shopping";
    case "waste":
      return "Waste";
    default:
      return category;
  }
};

export const getRecommendations = (data: EmissionCategory[]): string[] => {
  const recommendations: string[] = [];
  
  // Find highest emission category
  if (data.length > 0) {
    const highest = [...data].sort((a, b) => b.emissions - a.emissions)[0];
    
    switch (highest.id) {
      case "transportation":
        recommendations.push("Consider using public transportation, carpooling, or biking for your daily commute.");
        recommendations.push("If possible, switch to a hybrid or electric vehicle for your next car purchase.");
        break;
      case "electricity":
        recommendations.push("Switch to energy-efficient LED bulbs throughout your home.");
        recommendations.push("Consider installing a programmable thermostat to reduce heating and cooling when not needed.");
        break;
      case "food":
        recommendations.push("Try incorporating more plant-based meals in your diet.");
        recommendations.push("Buy local and seasonal produce to reduce transportation emissions.");
        break;
      case "shopping":
        recommendations.push("Before buying new, consider if you can repair, borrow, or buy second-hand.");
        recommendations.push("Look for products with minimal packaging or packaging made from recycled materials.");
        break;
      case "waste":
        recommendations.push("Start composting food scraps to reduce methane emissions from landfills.");
        recommendations.push("Recycle properly and aim to reduce single-use items in your daily routine.");
        break;
    }
  }
  
  // General recommendations
  recommendations.push("Conduct a home energy audit to identify areas for improvement.");
  recommendations.push("Consider offsetting your carbon footprint through verified carbon offset programs.");
  
  return recommendations;
};

export const DEFAULT_EMISSION_DATA: EmissionCategory[] = [
  {
    id: "transportation",
    name: "Transportation",
    color: getCategoryColor("transportation"),
    emissions: 120,
    unit: "km",
    factor: EMISSION_FACTORS.transportation,
  },
  {
    id: "electricity",
    name: "Electricity",
    color: getCategoryColor("electricity"),
    emissions: 80,
    unit: "kWh",
    factor: EMISSION_FACTORS.electricity,
  },
  {
    id: "food",
    name: "Food",
    color: getCategoryColor("food"),
    emissions: 60,
    unit: "kg",
    factor: EMISSION_FACTORS.food,
  },
  {
    id: "shopping",
    name: "Shopping",
    color: getCategoryColor("shopping"),
    emissions: 40,
    unit: "$",
    factor: EMISSION_FACTORS.shopping,
  },
  {
    id: "waste",
    name: "Waste",
    color: getCategoryColor("waste"),
    emissions: 25,
    unit: "kg",
    factor: EMISSION_FACTORS.waste,
  },
];
