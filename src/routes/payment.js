const router = require("express").Router();

const auth = require("../middleware/auth");
const idempotency = require("../middleware/idempotency");
const {
  validatePhone,
  validateName
} = require("../middleware/validation");

const {
  confirmPayment,
  declinePayment
} = require("../controllers/payment");

/**
 * YES on popup (pay self / pay for friend)
 */
router.post(
  "/confirm",
  auth,
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
  auth,
  validatePhone,
  declinePayment
);

module.exports = router;
