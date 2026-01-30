const Bill = require("../models/Bill");
const Participant = require("../models/Participant");
const PaymentAttempt = require("../models/PaymentAttempt");
const Payment = require("../models/Payment");
// const { autoCloseBillIfSettled } = require("./bill");

/**
 * ===========================
 * PAY VIA QR / GROUP CODE
 * ===========================
 */
exports.payForParticipant = async ({
  groupCode,
  payerPhone,
  payerName,
  idempotencyKey
}) => {
  // 1️⃣ Fetch bill
  const bill = await Bill.getBillByGroupCode(groupCode);
  if (!bill) {
    throw new Error("Bill not found");
  }

  const billId = bill.id;

  // 2️⃣ Idempotency check FIRST
  const existingAttempt = await PaymentAttempt.findByKey(idempotencyKey);
  if (existingAttempt?.status === "SUCCESS") {
    await Participant.markPaid(existingAttempt.participant_id);
    return { status: "PAID" };
  }

  // 3️⃣ Find or create participant
  let participant = await Participant.findByBillAndPhone(
    billId,
    payerPhone
  );

  if (!participant) {
    participant = await Participant.createParticipant({
      billId,
      groupCode,
      phone: payerPhone,
      name: payerName,
      restaurantId: bill.restaurant_id
    });
  }

  // 4️⃣ Prevent double payment
  if (participant.status === "PAID") {
    await PaymentAttempt.create({
      idempotencyKey,
      participantId: participant.id,
      status: "SUCCESS"
    });
    return { status: "PAID" };
  }

  // 5️⃣ Create payment
  await Payment.createPayment({
    billId,
    payerPhone,
    payerName,
    paidForParticipantId: participant.id,
    idempotencyKey,
    restaurantId: bill.restaurant_id
  });

  // 6️⃣ Mark participant PAID
  await Participant.markPaid(participant.id);

  // 7️⃣ Store idempotency success
  await PaymentAttempt.create({
    idempotencyKey,
    participantId: participant.id,
    status: "SUCCESS"
  });

  return { status: "PAID" };
};

/**
 * ===========================
 * PAY VIA TABLE NUMBER
 * ===========================
 */
exports.payByTable = async ({
  restaurantId,
  tableNo,
  payerPhone,
  payerName,
  idempotencyKey
}) => {
  // 1️⃣ Find OPEN bill
  const bill = await Bill.getOpenBillByTable(restaurantId, tableNo);
  if (!bill) {
    throw new Error("No open bill for this table");
  }

  const billId = bill.id;
  const groupCode = bill.group_code;

  // 2️⃣ Idempotency check
  const existingAttempt = await PaymentAttempt.findByKey(idempotencyKey);
  if (existingAttempt?.status === "SUCCESS") {
    await Participant.markPaid(existingAttempt.participant_id);
    return { status: "PAID" };
  }

  // 3️⃣ Find or create participant
  let participant = await Participant.findByBillAndPhone(
    billId,
    payerPhone
  );

  if (!participant) {
    participant = await Participant.createParticipant({
      billId,
      groupCode,
      phone: payerPhone,
      name: payerName,
      restaurantId
    });
  }

  // 4️⃣ Prevent double payment
  if (participant.status === "PAID") {
    await PaymentAttempt.create({
      idempotencyKey,
      participantId: participant.id,
      status: "SUCCESS"
    });
    return { status: "PAID" };
  }

  // 5️⃣ Create payment
  await Payment.createPayment({
    billId,
    payerPhone,
    payerName,
    paidForParticipantId: participant.id,
    idempotencyKey,
    restaurantId
  });

  // 6️⃣ Mark participant PAID
  await Participant.markPaid(participant.id);

  // 7️⃣ Store idempotency success
  await PaymentAttempt.create({
    idempotencyKey,
    participantId: participant.id,
    status: "SUCCESS"
  });

  return {
    status: "PAID",
    billId,
    tableNo
  };
};

/**
 * Decline payment
 */
exports.declinePayment = async () => {
  return { status: "DUE" };
};
