import express from "express";
import morgan from "morgan";

// Routes
import cors from "cors";
import registerRawRoutes from "./routes/registerRaw.routes.js";
import addRawRouters from "./routes/addRaw.routes.js";
import addMermaRouters from "./routes/addMerma.routes.js";
import createProductRouters from "./routes/createProduct.routes.js";
import addPrescriptionRouters from "./routes/addPrescription.routes.js";
import loginRouters from "./routes/login.routes.js";
import addOrderRouters from "./routes/addOrder.routes.js";
import addSalesRouters from "./routes/addSales.routes.js";

const app = express();
app.use(cors());

// Settings
app.set("port", 8081);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

//Routes

app.use("/api/registerRaw", registerRawRoutes);
app.use("/api/addRaw", addRawRouters);
app.use("/api/addMerma", addMermaRouters);
app.use("/api/createProduct", createProductRouters);
app.use("/api/addPrescription", addPrescriptionRouters);
app.use("/api/addOrder", addOrderRouters);
app.use("/api/login", loginRouters);
app.use("/api/addSales", addSalesRouters);

export default app;
