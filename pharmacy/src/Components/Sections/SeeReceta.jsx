import { useState, useEffect } from "react";
import axios from "axios";
import ModalWindow from "./SectionsComponents/ModalWindow";
import { Link } from "react-router-dom";

import DropDownGlobal from "./SectionsComponents/DropDownGlobal";
import { url } from "../../Url";
export default function SeeReceta() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const optionsPayment = [
    { id: 1, payment_method: "Efectivo" },
    { id: 2, payment_method: "Tarjeta" },
    { id: 3, payment_method: "QR" },
    { id: 4, payment_method: "Cheque" },
    { id: 5, payment_method: "Otro" },
  ];

  const [date, setDate] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prescriptions] = await Promise.all([axios.get(`${url}addPrescription/getPrescriptions`)]);

        setPrescriptions(prescriptions.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      // Establecemos la fecha actual
      setDate(new Date().toLocaleDateString());
    };

    fetchData();
  }, []);

  const [isSeeMoreModalOpen, setIsSeeMoreModalOpen] = useState(false);
  const handleCloseSeeMoreModal = () => {
    setIsSeeMoreModalOpen(false);
  };
  const [raws, setRaws] = useState([]);
  function formatISODate(isoDateString) {
    // Crear un objeto Date a partir de la cadena ISO
    const date = new Date(isoDateString);

    // Obtener el día, mes y año
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const year = date.getUTCFullYear();

    // Devolver la fecha en formato DD/MM/YYYY
    return `${day}/${month}/${year}`;
  }
  const handleSeeMore = async (item) => {
    try {
      const response = await axios.post(`${url}addPrescription/getRawsIdGiven`, {
        id: item.id_prescription,
        measurement: item.measurement,
      });
      setRaws([{ name_product: item.name_product, measurement: item.measurement }, ...response.data[0]]);

      setIsSeeMoreModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="bg-slate-50 w-full">
      <ModalWindow isOpen={isSeeMoreModalOpen} onClose={handleCloseSeeMoreModal}>
        <div className="ml-2 mt-3">
          {raws.length > 0 && (
            <h1 className="text-xl font-bold leading-10 text-gray-900">{`Receta para el producto ${raws[0].name_product} (${raws[0].measurement})`}</h1>
          )}
        </div>
        <div className="w-max mx-auto py-6 sm:px-6 lg:px-6">
          <div className="bg-white shadow-md rounded-lg flex">
            <table className="max-w-44 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nro
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cantidad necesitada (C/U)
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cantidad disponible (C/U)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {raws.map(
                  (item, index) =>
                    index !== 0 && (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {/* {item.id_prescription.toString().padStart(5, 0)} */}
                          {item.nro_list}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{`${item.name_raw_material} `}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{`${item.needed_quantity} (${item.measurement})`}</td>

                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{`${item.raw_quantity} (${item.measurement})`}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ModalWindow>

      <div className=" mx-10 mt-4   ">
        <h2 className="text-xl font-bold leading-10 text-gray-900">Recetas</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">Estás son las recetas actuales</p>
      </div>
      <div className="flex justify-end my-4 mx-10">
        <Link to="/add-receta">
          <button
            type="button"
            className="rounded-md ml-6 bg-indigo-700 px-7 py-3 text-base font-semibold border-2 text-white shadow-sd hover:bg-indigo-500 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
          >
            Agregar Receta
          </button>
        </Link>
      </div>
      {prescriptions.length !== 0 ? (
        <div className="w-max mx-auto py-6 sm:px-6 lg:px-6">
          <div className="bg-white shadow-md rounded-lg flex">
            <table className="max-w-44 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nro
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Producto <br />
                    asociado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha de <br />
                    Creación
                  </th>

                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prescriptions.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id_prescription.toString().padStart(5, 0)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{`${item.name_product} (${item.measurement})`}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatISODate(item.date)}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <span
                        onClick={() => handleSeeMore(item)}
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      >
                        Ver más
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex justify-center text-xl mt-20 text-gray-500">
          <p>No existen ordenes de ventas sin completarse.</p>
        </div>
      )}
    </div>
  );
}
