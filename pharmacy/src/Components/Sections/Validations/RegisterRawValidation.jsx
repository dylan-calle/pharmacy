import axios from "axios";
import { url } from "./../../../Url";

export default function RegisterRawValidation(values) {
  return new Promise((resolve, reject) => {
    let error = {};

    if (values.name_raw_material === "") {
      error.name_raw_material = "Necesita llenar este campo";
      resolve(error);
      return;
    }

    axios
      .post(url + "registerRaw/existsRawMaterial/", {
        name_raw_material: values.name_raw_material,
      })
      .then((res) => {
        if (res.data.response) {
          error.name_raw_material = "Ya existe un registro con este nombre";
        } else {
          error.name_raw_material = "";
        }
        resolve(error);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}
