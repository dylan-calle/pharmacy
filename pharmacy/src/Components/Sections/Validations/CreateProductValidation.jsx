import axios from "axios";
import { url } from "./../../../Url";

export default function CreateProductValidation(values) {
  return new Promise((resolve, reject) => {
    let error = {};

    if (values.name_product === "") {
      error.name_product = "Necesita llenar este campo";
      resolve(error);
      return;
    }

    axios
      .post(url + "createProduct/existsProduct/", {
        name_product: values.name_product,
      })
      .then((res) => {
        if (res.data.response) {
          error.name_product = "Ya existe un producto con este nombre";
        } else {
          error.name_product = "";
        }
        resolve(error);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}
