const PR = require("../models/PR");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const HISTORY_KIND = { approved: "done", rejected: "drop", pending: "reopen" };

const getPRs = async (req, res, next) => {
  try {
    const { search, priority } = req.query;
    const filter = { createdBy: req.user.id };

    if (typeof search === "string" && search.trim()) {
      const pattern = { $regex: escapeRegex(search.trim()), $options: "i" };
      filter.$or = [{ title: pattern }, { author: pattern }];
    }

    if (typeof priority === "string" && priority) {
      filter.priority = priority;
    }

    const prs = await PR.find(filter).sort({ createdAt: -1 });
    res.json(prs);
  } catch (err) {
    next(err);
  }
};

const getPRById = async (req, res, next) => {
  try {
    const pr = await PR.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!pr) {
      return res.status(404).json({ error: "Kitap bulunamadı" });
    }

    res.json(pr);
  } catch (err) {
    next(err);
  }
};

const createPR = async (req, res, next) => {
  try {
    const { title, author, fileCount, priority, genre, year, description } = req.body ?? {};

    const pr = await PR.create({
      title,
      author,
      fileCount,
      priority,
      genre,
      year,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json(pr);
  } catch (err) {
    next(err);
  }
};

const updateStatus = (status) => async (req, res, next) => {
  try {
    const { version } = req.body ?? {};

    if (typeof version !== "number") {
      return res.status(400).json({ error: "version alanı zorunludur ve sayı olmalıdır" });
    }

    const updated = await PR.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id, version },
      {
        $set: { status },
        $inc: { version: 1 },
        $push: { history: { kind: HISTORY_KIND[status] } },
      },
      { returnDocument: "after" }
    );

    if (updated) {
      return res.json(updated);
    }

    const exists = await PR.exists({ _id: req.params.id, createdBy: req.user.id });
    if (!exists) {
      return res.status(404).json({ error: "Kitap bulunamadı" });
    }

    return res
      .status(409)
      .json({ error: "Bu kitap başka biri tarafından güncellendi, sayfayı yenileyin" });
  } catch (err) {
    next(err);
  }
};

const updateProgress = async (req, res, next) => {
  try {
    const { progress } = req.body ?? {};

    if (!Number.isInteger(progress) || progress < 0) {
      return res.status(400).json({ error: "progress alanı 0 veya daha büyük bir tam sayı olmalıdır" });
    }

    const pr = await PR.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!pr) {
      return res.status(404).json({ error: "Kitap bulunamadı" });
    }

    const value = Math.min(progress, pr.fileCount);
    const started = pr.history.some((h) => h.kind === "start");

    if (value > 0 && !started) {
      pr.history.push({ kind: "start" });
    }

    pr.progress = value;
    await pr.save();

    res.json(pr);
  } catch (err) {
    next(err);
  }
};

const addNote = async (req, res, next) => {
  try {
    const { text, page } = req.body ?? {};

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text alanı zorunludur" });
    }

    const pr = await PR.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { $push: { notes: { text, ...(Number.isInteger(page) && { page }) } } },
      { returnDocument: "after", runValidators: true }
    );

    if (!pr) {
      return res.status(404).json({ error: "Kitap bulunamadı" });
    }

    res.status(201).json(pr);
  } catch (err) {
    next(err);
  }
};

const approvePR = updateStatus("approved");
const rejectPR = updateStatus("rejected");
const reopenPR = updateStatus("pending");

module.exports = { getPRs, getPRById, createPR, approvePR, rejectPR, reopenPR, updateProgress, addNote };
