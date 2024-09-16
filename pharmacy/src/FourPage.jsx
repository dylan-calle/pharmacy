import { useNavigate } from "react-router-dom";
export default function FourPage() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="text-center">
        <h1 className="text-7xl">404</h1>
        <h2 className="text-xl">Página no encontrada</h2>
        <button
          onClick={() => navigate("/")}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
        >
          Volver al Home
        </button>
      </div>
    </div>
  );
}
