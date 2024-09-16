import React, { useState } from "react";
import axios from "axios";

const DynamicInputForm = () => {
  const [inputs, setInputs] = useState([
    { name: "", measurement: "", code: "" },
  ]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newInputs = [...inputs];
    newInputs[index][name] = value;
    setInputs(newInputs);
  };

  const addInput = () => {
    setInputs([...inputs, { name: "", measurement: "", code: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Enviar todos los inputs a la base de datos
    console.log(inputs);
  };

  return (
    <div className="bg-slate-50 w-full ml-[13rem]">
      <div className="mx-10 mt-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Registrar Materia Prima
              </h2>

              {inputs.map((input, index) => (
                <div
                  key={index}
                  className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
                >
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Nombre de Materia Prima
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={input.name}
                      onChange={(e) => handleInputChange(index, e)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Medida
                    </label>
                    <input
                      name="measurement"
                      type="text"
                      value={input.measurement}
                      onChange={(e) => handleInputChange(index, e)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Código
                    </label>
                    <input
                      name="code"
                      type="text"
                      value={input.code}
                      onChange={(e) => handleInputChange(index, e)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addInput}
                className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
              >
                Agregar Más Inputs
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicInputForm;
