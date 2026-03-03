export const JOB_TAGS: string[] = [
    // ── Frontend ──────────────────────────────────────────────────────────────
    "React", "Next.js", "Vue.js", "Angular", "Svelte", "TypeScript", "JavaScript",
    "HTML", "CSS", "Tailwind CSS", "Bootstrap", "SASS/SCSS", "Redux", "Zustand",
    "React Query", "GraphQL", "REST API", "Webpack", "Vite",

    // ── Backend ───────────────────────────────────────────────────────────────
    "Node.js", "Express.js", "NestJS", "Django", "FastAPI", "Flask", "Laravel",
    "Spring Boot", "ASP.NET", ".NET Core", "Ruby on Rails", "Go (Golang)", "Rust",
    "PHP", "Python", "Java", "C#", "C++", "Kotlin",

    // ── Mobile ────────────────────────────────────────────────────────────────
    "iOS", "Android", "Swift", "SwiftUI", "React Native", "Flutter", "Dart",

    // ── Database ──────────────────────────────────────────────────────────────
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Cassandra", "DynamoDB",
    "Elasticsearch", "Prisma", "TypeORM", "Sequelize",

    // ── DevOps & Cloud ────────────────────────────────────────────────────────
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins",
    "GitHub Actions", "Terraform", "Ansible", "Linux", "Nginx", "Serverless",

    // ── AI / ML / Data ────────────────────────────────────────────────────────
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
    "NLP", "Computer Vision", "Data Science", "Data Engineering", "Data Analysis",
    "Power BI", "Tableau", "Pandas", "NumPy", "Spark", "Hadoop", "ETL",
    "LLM", "Prompt Engineering", "AI Integration",

    // ── Security ──────────────────────────────────────────────────────────────
    "Cybersecurity", "Penetration Testing", "Network Security", "OWASP",
    "Ethical Hacking", "Cloud Security", "SOC",

    // ── Architecture & Misc Tech ──────────────────────────────────────────────
    "Microservices", "API Development", "WebSocket", "gRPC", "Blockchain",
    "Web3", "Smart Contracts", "Solidity", "Open Source", "Agile Development",

    // ── Design ────────────────────────────────────────────────────────────────
    "UI Design", "UX Design", "Figma", "Adobe XD", "Sketch", "Photoshop",
    "Illustrator", "User Research", "Wireframing", "Prototyping", "Motion Design",
    "Brand Design", "Graphic Design", "Visual Design", "Design Systems",

    // ── Project & Product ─────────────────────────────────────────────────────
    "Product Management", "Project Management", "Agile", "Scrum", "Kanban",
    "JIRA", "Confluence", "Roadmapping", "OKRs", "Stakeholder Management",
    "Requirement Analysis", "Business Analysis",

    // ── QA & Testing ──────────────────────────────────────────────────────────
    "QA Engineering", "Manual Testing", "Automated Testing", "Selenium",
    "Cypress", "Jest", "Playwright", "Test Driven Development", "Load Testing",

    // ── Finance & Accounting ──────────────────────────────────────────────────
    "Accounting", "Financial Analysis", "Bookkeeping", "Taxation", "Auditing",
    "Budget Management", "Cost Accounting", "Financial Reporting", "GAAP", "IFRS",
    "Payroll Processing", "Accounts Payable", "Accounts Receivable",
    "Treasury Management", "Financial Modeling", "Forecasting", "ERP",
    "QuickBooks", "SAP", "Oracle Financials", "Investment Analysis",

    // ── Banking & Finance ─────────────────────────────────────────────────────
    "Banking Operations", "Credit Analysis", "Risk Management", "Loan Processing",
    "KYC/AML", "Capital Markets", "Trade Finance", "Islamic Banking",
    "Wealth Management", "Insurance", "Actuarial", "Stock Market",

    // ── Marketing ─────────────────────────────────────────────────────────────
    "Digital Marketing", "SEO", "SEM", "Google Ads", "Facebook Ads",
    "Social Media Marketing", "Content Marketing", "Email Marketing",
    "Copywriting", "Brand Strategy", "Growth Hacking", "CRO",
    "Google Analytics", "Marketing Automation", "Influencer Marketing",
    "Video Marketing", "Affiliate Marketing", "Performance Marketing",
    "Market Research", "Campaign Management", "HubSpot", "Mailchimp",

    // ── Sales ─────────────────────────────────────────────────────────────────
    "Sales", "B2B Sales", "B2C Sales", "Inside Sales", "Field Sales",
    "Business Development", "Account Management", "Key Account Management",
    "Partnership Development", "CRM", "Salesforce", "Cold Calling",
    "Lead Generation", "Sales Strategy", "Upselling", "Negotiation",
    "Retail Sales", "Channel Sales",

    // ── Customer Service ──────────────────────────────────────────────────────
    "Customer Support", "Customer Success", "Customer Experience",
    "Technical Support", "Help Desk", "Live Chat Support", "Call Center",
    "Complaint Resolution", "Service Delivery",

    // ── Human Resources ───────────────────────────────────────────────────────
    "HR Management", "Recruitment", "Talent Acquisition", "Onboarding",
    "HR Policies", "Employee Relations", "Performance Management",
    "Compensation & Benefits", "Training & Development", "HRIS",
    "Workforce Planning", "Organizational Development",

    // ── Operations & Supply Chain ─────────────────────────────────────────────
    "Operations Management", "Supply Chain", "Logistics", "Procurement",
    "Inventory Management", "Vendor Management", "Warehouse Management",
    "Import/Export", "Quality Control", "Process Improvement", "Lean",
    "Six Sigma", "ERP Systems",

    // ── Administration ────────────────────────────────────────────────────────
    "Office Administration", "Executive Assistant", "Data Entry",
    "Document Management", "Scheduling", "Coordination", "Reception",

    // ── Legal & Compliance ────────────────────────────────────────────────────
    "Legal Research", "Contract Management", "Compliance", "Corporate Law",
    "Labour Law", "Intellectual Property", "Legal Drafting", "Regulatory Affairs",

    // ── Healthcare ────────────────────────────────────────────────────────────
    "Nursing", "Medical Officer", "Pharmacy", "Public Health", "Telemedicine",
    "Healthcare Administration", "Clinical Research", "Radiology",
    "Dentistry", "Mental Health", "Physiotherapy",

    // ── Education & Training ──────────────────────────────────────────────────
    "Teaching", "Curriculum Design", "E-Learning", "Corporate Training",
    "Academic Research", "Tutoring", "Instructional Design",

    // ── Media & Communication ─────────────────────────────────────────────────
    "Journalism", "Content Writing", "Technical Writing", "Editing",
    "Proofreading", "Blogging", "Scriptwriting", "Public Relations",
    "Media Relations", "Photography", "Videography", "Podcasting",

    // ── Real Estate ───────────────────────────────────────────────────────────
    "Real Estate Sales", "Property Management", "Valuation", "Leasing",

    // ── Soft Skills ───────────────────────────────────────────────────────────
    "Leadership", "Team Management", "Communication", "Problem Solving",
    "Critical Thinking", "Time Management", "Adaptability", "Teamwork",
    "Presentation Skills", "Conflict Resolution",
];
