import PDFDocument from 'pdfkit';

/**
 * Generate a basic CSV string from an array of objects
 * @param {Array} data - Array of objects
 * @param {Array} columns - Array of { key, label }
 * @returns {String} CSV string
 */
export const generateCSV = (data, columns) => {
  const header = columns.map(c => `"${c.label}"`).join(',');
  const rows = data.map(row => 
    columns.map(c => {
      const val = row[c.key];
      // Escape quotes and wrap in quotes
      return `"${(val === null || val === undefined ? 'N/A' : String(val)).replace(/"/g, '""')}"`;
    }).join(',')
  );
  return [header, ...rows].join('\n');
};

/**
 * Generate a PDF document
 * @param {Object} data - Document data structure
 * @param {Object} res - Express response object
 */
export const generatePDF = (data, res) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  // Title
  if (data.title) {
    doc.fontSize(20).text(data.title, { align: 'center' });
    doc.moveDown(2);
  }

  // Metadata sections
  if (data.sections) {
    data.sections.forEach(section => {
      doc.fontSize(14).text(section.heading, { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(10);
      if (Array.isArray(section.content)) {
        section.content.forEach(line => {
          doc.text(line);
        });
      } else {
        doc.text(section.content);
      }
      doc.moveDown(1.5);
    });
  }

  // Footer
  doc.fontSize(8).text(`Generated on: ${new Date().toISOString()} | TrialOrbit MVP`, 50, doc.page.height - 50, { align: 'center' });
  
  doc.end();
};
