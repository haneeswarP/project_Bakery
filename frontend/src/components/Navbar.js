import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1>🧁 Home Bakery</h1>
        <nav>
          <ul>
            <li>
              <Link 
                to="/" 
                className={isActive('/') ? 'active' : ''}
              >
                Place Order
              </Link>
            </li>
            <li>
              <Link 
                to="/baker-dashboard" 
                className={isActive('/baker-dashboard') ? 'active' : ''}
              >
                Baker Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;