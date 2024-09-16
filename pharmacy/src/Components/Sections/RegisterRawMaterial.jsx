import { useEffect, useState } from "react";
import RegisterRawValidation from "./Validations/RegisterRawValidation";
import MediumLabeledInput from "./SectionsComponents/MediumLabeledInput";
import axios from "axios";
import SelectInputSimple from "./SectionsComponents/SelectInputSImple";
import ModalWindow from "./SectionsComponents/ModalWindow";
import ModalConfirmation from "./SectionsComponents/ModalConfirmation";
import ModalInfoWindow from "./SectionsComponents/ModalInfoWindow";
import ListRawMaterialValidation from "./Validations/ListRawMaterialValidation";
import { url } from "../.././Url";
import generateInvoiceRaw from "./../../exports/RawMaterialExportPDF.jsx";
import axiosInstance from "./../../axiosConf.js";
import exportToExcel from "./../../exports/RawMaterialExportXLSX.jsx";
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
export default function RegisterRawMaterial() {
  const options = ["g", "mg", "µg", "ml", "l"];
  const [optionsModal, setOptionsModal] = useState(["g", "g", "mg", "µg", "ml", "l"]);
  const [message, setMessage] = useState({ name_raw: "", measurement: "" });
  const [codeMP, setCodeMP] = useState("");
  const [nameRaw, setNameRaw] = useState("");
  const [measurement, setMeasurement] = useState(options[0]);
  const [errors, setErrors] = useState({});
  const [errorsList, setErrorsList] = useState({});
  const [submited, setSubmited] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listOfRawMaterial, setListOfRawMaterial] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState();
  const [isReadOnly, setIsReadOnly] = useState([]);
  const [isFirstClick, setIsFirstClick] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [submitedSave, setSubmitedSave] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [newErrorsList, setNewErrorsList] = useState([]);
  const [exportButton, setExportButton] = useState(false);
  const [showSuccessMessage, setshowSuccessEditDelete] = useState(false);
  const [role, setRole] = useState("");
  const values = {
    name_raw_material: nameRaw,
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
          console.log("role ", role);
        } catch (error) {
          console.error("Failed to fetch role", error);
        }
      }
    };
    fetchRole();
  }, []);
  const renderMPCode = () => {
    axios
      .get(url + "registerRaw/getGreaterIdRaw/")
      .then((res) => {
        const dataRes = res.data[0][0].id_raw; // dataRes is 'MP-000X'
        let numPart = parseInt(dataRes.split("-")[1], 10); // Split 'MP' and '000X', [1] means the second then '000X' and 10 is the base
        numPart = numPart + 1; // Add one more
        const numPartStr = numPart.toString(); // To String
        const formattedStr = numPartStr.padStart(4, "0"); // '000X' for the number X
        const finalStr = `MP-${formattedStr}`;

        setCodeMP(finalStr);
      })
      .catch((err) => console.log(err));
  };
  const addArrayToState = (newArray) => {
    //setListOfRawMaterial((prevState) => [...prevState, ...newArray]);
    setListOfRawMaterial(newArray);
  };
  const renderListOfRawMaterial = () => {
    axios
      .get(url + "registerRaw/getRawMaterial/")
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
    setListOfRawMaterial((prevItems) => {
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
      name_raw_material: object.name_raw_material,
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
      if (!errors.name_raw_material) {
        setShowError(false);
        axios
          .post(url + "registerRaw/addMaterial/", values)
          .then(() => {
            setShowSuccess(true);
            setSubmited(false);
            setMessage({
              name_raw: nameRaw,
              measurement: measurement,
            });
            setNameRaw("");
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
          .post(url + "registerRaw/updateRawMaterial/", [...modifiedData])
          .then(() => {
            handleCloseModal();
            setModifiedData([]);
            setSubmitedSave(false);
            setshowSuccessEditDelete(true);
          })
          .catch((err) => console.log(err));
        if (idsToDelete.length > 0) {
          axios
            .post(url + "registerRaw/deleteRawMaterial/", [...idsToDelete])
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
      const validationErrors = await ListRawMaterialValidation(modifiedData);

      setErrorsList(validationErrors);
      setSubmitedSave(true);
      if (validationErrors.length === 0) {
        renderListOfRawMaterial();
      } //Here we are initializing isFirstClick to true all again and rendering the List
    } catch (err) {
      console.error("Validation failed", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validationErrors = await RegisterRawValidation(values);
      setErrors(validationErrors);
      setSubmited(true);
    } catch (err) {
      console.error("Validation failed", err);
    }
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
    renderListOfRawMaterial();
  };
  const handleCloseModal = () => {
    setExportButton(false);
    setIsModalOpen(false);
    renderListOfRawMaterial();

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
        addModified(listOfRawMaterial[index]);
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
    const newList = [...listOfRawMaterial];
    newList[index] = { ...newList[index], [string]: e.target.value };
    setListOfRawMaterial(newList);

    modifiedData.map((element, index2) => {
      if (modifiedData[index2].id === id) {
        modifiedData[index2] = {
          ...modifiedData[index2],
          [string]: string === "name_raw_material" ? newList[index].name_raw_material : newList[index].measurement,
        };
      }
    });
  };
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const handleCloseInfoModal = () => {
    setIsModalInfoOpen(false);
  };
  const printRaw = () => {
    generateInvoiceRaw(listOfRawMaterial, `Materia-prima ${new Date().toLocaleDateString()}`);
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
              Por favor llene los campos para registrar la materia prima.
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
                <h2 className="text-xl font-bold leading-10 text-gray-900">Registrar Materia Prima</h2>
                <button
                  title=" Llene los siguientes campos para registrar la
                  materia prima"
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
                  value={nameRaw}
                  label="Nombre de Materia Prima"
                  variableState={nameRaw}
                  functionState={setNameRaw}
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
              {showError && (
                <div className="text-red-600 font-semibold text-sm">{errors.name_raw_material || ""}</div>
              )}
              {showSuccess && (
                <div className="text-green-600 font-semibold text-sm">
                  ¡Material '{message.name_raw}' en {message.measurement} agregado! con el código {codeMP}
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
                Ver lista de Materias Primas
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
          <h2 className="text-2xl mb-4 font-semibold text-gray-900">Lista de Materias Primas</h2>

          <div className="mx-2">
            <div className=" mb-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-10">
              <span className="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900">
                Materia Prima
              </span>
              <span className="sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">Código</span>
              <span className=" sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">Cantidad</span>
              <span className=" sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">Medición</span>
            </div>
          </div>
        </div>
        <ul>
          {listOfRawMaterial.map((element, index) => (
            <li key={listOfRawMaterial[index].id}>
              <div className="grid sm:grid-cols-10">
                {/* NAME RAW MATERIAL */}
                <div className="mt-1 mx-2 sm:col-span-3">
                  <input
                    id={element.id + element.name_raw_material}
                    value={listOfRawMaterial[index].name_raw_material}
                    onChange={(e) => handleChangeModal(e, index, "name_raw_material", listOfRawMaterial[index].id)}
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
                {/* NAME RAW MATERIAL */}

                {/* CODE */}
                <div className="mt-1 mx-2 sm:col-span-2">
                  <input
                    id={element.id + element.id_raw}
                    value={listOfRawMaterial[index].id_raw}
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
                    id={element.id + element.raw_quantity}
                    value={listOfRawMaterial[index].raw_quantity}
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
                      value={listOfRawMaterial[index].measurement}
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
                      value={listOfRawMaterial[index].measurement}
                      autoComplete="off"
                      onChange={(e) => handleChangeModal(e, index, "measurement", listOfRawMaterial[index].id)}
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
                    error.id === element.id && error.name_raw_material !== "" ? error.name_raw_material : ""
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="sticky z-100 bottom-0 bg-white p-3 flex justify-end">
          <button
            onClick={() => setExportButton(!exportButton)}
            type="button"
            className="rounded-md ml-4 bg-white px-3 py-1 text-sm font-semibold border-2 text-indigo-700 shadow-sd hover:bg-indigo-50 focus-visible:outline focus-visible:outline-0 focus-visible:outline-offset-1 focus-visible:outline-indigo-600"
          >
            Exportar
          </button>
          {exportButton && (
            <div className="relative inline-block text-left">
              <div className="absolute right-2 bottom-10 z-30 mt-2 w-[10rem] origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <ul className="py-1">
                  <li
                    onClick={() =>
                      exportToExcel(listOfRawMaterial, `Materia-prima ${new Date().toLocaleDateString()}`)
                    }
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <button type="button">Exportar a Excel</button>
                  </li>
                  <li
                    onClick={printRaw}
                    className="block px-4 py-2 text-sm text-gray-700  hover:bg-slate-100 cursor-pointer"
                  >
                    <button type="button">Imprimir</button>
                  </li>
                </ul>
              </div>
            </div>
          )}

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
            onClick={handleSumbitSave}
          >
            Guardar
          </button>
        </div>
      </ModalWindow>
      <ModalConfirmation isOpen={isConfirmationModalOpen} onClose={handleConfirmationCloseModal}>
        <h2 className="text-base font-medium text-gray-900">
          ¿Estas seguro que deseas borrar esta materia prima?
        </h2>
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
