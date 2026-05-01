import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginThunk, clearAuthError } from '../store/authSlice';
import { addToast } from '../store/uiSlice';
import { meThunk } from '../store/authSlice';
import SiteFooter from '../components/SiteFooter';
import '../styles/auth.css';


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Vui lòng nhập email';
    if (!formData.password) errors.password = 'Vui lòng nhập mật khẩu';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const result = await dispatch(loginThunk(formData)).unwrap();
      if (result) {
        const nextPath = location.state?.from || '/';
        dispatch(addToast({ type: 'success', message: 'Đăng nhập thành công' }));
        navigate(nextPath, { replace: true });
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: typeof err === 'string' ? err : 'Đăng nhập thất bại' }));
    }
  };

  const handleClearError = () => {
    dispatch(clearAuthError());
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth start
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/google`;
  };

  const handleFacebookLogin = () => {
    // Redirect to backend Facebook OAuth start
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/facebook`;
  };

  // If OAuth redirect returned a token in query, handle it
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      dispatch(meThunk());
      const nextPath = location.state?.from || '/';
      navigate(nextPath, { replace: true });
    }
  }, [location.search]);

  return (
    <>
      <div className="auth-container">
        <div className="auth-left">
          <img src="/img/login1.jpg" alt="" />
          <h3>Huyền Thoại Thời Gian</h3>
          <h2>CHẾ TÁC TỪ SỰ<br />HOÀN HẢO</h2>
          <p>Mỗi chi tiết là dấu ấn của sự chuẩn xác, tinh thần kỹ thuật và tay nghề chế tác.</p>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-header-icon">👤</div>
              <h2>Đăng nhập</h2>
              <p className="auth-subtitle">Chào mừng trở lại với CASIO</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  <span>{error}</span>
                  <button type="button" onClick={handleClearError}>✕</button>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Địa chỉ email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@casio-luxury.vn"
                  className={formErrors.email ? 'input-error' : ''}
                />
                {formErrors.email && <span className="field-error">{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={formErrors.password ? 'input-error' : ''}
                />
                {formErrors.password && <span className="field-error">{formErrors.password}</span>}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP →'}
              </button>
            </form>

            <div className="divider">HOẶC TIẾP TỤC VỚI</div>

            <div className="social-buttons">
              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleLogin}
              >
                <span className="google-icon"></span>
                Google
              </button>

              <button
                type="button"
                className="facebook-btn"
                onClick={handleFacebookLogin}
              >
                <span className="facebook-icon"></span>
                Facebook
              </button>
            </div>

            <div className="auth-footer">
              <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
};

export default Login;
