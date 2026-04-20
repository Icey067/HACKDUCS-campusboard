/**
 * Seed file — populates the database with 30 realistic Indian college notices.
 * Run with: npm run seed
 *
 * Creates a demo admin user and 30 notices spanning DU fests, IIT hackathons,
 * research internships, startup opportunities, and campus notices.
 */
const pool = require("../config/db");

const seedData = async () => {
  try {
    console.log("🌱 Seeding database...\n");

    // ── Create demo admin user ──
    const adminResult = await pool.query(
      `INSERT INTO users (name, email, google_id, is_admin)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_id) DO UPDATE SET is_admin = true
       RETURNING id`,
      ["CampusBoard Admin", "admin@campusboard.in", "demo-admin-001", true]
    );
    const adminId = adminResult.rows[0].id;
    console.log("  ✅ Admin user created");

    // ── Seed Notices (30 realistic Indian college notices) ──
    const notices = [
      // ── FESTS ──
      {
        title: "Reverie 2026 — Annual Cultural Fest",
        college: "Kirori Mal College, Delhi University",
        domain: "fest",
        deadline: "2026-05-10",
        apply_link: "https://reverie-kmc.in/register",
        description:
          "Reverie is back! 3 days of music, dance, drama, art, and literary events. Featuring performances by Nucleya and The Local Train. Open to all Delhi University students. Cash prizes worth ₹5 lakhs. Register with your college ID.",
      },
      {
        title: "Mecca 2026 — DTU Annual Tech Fest",
        college: "Delhi Technological University",
        domain: "fest",
        deadline: "2026-04-28",
        apply_link: "https://dtumecca.in",
        description:
          "DTU's flagship tech fest with 30+ events including robotics, coding, CAD design, and quizzing. Prize pool of ₹8 lakhs. Workshops by Google & Microsoft engineers. Free entry with college ID.",
      },
      {
        title: "Mood Indigo 2026 — Asia's Largest College Fest",
        college: "IIT Bombay",
        domain: "fest",
        deadline: "2026-06-15",
        apply_link: "https://moodi.org/register",
        description:
          "Asia's largest college cultural festival. 4 days of events spanning art, music, dance, comedy, and workshops. Past headliners include AR Rahman, Prateek Kuhad, and Zakir Khan. Travel reimbursement available for outstation participants.",
      },
      {
        title: "Saarang 2026 — Cultural Festival",
        college: "IIT Madras",
        domain: "fest",
        deadline: "2026-05-20",
        apply_link: "https://saarang.org",
        description:
          "South India's largest cultural fest with 100+ events. Competitions in classical music, western dance, filmmaking, and debating. Accommodation provided for participants travelling from other cities. ₹10 lakh total prize pool.",
      },

      // ── HACKATHONS ──
      {
        title: "Smart India Hackathon 2026 — Grand Finale",
        college: "Ministry of Education, Govt. of India",
        domain: "hackathon",
        deadline: "2026-05-01",
        apply_link: "https://sih.gov.in/register",
        description:
          "India's biggest hackathon organized by the Government. Build solutions for real-world problems across 10 themes: healthcare, agriculture, smart cities, fintech, and more. Winning teams get ₹1 lakh + internship opportunities with govt. bodies.",
      },
      {
        title: "HackDTU 6.0 — 36-Hour Hackathon",
        college: "Delhi Technological University",
        domain: "hackathon",
        deadline: "2026-04-25",
        apply_link: "https://hackdtu.tech",
        description:
          "DTU's flagship hackathon. 36 hours of building, learning, and hacking. Tracks: AI/ML, Web3, Sustainability, HealthTech. Sponsors include GitHub, Polygon, and Devfolio. Swag, food, and mentorship included. Teams of 2-4.",
      },
      {
        title: "Hack36 — IIT BHU's Annual Hackathon",
        college: "IIT BHU Varanasi",
        domain: "hackathon",
        deadline: "2026-05-05",
        apply_link: "https://hack36.com",
        description:
          "36-hour offline hackathon at IIT BHU. Open tracks with prizes worth ₹3 lakh. Industry mentors from Amazon, Flipkart, and Razorpay. Travel reimbursement for selected teams. Free meals and accommodation on campus.",
      },
      {
        title: "CodeUtsava 7.0 — NIT Raipur Hackathon",
        college: "NIT Raipur",
        domain: "hackathon",
        deadline: "2026-05-12",
        apply_link: "https://codeutsava.in",
        description:
          "Open-source hackathon with real GitHub bounties. Contribute to open source projects mentored by maintainers from CNCF, Mozilla, and CircleCI. Best contributions win goodies + certificates.",
      },
      {
        title: "KJSCE Hack 8.0",
        college: "KJ Somaiya College of Engineering, Mumbai",
        domain: "hackathon",
        deadline: "2026-04-30",
        apply_link: "https://kjscehack.com",
        description:
          "Mumbai's premier student hackathon. 24 hours to build MVPs. Theme tracks: EdTech, FinTech, GreenTech. Top prize ₹50,000. MLH affiliated event with global swag packs.",
      },

      // ── INTERNSHIPS ──
      {
        title: "SDE Intern — Razorpay (Summer 2026)",
        college: "Razorpay (Open for all colleges)",
        domain: "internship",
        deadline: "2026-04-22",
        apply_link: "https://razorpay.com/careers/intern",
        description:
          "6-month SDE internship at Razorpay Bangalore. Work on payment infrastructure serving millions of merchants. Stipend: ₹80,000/month. Requirements: DSA, any backend language (Go/Java/Python), and familiarity with distributed systems.",
      },
      {
        title: "Product Design Intern — CRED",
        college: "CRED (Open for all colleges)",
        domain: "internship",
        deadline: "2026-05-01",
        apply_link: "https://careers.cred.club/internships",
        description:
          "3-month design internship at CRED Bangalore. Work with the product team on UI/UX for India's most premium fintech app. Stipend: ₹60,000/month. Must submit a portfolio + design challenge.",
      },
      {
        title: "Data Science Intern — Meesho",
        college: "Meesho (Open for all colleges)",
        domain: "internship",
        deadline: "2026-04-30",
        apply_link: "https://meesho.io/careers",
        description:
          "Summer internship in Meesho's data science team. Build recommendation systems and demand forecasting models. Stipend: ₹70,000/month + PPO opportunity. Requirements: Python, SQL, basic ML.",
      },
      {
        title: "Frontend Intern — Zerodha",
        college: "Zerodha (Open for all colleges)",
        domain: "internship",
        deadline: "2026-05-15",
        apply_link: "https://zerodha.com/careers",
        description:
          "Remote frontend internship at Zerodha. Work on Kite — India's most-used trading platform. Stipend: ₹50,000/month. Strong React/JS skills required. 3-month commitment.",
      },
      {
        title: "Campus Ambassador — Unstop",
        college: "Unstop (Open for all colleges)",
        domain: "internship",
        deadline: "2026-05-08",
        apply_link: "https://unstop.com/campus-ambassador",
        description:
          "Become Unstop's campus representative. Organize events, spread awareness, and earn perks including cash rewards, certificates, and goodies. Flexible hours — perfect for first-year students looking for experience.",
      },
      {
        title: "Backend Intern — Groww",
        college: "Groww (Open for all colleges)",
        domain: "internship",
        deadline: "2026-05-10",
        apply_link: "https://groww.in/careers",
        description:
          "6-month backend internship at Groww Bangalore. Work on microservices handling millions of investment transactions. Stipend: ₹75,000/month. Java/Spring Boot experience preferred.",
      },

      // ── RESEARCH ──
      {
        title: "SURGE 2026 — Summer Research Fellowship",
        college: "IIT Kanpur",
        domain: "research",
        deadline: "2026-04-25",
        apply_link: "https://surge.iitk.ac.in",
        description:
          "8-week summer research program at IIT Kanpur. Work with faculty on cutting-edge research in CS, EE, Mechanical, or Sciences. Stipend: ₹15,000/month + free hostel. Open to 2nd and 3rd year undergraduate students from any recognized university.",
      },
      {
        title: "IISC Summer Research Fellowship",
        college: "Indian Institute of Science, Bangalore",
        domain: "research",
        deadline: "2026-04-28",
        apply_link: "https://www.iisc.ac.in/summer-fellowships",
        description:
          "Prestigious 2-month research fellowship at IISc. Departments: CSA, ECE, CDS, Physics, Biology. Fellowship: ₹10,000/month + accommodation. Ideal for students planning to pursue a research career. CGPA 8.0+ preferred.",
      },
      {
        title: "IITD Summer Research Internship (SRI)",
        college: "IIT Delhi",
        domain: "research",
        deadline: "2026-05-05",
        apply_link: "https://sri.iitd.ac.in",
        description:
          "6-8 week summer research internship at IIT Delhi. Projects available in AI/ML, cybersecurity, renewable energy, and biomedical engineering. Stipend: ₹12,000/month. Open to pre-final year students from NAAC A+ colleges.",
      },
      {
        title: "JNCASR Summer Research Fellowship",
        college: "Jawaharlal Nehru Centre for Advanced Scientific Research",
        domain: "research",
        deadline: "2026-05-10",
        apply_link: "https://www.jncasr.ac.in/sfp",
        description:
          "2-month research fellowship at JNCASR Bangalore. Work in chemistry, physics, materials science, or neuroscience labs. Fellowship of ₹10,000/month + hostel. Strong academic record required.",
      },
      {
        title: "MITACS Globalink Research Internship 2027",
        college: "MITACS (Canadian Universities)",
        domain: "research",
        deadline: "2026-06-01",
        apply_link: "https://www.mitacs.ca/globalink",
        description:
          "Fully funded 12-week research internship at top Canadian universities (UBC, McGill, UofT, Waterloo). Covers flights, stipend ($6,000 CAD), and health insurance. Open to Indian undergrads in STEM. Highly competitive — strong SOP needed.",
      },

      // ── CAMPUS NOTICES ──
      {
        title: "DU SOL Exam Date Sheet Released — May 2026",
        college: "Delhi University — School of Open Learning",
        domain: "notice",
        deadline: "2026-05-20",
        apply_link: "https://sol.du.ac.in/exams",
        description:
          "SOL has released the date sheet for May 2026 examinations. BA Programme, B.Com, and BA (Hons) exams start from May 15. Download admit cards from the SOL portal. Last date to download: May 10.",
      },
      {
        title: "DUSU Elections 2026 — Nominations Open",
        college: "Delhi University Students' Union",
        domain: "notice",
        deadline: "2026-04-30",
        apply_link: "https://du.ac.in/dusu-elections",
        description:
          "Nominations are open for DUSU Elections 2026. Posts: President, Vice President, Secretary, Joint Secretary. Candidates must be enrolled DU students with no active backlogs. Last date for filing nominations: April 30.",
      },
      {
        title: "Anti-Ragging Committee Notice",
        college: "Delhi University (All Colleges)",
        domain: "notice",
        deadline: null,
        apply_link: "https://du.ac.in/anti-ragging",
        description:
          "All students are reminded to fill the mandatory anti-ragging affidavit on antiragging.in. Failure to submit will result in admission cancellation. Helpline: 1800-180-5522. Zero tolerance policy in effect.",
      },
      {
        title: "Library Timings Extended for Exams",
        college: "Hindu College, Delhi University",
        domain: "notice",
        deadline: "2026-05-31",
        apply_link: null,
        description:
          "Hindu College library will remain open from 8:00 AM to 11:00 PM during the exam period (May 1 — May 31). Book issuing extended to 5 books per student. Valid college ID mandatory for entry after 7 PM.",
      },
      {
        title: "Placement Cell — TCS Recruitment (2026 Batch)",
        college: "Hansraj College, Delhi University",
        domain: "notice",
        deadline: "2026-04-27",
        apply_link: "https://hansrajcollege.ac.in/placement-tcs",
        description:
          "TCS is recruiting from Hansraj College for the 2026 batch. Eligible: B.Sc (CS/Maths/Stats), B.Com (Hons). Package: ₹3.36 - 7 LPA. Register on TCS NextStep portal and submit college placement form by April 27.",
      },
      {
        title: "NSS Camp Registration — Summer 2026",
        college: "Miranda House, Delhi University",
        domain: "notice",
        deadline: "2026-05-05",
        apply_link: "https://mirandahouse.ac.in/nss",
        description:
          "7-day NSS residential camp in Sonipat, Haryana. Activities include village teaching, health awareness drives, and cleanliness campaigns. Registration fee: ₹200. Certificates issued for 120+ hours of service.",
      },
      {
        title: "CBCS to NEP Transition — Important Update",
        college: "Delhi University (All Colleges)",
        domain: "notice",
        deadline: null,
        apply_link: "https://du.ac.in/nep-transition",
        description:
          "Important notice regarding the transition from CBCS to NEP 2020 framework. Students admitted in 2023-24 will follow the NEP curriculum from 3rd year. Check your department notice board for subject mapping and credit transfer details.",
      },
      {
        title: "Google Developer Student Clubs — Lead Applications",
        college: "NSUT, Delhi",
        domain: "notice",
        deadline: "2026-05-15",
        apply_link: "https://gdsc.community.dev/nsut",
        description:
          "Apply to become the GDSC Lead for NSUT (2026-27 batch). Responsibilities include organizing workshops, hackathons, and study jams. Perks: Google swag, Cloud credits, and direct mentorship from Google Developer Experts.",
      },
      {
        title: "Entrepreneurship Cell — Startup Pitch Competition",
        college: "Shaheed Sukhdev CBS, Delhi University",
        domain: "hackathon",
        deadline: "2026-05-08",
        apply_link: "https://ecell-sscbs.in/pitch",
        description:
          "Pitch your startup idea to a panel of VCs and angel investors. Top 3 ideas win seed funding up to ₹2 lakhs + 3-month incubation at SSCBS E-Cell. Open to all DU students. Solo or team (max 3) entries accepted.",
      },
      {
        title: "AWS Cloud Computing Workshop — Free Certification",
        college: "IGDTUW, Delhi",
        domain: "notice",
        deadline: "2026-05-03",
        apply_link: "https://igdtuw.ac.in/aws-workshop",
        description:
          "Free 2-day AWS Cloud Computing workshop with hands-on labs. Topics: EC2, S3, Lambda, DynamoDB. Participants get free AWS Certified Cloud Practitioner exam voucher worth $100. Limited to 100 seats — first come first served.",
      },
    ];

    // Insert all notices
    for (const notice of notices) {
      await pool.query(
        `INSERT INTO notices (title, college, domain, deadline, apply_link, description, posted_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          notice.title,
          notice.college,
          notice.domain,
          notice.deadline,
          notice.apply_link,
          notice.description,
          adminId,
        ]
      );
    }

    console.log(`  ✅ Seeded ${notices.length} notices`);
    console.log("\n🎉 Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seedData();
