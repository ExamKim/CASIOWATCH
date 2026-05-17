import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfileThunk, logout } from '../store/authSlice';
import { fetchMyOrdersThunk } from '../store/ordersSlice';
import { authApi } from '../api/authApi';
import { addToast } from '../store/uiSlice';
import SiteFooter from '../components/SiteFooter';
import '../styles/profile.css';

// SVG icons as components for pure crisp display
const IconUser = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconOrders = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconHeart = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconSupport = () => (
  <svg viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconEditPen = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { myOrders } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState('profile'); // profile | security | orders
  
  // Profile editing state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editFields, setEditFields] = useState({
    username: '',
    phone: '',
    address: '',
  });

  // Password changing state
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync redux user to local editing state
  useEffect(() => {
    if (user) {
      setEditFields({
        username: user.username || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Fetch orders when tab is changed or on load
  useEffect(() => {
    if (token) {
      dispatch(fetchMyOrdersThunk());
    }
  }, [dispatch, token]);

  if (!token || !user) {
    return (
      <div className="profile-page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Vui lòng đăng nhập để truy cập hồ sơ</h2>
          <p style={{ color: '#888', marginBottom: '24px' }}>Bạn cần đăng nhập để xem thông tin cá nhân và đơn hàng.</p>
          <Link to="/login" className="manager-btn-gold" style={{ display: 'inline-block', padding: '12px 30px' }}>Đăng nhập ngay</Link>
        </div>
      </div>
    );
  }

  // Handle profile save
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfileThunk(editFields)).unwrap();
      dispatch(addToast({ type: 'success', message: 'Cập nhật thông tin cá nhân thành công' }));
      setIsEditingInfo(false);
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err || 'Không thể cập nhật thông tin cá nhân' }));
    }
  };

  // Handle password update
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      dispatch(addToast({ type: 'error', message: 'Mật khẩu xác nhận không trùng khớp' }));
      return;
    }
    try {
      setIsChangingPassword(true);
      const res = await authApi.changePassword({
        currentPassword: passwordFields.currentPassword,
        newPassword: passwordFields.newPassword,
      });
      dispatch(addToast({ type: 'success', message: res.message || 'Đổi mật khẩu thành công!' }));
      setPasswordFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể đổi mật khẩu';
      dispatch(addToast({ type: 'error', message: msg }));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ type: 'info', message: 'Đã đăng xuất khỏi hệ thống' }));
    navigate('/login');
  };

  // Formats price values cleanly
  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  // Formats SQL ISO timestamps
  const formatDate = (isoString) => {
    if (!isoString) return 'Chưa rõ';
    const d = new Date(isoString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // Get user initials for premium avatar
  const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length === 0) return 'US';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="profile-page-container">
      {/* Sidebar Section */}
      <aside className="profile-sidebar">
        <div className="sidebar-top">
          <nav className="sidebar-menu">
            <button
              className={`menu-item-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <IconUser />
              <span>Hồ sơ</span>
            </button>
            <button
              className={`menu-item-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <IconShield />
              <span>Bảo mật</span>
            </button>
            <button
              className={`menu-item-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <IconOrders />
              <span>Đơn hàng</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button
            className="menu-item-btn"
            style={{ color: '#e74c3c' }}
            onClick={handleLogout}
          >
            <IconLogout />
            <span>Đăng xuất</span>
          </button>
          <a href="tel:19000000" className="manager-btn-gold">Liên hệ hỗ trợ</a>
        </div>
      </aside>

      {/* Main Content Pane */}
      <section className="profile-content-area">
        <h1 className="profile-main-title">
          {activeTab === 'profile' && 'Hồ sơ Giám tuyển'}
          {activeTab === 'security' && 'Kho bảo mật & Xác thực'}
          {activeTab === 'orders' && 'Lịch sử mua hàng'}
        </h1>

        {/* Tab 1: profile Details */}
        {activeTab === 'profile' && (
          <div className="profile-dashboard-grid">
            {/* Left columns */}
            <div className="grid-col-left">
              {/* Avatar gold circle card */}
              <div className="premium-card-dark avatar-card-layout">
                <div className="avatar-outer-ring">
                  <span className="avatar-inner-initials">{getInitials(user.username)}</span>
                  <div className="avatar-edit-pen-badge" onClick={() => setIsEditingInfo(true)}>
                    <IconEditPen />
                  </div>
                </div>
                <div>
                  <h3 className="avatar-user-name">{user.username}</h3>
                </div>
              </div>

              {/* Secure Vault confirmation card */}
              <div className="premium-card-dark secure-store-layout">
                <div className="secure-icon-gold">
                  <IconShield />
                </div>
                <h3 className="secure-title">Kho bảo mật</h3>
                <p className="secure-desc">
                  Bộ sưu tập của bạn đã được xác thực trong hệ thống đăng ký cao cấp của CASIO.
                </p>
                <button type="button" className="secure-verified-btn">Đã xác minh</button>
              </div>
            </div>

            {/* Right columns */}
            <div className="grid-col-right">
              {/* Personal details Card */}
              <div className="premium-card-white">
                <div className="info-card-header">
                  <h3 className="info-card-title-small">Thông tin cá nhân</h3>
                  {!isEditingInfo && (
                    <button
                      type="button"
                      className="info-card-edit-btn"
                      onClick={() => setIsEditingInfo(true)}
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {isEditingInfo ? (
                  <form onSubmit={handleSaveInfo} className="edit-profile-form">
                    <div className="form-row">
                      <div className="edit-form-group">
                        <label>Họ và tên</label>
                        <input
                          type="text"
                          required
                          value={editFields.username}
                          onChange={(e) => setEditFields({ ...editFields, username: e.target.value })}
                        />
                      </div>
                      <div className="edit-form-group">
                        <label>Số điện thoại</label>
                        <input
                          type="tel"
                          value={editFields.phone}
                          onChange={(e) => setEditFields({ ...editFields, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="edit-form-group">
                      <label>Địa chỉ nhận hàng</label>
                      <input
                        type="text"
                        value={editFields.address}
                        onChange={(e) => setEditFields({ ...editFields, address: e.target.value })}
                      />
                    </div>
                    <div className="form-actions-row">
                      <button type="button" className="form-btn-cancel" onClick={() => setIsEditingInfo(false)}>Hủy</button>
                      <button type="submit" className="form-btn-save">Lưu</button>
                    </div>
                  </form>
                ) : (
                  <div className="info-details-grid">
                    <div className="info-item">
                      <span className="info-item-label">Họ và tên</span>
                      <span className="info-item-value">{user.username || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">Địa chỉ email</span>
                      <span className="info-item-value">{user.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">Số điện thoại</span>
                      <span className="info-item-value">{user.phone || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">Ngày tham gia</span>
                      <span className="info-item-value">{formatDate(user.created_at)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Latest ordered products card */}
              <div className="premium-card-dark">
                <div className="latest-possessions-header">
                  <h3 className="possession-section-title">Sở hữu mới nhất</h3>
                  <button type="button" className="possession-link-gold" onClick={() => setActiveTab('orders')}>
                    Kho lưu trữ
                  </button>
                </div>

                <div className="possessions-list">
                  {myOrders && myOrders.length > 0 ? (
                    myOrders.slice(0, 2).map((order) => (
                      <div key={order.id} className="possession-item-row" onClick={() => navigate(`/orders/${order.id}`)} style={{ cursor: 'pointer' }}>
                        <div className="possession-left">
                          <div className="possession-thumb-box">
                            <img src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=200" alt="Watch thumbnail" />
                          </div>
                          <div className="possession-info-meta">
                            <h4>Đơn hàng #{order.id}</h4>
                            <p className="possession-code-date">Mã đơn: #{order.id} • {formatDate(order.created_at)}</p>
                          </div>
                        </div>
                        <div className="possession-right">
                          <span className="possession-price-gold">{formatPrice(order.total_price)}</span>
                          <span className="possession-arrow-icon">
                            <IconArrowRight />
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {/* Premium mockup items if no active order history */}
                      <div className="possession-item-row">
                        <div className="possession-left">
                          <div className="possession-thumb-box">
                            <img src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=200" alt="Oceanus watch" />
                          </div>
                          <div className="possession-info-meta">
                            <h4>Heritage Oceanus VII</h4>
                            <p className="possession-code-date">#HO-9821 • 10/2023</p>
                          </div>
                        </div>
                        <div className="possession-right">
                          <span className="possession-price-gold">{formatPrice(61250000)}</span>
                          <span className="possession-arrow-icon">
                            <IconArrowRight />
                          </span>
                        </div>
                      </div>
                      <div className="possession-item-row">
                        <div className="possession-left">
                          <div className="possession-thumb-box">
                            <img src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=200" alt="MR-G watch" />
                          </div>
                          <div className="possession-info-meta">
                            <h4>MR-G Titanium Edition</h4>
                            <p className="possession-code-date">#MR-1022 • 05/2023</p>
                          </div>
                        </div>
                        <div className="possession-right">
                          <span className="possession-price-gold">{formatPrice(95000000)}</span>
                          <span className="possession-arrow-icon">
                            <IconArrowRight />
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Security (Change Password) */}
        {activeTab === 'security' && (
          <div className="security-tab-layout">
            <h2>Đổi mật khẩu tài khoản</h2>
            <p>Đảm bảo tài khoản của bạn được an toàn bằng cách sử dụng các mật khẩu có ký tự chữ, số và ký hiệu.</p>

            <form onSubmit={handleChangePassword} className="security-form">
              <div className="security-form-group">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordFields.currentPassword}
                  onChange={(e) => setPasswordFields({ ...passwordFields, currentPassword: e.target.value })}
                />
              </div>
              <div className="security-form-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu ít nhất 6 ký tự..."
                  value={passwordFields.newPassword}
                  onChange={(e) => setPasswordFields({ ...passwordFields, newPassword: e.target.value })}
                />
              </div>
              <div className="security-form-group">
                <label>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu mới..."
                  value={passwordFields.confirmPassword}
                  onChange={(e) => setPasswordFields({ ...passwordFields, confirmPassword: e.target.value })}
                />
              </div>
              <button type="submit" disabled={isChangingPassword} className="security-save-btn">
                {isChangingPassword ? 'Đang lưu...' : 'Thay đổi mật khẩu'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Orders List */}
        {activeTab === 'orders' && (
          <div className="orders-tab-layout">
            {myOrders && myOrders.length > 0 ? (
              myOrders.map((order) => (
                <div key={order.id} className="orders-tab-card">
                  <div className="order-tab-details">
                    <div className="order-tab-info-block">
                      <span>Mã đơn</span>
                      <strong>#{order.id}</strong>
                    </div>
                    <div className="order-tab-info-block">
                      <span>Tổng tiền</span>
                      <strong>{formatPrice(order.total_price)}</strong>
                    </div>
                    <div className="order-tab-info-block">
                      <span>Ngày đặt</span>
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                    <div className="order-tab-info-block">
                      <span>Trạng thái</span>
                      <span className={`order-tab-status-chip status-tab-${String(order.status || 'pending').toLowerCase()}`}>
                        {order.status === 'completed' ? 'Đã hoàn thành' : order.status === 'cancelled' ? 'Đã hủy' : 'Đang xử lý'}
                      </span>
                    </div>
                  </div>
                  <Link to={`/orders/${order.id}`} className="order-tab-actions-btn">Chi tiết</Link>
                </div>
              ))
            ) : (
              <div className="empty-tab-view">
                <h3>Không tìm thấy lịch sử đặt hàng</h3>
                <p>Bạn chưa thực hiện bất kỳ giao dịch nào với tài khoản này.</p>
                <Link to="/products" className="empty-tab-btn">Khám phá sản phẩm</Link>
              </div>
            )}
          </div>
        )}

      </section>
    </div>
  );
}
