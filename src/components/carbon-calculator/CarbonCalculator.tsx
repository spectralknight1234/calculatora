
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
    required_error: "Por favor, selecione uma categoria",
  }),
  amount: z.coerce.number({
    required_error: "Por favor, insira um valor",
    invalid_type_error: "Por favor, insira um número válido",
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
    toast.success("Emissão de carbono calculada e adicionada à sua pegada.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calcule Suas Emissões</CardTitle>
        <CardDescription>
          Insira os detalhes da sua atividade para calcular sua pegada de carbono
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
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="transportation">Transporte</SelectItem>
                        <SelectItem value="electricity">Eletricidade</SelectItem>
                        <SelectItem value="food">Alimentação</SelectItem>
                        <SelectItem value="shopping">Compras</SelectItem>
                        <SelectItem value="waste">Resíduos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione a categoria da sua atividade
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
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Digite a quantidade (ex: km percorridos, kWh utilizados)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Calcular
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CarbonCalculator;
