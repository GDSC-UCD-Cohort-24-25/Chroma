import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { MdHome, MdDashboard } from "react-icons/md";

function Header() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <aside className={`bg-gray-900 text-white transition-all duration-300 ${open ? "w-60" : "w-20"} flex flex-col px-4 py-5`}>
        <div className="flex items-center justify-between">
          {open && <span className="text-xl font-bold">CowCulator</span>}
          <button onClick={() => setOpen(!open)} className="text-white ml-auto">
            {open ? <GrClose size={20} /> : <GiHamburgerMenu size={24} />}
          </button>
        </div>
        <nav className="mt-10 space-y-4">
          <Link to="/" className="flex items-center gap-3 text-gray-300 hover:text-green-400">
            <MdHome size={24} />
            {open && <span>Home</span>}
          </Link>
          <Link to="/budget" className="flex items-center gap-3 text-gray-300 hover:text-green-400">
            <MdDashboard size={24} />
            {open && <span>Dashboard</span>}
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {/* Your content */}
      </main>
    </div>
  );
}

export default Header;



function Header() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="flex justify-between items-center w-full px-6 py-3 bg-white shadow-md h-16">
      {/* Logo & Title */}
      <div className="flex items-center space-x-3">
        {/*<img
          src="/assets/logo.png"
          alt="Cow Budget"
          className="h-12 w-12 rounded-full"
        /> */}
        
        <span className="text-3xl font-bold text-green-600 drop-shadow-sm">
          CowCulator
        </span>
      </div>

      {/* Hamburger menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className=" font-bold text-xl hover:text-gray-500 transition-all"
        >
          {showMenu ? <GrClose size={28} /> : <GiHamburgerMenu size={28} />}
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2">
            <ul className="flex flex-col gap-2 text-lg">
              <li>
                <Link
                    to="/"
                    className="block px-4 py-2 text-gray-700 hover:text-purple-500 transition"
                    onClick={() => setShowMenu(false)}>
                    Home
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

export { Header };

