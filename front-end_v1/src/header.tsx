import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="flex justify-between items-center w-full p-1 bg-white shadow-md">
      {/* Logo & Title */}
      <div className="flex items-center space-x-2">
        <img
          src="/assets/logo.png"
          alt="Cow Budget"
          className="h-24 w-24 md:h-28 md:w-28 rounded-xl transform scale-100"
        />
        <span className="text-4xl font-bold text-transparent bg-clip-text bg-[#10492A]">
          CowCulator
        </span>
      </div>

      {/* Hamburger menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className=" font-bold text-xl p-6 hover:text-gray-500 transition-all"
        >
          {showMenu ? <GrClose size={28} /> : <GiHamburgerMenu size={28} />}
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute right-4 mt-2 w-40 bg-white shadow-lg rounded-lg p-2">
            <ul className="flex flex-col gap-2 text-lg">
              <li>
                <Link
                //links once we add page
                    //to="/Profile"
                      to="/"
                    className="block px-4 py-2 text-gray-700 hover:text-purple-500 transition"
                    onClick={() => setShowMenu(false)}>
                    Profile
                </Link>
                <Link
                    to="/budget"
                    className="block px-4 py-2 text-gray-700 hover:text-purple-500 transition"
                    onClick={() => setShowMenu(false)}>
                    Dashboard
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
