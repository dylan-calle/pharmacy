import React, { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import imageBase64 from "./base64img/Logo";

// Establece las fuentes de pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function generateInvoiceRaw(data, fileName) {
  console.log(data);
  const documentDefinition = {
    content: [
      // Encabezado con información a la izquierda y derecha
      {
        columns: [
          {
            width: "50%",
            stack: [
              { image: imageBase64, width: 150, margin: [-10, -60, 0, 0] },
              {
                text: [""],
                style: "companyInfo",
              },
            ],
          },
          {
            width: "50%",
            text: [{ text: "Fecha: ", bold: true }, new Date().toLocaleDateString(), "\n"],
            style: "invoiceInfo",
            alignment: "right",
          },
        ],
        margin: [0, 20, 0, 20],
      },

      // Título de la Factura
      {
        text: "Lista de Materias Primas",
        style: "invoiceTitle",
        alignment: "center",
        margin: [0, 0, 0, 20],
      },

      // Tabla de productos o servicios
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto"],
          body: [
            [
              { text: "Materia Prima", style: "tableHeader" },
              { text: "Cantidad", style: "tableHeader" },
              { text: "Código", style: "tableHeader" },
            ],
            ...data.map((item) => [
              item.name_raw_material,
              `${item.raw_quantity} ${item.measurement}`,
              item.id_raw,
            ]),
          ],
        },
        layout: {
          fillColor: "#f2f2f2",
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: "#cccccc",
          vLineColor: "#cccccc",
          paddingLeft: () => 10,
          paddingRight: () => 10,
        },
        margin: [0, 0, 0, 20],
      },
    ],

    // Estilos
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        color: "#333",
      },
      companyInfo: {
        fontSize: 16,
        color: "#555",
      },
      invoiceTitle: {
        fontSize: 20,
        bold: true,
        color: "#333",
      },
      invoiceInfo: {
        fontSize: 12,
        color: "#555",
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      tableHeader: {
        fillColor: "#007BFF",
        color: "#ffffff",
        fontSize: 12,
        bold: true,
      },
      footer: {
        fontSize: 12,
        color: "#555",
      },
    },
  };

  pdfMake.createPdf(documentDefinition).download(fileName);
}

// function RawMaterialExport() {
//   const invoiceData = [
//     { name: "Paracetamol", quantity: 2, price: 30 },
//     { name: "Omeprazol", quantity: 1, price: 20 },
//   ];

//   return (
//     <div>
//       <button onClick={() => generateInvoice(invoiceData)}>Generate Invoice</button>
//     </div>
//   );
// }

export default generateInvoiceRaw;
