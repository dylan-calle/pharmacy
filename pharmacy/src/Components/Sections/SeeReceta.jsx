import { useState, useEffect } from "react";
import axios from "axios";
import ModalWindow from "./SectionsComponents/ModalWindow";

import DropDownGlobal from "./SectionsComponents/DropDownGlobal";
import { url } from "../../Url";
export default function SeeReceta() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [optionsProducts, setOptionProducts] = useState([]);
  const [optionsClient, setOptionsClient] = useState([]);
  const [optionsDoctor, setOptionsDoctor] = useState([]);

  //

  //
  const optionsPayment = [
    { id: 1, payment_method: "Efectivo" },
    { id: 2, payment_method: "Tarjeta" },
    { id: 3, payment_method: "QR" },
    { id: 4, payment_method: "Cheque" },
    { id: 5, payment_method: "Otro" },
  ];

  const [number, setNumber] = useState(0);
  const [date, setDate] = useState("");
  useEffect(() => {
    axios.get(`${url}addOrder/getProducts`).then((res) => {
      setOptionProducts(res.data[0]);
    });
    axios.get(`${url}addOrder/getClients`).then((res) => {
      setOptionsClient(res.data[0]);
    });
    axios.get(`${url}addOrder/getDoctors`).then((res) => {
      setOptionsDoctor(res.data[0]);
    });
    axios.get(`${url}addOrder/getNumber`).then((res) => {
      setNumber(res.data[0][0].id + 1);
    });
    axios.get(`${url}addOrder/getOrders`).then((res) => {
      setOrders(res.data[0]);
    });
    setDate(new Date().toLocaleDateString());
  }, []);
  useEffect(() => {
    axios.get(`${url}addOrder/getOrders`).then((res) => {
      setOrders(res.data[0]);
    });
  }, [isModalOpen]);
  const [data, setData] = useState({
    id_client: "",
    id_doctor: "",
    id_product: "",
    quantity: "",
    u_price: "",
    advance: "",
    payment_method_id: "",
  });

  const handleChange = (property, e) => {
    const value = e.target.value;
    setData((prev) => ({
      ...prev,
      [property]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("data ", data);

    axios.post(`${url}addOrder/addOrder`, data).then(() => {
      handleCloseModal();
      setData([]);
    });
  };

  const [clientData, setClientData] = useState({
    name: "",
    ci: "",
  });
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const handleCloseClientModal = () => {
    setIsClientModalOpen(false);
    setClientData({});
  };
  const addClient = () => {
    setIsClientModalOpen(true);
  };
  const handleClientChange = (property, e) => {
    const value = e.target.value;
    setClientData((prev) => ({
      ...prev,
      [property]: value,
    }));
  };
  const handleClientSubmit = (e) => {
    e.preventDefault();
    axios.post(`${url}addOrder/addClient`, clientData).then(() => {
      handleCloseClientModal();
      setClientData([]);
    });
  };
  const [doctorData, setDoctorData] = useState({
    name: "",
    sex: "",
    whatever: "",
  });
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const handleCloseDoctorModal = () => {
    setIsDoctorModalOpen(false);
    setDoctorData({});
  };
  const addDoctor = () => {
    setIsDoctorModalOpen(true);
  };
  const handleDoctorChange = (property, e) => {
    const value = e.target.value;
    setDoctorData((prev) => ({
      ...prev,
      [property]: value,
    }));
  };
  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    axios.post(`${url}addOrder/addDoctor`, doctorData).then(() => {
      handleCloseDoctorModal();
      setDoctorData([]);
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, doctorsRes] = await Promise.all([
          axios.get(`${url}addOrder/getClients`),
          axios.get(`${url}addOrder/getDoctors`),
        ]);
        setOptionsClient(clientsRes.data[0]);
        setOptionsDoctor(doctorsRes.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [isClientModalOpen, isDoctorModalOpen]);
  const [isSeeMoreModalOpen, setIsSeeMoreModalOpen] = useState(false);
  const handleCloseSeeMoreModal = () => {
    setIsSeeMoreModalOpen(false);
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
  });
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
  const handleSeeMore = (item) => {
    setUpdateData((prev) => ({
      ...prev,
      id: item.id,
      id_client: item.client_name,
      id_doctor: item.doctor_name,
      id_product: item.name_product,
      quantity: item.quantity,
      u_price: item.u_price,
      advance: item.advance,
      payment_method: item.payment_method_id,
      date: [formatISODate(item.date)],
    }));

    setIsSeeMoreModalOpen(true);
  };

  const sexOptions = [
    { id: "m", sex: "m" },
    { id: "f", sex: "f" },
  ];
  return (
    <div className="bg-slate-50 w-full">
      <ModalWindow isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="sticky top-0 z-10 pt-4 pb-1 bg-white mb-10">
            <h2 className="text-2xl mb-4 font-bold text-gray-900">Agregar orden de trabajo</h2>
            <div className="flex justify-between mx-5 mt-6 mb-5">
              <span className=" block text-xl font-medium leading-6 text-gray-800">
                Nro. {number.toString().padStart(5, 0)}
              </span>
              <span className=" block text-xl font-medium leading-6 text-gray-800">{date}</span>
            </div>
            <div className="mx-2 mb-1 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-12 items-end">
              <div className="sm:col-span-5">
                <label htmlFor="id_client" className=" block text-sm font-medium leading-6 text-gray-900">
                  Nombre del cliente
                </label>
                <DropDownGlobal
                  name="id_client"
                  options={optionsClient}
                  variableState=""
                  namesql="name"
                  functionState={setData}
                  index=""
                  styles="max-h-44"
                />
              </div>
              <div className="sm:col-span-1 flex">
                <div className="mb-1">
                  <button onClick={addClient} type="button" className="relative inline-flex group">
                    <img className="h-4 w-4 z-10" src="./../../../src/assets/black-add-icon.png" alt="Agregar" />
                    <span className="absolute inset-0 -m-2 bg-slate-200 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 z-0"></span>
                  </button>
                </div>
              </div>

              <div className="sm:col-span-5">
                <label htmlFor="id_doctor" className="block text-sm font-medium leading-6 text-gray-900">
                  Nombre del doctor
                </label>

                <DropDownGlobal
                  name="id_doctor"
                  options={optionsDoctor}
                  variableState=""
                  functionState={setData}
                  namesql="name"
                  index=""
                  styles="max-h-44"
                />
              </div>
              <div className="sm:col-span-1 flex">
                <div className="mb-1">
                  <button onClick={addDoctor} type="button" className="relative inline-flex group ">
                    <img className="h-4 w-4 z-10" src="./../../../src/assets/black-add-icon.png" alt="Agregar" />
                    <span className="absolute inset-0 -m-2 bg-slate-200 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 z-0"></span>
                  </button>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="id_product" className="block text-sm font-medium leading-6 text-gray-900">
                  Nombre del producto
                </label>
                <DropDownGlobal
                  name="id_product"
                  options={optionsProducts}
                  variableState=""
                  functionState={setData}
                  namesql="name_product"
                  index=""
                  styles="max-h-44"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">
                  Cantidad
                </label>
                <input
                  id="quantity"
                  type="text"
                  value={data.quantity}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  onChange={(e) => handleChange("quantity", e)}
                />
              </div>
              <div className="sm:col-span-2 sm:col-start-9">
                <label htmlFor="price" className=" block text-sm font-medium leading-6 text-gray-900">
                  Precio Unitario
                </label>
                <input
                  id="price"
                  type="text"
                  value={data.u_price}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  onChange={(e) => handleChange("u_price", e)}
                />
              </div>
              <div className="sm:col-span-2 ">
                <label htmlFor="total" className=" block text-sm font-medium leading-6 text-gray-900">
                  Total
                </label>
                <input
                  id="total"
                  type="text"
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                />
              </div>

              <div className="sm:col-span-2 sm:row-start-3">
                <label htmlFor="advance" className=" block text-sm font-medium leading-6 text-gray-900">
                  Adelanto
                </label>
                <input
                  id="advance"
                  type="text"
                  value={data.advance}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  onChange={(e) => handleChange("advance", e)}
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="payment_method_id" className=" block text-sm font-medium leading-6 text-gray-900">
                  Método de pago
                </label>
                <DropDownGlobal
                  name="payment_method_id"
                  options={optionsPayment}
                  variableState=""
                  functionState={setData}
                  namesql="payment_method"
                  index=""
                  styles="max-h-24"
                />
              </div>
            </div>
          </div>
          <div className="sticky z-100 bottom-0 bg-white p-3 flex justify-end">
            <button
              type="button"
              className="rounded-md ml-6  bg-white px-3 py-1 text-sm font-semibold border-2 text-indigo-700 shadow-sd hover:bg-indigo-50 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
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

      <ModalWindow isOpen={isSeeMoreModalOpen} onClose={handleCloseSeeMoreModal}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="sticky top-0 z-10 pt-4 pb-1 bg-white mb-10">
            <h2 className="text-2xl mb-4 font-bold text-gray-900">Modificar orden de trabajo</h2>
            <div className="flex justify-between mx-5 mt-6 mb-5">
              <span className=" block text-xl font-medium leading-6 text-gray-800">
                Nro. {updateData.id.toString().padStart(5, 0)}
              </span>
              <span className=" block text-xl font-medium leading-6 text-gray-800">{updateData.date}</span>
            </div>
            <div className="mx-2 mb-1 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-12 items-end">
              <div className="sm:col-span-5">
                <label htmlFor="id_client" className=" block text-sm font-medium leading-6 text-gray-900">
                  Nombre del cliente
                </label>
                <DropDownGlobal
                  name="id_client"
                  options={optionsClient}
                  variableState={updateData}
                  namesql="name"
                  functionState={setUpdateData}
                  index="1"
                  styles="max-h-44"
                />
              </div>
              <div className="sm:col-span-1 flex">
                <div className="mb-1">
                  <button onClick={addClient} type="button" className="relative inline-flex group">
                    <img className="h-4 w-4 z-10" src="./../../../src/assets/black-add-icon.png" alt="Agregar" />
                    <span className="absolute inset-0 -m-2 bg-slate-200 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 z-0"></span>
                  </button>
                </div>
              </div>

              <div className="sm:col-span-5">
                <label htmlFor="id_doctor" className=" block text-sm font-medium leading-6 text-gray-900">
                  Nombre del doctor
                </label>

                <DropDownGlobal
                  name="id_doctor"
                  options={optionsDoctor}
                  variableState={updateData}
                  functionState={setUpdateData}
                  namesql="name"
                  index="1"
                  styles="max-h-44"
                />
              </div>
              <div className="sm:col-span-1 flex">
                <div className="mb-1">
                  <button onClick={addDoctor} type="button" className="relative inline-flex group ">
                    <img className="h-4 w-4 z-10" src="./../../../src/assets/black-add-icon.png" alt="Agregar" />
                    <span className="absolute inset-0 -m-2 bg-slate-200 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 z-0"></span>
                  </button>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="id_product" className=" block text-sm font-medium leading-6 text-gray-900">
                  Nombre del producto
                </label>
                <DropDownGlobal
                  name="id_product"
                  options={optionsProducts}
                  variableState={updateData}
                  functionState={setUpdateData}
                  namesql="name_product"
                  index="1"
                  styles="max-h-44"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="id_client" className=" block text-sm font-medium leading-6 text-gray-900">
                  Cantidad
                </label>
                <input
                  type="text"
                  id="id_client"
                  value={updateData.quantity}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  onChange={(e) => handleChange("quantity", e)}
                />
              </div>
              <div className="sm:col-span-2 sm:col-start-9">
                <label htmlFor="u_price" className=" block text-sm font-medium leading-6 text-gray-900">
                  Precio Unitario
                </label>
                <input
                  id="u_price"
                  type="text"
                  value={updateData.u_price}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  onChange={(e) => handleChange("u_price", e)}
                />
              </div>
              <div className="sm:col-span-2 ">
                <label htmlFor="total" className="block text-sm font-medium leading-6 text-gray-900">
                  Total
                </label>
                <input
                  id="total"
                  type="text"
                  readOnly
                  autoComplete="off"
                  className="cursor-default mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-gray-300 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="sm:col-span-2 sm:row-start-3">
                <label htmlFor="advance" className="block text-sm font-medium leading-6 text-gray-900">
                  Adelanto
                </label>
                <input
                  id="advance"
                  type="text"
                  value={updateData.advance}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  onChange={(e) => handleChange("advance", e)}
                />
              </div>
              <div className="sm:col-span-3">
                <label id="payment_method" className=" block text-sm font-medium leading-6 text-gray-900">
                  Método de pago
                </label>
                <DropDownGlobal
                  name="payment_method"
                  options={optionsPayment}
                  variableState={updateData}
                  functionState={setData}
                  namesql="payment_method"
                  index="2"
                  styles="max-h-24"
                />
              </div>
            </div>
          </div>
          <div className="sticky z-100 bottom-0 bg-white p-3 flex justify-end">
            <button
              type="button"
              className="rounded-md ml-6  bg-white px-3 py-1 text-sm font-semibold border-2 text-indigo-700 shadow-sd hover:bg-indigo-50 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
              onClick={handleCloseSeeMoreModal}
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
      <ModalWindow isOpen={isClientModalOpen} onClose={handleCloseClientModal}>
        <form onSubmit={(e) => handleClientSubmit(e)}>
          <div className="sticky top-0 z-10 pt-4 pb-1 bg-white mb-10">
            <h2 className="text-2xl mb-4 font-bold text-gray-900">Agregar nuevo cliente</h2>

            <div className="mx-2 mb-1 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-12 items-end">
              <div className="sm:col-span-5">
                <label htmlFor="client_name" className=" block text-sm font-medium leading-6 text-gray-900">
                  Nombre del cliente
                </label>
                <input
                  id="client_name"
                  type="text"
                  value={clientData.name}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  onChange={(e) => handleClientChange("name", e)}
                />
              </div>

              <div className="sm:col-span-5">
                <label htmlFor="client_id" className="block text-sm font-medium leading-6 text-gray-900">
                  CI del cliente
                </label>
                <input
                  id="client_id"
                  type="text"
                  value={clientData.ci}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  onChange={(e) => handleClientChange("ci", e)}
                />
              </div>
            </div>
          </div>
          <div className="sticky z-100 bottom-0 bg-white p-3 flex justify-end">
            <button
              type="button"
              className="rounded-md ml-6  bg-white px-3 py-1 text-sm font-semibold border-2 text-indigo-700 shadow-sd hover:bg-indigo-50 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
              onClick={handleCloseClientModal}
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
      <ModalWindow isOpen={isDoctorModalOpen} onClose={handleCloseDoctorModal}>
        <form onSubmit={(e) => handleDoctorSubmit(e)}>
          <div className="sticky top-0 z-10 pt-4 pb-1 bg-white mb-10">
            <h2 className="text-2xl mb-4 font-bold text-gray-900">Agregar nuevo doctor</h2>

            <div className="mx-2 mb-1 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-12 items-end">
              <div className="sm:col-span-5">
                <label htmlFor="doctor_name" className=" block text-sm font-medium leading-6 text-gray-900">
                  Nombre del doctor
                </label>
                <input
                  id="doctor_name"
                  type="text"
                  value={doctorData.name}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  onChange={(e) => handleDoctorChange("name", e)}
                />
              </div>

              <div className="sm:col-span-5">
                <label htmlFor="doctor_ci" className=" block text-sm font-medium leading-6 text-gray-900">
                  CI del doctor
                </label>
                <input
                  id="doctor_ci"
                  type="text"
                  value={doctorData.whatever}
                  autoComplete="off"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                  onChange={(e) => handleDoctorChange("whatever", e)}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="sex" className=" block text-sm font-medium leading-6 text-gray-900">
                  Sexo
                </label>
                <DropDownGlobal
                  name="sex"
                  options={sexOptions}
                  variableState={doctorData}
                  functionState={setDoctorData}
                  namesql="sex"
                  index=""
                  styles=""
                />
              </div>
            </div>
          </div>
          <div className="sticky z-100 bottom-0 bg-white p-3 flex justify-end">
            <button
              type="button"
              className="rounded-md ml-6  bg-white px-3 py-1 text-sm font-semibold border-2 text-indigo-700 shadow-sd hover:bg-indigo-50 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
              onClick={handleCloseDoctorModal}
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
      <div className=" mx-10 mt-4   ">
        <h2 className="text-xl font-bold leading-10 text-gray-900">Órdenes de trabajo</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">Estos son los últimos movimientos</p>
      </div>
      <div className="flex justify-end my-4 mx-10">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-md ml-6 bg-indigo-700 px-7 py-3 text-base font-semibold border-2 text-white shadow-sd hover:bg-indigo-500 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
        >
          Agregar orden de trabajo
        </button>
      </div>
      {orders.length !== 0 ? (
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
                {orders.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id.toString().padStart(5, 0)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{item.client_name}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{item.doctor_name}</td>

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
                    Materia <br />
                    prima
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cantidad <br />
                    requerida
                  </th>

                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id.toString().padStart(5, 0)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{item.client_name}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{item.doctor_name}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
