const phoneRegex = /^[0-9]{10}$/;
const nameRegex = /^[A-Za-z ]+$/;

exports.validatePhone = (req, res, next) => {
  const phone = String(req.body.payerPhone || "").trim();

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      message: "Phone number must be exactly 10 digits"
    });
  }

  next();
};

exports.validateName = (req, res, next) => {
  const name = req.body.payerName || req.body.name;

  if (!name || !nameRegex.test(name)) {
    return res.status(400).json({
      message: "Name must contain only alphabets"
    });
  }
  next();
};
