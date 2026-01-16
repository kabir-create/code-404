const Participant = require("../models/Participant");
const PaymentAttempt = require("../models/PaymentAttempt");
const { autoCloseBillIfSettled } = require("./bill.js");

/**
 * Confirm payment for a participant
 * Idempotency is enforced before calling this
 */
exports.confirmPayment = async ({ billId, phone, idempotencyKey }) => {
  let participant = await Participant.findOne({ billId, phone });

  if (!participant) {
    participant = await Participant.create({
      billId,
      payerPhone,
      payerName,
      status: "DUE"
    });
  }

  if (participant.status === "PAID") {
    throw new Error("Participant already paid");
  }

  participant.status = "PAID";
  participant.paidAt = new Date();
  await participant.save();

  await PaymentAttempt.create({
    idempotencyKey,
    participantId: participant._id,
    status: "SUCCESS"
  });

  await autoCloseBillIfSettled(billId);

  return participant;
};
exports.payForParticipant = async ({
  billId,
  payerPhone,
  payerName,
  participantId,
  idempotencyKey
}) => {
  await Payment.createPayment({
    billId,
    payerPhone,
    payerName,
    paidForParticipantId: participantId,
    idempotencyKey
  });

  await Participant.markPaid(participantId);

  return { status: "PAID" };
};
/**
 * Decline payment (popup NO or window closed)
 * No DB mutation needed for MVP
 */
exports.declinePayment = async () => {
  return { status: "DUE" };
};
