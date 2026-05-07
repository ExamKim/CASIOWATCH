// Order Status Translations
export const ORDER_STATUS_VI = {
    pending: "Chờ xử lý",
    pending_payment: "Chờ thanh toán",
    processing: "Đang xử lý",
    completed: "Hoàn thành",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
};

// Payment Status Translations
export const PAYMENT_STATUS_VI = {
    pending: "Chưa thanh toán",
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    failed: "Thanh toán thất bại",
    cancelled: "Đã hủy",
};

// Payment Method Translations
export const PAYMENT_METHOD_VI = {
    qr: "QR Code",
    cod: "COD",
};

// Helper functions
export function getOrderStatusVi(status) {
    const normalized = String(status || "pending").toLowerCase();
    return ORDER_STATUS_VI[normalized] || status || "N/A";
}

export function getPaymentStatusVi(status) {
    const normalized = String(status || "pending").toLowerCase();
    return PAYMENT_STATUS_VI[normalized] || status || "N/A";
}

export function getPaymentMethodVi(method) {
    const normalized = String(method || "").toLowerCase();
    return PAYMENT_METHOD_VI[normalized] || method || "N/A";
}
