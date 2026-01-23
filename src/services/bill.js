const Bill = require("../models/Bill");
const Participant = require("../models/Participant");
const { v4: uuid } = require("uuid");

/**
 * Create bill (PostgreSQL)
 */
exports.createBill = async ({ tableNo, totalAmount, numberOfUsers }) => {
  const groupCode = uuid();
  const splitAmount = totalAmount / numberOfUsers;

  return Bill.createBill({
    tableNo,
    totalAmount,
    splitAmount,
    groupCode
  });
};

/**
 * Fetch bill + participants using groupCode (QR flow)
 */
exports.getBillWithParticipants = async (groupCode) => {
  const bill = await Bill.getBillByGroupCode(groupCode);
  if (!bill) {
    throw new Error("Bill not found");
  }

  const participants = await Participant.getByGroupCode(groupCode);

  return { bill, participants };
};
