
import CarbonCalculator from "./CarbonCalculator";
import EcoTips from "./EcoTips";

interface CalculatorTabProps {
  onCalculate: (values: { category: string; amount: number; unit?: string }) => void;
}

const CalculatorTab = ({ onCalculate }: CalculatorTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CarbonCalculator onCalculate={onCalculate} />
      <EcoTips />
    </div>
  );
};

export default CalculatorTab;
