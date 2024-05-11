import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // const isHomePage = location.pathname === "/home";
  // const hasButton = isHomePage;

  return (
    <div className="navbar" style={{ top: 0, backgroundColor: '#395241', padding: '17px', display: 'flex', color: 'black', textAlign: 'center', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', fontWeight: 'bold' }}>
      <div className='logo'>
        <NavLink to="/home">
          <img src="/logoside.png" alt="Your Image" width='150px' height='40px' style={{ maxWidth: '100%' }} />
        </NavLink>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        {/* {hasButton ? (
          <NavLink to="/form-display">
            <button 
              style={{ 
                padding: '8px 16px', 
                border: 'none', 
                borderRadius: '5px', 
                backgroundColor: '#6B8065', 
                color: 'white', 
                fontSize: '14px', 
                cursor: 'pointer', 
                transition: 'background-color 0.3s ease, transform 0.3s ease' ,
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', 
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0px 0px 20px rgba(0, 0, 0, 0.4)';
                e.target.style.backgroundColor = '#7FD67B'; 
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
                e.target.style.backgroundColor = '#6B8065';
              }}
            >
              Transact
            </button> */}
          {/* </NavLink> */}
        {/* // ) : ( */}
          <span style={{ color: 'white', marginRight: '15px', animation: 'pulsate 2s infinite' }}>METATOOL</span>
        {/* // )} */}
      </div>
    </div>
  );
}

export default Navbar;
