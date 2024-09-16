// src/components/Modal.js
import React, { useState } from "react";

const Modal = ({ isOpen, onClose, children, styles }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="absolute inset-0 bg-black opacity-20" onClick={onClose}></div>
      <div
        className={styles !== undefined ? styles : "bg-white rounded-md overflow-hidden shadow-xl z-10 w-[45rem] "}
      >
        <div className="px-4 overflow-auto max-h-[85vh]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
