import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { meThunk } from '../api/authSlice';
import '../styles/home.css';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token, } = useSelector(state => state.auth);

    useEffect(() => {
        if (token && !user) {
            dispatch(meThunk());
        }
    }, [token, user, dispatch]);

    if (!token) {
        return (
            <div className="home-container">
                <div className="welcome-section">
                    <h1>Chào mừng đến CASIO Watch</h1>
                    <p>Vui lòng đăng nhập để tiếp tục</p>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="user-info-section">
                <h1>Chào mừng, {user?.username || 'User'}!</h1>

                <div className="user-card">
                    <h2>Thông tin tài khoản</h2>
                    <div className="user-details">
                        <p><strong>Tên:</strong> {user?.username}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        {user?.phone && <p><strong>Số điện thoại:</strong> {user.phone}</p>}
                        {user?.address && <p><strong>Địa chỉ:</strong> {user.address}</p>}
                        <p><strong>Role:</strong> {user?.role}</p>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="btn-secondary">Cập nhật thông tin</button>
                    <button className="btn-secondary">Xem đơn hàng</button>
                </div>
            </div>
        </div>
    );
};

export default Home;