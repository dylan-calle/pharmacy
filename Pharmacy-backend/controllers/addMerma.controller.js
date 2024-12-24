import { getConnection as connection } from "./../database/database.js";
import { getCurrentTimestamp } from "./../functions/function1.js";
const getMaterial = async (req, res) => {
  try {
    const result = await connection.query("SELECT * FROM type_raw_material WHERE id>210 AND status = 1;");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const getNumber = async (req, res) => {
  try {
    const query =
      "SELECT DISTINCT n_merma FROM inserts_mermas WHERE n_merma >= ALL (SELECT n_merma FROM inserts_mermas)";
    const result = await connection.query(query);
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const mermaAndQuantity = async (req, res) => {
  try {
    let modifiedData = [...req.body];
    if (!Array.isArray(modifiedData)) {
      return res.status(400).send("El formato de datos no es correcto, contacte con el admin");
    }

    const nowTime = getCurrentTimestamp();

    let i = 0;

    while (i < modifiedData.length) {
      const { number, id_raw_material, quantity, cost, n_merma, obs } = modifiedData[i];
      console.log(modifiedData[i]);
      console.log("quantity", quantity);
      if (
        number === undefined ||
        id_raw_material === undefined ||
        quantity === undefined ||
        cost === undefined ||
        n_merma === undefined ||
        obs === undefined
      ) {
        return res.status(400).json({ error: "Formato de datos incorrecto" });
      }
      const query = "CALL mermaAndQuantity(?, ?, ?, ?, ?, ?)";
      await connection.query(query, [number, id_raw_material, quantity, cost, n_merma, obs]);
      i = i + 1;
    }
    res.json({ message: "Lista agregada" });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
export const metodos = {
  getMaterial,
  getNumber,
  mermaAndQuantity,
};
