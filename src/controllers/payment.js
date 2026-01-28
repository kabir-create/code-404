const paymentService = require("../services/payment.js");

exports.confirmPayment = async (req, res) => {
  const { groupCode, payerPhone, payerName } = req.body;

  if (!groupCode || !payerPhone || !payerName) {
    return res.status(400).json({
      message: "Missing required fields"
    });
  }

  const result = await paymentService.payForParticipant({
    groupCode,
    payerPhone,
    payerName,
    idempotencyKey: req.idempotencyKey
  });

  res.json(result);
};

exports.declinePayment = async (req, res) => {
  res.json({ status: "DUE" });
};
