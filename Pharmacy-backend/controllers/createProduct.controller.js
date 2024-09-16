import { getConnection } from "../database/database.js";

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
const getProductExpectId = async (req, res) => {
  try {
    const connection = await getConnection;
    const result = await connection.query(
      "SELECT name_product, measurement, id_product FROM type_product WHERE id>210;"
    );
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getGreaterIdProduct = async (req, res) => {
  try {
    const connection = await getConnection;
    const result = await connection.query(
      "SELECT id_product FROM type_product WHERE id >= ALL (SELECT id FROM type_product);"
    );
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const addProduct = async (req, res) => {
  try {
    const { name_product, measurement } = req.body;

    if (name_product === undefined || measurement === undefined) {
      res.status(400).json({ message: "Bad Request. Please fill all field." });
    }
    const Product = {
      name_product: name_product.trim(),
      measurement,
    };
    const connection = await getConnection;
    await connection.query("INSERT INTO type_product SET ?", Product);
    res.json({ message: "Material agregado" });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const existsProduct = async (req, res) => {
  try {
    const { name_product } = req.body;

    if (name_product === undefined) {
      return res
        .status(400)
        .json({ message: "Bad Request. Please fill all field." });
    }

    const connection = await getConnection;

    const query =
      "SELECT name_product FROM type_product WHERE name_product LIKE ?";
    const [results] = await connection.query(query, [name_product.trim()]);
    console.log("results ", results);
    results.length > 0
      ? res.json({ response: true })
      : res.json({ response: false });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const existsNotSameProduct = async (req, res) => {
  try {
    const { name_product, id } = req.body;

    if (name_product === undefined || id === undefined) {
      res.status(400).json({ message: "Bad Request. Please fill all field." });
    }

    const connection = await getConnection;
    const query =
      "SELECT name_product FROM type_product WHERE name_product LIKE ? && id <> ?";
    const [results] = await connection.query(query, [name_product, id]);
    results.length > 0
      ? res.json({ response: true })
      : res.json({ response: false });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const updateProduct = async (req, res) => {
  try {
    let i = 0;

    let modifiedData = [...req.body];
    if (!Array.isArray(modifiedData)) {
      return res
        .status(400)
        .send("El formato de datos no es correcto, contacte con el admin");
    }

    const connection = await getConnection;
    while (i < modifiedData.length) {
      const { name_product, measurement, id } = modifiedData[i];
      if (!name_product || !measurement || !id) {
        return res.status(400).json({ error: "Formato de datos incorrecto" });
      }
      const query =
        "UPDATE type_product SET name_product = ?, measurement = ? WHERE id = ?";
      await connection.query(query, [name_product, measurement, id]);
      i = i + 1;
    }

    res.json("Registro actualizado");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const deleteProduct = async (req, res) => {
  try {
    let i = 0;
    let idsToDelete = [...req.body];
    console.log("idsToDeleteArray", idsToDelete);
    if (!Array.isArray(idsToDelete)) {
      return res
        .status(400)
        .send("El formato de datos no es correcto, contacte con el admin");
    }
    // if (
    //   name_raw_material === undefined ||
    //   measurement === undefined ||
    //   id === undefined
    // ) {
    //   return res
    //     .status(400)
    //     .json({ message: "Bad Request. Please fill all field." });
    // }
    const connection = await getConnection;
    while (i < idsToDelete.length) {
      const { id } = idsToDelete[i];
      if (!id) {
        return res.status(400).json({ error: "Formato de datos incorrecto" });
      }
      console.log("DELETEFROM", [id]);
      const query = "DELETE FROM type_product WHERE id = ?";
      await connection.query(query, [id]);
      i = i + 1;
    }

    res.json("Registro borrado");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const metodos = {
  getProducts,
  addProduct,
  getGreaterIdProduct,
  existsProduct,
  getProductExpectId,
  updateProduct,
  deleteProduct,
  existsNotSameProduct,
};
