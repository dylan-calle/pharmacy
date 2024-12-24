import { useRef, useState, useEffect } from "react";
import axios from "./Validations/axios";
import DropDownGlobal from "./SectionsComponents/DropDownGlobal.jsx";
import { url } from "../../Url.jsx";
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/; // just can have letter from 3 to 23 and -_

const PWD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,32}$/; // 1 uppercase, 1 lowercase, 1 number and 1 sign
//const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/; // 1 uppercase, 1 lowercase, 1 number and 1 sign

const REGISTER_URL = "/register";
const Users2 = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [role, setRole] = useState("");
  useEffect(() => {
    console.log(role);
    if (role.id === 1) {
      setRole({ role: "admin" });
    } else if (role.id === 2) {
      setRole({ role: "user" });
    }
  }, [role]);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid entry");
      return;
    }
    try {
      const response = await axios.post(`${url}/login/register`, JSON.stringify({ user, pwd, role }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(response.date);
      console.log(response.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      // clear input fields
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username taken");
      } else {
        setErrMsg("Registration Failed");
      }
    }
    console.log(user, pwd);
    setSuccess(true);
  };
  const roleOptions = [
    { id: 1, name: "admin" },
    { id: 2, name: "user" },
  ];
  return (
    <div className="w-full h-[100vh]">
      <div>
        <h2 className="fixed pl-5 pt-4 block text-xl font-medium leading-6 text-gray-900">Registro de usuarios</h2>
      </div>
      <div className="flex items-center h-full justify-center">
        {success ? (
          <section>
            <h1>Sucess</h1>
            <p>
              <a href="#">Sign in</a>
            </p>
          </section>
        ) : (
          <div className="p-8 rounded-3xl border-indigo-400 border-[2px]">
            <p ref={errRef}>{errMsg}</p>

            <form
              className="w-72 mt-4 block text-sm font-medium leading-6 text-gray-900"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className="mb-2">
                <label htmlFor="name">Usuario</label>
                <input
                  type="text"
                  id="name"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
                    validName || user === "" ? "focus:ring-indigo-600" : "focus:ring-red-500"
                  } sm:text-sm sm:leading-6`}
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  required
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <p
                  id="uidnote"
                  className={
                    userFocus && user && !validName
                      ? "text-xs text-red-500 relative p-[0.25] b-[-10] "
                      : "absolute left-[-9999px]"
                  }
                >
                  Puede contener de 4 a 24 caracteres y solo los simbolos "_ -"
                </p>
              </div>
              <div className="mb-2">
                <label htmlFor="pass1">Contraseña</label>
                <input
                  type="password"
                  id="pass1"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
                    validPwd || pwd === "" ? "focus:ring-indigo-600" : "focus:ring-red-500"
                  } sm:text-sm sm:leading-6`}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p
                  id="pwdnote"
                  className={
                    !validPwd && pwd !== ""
                      ? "text-xs text-red-500 relative p-[0.25] b-[-10] "
                      : "absolute left-[-9999px]"
                  }
                >
                  Debe tener más de 8 caracteres. Al menos un número.
                </p>
              </div>
              <div className="mb-2">
                <label htmlFor="pass2">Repetir contraseña</label>
                <input
                  type="password"
                  id="pass2"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
                    validMatch || matchPwd === "" ? "focus:ring-indigo-600" : "focus:ring-red-500"
                  } sm:text-sm sm:leading-6`}
                  onChange={(e) => setMatchPwd(e.target.value)}
                  required
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p
                  id="confirmnote"
                  className={
                    !validMatch && matchPwd !== ""
                      ? "text-xs text-red-500 relative p-[0.25] b-[-10] "
                      : "absolute left-[-9999px]"
                  }
                >
                  Las contraseñas no coinciden
                </p>
              </div>
              <div className="mb-2">
                <label htmlFor="id">Rol de usuario</label>
                <DropDownGlobal
                  name="id"
                  options={roleOptions}
                  variableState={role}
                  functionState={setRole}
                  namesql="name"
                  index=""
                  styles="max-h-24"
                />
              </div>
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className={`rounded-md ${
                    !validName || !validPwd || !validMatch
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }  px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  disabled={!validName || !validPwd || !validMatch ? true : false}
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default Users2;
