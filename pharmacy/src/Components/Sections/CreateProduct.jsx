import { useEffect, useState } from "react";

import MediumLabeledInput from "./SectionsComponents/MediumLabeledInput";
import axios from "axios";
import SelectInputSimple from "./SectionsComponents/SelectInputSImple";
import ModalWindow from "./SectionsComponents/ModalWindow";
import ModalConfirmation from "./SectionsComponents/ModalConfirmation";
import ModalInfoWindow from "./SectionsComponents/ModalInfoWindow";
import ListProductValidation from "./Validations/ListProductValidation";
import { url } from "../.././Url";
import CreateProductValidation from "./Validations/CreateProductValidation";
import Menu from "../Menu";
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
export default function CreateProduct() {
  const options = ["g", "mg", "µg", "ml", "l"];
  const [optionsModal, setOptionsModal] = useState(["g", "g", "mg", "µg", "ml", "l"]);
  const [message, setMessage] = useState({ name_product: "", measurement: "" });
  const [codeMP, setCodeMP] = useState("");
  const [nameProduct, setNameProduct] = useState("");
  const [measurement, setMeasurement] = useState(options[0]);
  const [errors, setErrors] = useState({});
  const [errorsList, setErrorsList] = useState({});
  const [submited, setSubmited] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listOfProduct, setListOfProduct] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState();
  const [isReadOnly, setIsReadOnly] = useState([]);
  const [isFirstClick, setIsFirstClick] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [submitedSave, setSubmitedSave] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [newErrorsList, setNewErrorsList] = useState([]);
  const [showSuccessMessage, setshowSuccessEditDelete] = useState(false);
  const [role, setRole] = useState("");

  const values = {
    name_product: nameProduct,
    measurement: measurement,
  };
  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          console.log("token ", token);
          const response = await axios.get(url + "login/getRole", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRole(response.data.role);
        } catch (error) {
          console.error("Failed to fetch role", error);
        }
      }
    };
    fetchRole();
  }, []);
  const renderMPCode = () => {
    axios
      .get(url + "createProduct/getGreaterIdProduct/")
      .then((res) => {
        const dataRes = res.data[0][0].id_product; // dataRes is 'MP-000X'
        let numPart = parseInt(dataRes.split("-")[1], 10); // Split 'P' and '000X', [1] means the second ('0001') then '000X' and 10 is the base
        numPart = numPart + 1; // Add one more
        const numPartStr = numPart.toString(); // To String
        const formattedStr = numPartStr.padStart(4, "0"); // '000X' for the number X
        const finalStr = `P-${formattedStr}`;

        setCodeMP(finalStr);
      })
      .catch((err) => console.log(err));
  };
  const addArrayToState = (newArray) => {
    //setListOfProduct((prevState) => [...prevState, ...newArray]);
    setListOfProduct(newArray);
  };
  const renderListOfProduct = () => {
    axios
      .get(url + "createProduct/getProducts/")
      .then((res) => {
        addArrayToState(...[res.data[0]]);
        //This part is to initialize arrays to true
        const newArrayReadOnly = new Array(res.data[0].length).fill(true);
        setIsReadOnly(newArrayReadOnly);
        const newArrayFirstClick = new Array(res.data[0].length).fill(true);
        setIsFirstClick(newArrayFirstClick);
        const newArrayErrors = new Array(res.data[0].length).fill("");
        setErrorsList(newArrayErrors);
      })
      .catch((err) => console.log(err));
  };
  const removeById = (idToRemove) => {
    setListOfProduct((prevItems) => {
      const indexToRemove = prevItems.findIndex((item) => item.id === idToRemove);
      if (indexToRemove !== -1) {
        const newItems = [...prevItems];
        newItems.splice(indexToRemove, 1);
        return newItems;
      }
    });
  };
  const addModified = (object) => {
    const newObject = {
      name_product: object.name_product,
      measurement: object.measurement,
      id: object.id,
    };

    setModifiedData((preev) => [...preev, newObject]);
  };
  useEffect(() => {
    if (errorsList.length > 0) {
      setNewErrorsList([...errorsList]);
    }
  }, [errorsList]);
  useEffect(() => {
    renderMPCode();
  }, [submited, submitedSave]);
  useEffect(() => {
    if (submited) {
      if (!errors.name_product) {
        setShowError(false);
        axios
          .post(url + "createProduct/addProduct/", values)
          .then(() => {
            setShowSuccess(true);
            setSubmited(false);
            setMessage({
              name_product: nameProduct,
              measurement: measurement,
            });
            setNameProduct("");
          })
          .catch((err) => console.log(err));
      } else {
        setShowError(true);
        setSubmited(false);
      }
    }
  }, [submited, errors]);
  useEffect(() => {
    if (submitedSave) {
      if (errorsList.every(isObjectEmpty)) {
        axios
          .post(url + "createProduct/updateProduct/", [...modifiedData])
          .then(() => {
            handleCloseModal();
            setModifiedData([]);
            setSubmitedSave(false);
            setshowSuccessEditDelete(true);
          })
          .catch((err) => console.log(err));
        if (idsToDelete.length > 0) {
          axios
            .post(url + "createProduct/deleteProduct/", [...idsToDelete])
            .then(() => {
              setshowSuccessEditDelete(true);
            })
            .catch((err) => console.log(err));
        }
      } else {
        //setShowError(true);
        setSubmitedSave(false);
        setErrorsList([]);
      }
    }
  }, [submitedSave, errorsList]);

  const handleSumbitSave = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = await ListProductValidation(modifiedData);

      setErrorsList(validationErrors);
      setSubmitedSave(true);
      if (validationErrors.length === 0) {
        renderListOfProduct();
      } //Here we are initializing isFirstClick to true all again and rendering the List
    } catch (err) {
      console.error("Validation failed", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validationErrors = await CreateProductValidation(values);

      setErrors(validationErrors);
      setSubmited(true);
    } catch (err) {
      console.error("Validation failed", err);
    }
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
    renderListOfProduct();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    renderListOfProduct();

    setModifiedData([]); // set to [] each data who was gonna be edited
    setIdsToDelete([]); // set to [] each data who was gonna be deleted
  };
  const handleDeleteButton = (id, index) => {
    setTargetToDelete(id);
    setIsConfirmationModalOpen(true);
  };
  const handleConfirmationCloseModal = (eliminated) => {
    if (eliminated) {
      //This code is to eliminate this element from the modifiedData in case that the user wanted to edit and then delete but they deleted it with an invalid name
      const newListModified = [...modifiedData];
      const index = newListModified.findIndex((item) => item.id === targetToDelete);

      newListModified.splice(index, 1);
      setModifiedData(newListModified);
      //
      removeById(targetToDelete); //front delete
      setIdsToDelete((prev) => [...prev, { id: targetToDelete }]); //back delete
    }

    setIsConfirmationModalOpen(false);
  };
  const handleEdit = (index, fromDoubleClick) => {
    if (role === "admin") {
      if (isFirstClick[index]) {
        const newList = [...isFirstClick];
        newList[index] = false;
        setIsFirstClick(newList);
        addModified(listOfProduct[index]);
      }
      if (fromDoubleClick) {
        const newList = [...isReadOnly];
        newList[index] = false;
        setIsReadOnly(newList);
      } else {
        const newList = [...isReadOnly];
        newList[index] = !isReadOnly[index];
        setIsReadOnly(newList);
      }
    }
  };
  const handleChangeModal = (e, index, string, id) => {
    const newList = [...listOfProduct];
    newList[index] = { ...newList[index], [string]: e.target.value };
    setListOfProduct(newList);

    modifiedData.map((element, index2) => {
      if (modifiedData[index2].id === id) {
        modifiedData[index2] = {
          ...modifiedData[index2],
          [string]: string === "name_product" ? newList[index].name_product : newList[index].measurement,
        };
      }
    });
  };

  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const handleCloseInfoModal = () => {
    setIsModalInfoOpen(false);
  };
  return (
    <div
      className="bg-slate-50 w-full"
      onClick={() => {
        setShowSuccess(false);
        setshowSuccessEditDelete(false);
      }}
    >
      <ModalInfoWindow isOpen={isModalInfoOpen} onClose={handleCloseInfoModal}>
        <div className="bg-white rounded-md overflow-hidden shadow-xl z-40 w-[20rem] opacity-[0.9999]">
          <div className="px-4 pt-3 pb-4 overflow-auto max-h-[78vh]">
            <p className="mt-1 mb-3 text-sm font-semibold leading-6 text-gray-600">
              Por favor llene los campos para crear el producto.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setIsModalInfoOpen(false)}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </ModalInfoWindow>
      <div className="mx-10 mt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-16">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="flex ">
                <h2 className="text-xl font-bold leading-10 text-gray-900">Crear Producto</h2>
                <button
                  title=" Llene los siguientes campos para registrar el producto"
                  type="button"
                  onClick={() => setIsModalInfoOpen(true)}
                >
                  <img
                    src="./../../assets/info-icon.png"
                    alt="info"
                    className="w-4 h-4 ml-3 align-middle leading-7"
                  />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
                <MediumLabeledInput
                  name=""
                  value={nameProduct}
                  label="Nombre de Producto"
                  variableState={nameProduct}
                  functionState={setNameProduct}
                />
                <div className="sm:col-span-2">
                  <span className="block text-sm font-medium leading-6 text-gray-900">Medida</span>
                  <div className="mt-2">
                    <SelectInputSimple
                      name="Medida"
                      options={options}
                      variableState={measurement}
                      functionState={setMeasurement}
                    />
                  </div>
                </div>
              </div>
              {showError && <div className="text-red-600 font-semibold text-sm">{errors.name_product || ""}</div>}
              {showSuccess && (
                <div className="text-green-600 font-semibold text-sm">
                  Producto '{message.name_product}' en {message.measurement} agregado! con el código {codeMP}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
            <div className="mt-6 flex items-center justify-start gap-x-6 sm:col-span-3">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleOpenModal}
              >
                Ver lista de Productos
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6 sm:col-span-2">
              <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Guardar
              </button>
            </div>
          </div>
          {showSuccessMessage && (
            <div className="mt-5">
              <span className="text-green-600 font-semibold text-lg">¡Los cambios se realizaron con éxito!</span>
            </div>
          )}
        </form>
      </div>
      <ModalWindow isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="sticky top-0 z-10 pt-4 pb-1 bg-white ">
          <h2 className="text-2xl mb-4 font-semibold text-gray-900">Lista de Productos</h2>

          <div className="mx-2">
            <div className=" mb-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-10">
              <span className="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900">Producto</span>
              <span className="sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">Código</span>
              <span className=" sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">Cantidad</span>
              <span className=" sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">Medición</span>
            </div>
          </div>
        </div>
        <ul>
          {listOfProduct.map((element, index) => (
            <li key={listOfProduct[index].id}>
              <div className="grid sm:grid-cols-10">
                {/* NAME PRODUCT */}
                <div className="mt-1 mx-2 sm:col-span-3">
                  <input
                    id={element.id + element.name_product}
                    value={listOfProduct[index].name_product}
                    onChange={(e) => handleChangeModal(e, index, "name_product", listOfProduct[index].id)}
                    readOnly={isReadOnly[index]}
                    type="text"
                    autoComplete="off"
                    className={
                      !isReadOnly[index]
                        ? " block w-full rounded-md border-0 py-1.5 text-black font-normal shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        : "cursor-default block w-full rounded-md border-0 py-1.5 text-gray-500 font-semibold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    }
                    onDoubleClick={() => handleEdit(index, true)}
                  />
                </div>
                {/* NAME NAME PRODUCT */}

                {/* CODE */}
                <div className="mt-1 mx-2 sm:col-span-2">
                  <input
                    id={element.id + element.id_product}
                    value={listOfProduct[index].id_product}
                    readOnly
                    type="text"
                    autoComplete="off"
                    className="cursor-default block w-full rounded-md border-0 py-1.5 text-gray-500 font-semibold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {/* CODE */}
                {/* QUANTITY */}
                <div className="mt-1 mx-2 sm:col-span-2">
                  <input
                    id={element.id + element.product_quantity}
                    value={listOfProduct[index].product_quantity}
                    readOnly
                    type="text"
                    autoComplete="off"
                    className="cursor-default block w-full rounded-md border-0 py-1.5 text-gray-500 font-semibold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {/* QUANITY */}
                {/* MEASUREMENT */}
                <div className="mt-1 mx-2 sm:col-span-2">
                  {isReadOnly[index] && (
                    <input
                      id={element.id + element.measurement}
                      value={listOfProduct[index].measurement}
                      readOnly={isReadOnly[index]}
                      type="text"
                      autoComplete="off"
                      className=" cursor-default block w-full rounded-md border-0 py-1.5 text-gray-500 font-semibold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onDoubleClick={() => handleEdit(index, true)}
                    />
                  )}
                  {!isReadOnly[index] && ( //DROPDOWN
                    <select
                      id={element.id + element.measurement}
                      value={listOfProduct[index].measurement}
                      autoComplete="off"
                      onChange={(e) => handleChangeModal(e, index, "measurement", listOfProduct[index].id)}
                      className="mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      {optionsModal.map((option, index2) => (
                        <option value={index2 === 0 ? element.measurement : option} key={index2}>
                          {index2 === 0 ? element.measurement : option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {/* MEASUREMENT */}
                {/* BUTTONS THRASH AND EDIT */}
                {role === "admin" && (
                  <div className="mt-1 mx-2 sm:col-span-1 flex items-center">
                    <div className="flex items-center justify-center h-max w-max">
                      <button
                        className="hover:bg-red-200 p-1 rounded flex items-center opacity-40 hover:opacity-100"
                        onClick={() => handleDeleteButton(element.id, index)}
                      >
                        <img
                          src="./../../src/assets/red-thrashcan-icon.png"
                          alt="thrash can"
                          className="w-4 h-4 "
                        />
                      </button>
                      <button
                        className="hover:bg-gray-200 p-1 rounded flex items-center opacity-40 hover:opacity-100"
                        onClick={() => handleEdit(index, false)}
                      >
                        <img
                          src="./../../src/assets/black-penciledit-icon.svg"
                          alt="pencil edit"
                          className="w-4 h-4 "
                        />
                      </button>
                    </div>
                  </div>
                )}
                <span className="font-medium text-sm mb-1 mx-3 mt-0 sm:col-span-8 text-red-600">
                  {newErrorsList.map((error) =>
                    error.id === element.id && error.name_product !== "" ? error.name_product : ""
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="sticky z-100 bottom-0 bg-white p-3">
          <div className="flex justify-end">
            <select>
              <option>HOla</option>
              <option>HOla</option>
            </select>
            <button
              className="rounded-md bg-white px-3 py-1 text-sm font-semibold border-2 text-indigo-700 shadow-sd hover:bg-indigo-50 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
            {role === "admin" ? (
              <button
                type="submit"
                className="rounded-md ml-4 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleSumbitSave}
              >
                Guardar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-md ml-4 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </ModalWindow>
      <ModalConfirmation isOpen={isConfirmationModalOpen} onClose={handleConfirmationCloseModal}>
        <h2 className="text-base font-medium text-gray-900">¿Estás seguro que deseas borrar este producto?</h2>
        <div className="flex justify-end pt-3">
          <button
            className="rounded-md bg-white px-3 py-1 text-sm font-semibold border-2 text-indigo-700 shadow-sd hover:bg-indigo-50 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
            onClick={() => handleConfirmationCloseModal(false)}
          >
            Cancelar
          </button>
          <button
            className="rounded-md bg-red-500 px-3 py-2 ml-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={() => handleConfirmationCloseModal(true)}
          >
            Sí, borrar
          </button>
        </div>
      </ModalConfirmation>
    </div>
  );
}
