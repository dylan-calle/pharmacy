import { getConnection as connection } from "./../database/database.js";
import { getCurrentTimestamp } from "./../functions/function1.js";
const getProducts = async (req, res) => {
  try {
    const result = await connection.query("SELECT * FROM type_product WHERE id>3;");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getMaterial = async (req, res) => {
  try {
    const result = await connection.query("SELECT * FROM type_raw_material WHERE id>210;");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const getNumber = async (req, res) => {
  try {
    const query =
      "SELECT DISTINCT id_prescription FROM inserts_prescription WHERE id_prescription >= ALL (SELECT id_prescription FROM inserts_prescription)";
    const result = await connection.query(query);
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const insertPrescription = async (req, res) => {
  try {
    let modifiedData = [...req.body];
    if (!Array.isArray(modifiedData[0])) {
      return res.status(400).send("El formato de datos no es correcto, contacte con el admin");
    }

    //const nowTime = getCurrentTimestamp();

    let i = 0;

    while (i < modifiedData[0].length) {
      const { number, id_raw_material, quantity, n_prescription } = modifiedData[0][i];
      if (
        number === undefined ||
        id_raw_material === undefined ||
        quantity === undefined ||
        n_prescription === undefined
      ) {
        return res.status(400).json({ error: "Formato de datos incorrecto" });
      }
      const query = "CALL insertPrescription(?, ?, ?, ?, ?)";
      await connection.query(query, [number, id_raw_material, quantity, n_prescription, modifiedData[1]]);
      i = i + 1;
    }
    res.json({ message: "Lista agregada" });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const getPrescriptions = async (req, res) => {
  const query =
    "SELECT DISTINCT name_product, measurement, date, id_prescription FROM type_product T RIGHT JOIN inserts_prescription I on T.prescription_id = I.id_prescription WHERE T.id>3";
  try {
    const results = await connection.query(query);
    res.json(results);
  } catch (err) {
    console.err(err);
  }
};
const getRawsIdGiven = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "El campo 'id' es obligatorio" });
  }
  const query =
    " SELECT nro_list, name_raw_material, measurement, needed_quantity, raw_quantity FROM inserts_prescription I JOIN type_raw_material T ON T.id = I.id_raw_material WHERE id_prescription = ?";
  try {
    const results = await connection.query(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ msg: "No se encontraron resultados para el ID proporcionado" });
    }
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
export const metodos = {
  getProducts,
  getMaterial,
  getNumber,
  insertPrescription,
  getPrescriptions,
  getRawsIdGiven,
};
