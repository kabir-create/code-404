const { pool } = require("../config/db");

exports.createParticipant = async ({
  billId,
  groupCode,
  phone,
  name,
  restaurantId
}) => {
  const { rows } = await pool.query(
    `
    INSERT INTO participants
      (bill_id, group_code, phone, name, status, restaurant_id)
    VALUES
      ($1, $2, $3, $4, 'DUE', $5)
    RETURNING *
    `,
    [billId, groupCode, phone, name, restaurantId]
  );
  return rows[0];
};


/**
 * 🔹 REQUIRED for payment flow
 */
exports.findByBillAndPhone = async (billId, phone) => {
  const { rows } = await pool.query(
    `
    SELECT * FROM participants
    WHERE bill_id = $1 AND phone = $2
    `,
    [billId, phone]
  );
  return rows[0];
};

exports.markPaid = async (participantId) => {
  await pool.query(
    `
    UPDATE participants
    SET status='PAID', paid_at=NOW()
    WHERE id=$1
    `,
    [participantId]
  );
};
exports.getByBillId = async (billId) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM participants
    WHERE bill_id = $1
    ORDER BY created_at ASC
    `,
    [billId]
  );
  return rows;
};


exports.getByGroupCode = async (groupCode) => {
  const { rows } = await pool.query(
    `
    SELECT * FROM participants
    WHERE group_code=$1
    `,
    [groupCode]
  );
  return rows;
};
