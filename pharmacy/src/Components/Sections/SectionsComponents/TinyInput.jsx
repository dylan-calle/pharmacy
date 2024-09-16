import React from "react";
export default function TinyInput({
  name,
  value,
  label,
  variableState,
  functionState,
  index,
}) {
  let returned;
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newInputs = [...variableState];
    newInputs[index][name] = value;
    functionState(newInputs);
  };
  const handleInputChangeSimple = (e) => {
    functionState(e.target.value);

    //console.log("Valores a enviar:", variableState);
  };
  const handleInput = (index, e) => {
    if (label !== "") {
      handleInputChangeSimple;
    } else {
      handleInputChange(index, e);
    }

    //console.log("Valores a enviar:", variableState);
  };

  if (index === "") {
    returned = (
      <div className="sm:col-span-1">
        <label
          htmlFor={label.replace(/\s+/g, "")}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
        <div className="mt-2">
          <input
            //id={label.replace(/\s+/g, "")}
            name={name}
            value={{}}
            type="text"
            autoComplete="off"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => handleInput(index, e)}
          />
        </div>
      </div>
    );
  } else {
    returned = (
      <div className="sm:col-span-1">
        <div className="mt-2">
          <input
            //id={label.replace(/\s+/g, "")}
            name={name}
            value={value.name}
            type="text"
            autoComplete="off"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => handleInput(index, e)}
          />
        </div>
      </div>
    );
  }

  return returned;
}
