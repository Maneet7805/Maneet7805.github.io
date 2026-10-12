/* ──────────────────────────────────────────────────────────────────────────
   ALL SITE CONTENT LIVES HERE. Components only read from this file.

   Rule: nothing is invented. Sources, in order of priority:
   1. "CV Maneet Mehta Latest.pdf" (the résumé)
   2. LinkedIn (linkedin.com/in/maneet-arvind-mehta), for what the CV hasn't
      caught up with yet: the Cloudify Asia internship, Spark CRM, AWS badges,
      full education history.
   Deliberately NOT published: phone number, passport number, and the
   referees' email addresses from the CV.
   Empty arrays remove their section and nav link automatically.
   ────────────────────────────────────────────────────────────────────────── */

export type Family = "Languages" | "Frontend" | "Backend" | "Databases" | "Cloud & DevOps" | "AI & Data" | "Tools" | "Concepts";

export type Skill = {
  name: string;
  symbol: string; // 1–2 letters, periodic-table style
  family: Family;
  logo: string; // key into TechLogo's BRAND or CONCEPT map
};

export type Mock = "crm" | "game" | "lms" | "terminal" | "medical" | "chart" | "db";

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: string[]; // skill names; must match SKILLS[].name to get a logo
  link?: string;
  mock: Mock;
};

export type TimelineStop = {
  start: number; // for chronological sorting
  year: string;
  title: string;
  place: string;
  detail?: string;
  kind: "education" | "experience";
};

export type Certification = { title: string; issuer: string; date: string; href?: string };

