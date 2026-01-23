const paymentService = require("../services/payment.js");

exports.confirmPayment = async (req, res) => {
  const { groupCode, participantId, payerPhone, payerName } = req.body;

  const result = await paymentService.payForParticipant({
    groupCode,
    participantId,
    payerPhone,
    payerName,
    idempotencyKey: req.idempotencyKey
  });

  res.json(result);
};

exports.declinePayment = async (req, res) => {
  res.json({ status: "DUE" });
};
