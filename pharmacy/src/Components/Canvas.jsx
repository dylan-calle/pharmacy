import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import { useState } from "react";
import Menu from "./Menu";
import Home from "./Sections/Home";
import AddRawMaterial from "./Sections/AddRawMaterial";
import AddMerma from "./Sections/AddMerma";
import AddReceta from "./Sections/AddReceta";
import SeeReceta from "./Sections/SeeReceta";
import CreateProduct from "./Sections/CreateProduct";
import Login from "./Login";
import Users from "./Sections/Users";
import Users2 from "./Sections/Users2";
import RegisterRawMaterial from "./Sections/RegisterRawMaterial";
import BalancesToDate from "./Sections/BalancesToDate";

//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
export default function Canvas() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-raw-material" element={<AddRawMaterial />} />
          <Route path="/add-merma" element={<AddMerma />} />
          <Route path="/add-receta" element={<AddReceta />} />
          <Route path="/see-receta" element={<SeeReceta />} />
          <Route path="/add-product" element={<CreateProduct />} />
          <Route path="/users" element={<Users2 />} />
          <Route path="/register-raw" element={<RegisterRawMaterial />} />
          <Route path="/balances-to-date" element={<BalancesToDate />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
