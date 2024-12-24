import { getConnection as connection } from "./../database/database.js";

const getRawMaterial = async (req, res) => {
  try {
    const result = await connection.query("SELECT * FROM type_raw_material WHERE id>210 AND status = 1;");
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
const getRawMaterialExpectId = async (req, res) => {
  try {
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
    const modifiedData = req.body;

    if (!Array.isArray(modifiedData)) {
      return res.status(400).json({ error: "El formato de datos no es correcto, contacte con el admin" });
    }

    // Validate all entries
    const invalidEntry = modifiedData.find(
      ({ name_raw_material, measurement, id }) => !name_raw_material || !measurement || !id
    );

    if (invalidEntry) {
      return res.status(400).json({ error: "Formato de datos incorrecto" });
    }

    // Build queries
    const queries = modifiedData.map(({ name_raw_material, measurement, id, raw_quantity }) => {
      const query =
        raw_quantity === undefined
          ? "UPDATE type_raw_material SET name_raw_material = ?, measurement = ? WHERE id=?"
          : "UPDATE type_raw_material SET name_raw_material = ?, measurement = ?, raw_quantity = ? WHERE id=?";
      const params =
        raw_quantity === undefined
          ? [name_raw_material, measurement, id]
          : [name_raw_material, measurement, raw_quantity, id];
      return { query, params };
    });
    console.log("queries", queries);
    // Execute all queries in parallel
    await Promise.all(queries.map(({ query, params }) => connection.query(query, params)));

    res.json({ message: "Registro actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRawMaterial = async (req, res) => {
  try {
    let idsToDelete = [...req.body];

    if (!Array.isArray(idsToDelete)) {
      return res.status(400).send("El formato de datos no es correcto, contacte con el admin");
    }

    for (let i = 0; i < idsToDelete.length; i++) {
      const { id } = idsToDelete[i];
      if (!id) {
        return res.status(400).json({ error: "Formato de datos incorrecto" });
      }

      // Verificar si existen referencias en inserts_raw_material
      const checkReferencesQuery = "SELECT COUNT(*) AS count FROM inserts_raw_material WHERE id_raw_material = ?";
      const [result] = await connection.query(checkReferencesQuery, [id]);

      if (result[0].count > 0) {
        // Si hay referencias, mandar error
      } else {
        // Si no hay referencias, realizar Soft Delete
        const deleteQuery = "UPDATE type_raw_material SET status = 0 WHERE id = ?";
        await connection.query(deleteQuery, [id]);
        console.log(`Registro eliminado en type_raw_material con id ${id}`);
      }
    }

    res.json("Proceso de eliminación completado");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const verifyIfReferencesofRawExists = async (req, res) => {
  const { id } = req.body;

  try {
    const checkReferencesQuery = "SELECT COUNT(*) AS count FROM inserts_raw_material WHERE id_raw_material = ?";
    const [result] = await connection.query(checkReferencesQuery, [id]);

    return res.json(result);
  } catch (err) {
    console.error(err);
  }
};

const getUser = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    // Llama a getConnection como una función
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
  verifyIfReferencesofRawExists,
  existsNotSameRawMaterial,
};
