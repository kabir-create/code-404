const { pool } = require("../config/db");

exports.createPayment = async ({
  billId,
  payerPhone,
  payerName,
  paidForParticipantId,
  idempotencyKey
}) => {
  await pool.query(
    `INSERT INTO payments
     (bill_id, payer_phone, payer_name, paid_for_participant_id, idempotency_key)
     VALUES ($1,$2,$3,$4,$5)`,
    [billId, payerPhone, payerName, paidForParticipantId, idempotencyKey]
  );
};
