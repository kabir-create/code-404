const Bill = require("../models/Bill");
const Participant = require("../models/Participant");
const { v4: uuid } = require("uuid");

exports.createBill = async ({
  restaurantId,
  tableNo,
  totalAmount,
  numberOfUsers
}) => {
  if (!restaurantId) throw new Error("restaurantId is required");
  if (!tableNo) throw new Error("tableNo is required");
  if (!totalAmount || !numberOfUsers) {
    throw new Error("totalAmount and numberOfUsers are required");
  }

  const groupCode = uuid(); // ✅ always server-generated

  return Bill.createBill({
    restaurantId,
    tableNo,
    totalAmount,
    numberOfUsers,
    groupCode
  });
};

exports.getBillWithParticipants = async (groupCode) => {
  const bill = await Bill.getBillByGroupCode(groupCode);
  if (!bill) throw new Error("Bill not found");

  const participants = await Participant.getByGroupCode(groupCode);

  return { bill, participants };
};

exports.getParticipantsByTable = async ({ restaurantId, tableNo }) => {
  const bill = await Bill.getOpenBillByTable(restaurantId, tableNo);

  if (!bill) {
    throw new Error("No active bill for this table");
  }

  const participants = await Participant.getByBillId(bill.id);

  return {
    billId: bill.id,
    groupCode: bill.group_code,
    tableNo: bill.table_no,
    totalAmount: bill.total_amount,
    splitAmount: bill.split_amount,
    participants
  };
};
