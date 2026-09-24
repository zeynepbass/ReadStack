const PR = require("../models/PR");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getPRs = async (req, res, next) => {
  try {
    const { search, priority } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: escapeRegex(search), $options: "i" };
    }

    if (priority) {
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
    const pr = await PR.findById(req.params.id);

    if (!pr) {
      return res.status(404).json({ error: "PR bulunamadı" });
    }

    res.json(pr);
  } catch (err) {
    next(err);
  }
};

const createPR = async (req, res, next) => {
  try {
    const { title, author, fileCount, priority } = req.body;

    const pr = await PR.create({
      title,
      author,
      fileCount,
      priority,
      createdBy: req.user.id,
    });

    res.status(201).json(pr);
  } catch (err) {
    next(err);
  }
};

const updateStatus = (status) => async (req, res, next) => {
  try {
    const { version } = req.body;

    if (typeof version !== "number") {
      return res.status(400).json({ error: "version alanı zorunludur ve sayı olmalıdır" });
    }

    const updated = await PR.findOneAndUpdate(
      { _id: req.params.id, version },
      { $set: { status }, $inc: { version: 1 } },
      { new: true }
    );

    if (updated) {
      return res.json(updated);
    }

    const exists = await PR.exists({ _id: req.params.id });
    if (!exists) {
      return res.status(404).json({ error: "PR bulunamadı" });
    }

    return res
      .status(409)
      .json({ error: "Bu PR başka biri tarafından güncellendi, sayfayı yenileyin" });
  } catch (err) {
    next(err);
  }
};

const approvePR = updateStatus("approved");
const rejectPR = updateStatus("rejected");

module.exports = { getPRs, getPRById, createPR, approvePR, rejectPR };
