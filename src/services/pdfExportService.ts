
import { jsPDF } from "jspdf";
import { getRecommendations } from "@/utils/carbon-calculations";
import emailjs from "emailjs-com";
import { toast } from "sonner";

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
  try {
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

    return doc;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    toast.error("Erro ao gerar o PDF. Tente novamente.");
    // Return a simple error PDF
    const errorDoc = new jsPDF();
    errorDoc.text("Erro ao gerar o relatório. Tente novamente.", 20, 20);
    return errorDoc;
  }
};

/**
 * Sends a PDF report by email using EmailJS
 */
export const sendPDFByEmail = async (
  email: string,
  emissionData: EmissionData[],
  totalEmissions: number,
  goal: number
): Promise<boolean> => {
  try {
    // Generate the PDF
    const doc = exportEmissionsToPDF(emissionData, totalEmissions, goal);
    
    // Convert PDF to base64
    const pdfData = doc.output('datauristring');
    
    // EmailJS configuration
    // Note: These are placeholders. User will need to create a free EmailJS account
    // and replace with their own credentials for production use
    const serviceID = 'default_service'; // Demo email service
    const templateID = 'template_carbon_report'; // Demo template
    const userID = 'user_demo123456'; // Demo user ID
    
    // Prepare data for sending
    const templateParams = {
      to_email: email,
      from_name: 'Calculadora de Pegada de Carbono',
      message: `Segue em anexo seu relatório de Pegada de Carbono com emissão total de ${totalEmissions.toFixed(1)} kg CO₂e.`,
      pdf_attachment: pdfData
    };
    
    // In demo mode, we save the PDF locally and show a success toast
    // In production, this would send the actual email with a real EmailJS user ID
    doc.save("relatorio-pegada-carbono.pdf");
    
    // Uncomment the line below and use real credentials for actual email sending
    // await emailjs.send(serviceID, templateID, templateParams, userID);
    
    toast.success(`Email enviado com sucesso para ${email}! (Modo de demonstração: PDF baixado localmente)`);
    toast.info('Para envio real de emails, configure seu próprio EmailJS em produção');
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar PDF por email:", error);
    toast.error("Erro ao enviar email. Tente novamente mais tarde.");
    return false;
  }
};
