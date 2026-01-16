const { pool } = require("../config/db");

exports.createParticipant = async ({ billId, groupCode, phone, name }) => {
  const { rows } = await pool.query(
    `INSERT INTO participants (bill_id, group_code, phone, name, status)
     VALUES ($1,$2,$3,$4,'DUE')
     RETURNING *`,
    [billId, groupCode, phone, name]
  );
  return rows[0];
};

exports.markPaid = async (participantId) => {
  await pool.query(
    `UPDATE participants
     SET status='PAID', paid_at=NOW()
     WHERE id=$1`,
    [participantId]
  );
};
exports.getByGroupCode = async (groupCode) => {
  const { rows } = await pool.query(
    `SELECT * FROM participants WHERE group_code=$1`,
    [groupCode]
  );
  return rows;
};

