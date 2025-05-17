import React, { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GrClose } from 'react-icons/gr';
import { MdHome, MdDashboard , MdLogout, MdPerson} from 'react-icons/md';
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
      <div className='fixed'> 
        <nav className={`md-10 space-y-4 ${open ? '' : 'items-center mx-auto'}`}>
            <div className=" flex items-center justify-between mb-8">
              {open && 
              <span className="text-2xl font-bold text-white">
                CowCulator
              </span>}
              
              <button onClick={() => setOpen(!open)} className={`ml-5 text-white hover:text-white/90 focus:outline-none ${open ? '' : 'ml-auto'}`}>
                {open ? <GrClose size={24} /> : <GiHamburgerMenu size={26}/>}
              </button>
            </div>

          <Link 
            to="/" 
            className={`flex items-center gap-3 text-white hover:text-white/90 text-lg ${
              location.pathname === '/' ? 'font-semibold' : ''
            }`}>
            <MdHome size={30} />
            {open && <span >Home</span>}
          </Link>
          
          {showDashboardLink && (
            <Link
              to="/budget"
              className={`flex items-center gap-3 text-white hover:text-white/90 text-lg ${
                location.pathname === '/budget' ? 'font-semibold' : ''
              }`}
            >
              <MdDashboard size={30} />
              {open && <span>Dashboard</span>}
            </Link>
          )}
          {showDashboardLink && (
          <Link
                to="/profile"
              className={`flex items-center gap-3 text-white hover:text-white/90 text-lg ${
                location.pathname === '/profile' ? 'font-semibold' : ''
              }`}
              >
                <MdPerson size={30} />
                {open && <span >Profile</span>}
              
          </Link>
          )}

        </nav>
      </div> 
      {/* Bottom Section */}
      {isAuthenticated && (
      <div className='fixed bottom-2'>
        <button
          onClick={handleLogout} className={`flex items-center gap-3 text-white hover:text-white/90 text-lg mb-2 ${open ? '' : ' mx-auto'}`}
        >
          <MdLogout size={30} />
          {open && <span>Logout</span>}
        </button>
      </div>
      )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default Layout;
