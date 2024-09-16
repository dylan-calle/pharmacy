export default function SelectInput({
  name,
  options,
  variableState,
  functionState,
}) {
  // const option = props.options;

  const handleInput = (e) => {
    const value = e.target.value;
    functionState(value);
    console.log(value);
  };
  return (
    <select
      autoComplete="off"
      onChange={handleInput}
      name={name}
      className="mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
    >
      {options.map((options, index) => (
        <option value={options.id} key={index}>
          {options.name_raw_material}
        </option>
      ))}
    </select>
  );
}
