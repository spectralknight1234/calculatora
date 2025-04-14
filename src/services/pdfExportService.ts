
import { jsPDF } from "jspdf";
import { getRecommendations } from "@/utils/carbon-calculations";

// Define EmissionData type here to avoid importing it
type EmissionData = {
  id: string;
  name: string;
  color: string;
  emissions: number;
  unit: string;
  factor: number;
};

// Define a type for the recommendations that can be returned
type Recommendation = string | { description: string } | unknown;

/**
 * Creates and returns a PDF document with emission data
 */
export const exportEmissionsToPDF = (
  emissionData: EmissionData[],
  totalEmissions: number,
  goal: number
): jsPDF => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Relatório de Pegada de Carbono", 20, 20);

  const today = new Date().toLocaleDateString("pt-BR");
  doc.setFontSize(10);
  doc.text(`Gerado em: ${today}`, 20, 30);

  doc.setFontSize(14);
  doc.text("Resumo de Emissões", 20, 40);

  doc.setFontSize(12);
  doc.text(`Emissão Total: ${totalEmissions.toFixed(1)} kg CO₂e`, 20, 50);
  doc.text(`Meta: ${goal} kg CO₂e`, 20, 60);

  doc.setFontSize(14);
  doc.text("Detalhamento por Categoria", 20, 75);

  let yPosition = 85;

  doc.setFontSize(10);
  doc.text("Categoria", 20, yPosition);
  doc.text("Emissões (kg CO₂e)", 90, yPosition);
  yPosition += 5;

  doc.line(20, yPosition, 180, yPosition);
  yPosition += 10;

  emissionData.forEach((category) => {
    doc.text(category.name, 20, yPosition);
    doc.text(category.emissions.toFixed(1), 90, yPosition);
    yPosition += 10;
  });

  const recommendationsList = getRecommendations(emissionData) as Recommendation[];

  if (recommendationsList.length > 0) {
    yPosition += 10;
    doc.setFontSize(14);
    doc.text("Recomendações para Redução", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    recommendationsList.forEach((rec) => {
      // Safely handle recommendations of different types
      const recText = typeof rec === 'string' 
        ? rec 
        : (typeof rec === 'object' && rec !== null && 'description' in rec 
          ? (rec as { description: string }).description 
          : String(rec));
        
      doc.text(`• ${recText}`, 20, yPosition);
      yPosition += 7;
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
  }

  doc.save("relatorio-pegada-carbono.pdf");
  return doc;
};

/**
 * Simulates sending a PDF report by email
 */
export const sendPDFByEmail = (
  email: string,
  emissionData: EmissionData[],
  totalEmissions: number,
  goal: number
): boolean => {
  try {
    exportEmissionsToPDF(emissionData, totalEmissions, goal);
    // In a real app, you would send the PDF to the email server here
    console.log(`PDF report sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending PDF by email:", error);
    return false;
  }
};
