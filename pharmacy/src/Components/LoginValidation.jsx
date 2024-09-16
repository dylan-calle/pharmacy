export default function LoginValidation(values) {
  let error = {};

  if (values.username === "") {
    error.username = "Debe ingresar un usuario";
  } else {
    error.username = "";
  }
  if (values.password === "") {
    error.password = "Debe ingresar una contraseña";
  } else {
    error.password = "";
  }
  return error;
}
