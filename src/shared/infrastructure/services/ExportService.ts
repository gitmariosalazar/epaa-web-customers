// ============================================================
// INFRASTRUCTURE — ExportService
// Implements IExportService using jsPDF + jspdf-autotable.
// Ported from epaa-web with EPAA-AA branding.
// SRP: each private method handles one rendering concern.
// ============================================================

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { IExportService, ReportOptions, Signature } from '@/shared/domain/services/IExportService';

const PDF_THEME = {
  colors: {
    primary:    [41, 128, 185]  as [number, number, number],
    secondary:  [127, 140, 141] as [number, number, number],
    text:       [44, 62, 80]    as [number, number, number],
    divider:    [230, 230, 230] as [number, number, number],
    background: [248, 250, 252] as [number, number, number],
    border:     [226, 232, 240] as [number, number, number],
    footer:     [150, 150, 150] as [number, number, number]
  },
  fonts: {
    base: 'helvetica',
    sizes: {
      companyName: 11,
      reportInfo: 7,
      title: 12,
      label: 8,
      table: 8,
      footer: 7
    }
  },
  margins: {
    default: 14,
    logoSize: 18,
    logoY: 8,
    signaturePadding: 10,
    signatureBlockHeight: 30
  }
};

export class ExportService implements IExportService {
  /** Download PDF directly */
  exportToPdf(options: ReportOptions): void {
    try {
      const doc = this.createPdfDoc(options);
      doc.save(`${options.fileName}.pdf`);
    } catch (err) {
      console.error('[ExportService] exportToPdf failed:', err);
    }
  }

  /** Generate a blob URL for iframe preview */
  generatePdfBlobUrl(options: ReportOptions): string {
    const doc = this.createPdfDoc(options);
    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
  }

