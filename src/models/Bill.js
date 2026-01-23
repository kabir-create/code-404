const { pool } = require("../config/db");

exports.createBill = async ({ tableNo, totalAmount, splitAmount, groupCode }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO bills (restaurant_id,table_no, total_amount, split_amount, group_code, status)
    VALUES ($1, $2, $3, $4, $5, 'OPEN')
    RETURNING *
    `,
    [restaurantId,tableNo, totalAmount, splitAmount, groupCode]
  );

  return rows[0];
};

exports.getBillByGroupCode = async (groupCode) => {
  const { rows } = await pool.query(
    `
    SELECT b.*, r.name as restaurant_name, r.city 
    FROM bills b
    LEFT JOIN restaurants r ON b.restaurant_id = r.id
    WHERE b.group_code = $1
    `,
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
