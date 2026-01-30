const paymentService = require("../services/payment.js");

/**
 * Pay via QR / groupCode
 */
exports.confirmPayment = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("confirmPayment error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Pay via restaurant + table number (NO QR)
 */
exports.payByTable = async (req, res) => {
  try {
    const { restaurantId, tableNo, payerPhone, payerName } = req.body;

    if (!restaurantId || !tableNo || !payerPhone || !payerName) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const result = await paymentService.payByTable({
      restaurantId,
      tableNo,
      payerPhone,
      payerName,
      idempotencyKey: req.idempotencyKey
    });

    res.json(result);
  } catch (err) {
    console.error("payByTable error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Decline payment
 */
exports.declinePayment = async (req, res) => {
  res.json({ status: "DUE" });
};
