const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  text: { type: String, required: [true, "Not metni zorunludur"], trim: true, maxlength: [2000, "Not en fazla 2000 karakter olabilir"] },
  page: { type: Number, min: [0, "Sayfa numarası negatif olamaz"] },
  createdAt: { type: Date, default: Date.now },
});

const historySchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["add", "start", "done", "drop", "reopen"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const prSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Kitap adı zorunludur"], trim: true },
    author: { type: String, required: [true, "Yazar zorunludur"], trim: true },
    fileCount: { type: Number, default: 0, min: [0, "Sayfa sayısı negatif olamaz"] },
    priority: {
      type: String,
      enum: { values: ["low", "medium", "high"], message: "Geçersiz öncelik değeri" },
      default: "medium",
    },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    version: { type: Number, default: 0 },
    genre: { type: String, trim: true, maxlength: [60, "Tür en fazla 60 karakter olabilir"] },
    year: { type: Number, min: [0, "Yayın yılı geçersiz"], max: [3000, "Yayın yılı geçersiz"] },
    description: { type: String, trim: true, maxlength: [2000, "Açıklama en fazla 2000 karakter olabilir"] },
    progress: { type: Number, default: 0, min: [0, "İlerleme negatif olamaz"] },
    notes: { type: [noteSchema], default: [] },
    history: { type: [historySchema], default: () => [{ kind: "add" }] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PR", prSchema);
