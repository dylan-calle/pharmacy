// src/components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div
        className="absolute inset-0 bg-black opacity-20"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-md overflow-hidden shadow-xl z-10 w-[20rem] ">
        <div className="p-4 overflow-auto max-h-[78vh]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
