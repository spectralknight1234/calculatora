-- Create table for user emission calculations
CREATE TABLE public.user_emissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  category_color TEXT NOT NULL,
  emissions NUMERIC(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  factor NUMERIC(10,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_emissions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own emissions" 
ON public.user_emissions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emissions" 
ON public.user_emissions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emissions" 
ON public.user_emissions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emissions" 
ON public.user_emissions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_emissions_updated_at
BEFORE UPDATE ON public.user_emissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();