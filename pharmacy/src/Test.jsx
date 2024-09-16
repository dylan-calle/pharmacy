import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import imageBase64 from "./exports/base64img/Logo";

// Establece las fuentes de pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function generateInvoice(data) {
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
                text: [
                  "Cuarto anillo\n",
                  "Santa Cruz de la Sierra, Bolivia ZIP\n",
                  "Phone: +593 61732837\n",
                  "Email: info@farmaciax.com",
                ],
                style: "companyInfo",
              },
            ],
          },
          {
            width: "50%",
            text: [
              { text: "Fecha: ", bold: true },
              new Date().toLocaleDateString(),
              "\n",
              { text: "Número de orden de trabajo: ", bold: true },
              "INV-00123",
              "\n",
              { text: "Fecha de pago máximo: ", bold: true },
              new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString(),
            ],
            style: "invoiceInfo",
            alignment: "right",
          },
        ],
        margin: [0, 20, 0, 20],
      },

      // Título de la Factura
      {
        text: "Recibo",
        style: "invoiceTitle",
        alignment: "center",
        margin: [0, 0, 0, 20],
      },

      // Información del Cliente
      {
        text: "Recibo para:",
        style: "subheader",
        margin: [0, 0, 0, 10],
      },
      {
        text: [
          "Pedro Castillo\n",
          "Customer Address Line 1\n",
          "Customer Phone: 6736233\n",
          "Médico: Juan Alvarez",
        ],
        margin: [0, 0, 0, 20],
      },

      // Tabla de productos o servicios
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto"],
          body: [
            [
              { text: "Producto", style: "tableHeader" },
              { text: "Cantidad", style: "tableHeader" },
              { text: "Precio u", style: "tableHeader" },
              { text: "Total", style: "tableHeader" },
            ],
            ...data.map((item) => [
              item.name,
              item.quantity,
              `Bs.${item.price.toFixed(2)}`,
              `Bs,${(item.quantity * item.price).toFixed(2)}`,
            ]),
            [
              "",
              "",
              "Subtotal",
              `Bs.${data.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}`,
            ],
            [
              "",
              "",
              "IVA (10%)",
              `Bs.${(data.reduce((sum, item) => sum + item.quantity * item.price, 0) * 0.1).toFixed(2)}`,
            ],
            [
              "",
              "",
              "Total",
              `Bs.${(data.reduce((sum, item) => sum + item.quantity * item.price, 0) * 1.1).toFixed(2)}`,
            ],
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

      // Notas o mensajes adicionales
      {
        text: "Gracias por su confianza",
        style: "footer",
        alignment: "center",
        margin: [0, 20, 0, 0],
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
        fontSize: 12,
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

  pdfMake.createPdf(documentDefinition).download("invoice.pdf");
}

function Test() {
  const invoiceData = [
    { name: "Paracetamol", quantity: 2, price: 30 },
    { name: "Omeprazol", quantity: 1, price: 20 },
  ];

  return (
    <div>
      <button onClick={() => generateInvoice(invoiceData)}>Generate Invoice</button>
    </div>
  );
}

export default Test;
