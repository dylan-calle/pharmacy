import { getConnection } from "../database/database.js";

const getProducts = async (req, res) => {
  const query = "SELECT id, name_product, measurement FROM type_product WHERE id>3";
  try {
    const connection = getConnection;
    const results = await connection.query(query);

    res.json(results);
    //res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
};
const getClients = async (req, res) => {
  const query = "SELECT id, name FROM clients";
  try {
    const connection = getConnection;
    const results = await connection.query(query);
    res.json(results);
  } catch (err) {
    res.status(400).send(err);
  }
};
const addClient = async (req, res) => {
  const { name, ci } = req.body;
  const query = "INSERT INTO clients (name, ci) VALUES (?,?)";
  try {
    const connection = getConnection;
    await connection.query(query, [name, ci]);
    res.status(201).send("Client successfully created");
  } catch (err) {
    res.status(400).send(err);
  }
};
const getDoctors = async (req, res) => {
  const query = "SELECT id, name FROM doctors";
  try {
    const connection = getConnection;
    const results = await connection.query(query);
    res.json(results);
  } catch {
    res.status(400).send(err);
  }
};
const addDoctor = async (req, res) => {
  const { name, sex, whatever } = req.body;
  const query = "INSERT INTO doctors (name, sex, whatever) VALUES (?,?,?)";
  try {
    const connection = getConnection;
    await connection.query(query, [name, sex, whatever]);
    res.status(201).send("Doctor successfully created!");
  } catch (err) {
    res.status(400).send(err);
  }
};
const getNumber = async (req, res) => {
  const query = "SELECT id FROM work_order WHERE id>= ALL (SELECT id FROM work_order)";
  try {
    const connection = getConnection;
    const results = await connection.query(query);
    res.json(results);
  } catch (err) {
    res.status(400).send(err);
  }
};
const addOrder = async (req, res) => {
  const { id_client, id_doctor, id_product, quantity, u_price, advance, payment_method_id } = req.body;
  console.log("req.body", req.body);
  const query =
    "INSERT INTO work_order (id_client, id_doctor, id_product, quantity, u_price, advance, payment_method_id) VALUES (?,?,?,?,?,?,?)";
  try {
    const connection = getConnection;
    await connection.query(query, [
      id_client,
      id_doctor,
      id_product,
      quantity,
      u_price,
      advance,
      payment_method_id,
    ]);
    res.status(201).send("Work order successfully created");
  } catch (err) {
    res.status(400).send(err);
  }
};
const updateOrder = async (req, res) => {
  console.log(req.body);
  const { id, id_client, id_doctor, id_product, quantity, u_price, advance, payment_method_id, date, completed } =
    req.body;
  const query =
    "UPDATE work_order SET id_client = ?, id_doctor = ?, id_product = ?, quantity = ?, u_price = ?, advance = ?, payment_method_id = ?, completed = ? WHERE id = ?";
  try {
    const connection = getConnection;
    await connection.query(query, [
      id_client,
      id_doctor,
      id_product,
      quantity,
      u_price,
      advance,
      payment_method_id,
      completed,
      id,
    ]);
    res.status(200).send("Updated sucessfully");
  } catch (err) {
    res.status(400).send(err);
  }
};
const getOrders = async (req, res) => {
  const query =
    "SELECT work_order.id, clients.name AS client_name, doctors.name AS doctor_name, type_product.name_product, quantity, u_price, advance, payment_method.payment_method, work_order.date, completed FROM work_order INNER JOIN doctors ON doctors.id = work_order.id_doctor INNER JOIN clients ON clients.id = work_order.id_client INNER JOIN type_product ON type_product.id = work_order.id_product INNER JOIN payment_method ON work_order.payment_method_id = payment_method.id";

  try {
    const connection = getConnection;
    const results = await connection.query(query);
    res.json(results);
  } catch {
    res.status(400).send(err);
  }
};
const getOrdersID = async (req, res) => {
  const { id } = req.body;
  const query =
    "SELECT id, id_client, id_doctor, id_product, quantity, u_price, advance, payment_method_id, completed FROM work_order WHERE id=?";
  const connection = getConnection;
  try {
    const results = await connection.query(query, [id]);
    res.json(results);
  } catch (err) {
    res.status(400).send(err);
  }
};
const getPreparedOrders = async (req, res) => {
  const query =
    "SELECT work_order.id, clients.name AS client_name, doctors.name AS doctor_name, type_product.name_product, quantity, u_price, advance, payment_method.payment_method, work_order.date, completed FROM work_order INNER JOIN doctors ON doctors.id = work_order.id_doctor INNER JOIN clients ON clients.id = work_order.id_client INNER JOIN type_product ON type_product.id = work_order.id_product INNER JOIN payment_method ON work_order.payment_method_id = payment_method.id WHERE completed = 1";

  try {
    const connection = getConnection;
    const results = await connection.query(query);
    res.json(results);
  } catch {
    res.status(400).send(err);
  }
};
export const methods = {
  getProducts,
  getClients,
  addClient,
  getDoctors,
  addDoctor,
  getNumber,
  addOrder,
  getOrders,
  updateOrder,
  getPreparedOrders,
  getOrdersID,
};