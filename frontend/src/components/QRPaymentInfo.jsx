import React from 'react';

export default function QRPaymentInfo({ qr, note, qrImageUrl, bankCode, accountNo, accountName, amount }) {
    if (!qr && !note && !qrImageUrl) return null;
    return (
        <div className="qr-payment-info">
            <h3>Thông tin chuyển khoản QR</h3>
            {qrImageUrl && (
                <div style={{ marginBottom: 12 }}>
                    <img
                        src={qrImageUrl}
                        alt="QR thanh toán"
                        style={{ width: 260, maxWidth: '100%', borderRadius: 8, border: '1px solid #e5e7eb' }}
                    />
                </div>
            )}

            {(bankCode || accountNo || accountName || amount) && (
                <div style={{ marginBottom: 10, display: 'grid', gap: 6 }}>
                    {bankCode && <div><strong>Ngân hàng:</strong> {bankCode}</div>}
                    {accountNo && <div><strong>Số tài khoản:</strong> {accountNo}</div>}
                    {accountName && <div><strong>Người nhận:</strong> {accountName}</div>}
                    {amount !== undefined && amount !== null && <div><strong>Số tiền:</strong> {Number(amount).toLocaleString('vi-VN')} đ</div>}
                </div>
            )}

            {qr && (
                <div>
                    <strong>Nội dung QR:</strong>
                    <div style={{ wordBreak: 'break-all', background: '#f5f5f5', padding: 8, borderRadius: 4 }}>{qr}</div>
                </div>
            )}
            {note && (
                <div style={{ marginTop: 8 }}>
                    <strong>Ghi chú chuyển khoản:</strong>
                    <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>{note}</div>
                </div>
            )}
        </div>
    );
}
