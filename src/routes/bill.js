console.log("✅ bill routes file loaded");

const router = require("express").Router();
const {
  createBill,
  getBill,
  getBillById,
  getParticipantsByTable
} = require("../controllers/bill.js");
const { getBillByGroupCode } = require("../models/bill.js");
const controllers = require("../controllers/bill.js");
console.log("BILL CONTROLLERS:", controllers);


router.post("/create", createBill);

// 🔥 IMPORTANT: specific routes FIRST
router.get("/id/:billId", getBillById);

router.get("/table/participants", getParticipantsByTable);

// ⚠️ groupCode route must be LAST (catch-all)
router.get("/:groupCode", getBill);

module.exports = router;
