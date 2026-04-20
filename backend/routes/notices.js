/**
 * Notice routes — public feed with filtering, search, and detail view.
 *
 * GET  /api/notices          → list notices (with filters & search)
 * GET  /api/notices/:id      → single notice detail
 * POST /api/notices          → create notice (admin only)
 * PUT  /api/notices/:id      → update notice (admin only)
 * DELETE /api/notices/:id    → delete notice (admin only)
 */
const router = require("express").Router();
const pool = require("../config/db");
const { authenticate } = require("../middleware/auth");

// ── List notices with filtering, search & pagination ──
router.get("/", async (req, res) => {
  try {
    const {
      domain,
      college,
      search,
      deadline, // "upcoming" | "this_week" | "this_month"
      sort = "newest", // "newest" | "deadline"
      page = 1,
      limit = 20,
    } = req.query;

    let query = "SELECT * FROM notices WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    // Filter by domain
    if (domain) {
      query += ` AND domain = $${paramIndex++}`;
      params.push(domain);
    }

    // Filter by college (case-insensitive partial match)
    if (college) {
      query += ` AND college ILIKE $${paramIndex++}`;
      params.push(`%${college}%`);
    }

    // Keyword search across title and description
    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Deadline filters
    if (deadline === "upcoming") {
      query += ` AND deadline >= CURRENT_DATE`;
    } else if (deadline === "this_week") {
      query += ` AND deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'`;
    } else if (deadline === "this_month") {
      query += ` AND deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'`;
    }

    // Sorting
    if (sort === "deadline") {
      query += ` ORDER BY deadline ASC NULLS LAST`;
    } else {
      query += ` ORDER BY posted_at DESC`;
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), offset);

    const result = await pool.query(query, params);

    // Get total count for pagination metadata
    let countQuery = "SELECT COUNT(*) FROM notices WHERE 1=1";
    const countParams = [];
    let cParamIndex = 1;

    if (domain) {
      countQuery += ` AND domain = $${cParamIndex++}`;
      countParams.push(domain);
    }
    if (college) {
      countQuery += ` AND college ILIKE $${cParamIndex++}`;
      countParams.push(`%${college}%`);
    }
    if (search) {
      countQuery += ` AND (title ILIKE $${cParamIndex} OR description ILIKE $${cParamIndex})`;
      countParams.push(`%${search}%`);
      cParamIndex++;
    }
    if (deadline === "upcoming") {
      countQuery += ` AND deadline >= CURRENT_DATE`;
    } else if (deadline === "this_week") {
      countQuery += ` AND deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'`;
    } else if (deadline === "this_month") {
      countQuery += ` AND deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      notices: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Error fetching notices:", err);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

// ── Get single notice ──
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notices WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json({ notice: result.rows[0] });
  } catch (err) {
    console.error("Error fetching notice:", err);
    res.status(500).json({ error: "Failed to fetch notice" });
  }
});

// ── Create notice (admin only) ──
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, college, domain, deadline, apply_link, description } =
      req.body;

    // Validate required fields
    if (!title || !college || !domain) {
      return res
        .status(400)
        .json({ error: "Title, college, and domain are required" });
    }

    const result = await pool.query(
      `INSERT INTO notices (title, college, domain, deadline, apply_link, description, posted_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, college, domain, deadline || null, apply_link, description, req.user.id]
    );

    res.status(201).json({ notice: result.rows[0] });
  } catch (err) {
    console.error("Error creating notice:", err);
    res.status(500).json({ error: "Failed to create notice" });
  }
});

// ── Update notice (admin only) ──
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { title, college, domain, deadline, apply_link, description } =
      req.body;

    const result = await pool.query(
      `UPDATE notices
       SET title = COALESCE($1, title),
           college = COALESCE($2, college),
           domain = COALESCE($3, domain),
           deadline = COALESCE($4, deadline),
           apply_link = COALESCE($5, apply_link),
           description = COALESCE($6, description)
       WHERE id = $7
       RETURNING *`,
      [title, college, domain, deadline, apply_link, description, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json({ notice: result.rows[0] });
  } catch (err) {
    console.error("Error updating notice:", err);
    res.status(500).json({ error: "Failed to update notice" });
  }
});

// ── Delete notice (admin only) ──
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM notices WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json({ message: "Notice deleted" });
  } catch (err) {
    console.error("Error deleting notice:", err);
    res.status(500).json({ error: "Failed to delete notice" });
  }
});

module.exports = router;
