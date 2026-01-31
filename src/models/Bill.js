const { pool } = require("../config/db");
console.log("🔥 BILL MODEL LOADED FROM:", __filename);

exports.createBill = async ({
  restaurantId,
  tableNo,
  totalAmount,
  numberOfUsers,
  groupCode
}) => {
  const splitAmount = Math.ceil(totalAmount / numberOfUsers);

  const { rows } = await pool.query(
    `
    INSERT INTO bills (
      restaurant_id,
      table_no,
      total_amount,
      split_amount,
      group_code,
      status
    )
    VALUES ($1, $2, $3, $4, $5, 'OPEN')
    RETURNING *
    `,
    [restaurantId, tableNo, totalAmount, splitAmount, groupCode]
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

exports.getOpenBillByTable = async (restaurantId, tableNo) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM bills
    WHERE restaurant_id = $1
      AND table_no = $2
      AND status = 'OPEN'
    LIMIT 1
    `,
    [restaurantId, tableNo]
  );
  return rows[0];
};
