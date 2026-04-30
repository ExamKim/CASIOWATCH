import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const { token, user, status } = useSelector(state => state.auth);

  if (token && !user && status !== 'failed') {
    return <p className="catalog-status">Đang xác thực tài khoản...</p>;
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
          message: 'Vui lòng đăng nhập để tiếp tục',
        }}
      />
    );
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace state={{ message: 'Trang nay danh cho admin' }} />;
  }

  return children;
};

export default ProtectedRoute;
