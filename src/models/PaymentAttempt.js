const { pool } = require("../config/db");

/**
 * Used ONLY for idempotency protection
 */
exports.findByKey = async (idempotencyKey) => {
  const { rows } = await pool.query(
    `
    SELECT id
    FROM payment_attempts
    WHERE idempotency_key = $1
    `,
    [idempotencyKey]
  );

  return rows[0];
};

exports.create = async ({ idempotencyKey, participantId, status }) => {
  await pool.query(
    `
    INSERT INTO payment_attempts
      (idempotency_key, participant_id, status)
    VALUES
      ($1, $2, $3)
    `,
    [idempotencyKey, participantId, status]
  );
};
