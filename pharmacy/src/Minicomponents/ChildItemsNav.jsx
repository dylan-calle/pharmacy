import { Link } from "react-router-dom";

export default function ChildItemsNav({ ul }) {
  return (
    <ul className="link-child">
      {ul.map((ul, index) => (
        <li
          className=" text-white hover:bg-blue-900  rounded-lg text-sm grid"
          key={index}
        >
          <Link className="p-2" to={ul.to}>
            {ul.li}
          </Link>
        </li>
      ))}
    </ul>
  );
}
