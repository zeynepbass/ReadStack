const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Ad soyad zorunludur"], trim: true },
    email: { type: String, required: [true, "E-posta zorunludur"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    readingGoal: {
      type: Number,
      default: 24,
      min: [1, "Okuma hedefi en az 1 olmalıdır"],
      max: [1000, "Okuma hedefi en fazla 1000 olabilir"],
    },
    tokenVersion: { type: Number, default: 0 },
    resetTokenHash: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    readingGoal: this.readingGoal,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
