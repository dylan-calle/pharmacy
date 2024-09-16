import { useRef, useState, useEffect } from "react";
import ItemsNav from "../Minicomponents/ItemsNav";
import axios from "axios";
import { url } from "../Url";
import { Link, useNavigate } from "react-router-dom";

export default function Menu() {
  const liMateria = [
    { li: "Registro de Materia prima", to: "/register-raw" },
    { li: "Ingreso de materia prima", to: "/add-raw-material" },
    { li: "Mermas o pérdidas", to: "/add-merma" },
  ];
  const liReceta = [
    { li: "Agregar receta", to: "/add-receta" },
    { li: "Ver receta", to: "/see-receta" },
  ];
  const liProductos = [
    { li: "Registrar produtos", to: "/add-product" },
    { li: "Saldos a la fecha", to: "/balances-to-date" },
  ];
  const liVentas = [
    { li: "Ordenes de trabajo", to: "/order" },
    { li: "Notas de venta", to: "/sales" },
  ];
  const navRef = useRef();
  const handleClick = (e) => {
    const currentElement = e.target;
  };
  const [role, setRole] = useState();
  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await axios.get(url + "login/getRole", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRole(response.data.role);
        } catch (error) {
          navigate("/login");
          console.error("Failed to fetch role", error);
        }
      }
    };
    fetchRole();
  }, []);
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(true);
  return (
    <div
      className={`sticky top-0 h-screen bg-blue-950 flex flex-col justify-between duration-300 ${
        !isNavOpen ? "w-0" : "w-60"
      }`}
    >
      <button
        className={`w-10 h-10 fixed z-30 ${isNavOpen ? "text-white  self-end" : "text-black"}`}
        onClick={() => setIsNavOpen(!isNavOpen)}
      >
        ☰
      </button>
      <img src="./src/assets/farmacia-logo-icon.png" alt="logo-farmacia" className="w-52 z-10" />
      <div className={`${!isNavOpen ? "hidden " : "block "}`}>
        <nav ref={navRef} onClick={handleClick} data-id="menu" className="w-max min-h-[20rem] min-w-[13rem] z-0">
          <ul className="px-3">
            <ItemsNav to="/" idmenu="" text="Inicio" src="./src/assets/home-icon.svg" src2="" />
            <ItemsNav
              idmenu={navRef}
              text="Materia Prima"
              src="./src/assets/material-icon.png"
              src2="./src/assets/forward-icon.png"
              li={liMateria}
            />

            <ItemsNav
              idmenu={navRef}
              text="Recetas"
              src="./src/assets/recetas-icon.png"
              src2="./src/assets/forward-icon.png"
              li={liReceta}
            />
            <ItemsNav
              idmenu={navRef}
              text="Productos"
              src="./src/assets/new-product-icon.png"
              src2="./src/assets/forward-icon.png"
              li={liProductos}
            />

            {role === "admin" && (
              <ItemsNav to="/users" idmenu="" text="Usuarios" src="./src/assets/user-icon.png" src2="" />
            )}
            <ItemsNav
              idmenu={navRef}
              text="Ventas"
              src="./src/assets/sales-icon.png"
              src2="./src/assets/forward-icon.png"
              li={liVentas}
            />
          </ul>
        </nav>
      </div>
      <div className={`flex justify-end ${!isNavOpen && "hidden"}`}>
        <div className="mb-3 mr-4">
          <button type="button" className="p-1 hover:bg-blue-900 rounded-lg">
            <Link to="/settings">
              <img src="./src/assets/settings-icon.svg" alt="Settings" className="w-6 h-6" />
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