  /** Export to Excel using structured options */
  exportToExcel(options: ReportOptions): void {
    try {
      const { rows, columns, fileName, totals } = options;
      const aoa = [columns, ...rows];
      if (totals?.length) aoa.push(totals);
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (err) {
      console.error('[ExportService] exportToExcel failed:', err);
    }
  }

  /** Export raw JSON array to Excel */
  exportToExcelRaw<T>(data: T[], fileName: string): void {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Datos');
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (err) {
      console.error('[ExportService] exportToExcelRaw failed:', err);
    }
  }

  // ── Private orchestration ────────────────────────────────

  private createPdfDoc(options: ReportOptions): jsPDF {
    const { orientation = 'portrait' } = options;
    const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4', compress: true });

    this.renderHeaderAccent(doc);
    let y = this.renderBranding(doc);
    y = this.renderTitleSection(doc, options.title || 'REPORTE', y);
    if (options.description)      y = this.renderDescriptionSection(doc, options.description, y);
    if (options.labelsHorizontal) y = this.renderLabelsHorizontal(doc, options.labelsHorizontal, y);
    if (options.labelsVertical)   y = this.renderLabelsVertical(doc, options.labelsVertical, y);
    if (options.clientInfo)       y = this.renderClientInfoBox(doc, options.clientInfo, y);
    y = this.renderDataTable(doc, options, y);
    this.renderSignatureSection(doc, options.signatures);

    return doc;
  }

  private renderHeaderAccent(doc: jsPDF): void {
    const { primary } = PDF_THEME.colors;
    doc.setFillColor(...primary);
    doc.rect(0, 0, doc.internal.pageSize.width, 3, 'F');
  }

  private renderBranding(doc: jsPDF): number {
    const { default: margin, logoSize, logoY } = PDF_THEME.margins;
    const { primary, secondary } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    const pageWidth = doc.internal.pageSize.width;

    // Fallback circle for logo (no static asset dependency)
    doc.setFillColor(41, 128, 185);
    doc.circle(margin + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('EPAA', margin + logoSize / 2, logoY + logoSize / 2 + 2, { align: 'center' });

    const company = 'EMPRESA PÚBLICA DE AGUA POTABLE Y ALCANTARILLADO DE ANTONIO ANTE';
    const maxW = pageWidth - margin * 2 - logoSize - 10;
    let fs = sizes.companyName;
    doc.setFontSize(fs);
    while (doc.getTextWidth(company) > maxW && fs > 7) {
      fs -= 0.5;
      doc.setFontSize(fs);
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...primary);
    doc.text(company, margin + logoSize + 6, logoY + logoSize / 2 + 2);

    const dateStr = new Date().toLocaleDateString('es-EC', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    doc.setFontSize(sizes.reportInfo);
    doc.setTextColor(...secondary);
    doc.text(`Generado: ${dateStr}`, pageWidth - margin, logoY + 4, { align: 'right' });

    return logoY + logoSize + 10;
  }

  private renderTitleSection(doc: jsPDF, title: string, y: number): number {
    const { text } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(sizes.title);
    doc.setTextColor(...text);
    doc.text(title.toUpperCase(), doc.internal.pageSize.width / 2, y, { align: 'center' });
    return y + 8;
  }

  private renderDescriptionSection(doc: jsPDF, description: string, y: number): number {
    const { text } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    const { default: margin } = PDF_THEME.margins;
    const pageWidth = doc.internal.pageSize.width;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(sizes.label);
    doc.setTextColor(...text);
    const lines = doc.splitTextToSize(description, pageWidth - margin * 2);
    doc.text(lines, pageWidth / 2, y, { align: 'center' });
    return y + lines.length * 5;
  }

  private renderLabelsHorizontal(doc: jsPDF, labels: Record<string, string>, y: number): number {
    const { background, border, primary, text } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    const { default: margin } = PDF_THEME.margins;
    const pageWidth = doc.internal.pageSize.width;
    const entries = Object.entries(labels);
    if (!entries.length) return y;

    const pad = 4, lineH = 5;
    const mid = Math.ceil(entries.length / 2);
    const boxH = mid * lineH + pad * 2;
    doc.setFillColor(...background);
    doc.setDrawColor(...border);
    doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 1.5, 1.5, 'FD');

    doc.setFontSize(sizes.label - 1);
    const col1X = margin + pad, col2X = pageWidth / 2 + 5, labelOffset = 30;
    let currY = y + pad + 3.5;
    const col1 = entries.slice(0, mid), col2 = entries.slice(mid);
    for (let i = 0; i < mid; i++) {
      if (col1[i]) {
        doc.setFont('helvetica', 'bold'); doc.setTextColor(...primary); doc.text(`${col1[i][0]}:`, col1X, currY);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(...text); doc.text(String(col1[i][1]), col1X + labelOffset, currY);
      }
      if (col2[i]) {
        doc.setFont('helvetica', 'bold'); doc.setTextColor(...primary); doc.text(`${col2[i][0]}:`, col2X, currY);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(...text); doc.text(String(col2[i][1]), col2X + labelOffset, currY);
      }
      currY += lineH;
    }
    return y + boxH + 2;
  }

  private renderLabelsVertical(doc: jsPDF, labels: Record<string, string>, y: number): number {
    const { text } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    const pageWidth = doc.internal.pageSize.width;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(sizes.label - 1);
    doc.setTextColor(...text);
    let curr = y;
    Object.entries(labels).forEach(([k, v]) => {
      doc.text(`${k}: ${v}`, pageWidth / 2, curr, { align: 'center' });
      curr += 5;
    });
    return curr + 2;
  }

  private renderClientInfoBox(doc: jsPDF, clientInfo: Record<string, any>, y: number): number {
    const { default: margin } = PDF_THEME.margins;
    const { background, border, primary, text } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;
    const pageWidth = doc.internal.pageSize.width;
    const entries = Object.entries(clientInfo);
    const pad = 4, lineH = 5;
    const boxH = entries.length * lineH + pad * 2;
    doc.setFillColor(...background);
    doc.setDrawColor(...border);
    doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 1.5, 1.5, 'FD');
    let curr = y + pad + 3.5;
    doc.setFontSize(sizes.label);
    entries.forEach(([k, v]) => {
      doc.setFont('helvetica', 'bold'); doc.setTextColor(...primary); doc.text(`${k}:`, margin + pad, curr);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(...text); doc.text(String(v), margin + pad + 35, curr);
      curr += lineH;
    });
    return y + boxH + 8;
  }

  private renderDataTable(doc: jsPDF, options: ReportOptions, y: number): number {
    const { default: margin } = PDF_THEME.margins;
    const { primary, footer } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;

    autoTable(doc, {
      head: [options.columns],
      body: options.rows || [],
      foot: options.totals ? [options.totals] : undefined,
      showFoot: 'lastPage',
      startY: y,
      theme: 'grid',
      styles: { fontSize: sizes.table, cellPadding: 3, valign: 'middle', lineColor: [230, 230, 230], lineWidth: 0.1 },
      headStyles: { fillColor: primary, textColor: 255, fontStyle: 'bold' },
      footStyles: { fillColor: [225, 29, 72], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: margin, right: margin },
      didDrawPage: (data) => {
        doc.setFontSize(sizes.footer);
        doc.setTextColor(...footer);
        doc.text(`Página ${data.pageNumber}`, margin, doc.internal.pageSize.height - 8);
      }
    });

    return (doc as any).lastAutoTable?.finalY ?? y;
  }

  private renderSignatureSection(doc: jsPDF, signatures?: Signature[]): void {
    const pageWidth  = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const { default: margin, signaturePadding: padding, signatureBlockHeight: blockH } = PDF_THEME.margins;
    const { text, secondary } = PDF_THEME.colors;
    const { sizes } = PDF_THEME.fonts;

    const sigs = signatures?.length
      ? signatures
      : [{ label: 'FIRMA RESPONSABLE', name: 'EPAA - Antonio Ante' }];

    let sigY = pageHeight - margin - blockH + 8;
    const lastTable = (doc as any).lastAutoTable;
    if (lastTable?.finalY > sigY - 5) { doc.addPage(); sigY = 40; }

    const totalW = pageWidth - margin * 2;
    const spacing = totalW / sigs.length;

    sigs.forEach((sig, i) => {
      const cx = margin + spacing * i + spacing / 2;
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.04);
      doc.line(cx - 28, sigY + 5, cx + 28, sigY + 5);

      doc.setFontSize(sizes.label);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...text);
      doc.text(sig.label.toUpperCase(), cx, sigY + padding, { align: 'center' });

      let subY = sigY + padding + 4.5;
      if (sig.name) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(sizes.footer);
        doc.setTextColor(...secondary);
        doc.text(sig.name, cx, subY, { align: 'center' });
        subY += 4.5;
      }
      if (sig.idNumber) {
        doc.setFontSize(sizes.footer - 1);
        doc.text(`C.I: ${sig.idNumber}`, cx, subY, { align: 'center' });
      }
    });
  }
}