export type Achievement = {
  logo: string; // TechLogo key
  label: string;
  caption: string;
  detail?: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

/* ── Profile ─────────────────────────────────────────────────────────────── */
export const PROFILE = {
  name: "Maneet Arvind Mehta",
  firstName: "Maneet",
  initials: "MM",
  role: "Computer Science Student", // CV title
  roleLine: "Software Development Intern at Cloudify Asia, May – Aug 2026", // LinkedIn
  // CV summary, verbatim.
  summary:
    "Curious and adaptable computer science student with a passion for exploring new ideas and learning through hands-on experiences. Thrives when tackling challenges and enjoys finding creative solutions. Known for persistence, a positive attitude, and the ability to collaborate effectively in teams. Eager to contribute, grow, and make an impact in any environment.",
  // LinkedIn experience entry, condensed.
  secondLine: "Most recently, I built and deployed Spark CRM into production during my internship at Cloudify Asia.",
  // Paraphrase of his own LinkedIn post ("A feature isn't complete when it works, it's complete when people use it").
  quote: "A feature isn't finished when it works. It's finished when people use it.",
  location: "Kuala Lumpur, Malaysia",
  email: "maneet.arvind@gmail.com",
  github: "https://github.com/Maneet7805",
  linkedin: "https://www.linkedin.com/in/maneet-arvind-mehta",
  // Set to "/resume.pdf" once an updated CV (internship added, referees removed) is in /public.
  resume: null as string | null,
  hero: {
    // Flip to true after running scripts/build-hero-assets.py (creates public/hero/*).
    videoReady: true,
    mp4: "/hero/hero.mp4",
    webm: "/hero/hero.webm",
    poster: "/hero/poster.jpg",
  },
  portrait: "/portrait-bust.webp" as string | null, // made by scripts/build-hero-assets.py from the intro video
  idCard: {
    idNo: "MANEET7805",
    dept: "Computer Science",
    validTill: "2027", // LinkedIn: Jul 2024 – Jul 2027
    back: [
      "Computer Science student, APU × De Montfort",
      "Year 1 CGPA 3.67",
      "Software Development Intern, Cloudify Asia",
      "Built Spark CRM, LearnSphere and The Last Christmas Run",
      "Red Hat System Administration I & II · AWS Academy Graduate ×2",
    ],
  },
  quickFacts: [
    { label: "Location", value: "Kuala Lumpur, Malaysia" },
    { label: "Education", value: "BSc (Hons) Computer Science · APU × De Montfort University" },
    { label: "Latest role", value: "Software Development Intern · Cloudify Asia" },
    { label: "Email", value: "maneet.arvind@gmail.com" },
  ],
};

/* ── Skills: CV skills list + skills LinkedIn attaches to his projects ────── */
export const SKILLS: Skill[] = [
  // Languages
  { name: "Python", symbol: "Py", family: "Languages", logo: "python" },
  { name: "Java", symbol: "Ja", family: "Languages", logo: "java" },
  { name: "C", symbol: "C", family: "Languages", logo: "c" },
  { name: "C++", symbol: "Cp", family: "Languages", logo: "cplusplus" },
  { name: "C#", symbol: "Cs", family: "Languages", logo: "csharp" },
  { name: "R", symbol: "R", family: "Languages", logo: "r" },
  { name: "JavaScript", symbol: "Js", family: "Languages", logo: "javascript" },
  { name: "TypeScript", symbol: "Ts", family: "Languages", logo: "typescript" },
  { name: "SQL", symbol: "Sq", family: "Languages", logo: "sql" },
  { name: "Assembly (NASM, TASM)", symbol: "As", family: "Languages", logo: "asm" },
  // Frontend
  { name: "React", symbol: "Re", family: "Frontend", logo: "react" },
  { name: "Next.js", symbol: "Nx", family: "Frontend", logo: "nextjs" },
  { name: "HTML", symbol: "Ht", family: "Frontend", logo: "html5" },
  { name: "CSS", symbol: "Ss", family: "Frontend", logo: "css3" },
  { name: "Tailwind CSS", symbol: "Tw", family: "Frontend", logo: "tailwindcss" },
  // Backend
  { name: "ASP.NET", symbol: "An", family: "Backend", logo: "dotnetcore" },
  { name: "Entity Framework", symbol: "Ef", family: "Backend", logo: "entityframeworkcore" },
  { name: "REST APIs", symbol: "Ra", family: "Backend", logo: "api" },
  { name: "BullMQ", symbol: "Bq", family: "Backend", logo: "queue" },
  // Databases
  { name: "PostgreSQL", symbol: "Pq", family: "Databases", logo: "postgresql" },
  { name: "MySQL", symbol: "My", family: "Databases", logo: "mysql" },
  { name: "SQL Server", symbol: "Ms", family: "Databases", logo: "microsoftsqlserver" },
  { name: "Redis", symbol: "Rd", family: "Databases", logo: "redis" },
  { name: "Relational Database Design", symbol: "Db", family: "Databases", logo: "schema" },
  // Cloud & DevOps
  { name: "Docker", symbol: "Dk", family: "Cloud & DevOps", logo: "docker" },
  { name: "Nginx", symbol: "Ng", family: "Cloud & DevOps", logo: "nginx" },
  { name: "Cloudflare", symbol: "Cf", family: "Cloud & DevOps", logo: "cloudflare" },
  { name: "AWS", symbol: "Aw", family: "Cloud & DevOps", logo: "amazonwebservices" },
  { name: "Red Hat Enterprise Linux", symbol: "Rh", family: "Cloud & DevOps", logo: "redhat" },
  { name: "Ubuntu", symbol: "Ub", family: "Cloud & DevOps", logo: "ubuntu" },
  { name: "Rocky Linux", symbol: "Rk", family: "Cloud & DevOps", logo: "linux" },
  { name: "CI/CD", symbol: "Ci", family: "Cloud & DevOps", logo: "githubactions" },
  // AI & Data
  { name: "LLMs", symbol: "Ll", family: "AI & Data", logo: "llm" },
  { name: "AI Agents", symbol: "Ai", family: "AI & Data", logo: "agent" },
  { name: "OpenCV", symbol: "Cv", family: "AI & Data", logo: "opencv" },
  { name: "NumPy", symbol: "Np", family: "AI & Data", logo: "numpy" },
  { name: "Regression Modelling", symbol: "Rg", family: "AI & Data", logo: "chart" },
  // Tools
  { name: "Git", symbol: "Gt", family: "Tools", logo: "git" },
  { name: "GitHub", symbol: "Gh", family: "Tools", logo: "github" },
  { name: "Jira", symbol: "Ji", family: "Tools", logo: "jira" },
  { name: "Pygame", symbol: "Pg", family: "Tools", logo: "game" },
  { name: "Cisco Packet Tracer", symbol: "Ct", family: "Tools", logo: "cisco" },
  { name: "VirtualBox", symbol: "Vb", family: "Tools", logo: "virtualbox" },
  // Concepts
  { name: "OOP", symbol: "Oo", family: "Concepts", logo: "oop" },
  { name: "RBAC & Auth", symbol: "Rb", family: "Concepts", logo: "lock" },
  { name: "Agile / Scrum", symbol: "Ag", family: "Concepts", logo: "agile" },
  { name: "SDLC", symbol: "Sd", family: "Concepts", logo: "cycle" },
  { name: "Networking", symbol: "Nw", family: "Concepts", logo: "network" },
];

export const SKILL_GROUPS: Family[] = ["Languages", "Frontend", "Backend", "Databases", "Cloud & DevOps", "AI & Data", "Tools", "Concepts"];

/* ── Projects ────────────────────────────────────────────────────────────── */
export const PROJECTS: Project[] = [
  {
    slug: "spark-crm",
    title: "Spark CRM",
    kicker: "Internship · in production",
    description:
      "Built and deployed a CRM from scratch into production at Cloudify Asia, across frontend, backend, database, AI, integrations and deployment. A customer PO arrived within 12 hours of a Spark quotation, Cloudify's fastest turnaround yet.",
    features: [
      "Lead → Quotation → Sales Order flow",
      "AI agent with controlled tool calling",
      "AI vendor-sheet & card extraction",
      "Gmail & Outlook integrations",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Redis", "BullMQ", "REST APIs", "Docker", "Nginx", "Cloudflare", "CI/CD", "LLMs", "AI Agents", "RBAC & Auth"],
    mock: "crm",
  },
  {
    slug: "last-christmas-run",
    title: "The Last Christmas Run",
    kicker: "2D platformer · Python",
    description:
      "A 2D platformer built from scratch to practise real-time system design: frame-independent physics, a finite-state-machine boss AI and data-driven levels. Recycling off-screen entities improved runtime performance by over 40%.",
    features: [
      "Frame-independent physics",
      "Multi-phase boss AI (state machine)",
      "CSV / JSON level editor",
      "Particle effects & power-ups",
    ],
    tech: ["Python", "Pygame", "OpenCV", "NumPy", "OOP"],
    link: "https://github.com/Maneet7805/2D-Platform_Game",
    mock: "game",
  },
  {
    slug: "learnsphere",
    title: "LearnSphere",
    kicker: "Learning management system",
    description:
      "A full-stack academic platform for students, lecturers and admins, built with ASP.NET Web Forms and C#, with role-based access, Google OAuth, automated quiz grading and SendGrid email notifications.",
    features: [
      "Role-based portals (ASP.NET Identity)",
      "Google OAuth sign-in",
      "Auto-graded quizzes & assignments",
      "Email alerts via SendGrid",
    ],
    tech: ["C#", "ASP.NET", "Entity Framework", "SQL Server", "JavaScript", "HTML", "CSS", "RBAC & Auth"],
    link: "https://github.com/Maneet7805/Learning-Management-System",
    mock: "lms",
  },
  {
    slug: "sysadmin-labs",
    title: "System & Network Admin Labs",
    kicker: "Rocky & Ubuntu",
    description:
      "Built and managed secure, production-style server environments: DNS, DHCP, FTP/SSL, NFS, SSH, firewalls, ACLs, rsyslog, web and email servers and container platforms, then troubleshot the failures.",
    features: ["DNS · DHCP · NFS · SSH", "Firewalls & ACLs", "Web, email & FTP/SSL servers", "Service troubleshooting"],
    tech: ["Rocky Linux", "Ubuntu", "Networking"],
    mock: "terminal",
  },
  {
    slug: "medical-center",
    title: "APU Medical Center System",
    kicker: "Desktop app · Java",
    description:
      "A GUI-based medical management system for patient records, appointments and prescriptions, structured around encapsulation, inheritance, polymorphism and abstraction.",
    features: ["Patient records", "Appointments", "Prescriptions", "OOP architecture"],
    tech: ["Java", "OOP"],
    link: "https://github.com/Maneet7805/medical-center-java",
    mock: "medical",
  },
  {
    slug: "flight-delays",
    title: "Flight Delay Analysis",
    kicker: "Data analysis · R",
    description:
      "Analysed 2015 U.S. flight data with cleaning, validation and regression modelling to show how distance, airport congestion and airline performance drive delays.",
    features: ["Data cleaning", "Validation", "Regression modelling", "Delay-factor insights"],
    tech: ["R", "Regression Modelling"],
    link: "https://github.com/Maneet7805/flight-delay-analysis",
    mock: "chart",
  },
  {
    slug: "hotel-db",
    title: "Hotel Management Database",
    kicker: "Database design · MS SQL",
    description:
      "A normalised hotel management database with tables, relationships, stored procedures and optimised queries for data integrity and query efficiency.",
    features: ["Normalised schema", "Stored procedures", "Optimised queries", "Data integrity"],
    tech: ["SQL", "SQL Server", "Relational Database Design"],
    mock: "db",
  },
];

/* ── Education & experience (combined into one timeline) ──────────────────── */
export const EDUCATION: TimelineStop[] = [
  {
    start: 2011,
    year: "2011 – 2021",
    title: "Secondary School Certificate (SSC)",
    place: "Children's Academy Group of Schools",
    detail: "Grade: 95%",
    kind: "education",
  },
  {
    start: 2021,
    year: "2021 – 2023",
    title: "Higher Secondary (HSC): Physics, Chemistry, Maths & Computer Science",
    place: "Thakur College of Science & Commerce",
    kind: "education",
  },
  {
    start: 2024,
    year: "2024 – 2027",
    title: "BSc (Hons) Computer Science, dual degree",
    place: "Asia Pacific University (MY) × De Montfort University (UK)",
    detail: "Year 1 CGPA: 3.67",
    kind: "education",
  },
];

export const EXPERIENCE: TimelineStop[] = [
  {
    start: 2026,
    year: "May – Aug 2026",
    title: "Software Development Intern",
    place: "Cloudify Asia (HaaS Technologies) · Kuala Lumpur, on-site",
    detail: "Built and deployed Spark CRM into production, from requirements to deployment, integrations and real-user fixes.",
    kind: "experience",
  },
];

/* ── Certifications (LinkedIn, with Credly links) ─────────────────────────── */
export const CERTIFICATIONS: Certification[] = [
  {
    title: "AWS Academy Graduate: Machine Learning Foundations",
    issuer: "Amazon Web Services",
    date: "Oct 2026",
    href: "https://www.credly.com/badges/28dc8a6a-ed66-42bd-9e84-7441eee79124/public_url",
  },
  {
    title: "AWS Academy Graduate: Cloud Foundations",
    issuer: "Amazon Web Services",
    date: "Oct 2026",
    href: "https://www.credly.com/badges/cf81794e-51eb-4b78-a9ca-e07a2b9d6fe4/public_url",
  },
  {
    title: "Red Hat System Administration II (RH134-RHA, v9.3)",
    issuer: "Red Hat",
    date: "Jan 2026",
    href: "https://www.credly.com/badges/7e8f91b2-91e4-4e1d-b852-b1db6efd42ba/public_url",
  },
  {
    title: "Red Hat System Administration I (RH124-RHA, v9.3)",
    issuer: "Red Hat",
    date: "Sep 2025",
    href: "https://www.credly.com/badges/5b6156f7-1d6f-49cd-bb2a-a2edbec71484/public_url",
  },
];

/* ── Achievements: only numbers stated in the CV / LinkedIn ───────────────── */
export const ACHIEVEMENTS: Achievement[] = [
  {
    logo: "bolt",
    label: "Quote → PO",
    caption: "Spark CRM, in production",
    detail: "Fastest quotation-to-PO turnaround Cloudify had seen",
    value: 12,
    suffix: "h",
  },
  {
    logo: "cap",
    label: "Year 1 CGPA",
    caption: "BSc (Hons) Computer Science",
    detail: "APU × De Montfort University",
    value: 3.67,
    decimals: 2,
  },
  {
    logo: "game",
    label: "Faster runtime",
    caption: "The Last Christmas Run",
    detail: "Recycled off-screen entities with sprite groups",
    value: 40,
    prefix: "+",
    suffix: "%",
  },
  {
    logo: "redhat",
    label: "Certifications",
    caption: "Red Hat ×2 · AWS Academy ×2",
    detail: "System administration, cloud and ML foundations",
    value: 4,
  },
  {
    logo: "cap",
    label: "SSC grade",
    caption: "Children's Academy Group of Schools",
    value: 95,
    suffix: "%",
  },
];

/* ── Navigation & section order (derived; empty sections drop out) ──────── */
export type SectionId = "about" | "skills" | "work" | "certifications" | "experience" | "achievements" | "contact";

const ORDER: { id: SectionId; label: string; inNav: boolean; has: boolean }[] = [
  { id: "about", label: "About", inNav: true, has: true },
  { id: "skills", label: "Skills", inNav: true, has: SKILLS.length > 0 },
  { id: "work", label: "Work", inNav: true, has: PROJECTS.length > 0 },
  { id: "certifications", label: "Certifications", inNav: false, has: CERTIFICATIONS.length > 0 },
  { id: "experience", label: "Experience", inNav: true, has: EDUCATION.length + EXPERIENCE.length > 0 },
  { id: "achievements", label: "Achievements", inNav: true, has: ACHIEVEMENTS.length > 0 },
  { id: "contact", label: "Contact", inNav: true, has: true },
];

export const SECTIONS = ORDER.filter((s) => s.has).map((s, i) => ({
  ...s,
  index: String(i + 1).padStart(2, "0"),
}));

export const NAV = SECTIONS.filter((s) => s.inNav).map(({ id, label }) => ({ id, label }));

export const has = (id: SectionId) => SECTIONS.some((s) => s.id === id);

export function sectionTag(id: SectionId) {
  return SECTIONS.find((s) => s.id === id)?.index ?? "";
}

export function projectsUsing(skill: string) {
  return PROJECTS.filter((p) => p.tech.includes(skill)).map((p) => p.title);
}

export function skillByName(name: string) {
  return SKILLS.find((s) => s.name === name);
}
