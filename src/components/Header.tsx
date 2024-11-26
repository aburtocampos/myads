import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SearchContext } from "../App"; // Importa el contexto de búsqueda

const Header: React.FC = () => {
  const { logout } = useAuth();
  const { setSearchQuery } = useContext(SearchContext); // Usar el estado de búsqueda global

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Actualiza la búsqueda global
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/feed" className="btn btn-ghost text-xl">
          MyAds
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Buscar..."
            onChange={handleSearchChange}
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <Link to="/drafts" className="btn btn-secondary">
          My Drafts
        </Link>
        <Link to="/create" className="btn btn-primary">
          Create Ad
        </Link>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <a onClick={logout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
