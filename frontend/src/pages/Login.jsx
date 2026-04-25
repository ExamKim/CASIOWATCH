import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginThunk, clearAuthError } from '../store/authSlice';
import '../styles/auth.css';


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      const result = await dispatch(loginThunk(formData));
      if (result.payload) {
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleClearError = () => {
    dispatch(clearAuthError());
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // TODO: Integrate with Google OAuth
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
    // TODO: Integrate with Facebook OAuth
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-left">
          <img src="/img/login1.jpg" alt="" />
          <h3>Huyền Thoại Thời Gian</h3>
          <h2>CHẾ TÁC TỪ SỰ<br />HOÀN HẢO</h2>
          <p>Mỗi chi tiết là nút mũi chứng chỉ ngoài nguyệt tính kỹ thuật kỹ năng thắp kỹ.</p>
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

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h2 className="logo">CASIO</h2>
            <p>
              Người giám tuyển kỹ thuật số cho những kiệt tác thời gian.
              Khám phá sự tinh hoa trong từng nhịp đập của thời khắc.
            </p>

            <div className="newsletter">
              <input type="email" placeholder="Địa chỉ email của bạn" />
              <button>GỬI</button>
            </div>
          </div>

          <div className="footer-col">
            <h4>COLLECTIONS</h4>
            <ul>
              <li>G-SHOCK MR-G</li>
              <li>EDIFICE PREMIUM</li>
              <li>VINTAGE GOLD</li>
              <li>BESPOKE SERIES</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>SERVICES</h4>
            <ul>
              <li>Bảo hành toàn cầu</li>
              <li>Chăm sóc đồng hồ</li>
              <li>Dịch vụ đặt riêng</li>
              <li>Tìm cửa hàng</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>COMPANY</h4>
            <ul>
              <li>Di sản thương hiệu</li>
              <li>Kỹ thuật chế tác</li>
              <li>Tin tức & sự kiện</li>
              <li>Liên hệ</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>FOLLOW US</h4>
            <div className="social">
              <span>IG</span>
              <span>FB</span>
              <span>IN</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">2026 CASIO ALL RIGHTS RESERVED</div>
      </footer>
    </>
  );
};

export default Login;