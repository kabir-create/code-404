const paymentService = require("../services/payment.js");

exports.confirmPayment = async (req, res) => {
  const { billId, participantId, payerName } = req.body;

  const result = await paymentService.payForParticipant({
    billId,
    participantId,
    payerPhone: req.user.phone,
    payerName,
    idempotencyKey: req.idempotencyKey
  });

  res.json(result);
};

exports.declinePayment = async (req, res) => {
  res.json({ status: "DUE" });
};
