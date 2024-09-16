import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../Url";
export default function Settings() {
  const navigate = useNavigate();

  const handleOnClick = async () => {
    try {
      await axios.post(url + "login/logout");
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" mx-10 mt-4 bg-slate-50 w-full">
      <div>
        <h2 className="text-xl font-bold leading-10 text-gray-900">Opciones</h2>
      </div>
      <button
        className="mt-16 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        onClick={handleOnClick}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
