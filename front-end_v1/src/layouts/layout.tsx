import React, { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GrClose } from 'react-icons/gr';
import { MdHome, MdDashboard , MdLogout} from 'react-icons/md';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the import path as necessary


function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout} = useAuth();

  const showDashboardLink = isAuthenticated ;
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${open ? 'w-52' : 'w-16'} flex flex-col justify-between px-3 py-5`}
        style={{ backgroundColor: '#7DAE94' }}>
      
      {/* Top Section */}
      <div>
        <div className="flex items-center justify-between">
          {open && 
          <span className="text-2xl font-bold text-white">
            CowCulator
          </span>}
          <button onClick={() => setOpen(!open)} className={`text-white ${open ? '' : 'items-center mx-auto'}`}>
            {open ? <GrClose size={22} /> : <GiHamburgerMenu size={26} />}
          </button>
        </div>

        <nav className={`mt-10 space-y-4 ${open ? '' : 'items-center mx-auto'}`}>
          <Link to="/" className="flex items-center gap-3 text-white hover:text-white/90 text-lg">
            <MdHome size={30} />
            {open && <span className="text-lg">Home</span>}
          </Link>
          
          {showDashboardLink && (
            <Link
              to="/budget"
              className="flex items-center gap-3 text-white hover:text-white/90 text-lg"
            >
              <MdDashboard size={30} />
              {open && <span>Dashboard</span>}
            </Link>
          )}

        </nav>
      </div> 
      {/* Bottom Section */}
      {isAuthenticated && (
      <button
        onClick={handleLogout} className={`flex items-center gap-3 text-white hover:text-white/90 text-lg ${open ? '' : 'mx-auto'}`}
      >
        <MdLogout size={30} />
        {open && <span>Logout</span>}
      </button>)}

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default Layout;
