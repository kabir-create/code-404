module.exports = (req, res, next) => {
  // MOCK AUTH
  req.user = { phone: req.headers["x-phone"] };
  if (!req.user.phone) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
