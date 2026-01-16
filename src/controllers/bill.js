const billService = require("../services/bill.js");
const generateQR = require("../utils/qr.js");

/**
 * Create bill
 * - creates bill in Postgres
 * - generates groupCodes
 * - returns QR + splitAmount (same behavior as before)
 */
exports.createBill = async (req, res) => {
  const { tableNo, totalAmount, numberOfUsers } = req.body;

  const bill = await billService.createBill({
    tableNo,
    totalAmount,
    numberOfUsers
  });

  res.json({
    billId: bill.id,                 // Postgres PK
    groupCode: bill.group_code,       // NEW
    splitAmount: bill.split_amount,
    qr: generateQR(bill.group_code)   // QR now encodes groupCode
  });
};

/**
 * Fetch bill by groupCode (QR scan flow)
 */
exports.getBill = async (req, res) => {
  const { groupCode } = req.params;

  const data = await billService.getBillWithParticipants(groupCode);

  res.json({
    total: data.bill.total_amount,
    splitAmount: data.bill.split_amount,
    status: data.bill.status,
    participants: data.participants
  });
};
