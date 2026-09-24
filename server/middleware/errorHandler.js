const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ error: message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Geçersiz ID formatı" });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: "Bu kayıt zaten mevcut" });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Geçersiz JSON gövdesi" });
  }

  res.status(err.status || 500).json({ error: err.message || "Sunucu hatası" });
};

module.exports = errorHandler;
