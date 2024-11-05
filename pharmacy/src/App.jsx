import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import FourPage from "./FourPage";
import Login from "./Components/Login";
import PrivateRoute from "./Components/PrivateRoute";
import Home from "./Components/Sections/Home";
import AddRawMaterial from "./Components/Sections/AddRawMaterial";
import AddMerma from "./Components/Sections/AddMerma";
import AddReceta from "./Components/Sections/AddReceta";
import SeeReceta from "./Components/Sections/SeeReceta";
import CreateProduct from "./Components/Sections/CreateProduct";
import Users2 from "./Components/Sections/Users2";
import RegisterRawMaterial from "./Components/Sections/RegisterRawMaterial";
import BalancesToDate from "./Components/Sections/BalancesToDate";
import Menu from "./Components/Menu";
import Settings from "./Components/Settings";
import Test from "./Test";
import Order from "./Components/Sections/Order";
import Sales from "./Components/Sections/Sales";
function Layout({ children }) {
  return (
    <div className="flex bg-slate-50 w-[100%]">
      <Menu />
      <div className="content w-[100%] overflow-auto">{children}</div>
    </div>
  );
}
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Home />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-raw-material"
          element={
            <PrivateRoute>
              <Layout>
                <AddRawMaterial />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-merma"
          element={
            <PrivateRoute>
              <Layout>
                <AddMerma />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-receta"
          element={
            <PrivateRoute>
              <Layout>
                <AddReceta />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/see-receta"
          element={
            <PrivateRoute>
              <Layout>
                <SeeReceta />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <Layout>
                <CreateProduct />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Layout>
                <Users2 />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/register-raw"
          element={
            <PrivateRoute>
              <Layout>
                <RegisterRawMaterial />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/balances-to-date"
          element={
            <PrivateRoute>
              <Layout>
                <BalancesToDate />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <Settings />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/test"
          element={
            <PrivateRoute>
              <Layout>
                <Test />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/order"
          element={
            <PrivateRoute>
              <Layout>
                <Order />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <PrivateRoute>
              <Layout>
                <Sales />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <FourPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
