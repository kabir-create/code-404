console.log("✅ bill routes file loaded");

const router = require("express").Router();
const auth = require("../middleware/auth.js");
const { createBill, getBill,} = require("../controllers/bill.js");

router.post("/create", createBill);
//router.get("/id/:billId", getBillById);
router.get("/:groupCode", getBill);
//router.get("/table/participants", getParticipantsByTable);

module.exports = router;
