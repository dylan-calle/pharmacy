import { getConnection } from "./../database/database.js";
import { getCurrentTimestamp } from "./../functions/function1.js";
const getProducts = async (req, res) => {
  try {
    const connection = await getConnection;
    const result = await connection.query(
      "SELECT * FROM type_product WHERE id>3;"
    );
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getMaterial = async (req, res) => {
  try {
    console.log("al menos llega");
    const connection = await getConnection;
    const result = await connection.query(
      "SELECT * FROM type_raw_material WHERE id>210;"
    );
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const getNumber = async (req, res) => {
  try {
    const connection = await getConnection;
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
    console.log("modifiedData[1] ", modifiedData[1]);
    console.log("modifiedData ", modifiedData);
    if (!Array.isArray(modifiedData[0])) {
      return res
        .status(400)
        .send("El formato de datos no es correcto, contacte con el admin");
    }

    const connection = await getConnection;
    //const nowTime = getCurrentTimestamp();

    let i = 0;

    while (i < modifiedData[0].length) {
      const { number, id_raw_material, quantity, n_prescription } =
        modifiedData[0][i];
      if (
        number === undefined ||
        id_raw_material === undefined ||
        quantity === undefined ||
        n_prescription === undefined
      ) {
        return res.status(400).json({ error: "Formato de datos incorrecto" });
      }
      const query = "CALL insertPrescription(?, ?, ?, ?, ?)";
      await connection.query(query, [
        number,
        id_raw_material,
        quantity,
        n_prescription,
        modifiedData[1],
      ]);
      i = i + 1;
    }
    res.json({ message: "Lista agregada" });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
export const metodos = {
  getProducts,
  getMaterial,
  getNumber,
  insertPrescription,
};
