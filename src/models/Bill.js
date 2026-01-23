const { pool } = require("../config/db");

exports.createBill = async ({ tableNo, totalAmount, splitAmount, groupCode }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO bills (table_no, total_amount, split_amount, group_code, status)
    VALUES ($1, $2, $3, $4, 'OPEN')
    RETURNING *
    `,
    [tableNo, totalAmount, splitAmount, groupCode]
  );

  return rows[0];
};

exports.getBillByGroupCode = async (groupCode) => {
  const { rows } = await pool.query(
    `SELECT * FROM bills WHERE group_code = $1`,
    [groupCode]
  );

  return rows[0];
};

exports.getBillById = async (billId) => {
  const { rows } = await pool.query(
    `SELECT * FROM bills WHERE id = $1`,
    [billId]
  );
  return rows[0];
};
