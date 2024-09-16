import { useRef, useState, useEffect } from "react";
import axios from "./Validations/axios";
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/; // just can have letter from 3 to 23 and -_
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/; // 1 uppercase, 1 lowercase, 1 number and 1 sign
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
      const response = await axios.post(REGISTER_URL, JSON.stringify({ user, pwd }), {
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
    // console.log(user, pwd);
    // setSuccess(true);
  };
  return (
    <>
      {success ? (
        <section>
          <h1>Sucess</h1>
          <p>
            <a href="#">Sign in</a>
          </p>
        </section>
      ) : (
        <div className="block">
          <p ref={errRef} aria-live="assertive">
            {errMsg}l
          </p>
          <h2>Register</h2>
          <form className="w-52 ml-10" onSubmit={handleSubmit}>
            <label htmlFor="name">
              Nombre:
              <span className={validName ? "text-lime-500 ml-[0.25rem]" : "hidden"}>☺</span>
              <span className={validName || !user ? "hidden" : "text-red-500 ml-[0.25rem]"}>x</span>
            </label>
            <input
              type="text"
              id="name"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName
                  ? "text-base text-white relative p-[0.25] b-[-10] bg-black"
                  : "absolute left-[-9999px]"
              }
            >
              4 to 24 chararteres
            </p>
            <label htmlFor="pass1">
              Contra1
              <span className={validPwd ? "text-lime-500 ml-[0.25rem]" : "hidden"}>☺</span>
              <span className={validPwd || !pwd ? "hidden" : "text-red-500 ml-[0.25rem]"}>x</span>
            </label>
            <input
              type="password"
              id="pass1"
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={
                pwdFocus && !validPwd
                  ? "text-base text-white relative p-[0.25] b-[-10] bg-black"
                  : "absolute left-[-9999px]"
              }
            >
              4 to 24 chararteres
            </p>
            <label htmlFor="pass2">
              Contra2 <span className={validMatch && matchPwd ? "text-lime-500 ml-[0.25rem]" : "hidden"}>☺</span>
              <span className={validMatch || !matchPwd ? "hidden" : "text-red-500 ml-[0.25rem]"}>x</span>
            </label>
            <input
              type="password"
              id="pass2"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch
                  ? "text-base text-white relative p-[0.25] b-[-10] bg-black"
                  : "absolute left-[-9999px]"
              }
            >
              Passwords not matching
            </p>
            <button className="p-3 bg-slate-400" disabled={!validName || !validPwd || !validMatch ? true : false}>
              Sign Up
            </button>
          </form>
        </div>
      )}
    </>
  );
};
export default Users2;
