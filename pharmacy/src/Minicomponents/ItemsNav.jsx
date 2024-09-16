import { Link } from "react-router-dom";
import ChildItemsNav from "./ChildItemsNav.jsx";
import React, { useState } from "react";

export default function ItemsNav(props) {
  const [ulClassName, setUlClassName] = useState("link-parent");
  const [imgClassName, setImgClassName] = useState("ml-auto mt-1 w-5 h-5 duration-300");
  const toggleClassUl = "grid-rows-[max-content_1fr]";
  const toggleClassImg = "rotate-90 duration-300";
  const handleClick = () => {
    setImgClassName((prevClassName) => {
      if (prevClassName.includes(toggleClassImg)) {
        return prevClassName.replace(toggleClassImg, "").trim();
      } else {
        return `${prevClassName} ${toggleClassImg}`.trim();
      }
    });
    setUlClassName((prevClassName) => {
      if (prevClassName.includes(toggleClassUl)) {
        return prevClassName.replace(toggleClassUl, "").trim();
      } else {
        return `${prevClassName} ${toggleClassUl}`.trim();
      }
    });
  };

  return (
    <li className={ulClassName}>
      {props.to ? (
        <Link to={props.to} onClick={handleClick} className="flex gap-3 px-3 py-3 hover:bg-blue-900 rounded-lg">
          <img src={props.src} alt="" className="w-6 h-6" />
          <p className="text-white">{props.text}</p>
        </Link>
      ) : (
        <span onClick={handleClick} className="flex gap-3 px-3 py-3 hover:bg-blue-900 rounded-lg">
          <img src={props.src} alt="" className="w-6 h-6" />
          <p className="text-white">{props.text}</p>

          {props.src2 && <img src={props.src2} alt="" className={imgClassName} />}
        </span>
      )}
      {props.src2 && <ChildItemsNav ul={props.li} />}
    </li>
  );
}
