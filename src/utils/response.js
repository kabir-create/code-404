exports.ok = (res, data) => res.json(data);
exports.err = (res, msg, code = 400) => res.status(code).json({ message: msg });

