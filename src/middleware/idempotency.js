const PaymentAttempt = require("../models/PaymentAttempt");

module.exports = async (req, res, next) => {
  const key = req.headers["idempotency-key"];

  if (!key) {
    return res.status(400).json({ message: "Missing idempotency key" });
  }

  const exists = await PaymentAttempt.findByKey(key);

  if (exists) {
    return res.status(409).json({
      message: "Payment already processed"
    });
  }

  req.idempotencyKey = key;
  next();
};
