import { getConnection } from "./../database/database.js";

const getRawMaterial = async (req, res) => {
  try {
    const connection = await getConnection;
    const result = await connection.query("SELECT * FROM type_raw_material WHERE id>210;");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const getRawMaterialExpectId = async (req, res) => {
  try {
    const connection = await getConnection;
    const result = await connection.query(
      "SELECT name_raw_material, measurement, id_raw FROM type_raw_material WHERE id>210;"
    );
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getGreaterIdRaw = async (req, res) => {
  try {
    const connection = await getConnection;
    const result = await connection.query(
      "SELECT id_raw FROM type_raw_material WHERE id >= ALL (SELECT id FROM type_raw_material);"
    );
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const addRawMaterial = async (req, res) => {
  try {
    const { name_raw_material, measurement } = req.body;

    if (name_raw_material === undefined || measurement === undefined) {
      res.status(400).json({ message: "Bad Request. Please fill all field." });
    }
    const rawMaterial = {
      name_raw_material: name_raw_material.trim(),
      measurement,
    };
    const connection = await getConnection;
    await connection.query("INSERT INTO type_raw_material SET ?", rawMaterial);
    res.json({ message: "Material agregado" });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const existsRawMaterial = async (req, res) => {
  try {
    const { name_raw_material } = req.body;

    if (name_raw_material === undefined) {
      return res.status(400).json({ message: "Bad Request. Please fill all field." });
    }

    const connection = await getConnection;

    const query = "SELECT name_raw_material FROM type_raw_material WHERE name_raw_material LIKE ?";
    const [results] = await connection.query(query, [name_raw_material.trim()]);
    console.log("hasta aqui llega", results.length);
    results.length > 0 ? res.json({ response: true }) : res.json({ response: false });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const existsNotSameRawMaterial = async (req, res) => {
  try {
    const { name_raw_material, id } = req.body;

    if (name_raw_material === undefined || id === undefined) {
      res.status(400).json({ message: "Bad Request. Please fill all field." });
    }

    const connection = await getConnection;
    const query = "SELECT name_raw_material FROM type_raw_material WHERE name_raw_material LIKE ? && id <> ?";
    const [results] = await connection.query(query, [name_raw_material, id]);
    results.length > 0 ? res.json({ response: true }) : res.json({ response: false });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const updateRawMaterial = async (req, res) => {
  try {
    let i = 0;

    let modifiedData = [...req.body];
    if (!Array.isArray(modifiedData)) {
      return res.status(400).send("El formato de datos no es correcto, contacte con el admin");
    }

    const connection = await getConnection;
    while (i < modifiedData.length) {
      const { name_raw_material, measurement, id } = modifiedData[i];
      if (!name_raw_material || !measurement || !id) {
        return res.status(400).json({ error: "Formato de datos incorrecto" });
      }
      const query = "UPDATE type_raw_material SET name_raw_material = ?, measurement = ? WHERE id = ?";
      await connection.query(query, [name_raw_material, measurement, id]);
      i = i + 1;
    }

    res.json("Registro actualizado");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const deleteRawMaterial = async (req, res) => {
  try {
    let i = 0;
    let idsToDelete = [...req.body];
    console.log("idsToDeleteArray", idsToDelete);
    if (!Array.isArray(idsToDelete)) {
      return res.status(400).send("El formato de datos no es correcto, contacte con el admin");
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
      const query = "DELETE FROM type_raw_material WHERE id = ?";
      await connection.query(query, [id]);
      i = i + 1;
    }

    res.json("Registro borrado");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const getUser = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const connection = await getConnection; // Llama a getConnection como una función
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).send("Unauthorized");
      }
      try {
        const [results] = await connection.query("SELECT role FROM users WHERE id = ?", [decoded.id]);
        console.log(results);
        if (results.length === 0) {
          return res.status(404).send("User not found");
        }
        res.json({ role: results[0].role });
      } catch (queryErr) {
        console.error(queryErr);
        res.status(500).send("Database query failed");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(401).send("Unauthorized");
  }
};

export const metodos = {
  getRawMaterial,
  addRawMaterial,
  getGreaterIdRaw,
  existsRawMaterial,
  getRawMaterialExpectId,
  updateRawMaterial,
  deleteRawMaterial,
  existsNotSameRawMaterial,
};
