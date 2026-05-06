const { pool } = require("../config/db");

function ensureAllowedStatus(status, allowed) {
  if (!allowed.includes(status)) {
    const err = new Error(`Invalid status. Allowed: ${allowed.join(", ")}`);
    err.status = 400;
    throw err;
  }
}

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

// COD: user chọn COD cho order
async function setCODPayment({ orderId, userId }) {
  const order = await getOrderById(orderId);
  await assertOrderOwned(order, userId);

  if (order.payment_status === "paid") {
    const err = new Error("Order already paid");
    err.status = 400;
    throw err;
  }

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

  const note = `CASIO_${orderId}`;
  // demo content (bạn thay bằng payload ngân hàng thật nếu cần)
  const qrContent = `BANK_TRANSFER|AMOUNT=${order.total_price}|NOTE=${note}`;

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

  return { note, qrContent };
}

// Card stub simulate
async function simulateCardPayment({ orderId, userId, result }) {
  ensureAllowedStatus(result, ["success", "fail"]);

  const order = await getOrderById(orderId);
  await assertOrderOwned(order, userId);

  if (order.payment_status === "paid") {
    const err = new Error("Order already paid");
    err.status = 400;
    throw err;
  }

  if (result === "success") {
    await pool.query(
      `UPDATE orders
       SET payment_method = 'CARD',
           payment_status = 'paid',
           paid_at = NOW(),
           status = 'processing'
       WHERE id = ?`,
      [orderId]
    );
  } else {
    await pool.query(
      `UPDATE orders
       SET payment_method = 'CARD',
           payment_status = 'failed',
           status = 'pending_payment'
       WHERE id = ?`,
      [orderId]
    );
  }

  return getOrderById(orderId);
}

// Debug: Log all exported functions to help trace issues
console.log('Exporting paymentService:', {
  setCODPayment,
  createQRPayment,
  simulateCardPayment,
});

module.exports = {
  setCODPayment,
  createQRPayment,
  simulateCardPayment,
};