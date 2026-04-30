import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import '../styles/header.css';

const HeaderIcon = ({ name }) => {
  switch (name) {
    case 'search':
      return (
        <svg viewBox="0 0 24 24" className="header-icon-svg" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
      );
    case 'orders':
      return (
        <svg viewBox="0 0 24 24" className="header-icon-svg" aria-hidden="true">
          <path d="M6 4h12l1 4v12H5V8z" />
          <path d="M9 4v4" />
          <path d="M15 4v4" />
          <path d="M8 12h8" />
        </svg>
      );
    case 'admin':
      return (
        <svg viewBox="0 0 24 24" className="header-icon-svg" aria-hidden="true">
          <path d="M12 2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L12 13.8 7.8 15l.8-4.7L5.2 7l4.7-.7z" />
          <path d="M12 13v9" />
        </svg>
      );
    case 'cart':
      return (
        <svg viewBox="0 0 24 24" className="header-icon-svg" aria-hidden="true">
          <path d="M4 5h2l2 10h10l2-7H7.2" />
          <circle cx="10" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
      );
    case 'logout':
      return (
        <svg viewBox="0 0 24 24" className="header-icon-svg" aria-hidden="true">
          <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
          <path d="M15 8l4 4-4 4" />
          <path d="M19 12H9" />
        </svg>
      );
    case 'user':
      return (
        <svg viewBox="0 0 24 24" className="header-icon-svg" aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case 'caret':
      return (
        <svg viewBox="0 0 12 12" className="nav-caret-svg" aria-hidden="true">
          <path d="M2.5 4.5l3.5 3.5 3.5-3.5" />
        </svg>
      );
    default:
      return null;
  }
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const categoryLinks = [
    { label: 'G-SHOCK', to: '/g-shock' },
    { label: 'BABY-G', to: '/baby-g' },
    { label: 'EDIFICE', to: '/edifice' },
  ];

  const mainLinks = [
    { label: 'TRANG CHỦ', to: '/' },
    { label: 'DANH MỤC', to: '/products' },
    { label: 'G-SHOCK', to: '/g-shock' },
    { label: 'BABY-G', to: '/baby-g' },
    { label: 'EDIFICE', to: '/edifice' },
    { label: 'ƯU ĐÃI', to: '/offers' },
    { label: 'LIÊN HỆ', to: '/contact' },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <Link className="brand" to="/" aria-label="CASIO home">
          <span className="brand-mark">CASIO</span>
          <span className="brand-tag">Luxury timepieces</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {mainLinks.map((item) => (
            item.isDropdown ? (
              <div key={item.label} className="nav-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className={`nav-link nav-dropdown-btn ${isDropdownOpen ? 'active' : ''}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <span>{item.label}</span>
                  <HeaderIcon name="caret" />
                </button>
                {isDropdownOpen && (
                  <div className="nav-dropdown-menu">
                    {categoryLinks.map((catLink) => (
                      <Link
                        key={catLink.label}
                        to={catLink.to}
                        className="nav-dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {catLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span>{item.label}</span>
                {item.hasCaret && <HeaderIcon name="caret" />}
              </NavLink>
            )
          ))}
        </nav>

        <div className="header-actions">
          <div className="search-wrap" role="search">
            <select className="search-category" defaultValue="ALL" aria-label="Product category">
              <option value="ALL">TẤT CẢ</option>
              <option value="GSHOCK">G-SHOCK</option>
              <option value="BABYG">BABY-G</option>
              <option value="EDIFICE">EDIFICE</option>
            </select>

            <input
              className="search-input"
              type="search"
              placeholder="Tìm kiếm..."
              aria-label="Search products"
            />

            <button type="button" className="search-btn" aria-label="Search">
              <HeaderIcon name="search" />
            </button>
          </div>

          <div className="action-group">
            {token && user && (
              <Link to="/my-orders" className="icon-btn" aria-label="My orders">
                <HeaderIcon name="orders" />
              </Link>
            )}

            {token && user?.role === 'admin' && (
              <Link to="/admin/orders" className="icon-btn" aria-label="Admin orders">
                <HeaderIcon name="admin" />
              </Link>
            )}

            <Link to="/cart" className="icon-btn" aria-label="Cart">
              <HeaderIcon name="cart" />
            </Link>

            {token && user ? (
              <button onClick={handleLogout} className="icon-btn" aria-label="Logout">
                <HeaderIcon name="logout" />
              </button>
            ) : (
              <button
                type="button"
                className="icon-btn"
                aria-label="Login"
                onClick={() => navigate('/login')}
              >
                <HeaderIcon name="user" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
