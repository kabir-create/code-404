const Bill = require("../models/Bill");
const Participant = require("../models/Participant");

/**
 * Create a new bill and initialize participants as DUE
 */
exports.createBill = async ({ tableNo, totalAmount, numberOfUsers }) => {
  const splitAmount = totalAmount / numberOfUsers;

  const bill = await Bill.create({
    tableNo,
    totalAmount,
    splitAmount,
    status: "OPEN"
  });

  return bill;
};

/**
 * Fetch bill with participants summary
 */
exports.getBillWithParticipants = async (billId) => {
  const bill = await Bill.findById(billId);
  if (!bill) {
    throw new Error("Bill not found");
  }

  const participants = await Participant.find({ billId });

  return {
    bill,
    participants
  };
};

/**
 * Close bill if all participants are PAID
 */
exports.autoCloseBillIfSettled = async (billId) => {
  const unpaid = await Participant.countDocuments({
    billId,
    status: "DUE"
  });

  if (unpaid === 0) {
    await Bill.findByIdAndUpdate(billId, { status: "CLOSED" });
    return true;
  }

  return false;
};
