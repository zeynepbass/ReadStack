const FIELD_LABELS = {
  readingGoal: "Okuma hedefi",
  year: "Yayın yılı",
  fileCount: "Sayfa sayısı",
  progress: "İlerleme",
  page: "Sayfa numarası",
};

const castMessage = (path) => {
  const field = path.split(".").pop();
  return `${FIELD_LABELS[field] ?? field} alanı geçersiz`;
};

const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => (e.name === "CastError" ? castMessage(e.path) : e.message))
      .join(", ");
    return res.status(400).json({ error: message });
  }

  if (err.name === "CastError") {
    const message = err.path === "_id" ? "Geçersiz ID formatı" : castMessage(err.path);
    return res.status(400).json({ error: message });
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
