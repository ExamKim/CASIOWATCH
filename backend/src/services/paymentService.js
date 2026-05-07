const { pool } = require("../config/db");

const QR_BANK_CODE = process.env.QR_BANK_CODE || "MB";
const QR_ACCOUNT_NO = process.env.QR_ACCOUNT_NO || "0979605453";
const QR_ACCOUNT_NAME = process.env.QR_ACCOUNT_NAME || "CHIU KIM THI";

async function assertOrderOwned(order, userId) {
  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }
  if (Number(order.user_id) !== Number(userId)) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}

async function getOrderById(orderId) {
  const [[order]] = await pool.query("SELECT * FROM orders WHERE id = ?", [orderId]);
  return order || null;
}

function assertOrderPayable(order) {
  const orderStatus = String(order.status || "").toLowerCase();
  const uncancellableStatuses = ["cancelled", "completed", "delivered"];

  if (uncancellableStatuses.includes(orderStatus)) {
    const err = new Error(`Cannot accept payment for ${orderStatus} order`);
    err.status = 400;
    throw err;
  }
}

// COD: user chọn COD cho order
async function setCODPayment({ orderId, userId }) {
  const order = await getOrderById(orderId);
  await assertOrderOwned(order, userId);

  if (order.payment_status === "paid") {
    const err = new Error("Order already paid");
    err.status = 400;
    throw err;
  }

  assertOrderPayable(order);

  await pool.query(
    `UPDATE orders
     SET payment_method = 'COD',
         payment_status = 'pending',
         status = 'processing'
     WHERE id = ?`,
    [orderId]
  );

  return getOrderById(orderId);
}

// QR: tạo attempt và trả qrContent + note
async function createQRPayment({ orderId, userId }) {
  const order = await getOrderById(orderId);
  await assertOrderOwned(order, userId);

  if (order.payment_status === "paid") {
    const err = new Error("Order already paid");
    err.status = 400;
    throw err;
  }

  assertOrderPayable(order);

  const note = `CASIO_${orderId}`;
  const amount = Number(order.total_price || 0);
  const qrContent = `BANK_TRANSFER|BANK=${QR_BANK_CODE}|ACCOUNT=${QR_ACCOUNT_NO}|AMOUNT=${amount}|NOTE=${note}`;
  const qrImageUrl = `https://img.vietqr.io/image/${encodeURIComponent(QR_BANK_CODE)}-${encodeURIComponent(QR_ACCOUNT_NO)}-compact2.png?amount=${encodeURIComponent(amount)}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(QR_ACCOUNT_NAME)}`;

  await pool.query(
    `UPDATE orders
     SET payment_method = 'QR',
         payment_status = 'pending',
         payment_note = ?,
         payment_qr_content = ?,
         status = 'pending_payment'
     WHERE id = ?`,
    [note, qrContent, orderId]
  );

  return {
    note,
    qrContent,
    qrImageUrl,
    amount,
    bankCode: QR_BANK_CODE,
    accountNo: QR_ACCOUNT_NO,
    accountName: QR_ACCOUNT_NAME,
  };
}

// Debug: Log all exported functions to help trace issues
console.log('Exporting paymentService:', {
  setCODPayment,
  createQRPayment,
});

module.exports = {
  setCODPayment,
  createQRPayment,
};