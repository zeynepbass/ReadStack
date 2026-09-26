const PR = require("../models/PR");

const getMonthlyStats = async (req, res, next) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [stats] = await PR.aggregate([
      { $match: { status: "approved", history: { $elemMatch: { kind: "done", createdAt: { $gte: monthStart } } } } },
      { $group: { _id: null, booksRead: { $sum: 1 }, pagesRead: { $sum: "$fileCount" } } },
    ]);

    res.json({ booksRead: stats?.booksRead ?? 0, pagesRead: stats?.pagesRead ?? 0 });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMonthlyStats };
