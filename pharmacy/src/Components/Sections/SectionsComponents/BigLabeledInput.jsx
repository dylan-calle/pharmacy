export default function ButtonsForm(props) {
  return (
    <div className="col-span-full">
      <label
        htmlFor={props.label.replace(/\s+/g, "")}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {props.label}
      </label>
      <div className="mt-2">
        <input
          id={props.label.replace(/\s+/g, "")}
          name={props.label.replace(/\s+/g, "")}
          type="text"
          autoComplete="off"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
