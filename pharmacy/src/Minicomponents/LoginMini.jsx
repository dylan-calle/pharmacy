export default function LoginMini(props) {
  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.user]: [e.target.value] }));
  };
  return (
    <input
      onChange={handleInput}
      id={props.id}
      name={props.name}
      type={props.type}
      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-700 sm:text-sm sm:leading-6"
    />
  );
}
