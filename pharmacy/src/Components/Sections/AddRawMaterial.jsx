import React, { createContext, useState, useEffect } from "react";
import ButtonsForm from "./SectionsComponents/ButtonsForm";
import ModalInfoWindow from "./SectionsComponents/ModalInfoWindow";
import axios from "axios";
import AddRawValidation from "./Validations/AddRawValidation";
import { url } from "../../Url";
import DropDownAdd from "./SectionsComponents/DropDownAdd";
export const ContextSelectedOption = React.createContext();
export default function AddRawMaterial() {
  // Show date and number
  const [nro, setNro] = useState("");
  const [nroToSend, setNroToSend] = useState();
  const [date, setDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    const today = new Date();
    setDate(today.toLocaleDateString());
    const fetchData = async () => {
      const nextNumber = (await axios.get(url + "addRaw/getNumber/")).data[0][0].n_purchase + 1; //plus 1 bc we want the nextNumber

      const nextNumberText = nextNumber.toString().padStart(4, "0");
      setNro(nextNumberText);
      setNroToSend(nextNumber);
      setSelectedOption(null);
    };
    fetchData();
  }, [showSuccess]);

  //Show the measurement to the quantity given
  const [selectedMeasurementOption, setSelectedMeasurementOption] = useState([]);
  //Add New Fields
  const [fields, setFields] = useState([
    {
      number: "",
      id_raw_material: "",
      quantity: "",
      cost: "",
      n_purchase: -1,
      name_raw_material: "",
    },
  ]);
  const addField = (e) => {
    e.preventDefault();
    setFields([
      ...fields,
      {
        number: "",
        id_raw_material: "",
        quantity: "",
        cost: "",
        n_purchase: nroToSend,
        name_raw_material: "",
      },
    ]);
    const newMeasurementList = [...selectedMeasurementOption];
    newMeasurementList.push("");
    setSelectedMeasurementOption(newMeasurementList);
  };
  //
  //Make the Total part
  const [sumaTotal, setSumaTotal] = useState(0);
  useEffect(() => {
    const total = fields.reduce((sum, field) => {
      return sum + parseFloat(field.cost || 0);
    }, 0);
    setSumaTotal(total);
  }, [fields]);
  //
  //Get the options for the Drop Down from the database
  const [options, setOptions] = useState([]);
  const renderOptions = () => {
    axios
      .get(url + "addRaw/getMaterial/")
      .then((res) => {
        setOptions(res.data[0]);
      })
      .catch((err) => console.log(err));
  };
  useEffect(renderOptions, []); //just get the data once the page is reloaded
  //
  //INPUTS
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newInputs = [...fields];
    newInputs[index][name] = value;
    setFields(newInputs);
  };
  //THRASH
  const [showThrashFirst, setShowThrashFirst] = useState(false);
  useEffect(() => {
    if (fields.length > 1) {
      setShowThrashFirst(true);
    } else {
      setShowThrashFirst(false);
    }
  }, [fields]);
  //HANDLES
  const [errorArray, setErrorArray] = useState([]);
  const isErrorFree = (array) => {
    let i = 0;
    let result = true;
    while (i < array.length) {
      if (array[i].id_raw_material !== "" || array[i].quantity !== "" || array[i].cost !== "") {
        result = false;
        break;
      }
      i = i + 1;
    }
    return result;
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      const results = await AddRawValidation(fields);
      setErrorArray(results);
      if (isErrorFree(results)) {
        fields.forEach((element, index) => {
          const newArray = [...fields];
          newArray[index].number = index == -1 ? index + 2 : index + 1;
          if (index === 0) {
            // Here I need to set the first row bc it iniciatilize on -1
            newArray[index].n_purchase = nroToSend;
          }
          setFields(newArray);
        });
        axios
          .post(url + "addRaw/addRawAndQuantity/", fields)
          .then(() => {
            setFields([
              {
                number: "",
                id_raw_material: "",
                quantity: "",
                cost: "",
                n_purchase: -1,
                name_raw_material: "",
              },
            ]);
            setShowSuccess(true);
            setSelectedMeasurementOption([]);

            console.log("Success");
          })
          .catch((err) => console.log(err));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const handleDeleteButton = (field, index) => {
    const newList = [...fields];
    newList.splice(index, 1);
    setFields(newList);
    const newListMeasurement = [...selectedMeasurementOption];
    newListMeasurement.splice(index, 1);
    setSelectedMeasurementOption(newListMeasurement);
  };
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const handleCloseInfoModal = () => {
    setIsModalInfoOpen(false);
  };
  return (
    <div className="bg-slate-50 w-full" onClick={() => setShowSuccess(false)}>
      <ModalInfoWindow isOpen={isModalInfoOpen} onClose={handleCloseInfoModal}>
        <div className="bg-white rounded-md overflow-hidden shadow-xl z-40 w-[20rem] opacity-[0.9999]">
          <div className="px-4 pt-3 pb-4 overflow-auto max-h-[78vh]">
            <p className="mt-1 mb-3 text-sm font-semibold leading-6 text-gray-600">
              Por favor llene los campos para registrar la materia prima dado.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                className=" rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setIsModalInfoOpen(false)}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </ModalInfoWindow>
      <div className="mx-10 mt-4">
        <form onSubmit={handleSumbit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="flex">
                <h2 className="text-xl font-bold leading-10 text-gray-900">Ingreso de Materia Prima</h2>
                <button
                  title=" Por favor llene los siguiente campos"
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
              <div className="flex justify-between my-10">
                <span className="text-3xl font-normal font-zain mr-5  leading-7 text-gray-900">Nro: {nro}</span>
                <span className="text-3xl font-normal font-zain mr-5  leading-7 text-gray-900">Fecha: {date}</span>
              </div>

              <div className="px-10 pt-10">
                <div className=" mb-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
                  <span className="sm:col-span-1 block text-sm font-medium leading-6 text-gray-900">Nro</span>
                  <span className="sm:col-span-3 block text-sm font-medium leading-6 text-gray-900">
                    Materia Prima
                  </span>
                  <span className=" sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">
                    Cantidad
                  </span>
                  <span className=" sm:col-span-2 block text-sm font-medium leading-6 text-gray-900">Costo</span>
                </div>

                <div>
                  {fields.map((field, index) => (
                    <div className=" mb-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9" key={index}>
                      <div className="sm:col-span-1">
                        <div className="mt-2">
                          <input
                            name="number"
                            defaultValue={index + 1}
                            type="text"
                            autoComplete="off"
                            className="cursor-default block w-full rounded-md font-semibold border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3 mt-2">
                        <DropDownAdd
                          name="id_raw_material"
                          options={options}
                          variableState={fields}
                          functionState={setFields}
                          index={index}
                          selectedMeasurementOption={selectedMeasurementOption}
                          setSelectedMeasurementOption={setSelectedMeasurementOption}
                          name2="name_raw_material"
                        />

                        {errorArray[index] === undefined ? (
                          <span></span>
                        ) : (
                          <span className="text-red-600 font-semibold text-sm">
                            {errorArray[index].id_raw_material}
                          </span>
                        )}
                      </div>

                      <div className="sm:col-span-2 rounded-md bg-white mt-2">
                        <div className=" flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <input
                            name="quantity"
                            value={fields[index].quantity}
                            type="text"
                            autoComplete="off"
                            className="block w-[85%] bg-transparent rounded-md border-0 py-1.5 pr-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            onChange={(e) => handleInputChange(index, e)}
                          />
                          <span className="flex w-[15%] select-none items-center justify-center text-gray-500 sm:text-sm">
                            {selectedMeasurementOption[index]}
                          </span>
                        </div>

                        {errorArray[index] === undefined ? (
                          <span></span>
                        ) : (
                          <span className="text-red-600 font-semibold text-sm">{errorArray[index].quantity}</span>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <div className="mt-2">
                          <input
                            name="cost"
                            value={fields[index].cost}
                            type="text"
                            autoComplete="off"
                            className="text-right block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                            onChange={(e) => handleInputChange(index, e)}
                          />
                        </div>

                        {/* // */}

                        {errorArray[index] === undefined ? (
                          <span></span>
                        ) : (
                          <span className="text-red-600 font-semibold text-sm">{errorArray[index].cost}</span>
                        )}
                        {/* // */}
                      </div>
                      <div className="mt-1 mx-2 sm:col-span-1 flex items-center pt-1">
                        <div className="flex items-center justify-center h-max w-max">
                          {(showThrashFirst || index !== 0) && (
                            <button
                              type="button"
                              className="hover:bg-red-200 p-1 rounded flex items-center opacity-40 hover:opacity-100"
                              onClick={() => handleDeleteButton(field, index)}
                            >
                              <img
                                src="./../../src/assets/red-thrashcan-icon.png"
                                alt="thrash can"
                                className="w-4 h-4 "
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className=" mb-1 grid gap-x-6 gap-y-8 sm:grid-cols-9">
                    <span className="sm:col-span-8 justify-self-end text-base font-semibold leading-7 text-gray-900">
                      Total: Bs {sumaTotal}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={addField}
                className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
              >
                Agregar
              </button>
              {showSuccess && (
                <span className="text-green-600 font-semibold text-lg ml-8">
                  ¡Materia Prima ingresada con éxito!
                </span>
              )}
            </div>
          </div>

          <ButtonsForm />
        </form>
      </div>
    </div>
  );
}
