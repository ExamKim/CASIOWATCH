import React from 'react';

export default function QRPaymentInfo({ qr, note }) {
    if (!qr && !note) return null;
    return (
        <div className="qr-payment-info">
            <h3>Thông tin chuyển khoản QR</h3>
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
