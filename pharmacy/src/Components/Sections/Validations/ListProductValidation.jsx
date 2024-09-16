import axios from "axios";
import { url } from "./../../../Url";
export default function ListProductValidation(values) {
  return new Promise(async (resolve, reject) => {
    let error = [];

    // Validación inicial de campos vacíos
    values.forEach((value) => {
      if (value.name_product === "") {
        error.push({
          name_product: "Necesita llenar este campo",
          id: value.id,
        });
      }
    });

    // Si hay errores de campos vacíos, resuelve con los errores y termina la ejecución
    if (error.length > 0) {
      resolve(error);
      return;
    }

    // Verificación de existencia de materiales en el servidor
    try {
      const promises = values.map((value) =>
        axios.post(url + "createProduct/existsNotSameProduct/", {
          name_product: value.name_product,
          id: value.id,
        })
      );

      const results = await Promise.all(promises);

      results.forEach((res, index) => {
        if (res.data.response) {
          error.push({
            name_product: "Ya existe un registro con ese nombre",
            id: values[index].id,
          });
        }
      });

      resolve(error);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
