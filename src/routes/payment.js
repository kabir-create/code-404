const router = require("express").Router();

//const auth = require("../middleware/auth.js");
const idempotency = require("../middleware/idempotency.js");
const {
  validatePhone,
  validateName
} = require("../middleware/validation.js");

const {
  confirmPayment,
  declinePayment,
  payByTable
} = require("../controllers/payment.js");
const Controllers = require("../controllers/payment.js");
console.log("PAYMENT CONTROLLERS:", Controllers);
/**
 * YES on popup (pay self / pay for friend)
 */
router.post(
  "/confirm",
  //auth,
  validatePhone,
  validateName,
  idempotency,
  confirmPayment
);

/**
 * NO on popup or window closed
 */
router.post(
  "/decline",
 // auth,
  validatePhone,
  declinePayment
);
router.post(
  "/pay-by-table",
  validatePhone,
  validateName,
  idempotency,
  payByTable
);

module.exports = router;
