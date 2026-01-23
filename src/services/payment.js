const Bill = require("../models/Bill");
const Participant = require("../models/Participant");
const PaymentAttempt = require("../models/PaymentAttempt");
const Payment = require("../models/Payment");
const { autoCloseBillIfSettled } = require("./bill");


/**
 * Pay for self (MVP)
 * Idempotency already checked by middleware
 */

exports.payForParticipant = async ({
  groupCode,
  payerPhone,
  payerName,
  idempotencyKey
}) => {
  const bill = await Bill.getBillByGroupCode(groupCode);
  if (!bill) {
    console.log(groupCode);
    throw new Error("Bill not found");
  }

  const billId = bill.id;
  // 1️⃣ Find or create participant
  let participant = await Participant.findByBillAndPhone(
    billId,
    payerPhone
  );console.log("GROUP CODE:", groupCode);
console.log("BILL FOUND:", bill);


  if (!participant) {
    participant = await Participant.createParticipant({
      billId,
      groupCode,
      phone: payerPhone,
      name: payerName
    });
  }

  // 2️⃣ Prevent double payment
  if (participant.status === "PAID") {
    throw new Error("Participant already paid");
  }

  // 3️⃣ Record payment
  await Payment.createPayment({
    billId,
    payerPhone,
    payerName,
    paidForParticipantId: participant.id,
    idempotencyKey
  });

  // 4️⃣ Mark participant as PAID
  await Participant.markPaid(participant.id);

  // 5️⃣ Store idempotency success
  await PaymentAttempt.create({
    idempotencyKey,
    participantId: participant.id,
    status: "SUCCESS"
  });

  // 6️⃣ Auto-close bill if settled
  await autoCloseBillIfSettled(billId);

  return { status: "PAID" };
};

/**
 * Decline payment
 */
exports.declinePayment = async () => {
  return { status: "DUE" };
};
