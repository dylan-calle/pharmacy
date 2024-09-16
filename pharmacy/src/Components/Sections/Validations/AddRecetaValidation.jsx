import axios from "axios";
import { url } from "./../../../Url";
export default function AddReceta(values) {
  return new Promise(async (resolve, reject) => {
    let errors = [];

    // Incial validation to check if NaN exist
    values.forEach(({ quantity, cost }) => {
      const errorNaN = { id_raw_material: "", quantity: "", cost: "" };

      if (isNaN(quantity)) {
        errorNaN.quantity = "Debe ser un número";
      }

      if (isNaN(cost)) {
        errorNaN.cost = "Debe ser un número";
      }

      // Solo agregar al array de errores si hay algún error
      if (errorNaN.quantity || errorNaN.cost) {
        errors.push(errorNaN);
      }
    });
    // If NaN are detected, breaks and resolve error array
    if (errors.length > 0) {
      resolve(errors);
      return;
    }
    values.forEach(({ id_raw_material, quantity, cost }) => {
      const error = { id_raw_material: "", quantity: "", cost: "" };

      if (id_raw_material === "") {
        error.id_raw_material = "Necesita llenar este campo";
      }

      if (quantity === "") {
        error.quantity = "Necesita llenar este campo";
      }

      if (cost === "") {
        error.cost = "Necesita llenar este campo";
      }

      // Solo agregar al array de errores si hay algún error
      //if (error.quantity || error.cost || error.id_raw_material) {
      errors.push(error);
      //}
    });
    if (errors.length > 0) {
      resolve(errors);
      return;
    }
  });
}
