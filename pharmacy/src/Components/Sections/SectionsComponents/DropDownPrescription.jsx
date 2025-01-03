import React, { useContext, useState } from "react";
import useClickOutside from "../../../Hooks/useClickOutside";

export default function DropDownPrescription({ name, options, variableState, functionState, index }) {
  const ref = useClickOutside(() => {
    setShowOptions(false);
    if (isImgToggle) {
      handleClickImg();
      setIsImgToggle(false);
    }
  });

  const [query, setQuery] = useState("");
  /** Shows which is the selected options currently. */
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.name_product.toLowerCase().includes(
      query
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    )
  );

  const handleOptionClick = (index, option) => {
    setSelectedOption(option);

    setQuery(option.name_product);
    setShowOptions(false);
    functionState(option.id);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowOptions(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowOptions(false), 150);
    handleClickImg(false); // Make sure the image comes to normallity
  };

  // Imagen a rotar
  const [imgClassName, setImgClassName] = useState(
    "duration-200 p-3 hover:bg-slate-200 rounded-full flex select-none items-center text-gray-500 sm:text-sm"
  );
  const [isImgToggle, setIsImgToggle] = useState(false);
  const toggleClassImg = "rotate-90 duration-200";

  const handleClickImg = (shouldRotate = true) => {
    setIsImgToggle(true);
    setImgClassName((prevClassName) => {
      if (!shouldRotate) {
        return prevClassName.replace(toggleClassImg, "").trim();
      }
      if (prevClassName.includes(toggleClassImg)) {
        return prevClassName.replace(toggleClassImg, "").trim();
      } else {
        return `${prevClassName} ${toggleClassImg}`.trim();
      }
    });
  };

  return (
    <div className="relative" ref={ref}>
      <div className="flex rounded-md shadow-sm ring-1 bg-white ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md ">
        <input
          name={name}
          type="text"
          autoComplete="off"
          id={"dropdown" + index}
          className=" block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:leading-6 w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setShowOptions(true);
            handleClickImg(); // Rotar imagen al hacer clic en el input
          }}
          onBlur={handleBlur}
        />

        <button
          type="button"
          className={imgClassName}
          onClick={() => {
            showOptions ? setShowOptions(false) : setShowOptions(true);
            handleClickImg(); // Rotar imagen al hacer clic en el input
            setQuery("");
          }}
        >
          <img className="w-3 h-3" src="../../../src/assets/black-forward-icon.png" alt="" />
        </button>
      </div>

      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-44 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
              onClick={() => handleOptionClick(index, option)}
            >
              <span
                className={`block truncate ${
                  selectedOption && selectedOption.id === option.id ? "font-semibold" : "font-normal"
                }`}
              >
                {option.name_product} ({option.measurement})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
