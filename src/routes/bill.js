const router = require("express").Router();
const auth = require("../middleware/auth.js");
const { createBill, getBill } = require("../controllers/bill.js");

router.post("/create", auth, createBill);
router.get("/:groupCode", auth, getBill);

module.exports = router;
