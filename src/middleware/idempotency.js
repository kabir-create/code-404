const PaymentAttempt = require("../models/PaymentAttempt");

module.exports = async (req, res, next) => {
  const key = req.headers["idempotency-key"];
  if (!key) return res.status(400).json({ message: "Missing idempotency key" });

  const exists = await PaymentAttempt.findOne({ idempotencyKey: key });
  if (exists) {
    return res.status(409).json({ message: "Already processed" });
  }

  req.idempotencyKey = key;
  next();
};
