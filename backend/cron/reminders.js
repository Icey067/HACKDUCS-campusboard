/**
 * Deadline reminder cron job.
 * Runs daily at 9 AM IST — sends email reminders for bookmarked notices
 * with deadlines in the next 2 days.
 */
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const pool = require("../config/db");

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Find bookmarks with deadlines approaching in the next 2 days
 * and send email alerts to the users.
 */
const sendDeadlineReminders = async () => {
  try {
    console.log("⏰ Running deadline reminder cron...");

    // Find bookmarks where the notice deadline is within the next 2 days
    const result = await pool.query(
      `SELECT u.email, u.name, n.title, n.college, n.domain, n.deadline, n.apply_link
       FROM bookmarks b
       JOIN users u ON b.user_id = u.id
       JOIN notices n ON b.notice_id = n.id
       WHERE n.deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 days'
       ORDER BY u.id, n.deadline`
    );

    if (result.rows.length === 0) {
      console.log("  No upcoming deadlines to remind about.");
      return;
    }

    // Group by user email
    const userReminders = {};
    for (const row of result.rows) {
      if (!userReminders[row.email]) {
        userReminders[row.email] = { name: row.name, notices: [] };
      }
      userReminders[row.email].notices.push(row);
    }

    const transporter = createTransporter();

    // Send one email per user with all their upcoming deadlines
    for (const [email, data] of Object.entries(userReminders)) {
      const noticeList = data.notices
        .map(
          (n) =>
            `• ${n.title} (${n.college}) — Deadline: ${new Date(
              n.deadline
            ).toLocaleDateString("en-IN")}${
              n.apply_link ? `\n  Apply: ${n.apply_link}` : ""
            }`
        )
        .join("\n\n");

      const mailOptions = {
        from: `"CampusBoard" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `⏰ Deadline Alert: ${data.notices.length} opportunity${
          data.notices.length > 1 ? "ies" : "y"
        } closing soon!`,
        text: `Hey ${data.name}! 👋\n\nYou have bookmarked notices with deadlines approaching:\n\n${noticeList}\n\nDon't miss out — apply now!\n\n— CampusBoard 🎓`,
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">⏰ Deadline Alert</h2>
            <p>Hey <strong>${data.name}</strong>! 👋</p>
            <p>You have bookmarked notices with deadlines approaching:</p>
            ${data.notices
              .map(
                (n) => `
              <div style="background: #f1f5f9; border-left: 4px solid #6366f1; padding: 12px 16px; margin: 12px 0; border-radius: 4px;">
                <strong>${n.title}</strong><br/>
                <span style="color: #64748b;">${n.college} • ${n.domain}</span><br/>
                <span style="color: #ef4444;">Deadline: ${new Date(
                  n.deadline
                ).toLocaleDateString("en-IN")}</span>
                ${
                  n.apply_link
                    ? `<br/><a href="${n.apply_link}" style="color: #6366f1;">Apply Now →</a>`
                    : ""
                }
              </div>`
              )
              .join("")}
            <p>Don't miss out — apply now! 🚀</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">— CampusBoard 🎓</p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`  📧 Sent reminder to ${email}`);
      } catch (emailErr) {
        console.error(`  ❌ Failed to send to ${email}:`, emailErr.message);
      }
    }

    console.log(
      `✅ Reminder cron complete. Notified ${
        Object.keys(userReminders).length
      } user(s).`
    );
  } catch (err) {
    console.error("❌ Reminder cron error:", err);
  }
};

/**
 * Schedule: every day at 9:00 AM IST (3:30 AM UTC)
 * Cron expression: minute hour day month weekday
 */
const startReminderCron = () => {
  cron.schedule("30 3 * * *", sendDeadlineReminders, {
    timezone: "Asia/Kolkata",
  });
  console.log("📅 Deadline reminder cron scheduled (daily 9:00 AM IST)");
};

module.exports = { startReminderCron, sendDeadlineReminders };
