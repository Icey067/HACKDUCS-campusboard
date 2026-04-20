/**
 * Bookmark routes — save/unsave notices, list user bookmarks.
 *
 * GET    /api/bookmarks        → list current user's bookmarks
 * POST   /api/bookmarks/:noticeId  → toggle bookmark on a notice
 * DELETE /api/bookmarks/:noticeId  → remove bookmark
 */
const router = require("express").Router();
const pool = require("../config/db");
const { authenticate } = require("../middleware/auth");

// All bookmark routes require authentication
router.use(authenticate);

// ── Get user's bookmarked notices ──
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT n.*, b.created_at AS bookmarked_at
       FROM bookmarks b
       JOIN notices n ON b.notice_id = n.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json({ bookmarks: result.rows });
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

// ── Toggle bookmark (add if not exists, remove if exists) ──
router.post("/:noticeId", async (req, res) => {
  try {
    const { noticeId } = req.params;

    // Check if bookmark exists
    const existing = await pool.query(
      "SELECT id FROM bookmarks WHERE user_id = $1 AND notice_id = $2",
      [req.user.id, noticeId]
    );

    if (existing.rows.length > 0) {
      // Remove bookmark
      await pool.query(
        "DELETE FROM bookmarks WHERE user_id = $1 AND notice_id = $2",
        [req.user.id, noticeId]
      );
      return res.json({ bookmarked: false, message: "Bookmark removed" });
    }

    // Add bookmark
    await pool.query(
      "INSERT INTO bookmarks (user_id, notice_id) VALUES ($1, $2)",
      [req.user.id, noticeId]
    );

    res.status(201).json({ bookmarked: true, message: "Bookmark added" });
  } catch (err) {
    console.error("Error toggling bookmark:", err);
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
});

// ── Remove bookmark ──
router.delete("/:noticeId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM bookmarks WHERE user_id = $1 AND notice_id = $2 RETURNING id",
      [req.user.id, req.params.noticeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    res.json({ message: "Bookmark removed" });
  } catch (err) {
    console.error("Error removing bookmark:", err);
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
});

// ── Check if a notice is bookmarked ──
router.get("/check/:noticeId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id FROM bookmarks WHERE user_id = $1 AND notice_id = $2",
      [req.user.id, req.params.noticeId]
    );

    res.json({ bookmarked: result.rows.length > 0 });
  } catch (err) {
    console.error("Error checking bookmark:", err);
    res.status(500).json({ error: "Failed to check bookmark" });
  }
});

module.exports = router;
