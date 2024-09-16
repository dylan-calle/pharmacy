import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginValidation from "./LoginValidation";
import axiosInstance from "../axiosConf";
import { url } from "../Url";

export default function Login() {
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = LoginValidation(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
  };

  // useEffect(() => {
  //   if (isSubmitting && errors.username === "" && errors.password === "") {
  //     axios
  //       .post(url + "login/login", values)
  //       .then((res) => {
  //         console.log("res", res);
  //         if (res.data.msg === "Success") {
  //           localStorage.setItem("accessToken", res.data.accessToken);
  //           navigate("/");
  //         } else {
  //           alert("No record existed");
  //         }
  //       })
  //       .catch((err) => console.log(err))
  //       .finally(() => setIsSubmitting(false));
  //   } else {
  //     setIsSubmitting(false);
  //   }
  // }, [errors, isSubmitting]);
  useEffect(() => {
    if (isSubmitting && errors.username === "" && errors.password === "") {
      axiosInstance
        .post("login/login", values)
        .then((res) => {
          console.log("res", res);
          if (res.data.msg === "Success") {
            localStorage.setItem("accessToken", res.data.accessToken);
            navigate("/");
          } else {
            alert("No record existed");
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setIsSubmitting(false));
    } else {
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Farmacia"
          src="https://media.istockphoto.com/id/1275720974/es/vector/salud-cruzada-m%C3%A9dica-azul-y-verde.jpg?s=1024x1024&w=is&k=20&c=QnEVLiQYxMepGowHVnUEHb_lBQ81v_CRMOkXjY6FsyM="
          className="mx-auto h-14 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Ingresa a tu cuenta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} action="" className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Usuario
            </label>
            <div className="mt-2">
              <input
                onChange={handleInput}
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                value={values.username}
                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
              />
              {errors.username && <span className="text-red-500">{errors.username}</span>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Contraseña
              </label>
              <div className="text-sm">
                <a tabIndex="-1" href="#" className="font-semibold text-blue-950 hover:text-blue-800">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                onChange={handleInput}
                id="password"
                name="password"
                type="password"
                value={values.password}
                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
              />
              {errors.password && <span className="text-red-500">{errors.password}</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
