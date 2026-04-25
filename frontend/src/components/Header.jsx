import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import '../styles/header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const mainLinks = [
    { label: 'TRANG CHU', to: '/' },
    { label: 'DANH MUC', to: '/products', hasCaret: true },
    { label: 'G-SHOCK', to: '/products' },
    { label: 'EDIFICE', to: '/products' },
    { label: 'VINTAGE', to: '/products' },
    { label: 'UU DAI', to: '/offers' },
    { label: 'LIEN HE', to: '/contact' },
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
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.label}</span>
              {item.hasCaret && <span className="nav-caret">▾</span>}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <div className="search-wrap" role="search">
            <select className="search-category" defaultValue="ALL" aria-label="Product category">
              <option value="ALL">TAT CA</option>
              <option value="GSHOCK">G-SHOCK</option>
              <option value="EDIFICE">EDIFICE</option>
              <option value="VINTAGE">VINTAGE</option>
            </select>

            <input
              className="search-input"
              type="search"
              placeholder="Tim kiem..."
              aria-label="Search products"
            />

            <button type="button" className="search-btn" aria-label="Search">
              ⌕
            </button>
          </div>

          <div className="action-group">
            <Link to="/cart" className="icon-btn" aria-label="Cart">
              🛒
            </Link>

            {token && user ? (
              <button onClick={handleLogout} className="icon-btn" aria-label="Logout">
                ⎋
              </button>
            ) : (
              <button
                type="button"
                className="icon-btn"
                aria-label="Login"
                onClick={() => navigate('/login')}
              >
                👤
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;