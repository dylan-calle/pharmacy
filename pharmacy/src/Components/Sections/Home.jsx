import Menu from "../Menu";

export default function Home() {
  //input w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
  //img p-[0.33rem] hover:bg-slate-200  duration-300 rounded-lg flex select-none items-center pl-3 text-gray-500 sm:text-sm
  return (
    <div className="bg-slate-50 w-full">
      <div className=" mx-10 mt-4   ">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Inicio</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">Estos son los últimos movimientos</p>
      </div>
    </div>
  );
}
