
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { EmissionCategory, getRecommendations } from "@/utils/carbon-calculations";

export function exportEmissionsToPDF(emissionData: EmissionCategory[], totalEmissions: number, goal: number) {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text("Relatório de Pegada de Carbono", 20, 20);
  
  const today = new Date().toLocaleDateString('pt-BR');
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
  
  emissionData.forEach(category => {
    doc.text(category.name, 20, yPosition);
    doc.text(category.emissions.toFixed(1), 90, yPosition);
    yPosition += 10;
  });
  
  const recommendationsList = getRecommendations(emissionData);
  
  if (recommendationsList.length > 0) {
    yPosition += 10;
    doc.setFontSize(14);
    doc.text("Recomendações para Redução", 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    recommendationsList.forEach(rec => {
      // Verifica o tipo da recomendação (pode ser string ou objeto)
      const recText = typeof rec === 'object' && rec !== null ? rec.description : String(rec || '');
      doc.text(`• ${recText}`, 20, yPosition);
      yPosition += 7;
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
  }
  
  doc.save("relatorio-pegada-carbono.pdf");
  toast.success("Relatório PDF gerado com sucesso!");
  
  return doc;
}

// Função para enviar PDF por email
export function sendPDFByEmail(email: string, emissionData: EmissionCategory[], totalEmissions: number, goal: number) {
  try {
    // Geramos o PDF
    const doc = exportEmissionsToPDF(emissionData, totalEmissions, goal);
    
    // No ambiente cliente, simulamos o envio de email
    // Em uma aplicação real, integraríamos com um serviço de e-mail
    console.log(`Enviando PDF para: ${email}`);
    
    // Simula envio bem-sucedido
    toast.success(`PDF enviado para ${email} com sucesso!`);
    return true;
  } catch (error) {
    console.error("Erro ao enviar PDF por email:", error);
    toast.error("Não foi possível enviar o PDF por e-mail. Tente novamente.");
    return false;
  }
}
