exports.login = (req, res) => {
  const { phone } = req.body;
  res.json({ token: "mock-token", phone });
};
