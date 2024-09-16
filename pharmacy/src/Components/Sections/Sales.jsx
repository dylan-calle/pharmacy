import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ModalWindow from "./SectionsComponents/ModalWindow";

import DropDownGlobal from "./SectionsComponents/DropDownGlobal";
import { url } from "../../Url";

const NUMBER_REGEX = /^[0-9]*(\.[0-9]*)?$/;
export default function Order() {
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);
  const dropdownRef3 = useRef(null);
  const dropdownRef4 = useRef(null);

  const [orders, setOrders] = useState([]);

  const [optionsProducts, setOptionProducts] = useState([]);
  const [optionsClient, setOptionsClient] = useState([]);
  const [optionsDoctor, setOptionsDoctor] = useState([]);
  const optionsPayment = [
    { id: 1, payment_method: "Efectivo" },
    { id: 2, payment_method: "Tarjeta" },
    { id: 3, payment_method: "QR" },
    { id: 4, payment_method: "Cheque" },
    { id: 5, payment_method: "Otro" },
  ];

  const [number, setNumber] = useState(0);
  const [date, setDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, clientsRes, doctorsRes, numberRes, ordersRes] = await Promise.all([
          axios.get(`${url}addOrder/getProducts`),
          axios.get(`${url}addOrder/getClients`),
          axios.get(`${url}addOrder/getDoctors`),
          axios.get(`${url}addOrder/getNumber`),
          axios.get(`${url}addOrder/getPreparedOrders`),
        ]);

        setNumber(numberRes.data[0][0].id + 1);
        setOrders(ordersRes.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      // Establecemos la fecha actual
      setDate(new Date().toLocaleDateString());
    };

    fetchData();
  }, [isModalOpen]);

  const [data, setData] = useState({
    work_order_id: "",
    amount_due: "",
    payment_method: "",
  });
  useEffect(() => {
    console.log("data", data);
  }, [data]);
  const [paymentErr, setPaymentErr] = useState("");
  const handleChange = (property, e) => {
    const value = e.target.value;
    setData((prev) => ({
      ...prev,
      [property]: value,
    }));
  };
  useEffect(() => {
    setPaymentErr(seePaymentErrors);
    console.log(paymentErr);
  }, [data]);
  const seePaymentErrors = () =>
    !NUMBER_REGEX.test(data.amount_due)
      ? "El valor tiene que ser númerico"
      : data.amount_due === ""
      ? "Llene este campo por favor"
      : data.amount_due < updateData.u_price * updateData.quantity - updateData.advance
      ? "Se necesita pagar más"
      : "";
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data ", data);

    await axios
      .post(`${url}addSales/addSales`, data)
      .then(() => {
        setData({
          work_order_id: "",
          amount_due: "",
          payment_method: "",
        });
        setUpdateData({
          id: "",
          id_client: "",
          id_doctor: "",
          id_product: "",
          quantity: "",
          u_price: "",
          advance: "",
          payment_method: "",
          date: "",
          client_name: "",
          doctor_name: "",
          name_product: "",
        });
        handleCloseModal();
      })
      .catch((err) => console.log("error", err));
  };

  const [updateData, setUpdateData] = useState({
    id: "",
    id_client: "",
    id_doctor: "",
    id_product: "",
    quantity: "",
    u_price: "",
    advance: "",
    payment_method: "",
    date: "",
    client_name: "",
    doctor_name: "",
    name_product: "",
  });

  const formatISODate = (isoDateString) => {
    // Crear un objeto Date a partir de la cadena ISO
    const date = new Date(isoDateString);

    // Obtener el día, mes y año
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const year = date.getUTCFullYear();

    // Devolver la fecha en formato DD/MM/YYYY
    return `${day}/${month}/${year}`;
  };

  const [isSearchWorkOpen, setIsSearchWorkOpen] = useState(false);
  const handleCloseSearchWork = () => {
    setIsSearchWorkOpen(false);
  };
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [selectedWorkOrderStyles, setSelectedWorkOrderStyles] = useState(null);
  const handleSelectWorkOrder = (index, item) => {
    setSelectedWorkOrder(item);
    setSelectedWorkOrderStyles(index);
  };
  const handleClickSelect = (e) => {
    e.preventDefault();
    console.log("selectedWorkOrder", selectedWorkOrder);
    setData((prev) => ({
      ...prev,
      work_order_id: selectedWorkOrder.id,
    }));
    setUpdateData(selectedWorkOrder);
    handleCloseSearchWork();
  };
  return (
    <div className="bg-slate-50 w-full">
      <ModalWindow isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="sticky top-0 z-10 pt-4 pb-1 bg-white mb-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Agregar nota de venta</h2>
              <button
                type="button"
                onClick={() => setIsSearchWorkOpen(true)}
                className="rounded-md ml-6 bg-indigo-700 px-5 py-[0.6rem] text-base font-semibold border-2 text-white shadow-sd hover:bg-indigo-500 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
              >
                Buscar orden de trabajo
              </button>
            </div>
            <div className="flex justify-between mx-5 mt-6 mb-5">
              <span className=" block text-xl font-medium leading-6 text-gray-800">
                Nro. {updateData.id.toString().padStart(5, 0)}
              </span>
              <span className=" block text-xl font-medium leading-6 text-gray-800">
                {formatISODate(updateData.date)}
              </span>
            </div>
            <div className="mx-2 mb-1 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-12 items-end">
              <div className="sm:col-span-5">
                <label htmlFor="id_client" className=" block text-sm font-medium leading-6 text-gray-900">
                  Nombre del cliente
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  id="id_client"
                  value={updateData.client_name}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-500 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                />
              </div>
              <div className="sm:col-span-5">
                <label htmlFor="id_doctor" className=" block text-sm font-medium leading-6 text-gray-900">
                  Nombre del doctor
                </label>

                <input
                  type="text"
                  readOnly
                  disabled
                  id="id_doctor"
                  value={updateData.doctor_name}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-500 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                />
              </div>
              <div className="sm:col-span-5">
                <label htmlFor="id_product" className=" block text-sm font-medium leading-6 text-gray-900">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  id="id_product"
                  value={updateData.name_product}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-500 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="quantity" className=" block text-sm font-medium leading-6 text-gray-900">
                  Cantidad
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  id="quantity"
                  value={updateData.quantity}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-500 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                />
              </div>
              <div className="sm:col-span-3 sm:col-start-8">
                <label htmlFor="u_price" className=" block text-sm font-medium leading-6 text-gray-900">
                  Precio Unitario
                </label>
                <input
                  id="u_price"
                  readOnly
                  disabled
                  type="text"
                  value={updateData.u_price}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-500 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                />
              </div>
              <div className="sm:col-span-2 ">
                <label htmlFor="total" className="block text-sm font-medium leading-6 text-gray-900">
                  Total
                </label>
                <input
                  id="total"
                  readOnly
                  disabled
                  value={`Bs. ${updateData.u_price * updateData.quantity}`}
                  type="text"
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-500 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="payment_method" className=" block text-sm font-medium leading-6 text-gray-900">
                  Pago
                </label>
                <input
                  id="total"
                  value={data.amount_due}
                  type="text"
                  onChange={(e) => handleChange("amount_due", e)}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-black font-normal shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-gray-300 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="payment_method" className=" block text-sm font-medium leading-6 text-gray-900">
                  Método de pago
                </label>
                <DropDownGlobal
                  name="payment_method"
                  options={optionsPayment}
                  variableState={data}
                  functionState={setData}
                  namesql="payment_method"
                  index=""
                  styles="max-h-24"
                />
              </div>
              <div className="sm:col-span-2 sm:col-start-11">
                <label htmlFor="advance" className="block text-sm font-medium leading-6 text-gray-900">
                  Avance
                </label>
                <input
                  id="advance"
                  readOnly
                  disabled
                  type="text"
                  value={`Bs. ${updateData.advance}`}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-500 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                />
              </div>
              {paymentErr !== "" && (
                <div className="sm:col-span-4">
                  <span className="text-red-600">{`${paymentErr}`} </span>
                </div>
              )}
              <div className="sm:col-span-3 sm:row-start-5">
                <span>
                  {`Por cobrar`}
                  <span className="text-red-600">{` Bs. ${
                    updateData.u_price * updateData.quantity - updateData.advance
                  }`}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="sticky z-10 bottom-0 bg-transparent p-3 flex justify-end">
            <button
              type="button"
              className="rounded-md ml-6 bg-white px-3 py-1 text-sm font-semibold border-2 text-indigo-700 shadow-sd hover:bg-indigo-50 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md ml-3 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </ModalWindow>
      <ModalWindow
        isOpen={isSearchWorkOpen}
        onClose={handleCloseSearchWork}
        styles="bg-white rounded-md overflow-hidden shadow-xl z-50 max-w-[98%] "
      >
        <div className="py-5 px-2">
          <h2 className="text-2xl font-bold text-gray-900">Seleccionar orden de trabajo</h2>
        </div>
        <div className="w-max mx-auto pt-6 sm:px-6 lg:px-6">
          <div className="bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
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
                    Nombre Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombre Doctor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Producto
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cantidad
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Precio
                    <br />
                    Unitario
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Por <br />
                    cobrar
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...orders].reverse().map(
                  (item, index) =>
                    item.completed === 1 && (
                      <tr
                        key={index}
                        className={`${
                          selectedWorkOrderStyles === index ? "bg-indigo-200" : "hover:bg-slate-50"
                        } cursor-pointer `}
                        onClick={() => handleSelectWorkOrder(index, item)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.id.toString().padStart(5, 0)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{item.client_name}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{item.doctor_name}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{item.name_product}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{item.quantity}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{`Bs. ${item.u_price}`}</td>

                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">
                          {`Bs. ${item.quantity * item.u_price}`}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-red-500">{`Bs. ${
                          item.quantity * item.u_price - item.advance
                        }`}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
          <div className="sticky z-100 bottom-0 bg-white p-3 flex justify-end">
            <button
              type="button"
              className="rounded-md ml-6  bg-white px-3 py-1 text-sm font-semibold border-2 text-indigo-700 shadow-sd hover:bg-indigo-50 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
              onClick={handleCloseSearchWork}
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={(e) => handleClickSelect(e)}
              className="rounded-md ml-3 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Seleccionar
            </button>
          </div>
        </div>
      </ModalWindow>
      <div className=" mx-10 mt-4">
        <h2 className="text-xl font-bold leading-10 text-gray-900">Notas de venta</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">Estas son las órdenes de trabajo listas para vender</p>
      </div>
      <div className="flex justify-end my-4 mx-10">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-md ml-6 bg-indigo-700 px-5 py-[0.6rem] text-base font-semibold border-2 text-white shadow-sd hover:bg-indigo-500 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
        >
          Agregar nota de venta
        </button>
      </div>
      {orders.length !== 0 ? (
        <div className="w-max mx-auto py-6 sm:px-6 lg:px-6">
          <div className="bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
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
                    Nombre Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombre Doctor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Producto
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cantidad
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Precio
                    <br />
                    Unitario
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Por <br />
                    cobrar
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...orders].reverse().map(
                  (item, index) =>
                    item.completed === 1 && (
                      <tr key={index} className="">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.id.toString().padStart(5, 0)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{item.client_name}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{item.doctor_name}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{item.name_product}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{`Bs. ${item.u_price}`}</td>

                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                          {`Bs. ${item.quantity * item.u_price}`}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-red-500">{`Bs. ${
                          item.quantity * item.u_price - item.advance
                        }`}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex justify-center text-xl mt-20 text-gray-500">
          <p>No existen órdenes de ventas sin completarse.</p>
        </div>
      )}
    </div>
  );
}
