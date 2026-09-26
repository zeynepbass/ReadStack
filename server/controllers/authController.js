const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const MIN_PASSWORD_LENGTH = 8;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id, tv: user.tokenVersion }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

const passwordError = (password) =>
  typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH
    ? `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır`
    : null;

const verifyRefreshToken = async (refreshToken) => {
  if (!isNonEmptyString(refreshToken)) return null;

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || (payload.tv ?? 0) !== user.tokenVersion) return null;
    return user;
  } catch {
    return null;
  }
};

const register = async (req, res, next) => {
  try {
    const { email, password, name, readingGoal } = req.body ?? {};

    if (!isNonEmptyString(email) || !isNonEmptyString(password) || !isNonEmptyString(name)) {
      return res.status(400).json({ error: "email, password ve name zorunludur" });
    }

    const invalidPassword = passwordError(password);
    if (invalidPassword) {
      return res.status(400).json({ error: invalidPassword });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Bu email ile kayıtlı bir kullanıcı zaten var" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name, readingGoal });

    res.status(201).json({ user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ error: "email ve password zorunludur" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Email veya şifre hatalı" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email veya şifre hatalı" });
    }

    res.json({
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
      user: user.toPublic(),
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body ?? {};

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token bulunamadı" });
    }

    const user = await verifyRefreshToken(refreshToken);
    if (!user) {
      return res.status(401).json({ error: "Geçersiz veya süresi dolmuş refresh token" });
    }

    res.json({ accessToken: generateAccessToken(user) });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body ?? {};
    const user = await verifyRefreshToken(refreshToken);

    if (user) {
      user.tokenVersion += 1;
      await user.save();
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    res.json({ user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body ?? {};

    if (!isNonEmptyString(email)) {
      return res.status(400).json({ error: "email zorunludur" });
    }

    const response = { message: "Bu e-posta kayıtlıysa şifre sıfırlama kodu oluşturuldu" };
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user) {
      const token = crypto.randomBytes(24).toString("hex");
      user.resetTokenHash = hashToken(token);
      user.resetTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await user.save();

      if (process.env.NODE_ENV !== "production") {
        response.resetToken = token;
      }
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body ?? {};

    if (!isNonEmptyString(token)) {
      return res.status(400).json({ error: "Sıfırlama kodu zorunludur" });
    }

    const invalidPassword = passwordError(password);
    if (invalidPassword) {
      return res.status(400).json({ error: invalidPassword });
    }

    const user = await User.findOne({
      resetTokenHash: hashToken(token.trim()),
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: "Sıfırlama kodu geçersiz veya süresi dolmuş" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetTokenHash = undefined;
    user.resetTokenExpires = undefined;
    user.tokenVersion += 1;
    await user.save();

    res.json({ message: "Şifren güncellendi, yeni şifrenle giriş yapabilirsin" });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout, me, forgotPassword, resetPassword };
