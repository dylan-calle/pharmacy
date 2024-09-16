import { utils, writeFile } from "xlsx";

const exportToExcel = (jsonDataWid, fileName) => {
  // Elimina la propiedad 'id' de los datos
  let jsonData = jsonDataWid.map(({ id, ...rest }) => rest);

  // Definir encabezados
  const headers = ["Nombre", "Medida", "id", "Cantidad"];

  // Añadir los encabezados al inicio de los datos
  jsonData = [headers, ...jsonData.map((item) => Object.values(item))];

  // Convertir JSON a una hoja de trabajo de Excel
  const worksheet = utils.aoa_to_sheet(jsonData);

  // Crear un libro de trabajo con la hoja
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Exportar el libro de trabajo a un archivo .xlsx
  writeFile(workbook, `${fileName}.xlsx`);
};

export default exportToExcel;
