import React from "react";

export default function MediumLabeledInput({
  name,
  value,
  label,
  variableState,
  functionState,
  index,
}) {
  //HANDLES
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newInputs = [...variableState];
    newInputs[index][name] = value;
    functionState(newInputs);
  };

  const handleInputChangeSimple = (e) => {
    functionState(e.target.value);
  };

  const handleInput = (index, e) => {
    if (label !== "") {
      handleInputChangeSimple(e);
    } else {
      handleInputChange(index, e);
    }
  };

  return (
    <div className="sm:col-span-3">
      {label && (
        <label
          htmlFor={label.replace(/\s+/g, "")}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      <div className="mt-2">
        <input
          name={name}
          id={label.replace(/\s+/g, "")}
          value={index !== undefined ? value[name] : value}
          type="text"
          autoComplete="off"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
          onChange={(e) => handleInput(index, e)}
        />
      </div>
    </div>
  );
}
