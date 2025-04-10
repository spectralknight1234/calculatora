
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const calculatorSchema = z.object({
  category: z.string({
    required_error: "Please select a category",
  }),
  amount: z.coerce.number({
    required_error: "Please enter a value",
    invalid_type_error: "Please enter a valid number",
  }).positive(),
  unit: z.string().optional(),
});

type CalculatorValues = z.infer<typeof calculatorSchema>;

interface CarbonCalculatorProps {
  onCalculate: (values: CalculatorValues) => void;
}

const CarbonCalculator = ({ onCalculate }: CarbonCalculatorProps) => {
  const form = useForm<CalculatorValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      category: "",
      amount: 0,
      unit: "",
    },
  });

  function onSubmit(values: CalculatorValues) {
    onCalculate(values);
    form.reset();
    toast.success("Carbon emission calculated and added to your footprint.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Your Emissions</CardTitle>
        <CardDescription>
          Enter your activity details to calculate its carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="electricity">Electricity</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="waste">Waste</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the category of your activity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the amount (e.g., km driven, kWh used)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Calculate
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CarbonCalculator;
