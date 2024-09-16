import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getConnection } from "./../database/database.js";
import { JWT_SECRET, JWT_REFRESH } from "../database/config.js";
const auth = async (req, res) => {
  const { username, password } = req.body;
  console.log("entro alguienn");
  try {
    const connection = await getConnection;

    const results = await connection.query("SELECT * FROM users WHERE username = ?", username);
    if (results.length > 0) {
      bcrypt.compare(password, results[0][0].password, (err, match) => {
        if (err) throw err;
        if (match) {
          const accessToken = jwt.sign({ id: results[0][0].id, role: results[0][0].role }, JWT_SECRET, {
            expiresIn: "15m",
          });
          const refreshToken = jwt.sign({ id: results[0][0].id, role: results[0][0].role }, JWT_REFRESH, {
            expiresIn: "1d",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
          });
          res.json({ msg: "Success", accessToken });
        } else {
          res.status(400).send("Invalid credentials");
        }
      });
    } else {
      res.status(400).send("User not found");
    }
  } catch (err) {
    res.sendStatus(500);
  }
};
const refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).send("No refresh token found");
  jwt.verify(refreshToken, JWT_REFRESH, (err, user) => {
    if (err) return res.status(403).send("Invalid refresh token");
    const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
    res.json({ accessToken });
  });
};
const logout = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "Strict", path: "/login" });
  res.status(200).json({ msg: "Logged out successfully" });
};
const getRole = async (req, res) => {
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

export const methods = { auth, refreshToken, logout, getRole };
