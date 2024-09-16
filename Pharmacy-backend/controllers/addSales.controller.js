import { getConnection } from "../database/database.js";
const addOrderToSales = async (req, res) => {
  const query = "CALL sp_add_sales(?,?,?)";
  const connection = getConnection;
  const { amount_due, work_order_id, payment_method } = req.body;
  console.log(amount_due, work_order_id, payment_method);
  if (!amount_due || !work_order_id || !payment_method) {
    return res.status(400).send("Bad Request");
  }
  try {
    connection.query(query, [amount_due, work_order_id, payment_method]);
    return res.status(201).send("Sale created successfully");
  } catch (err) {
    return res.status(400).send(err);
  }
};
export const methods = { addOrderToSales };
