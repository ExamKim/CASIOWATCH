import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerThunk, clearAuthError } from '../store/authSlice';
import '../styles/auth.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = 'Vui lòng nhập tên người dùng';
    if (!formData.email) errors.email = 'Vui lòng nhập email';
    if (!formData.password) errors.password = 'Vui lòng nhập mật khẩu';
    if (formData.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không khớp';
    }
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
      const result = await dispatch(registerThunk({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      }));
      if (result.payload) {
        navigate('/');
      }
    } catch (err) {
      console.error('Register failed:', err);
    }
  };

  const handleClearError = () => {
    dispatch(clearAuthError());
  };

  const handleGoogleRegister = () => {
    console.log('Google register clicked');
    // TODO: Integrate with Google OAuth
  };

  const handleFacebookRegister = () => {
    console.log('Facebook register clicked');
    // TODO: Integrate with Facebook OAuth
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-left">
          <img src="/img/login1.jpg" alt="" />
          <h3>Huyền Thoại Thời Gian</h3>
          <h2>CHẾ TÁC TỪ SỰ<br />HOÀN HẢO</h2>
          <p>Mỗi chi tiết là nút mũi chứng chỉ ngoài nguyệt tính kỹ thuật kỹ năng th���p kỹ.</p>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-header-icon">👤</div>
              <h2>Tạo tài khoản</h2>
              <p className="auth-subtitle">Gia nhập cộng đồng tính hoa CASIO</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  <span>{error}</span>
                  <button type="button" onClick={handleClearError}>✕</button>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">Họ và tên</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className={formErrors.username ? 'input-error' : ''}
                />
                {formErrors.username && <span className="field-error">{formErrors.username}</span>}
              </div>

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

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={formErrors.confirmPassword ? 'input-error' : ''}
                />
                {formErrors.confirmPassword && <span className="field-error">{formErrors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại (Tùy chọn)</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ (Tùy chọn)</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Đường ABC, Quận 1"
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY →'}
              </button>
            </form>

            <div className="divider">HOẶC TIẾP TỤC VỚI</div>

            <div className="social-buttons">
              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleRegister}
              >
                <span className="google-icon"></span>
                Google
              </button>

              <button
                type="button"
                className="facebook-btn"
                onClick={handleFacebookRegister}
              >
                <span className="facebook-icon"></span>
                Facebook
              </button>
            </div>

            <div className="auth-footer">
              <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
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

export default Register;