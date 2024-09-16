import React, { useImperativeHandle, forwardRef, useContext, useEffect, useState } from "react";
import useClickOutside from "../../../Hooks/useClickOutside";
const DropDownGlobal = forwardRef(
  ({ name, options, variableState, functionState, namesql, index, styles }, ref) => {
    const ref1 = useClickOutside(() => {
      setShowOptions(false);
      if (isImgToggle) {
        handleClickImg();
        setIsImgToggle(false);
      }
    });
    const [query, setQuery] = useState(variableState[name] ? variableState[name] : ""); // in case of having a name this will be charged at the first
    /** Shows which is the selected options currently. */
    const [selectedOption, setSelectedOption] = useState(null);
    const [showOptions, setShowOptions] = useState(false);

    useImperativeHandle(ref, () => ({
      handleBlankQuery() {
        setQuery(variableState[name] ? variableState[name] : "");
      },
    }));

    const filteredOptions = options.filter((option) =>
      option[namesql].toLowerCase().includes(
        query
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      )
    );

    const handleOptionClick = (index, option) => {
      console.log("option: ", option);
      setSelectedOption(option);

      setQuery(option[namesql]);
      setShowOptions(false);
      functionState((prev) => ({
        ...prev,
        [name]: option.id,
      }));
    };

    const handleInputChange = (e) => {
      setQuery(e.target.value);
      setShowOptions(true);
    };

    const handleBlur = () => {
      setTimeout(() => setShowOptions(false), 1000);
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
      <div className="relative" ref={ref1}>
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md ">
          <input
            name={name}
            type="text"
            autoComplete="off"
            id={name + index}
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
            tabIndex="-1"
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
          <ul
            className={`mb-24 absolute z-10 mt-1 w-full bg-white shadow-lg ${styles} rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm`}
          >
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
                  {option[namesql]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
export default DropDownGlobal;
