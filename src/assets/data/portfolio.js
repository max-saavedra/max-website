/**
 * portfolio.js
 * ============
 * Central data source for the entire portfolio.
 * Edit this file to update content across all sections.
 * See DOCUMENTATION.md for detailed instructions on each section.
 */

// ---------------------------------------------------------------------------
// PERSONAL INFO
// ---------------------------------------------------------------------------
export const personal = {
  name: "Max Bruno Saavedra Monterrey",
  shortName: "Max Saavedra", // Big name shown in the hero
  // Rotating headline in the hero (scramble animation)
  roles: ["Software Engineer", "AI Specialist", "Computer Vision Researcher", "Automation Engineer"],
  title: "Software Engineer",
  specialization: "Specializing in AI",
  tagline: "Building scalable systems at the intersection of theory and practice.",
  university: "National University of San Marcos",
  degree: "Bachelor of Software Engineering",
  graduationYear: 2025,
  location: "Lima, Peru",
  email: "max.bruno.saavedra.2002@gmail.com",
  phone: [
    { label: "Mobile", number: "+51 949 978 672" },
    { label: "WhatsApp", number: "+51 920 797 644" },
  ],
  interests: "Hiking the Andes, Chess, and Sci-Fi enthusiast.",
  // Paths relative to /src/assets/profile/
  profilePhoto: "profile.png",
  petPhoto: "pet.jpg",
  cvFile: `${import.meta.env.BASE_URL}assets/cv/cv.pdf`, // Place your CV PDF in /src/assets/cv/
};

// ---------------------------------------------------------------------------
// SOCIAL LINKS
// ---------------------------------------------------------------------------
export const social = {
  github: "https://github.com/max-saavedra",
  linkedin: "https://linkedin.com/in/max-saavedra",
  blog: "https://max-saavedra-se.blogspot.com/",
  orcid: "https://orcid.org/0009-0003-7066-2499",
};

// ---------------------------------------------------------------------------
// EXPERIENCE
// To add a new experience: copy one object block, fill in the fields.
// ---------------------------------------------------------------------------
export const experience = [
  {
    id: 1,
    role: "Software Developer",
    company: "Development & Data Analysis & Reports E.I.R.L.",
    period: "Dec 2023 – Feb 2026",
    location: "Lima, Peru (San Martin de Porres)",
    description:
      "Developed and maintained automation solutions, APIs, and data systems, contributing to process optimization and intelligent system integration.",
    achievements: [
      "Designed and implemented RPA bots to automate business processes, reducing manual workload.",
      "Managed and integrated BMC Remedy APIs for enterprise service operations.",
      "Handled database operations, Linux-based server management, and system maintenance.",
      "Developed and deployed AI-based models for data analysis and automation use cases.",
      "Built and maintained automation bots to improve operational efficiency."
    ],
    tech: ["Python", "RPA", "BMC Remedy API", "Linux", "SQL", "AI/ML"]
  },
  {
    id: 2,
    role: "Software Developer",
    company: "Metatest S.A.C.",
    period: "Dec 2024 – Nov 2025",
    location: "Lima, Peru (Huachipa)",
    description:
      "Developed and maintained ERP solutions based on Odoo 14, focusing on module customization and intelligent feature integration.",
    achievements: [
      "Maintained and enhanced existing Odoo 14 modules to ensure system stability and performance.",
      "Designed and implemented new features in Odoo 14 aligned with business requirements.",
      "Developed AI-based models to support automation and data-driven functionalities within the ERP ecosystem."
    ],
    tech: ["Python", "Odoo 14", "PostgreSQL", "AI/ML"]
  },
];

// ---------------------------------------------------------------------------
// RESEARCH & PUBLICATIONS
// Format: APA citation style recommended.
// ---------------------------------------------------------------------------
export const publications = [
  {
    id: 1,
    type: "paper",
    title:
      "A Comparative Model for Pedestrian Fall Detection in Urban Environments Using YOLOv5, YOLOv8, and YOLOv11",
    authors:
      "Fabricio Chuquispuma, Max Saavedra, Lenis Wong",
    venue:
      "Revista de Investigación de Sistemas e Informática",
    year: 2025,
    doi: "https://doi.org/10.15381/risi.v18i2.31512",
    abstract:
      "This paper evaluates YOLOv5, YOLOv8, and YOLOv11 for pedestrian fall detection using a dataset of 600 images. Results show YOLOv11 achieving the highest initial mAP@0.5, while YOLOv8 outperforms after hyperparameter tuning, reaching 94.4% precision and demonstrating superior overall performance.",
    tags: ["Computer Vision", "YOLO", "Object Detection", "Urban Safety", "Deep Learning"],
  },
];

// ---------------------------------------------------------------------------
// PROJECTS
// Choose 3–4 that showcase architecture and depth.
// ---------------------------------------------------------------------------
export const projects = [
    {
    id: 1,
    name: "Intelligent Control of an Inverted Pendulum using Q-Learning",
    description:
      "Developed an interactive simulation to solve the inverted pendulum control problem using Q-learning, a classical reinforcement learning algorithm. The system learns to stabilize the pendulum through reward optimization and iterative policy improvement.",
    why:
      "Control problems like the inverted pendulum are foundational in reinforcement learning and robotics. This project was built to deeply understand how reward design and parameter tuning impact convergence and policy stability.",
    stack: ["Python", "Pygame", "Reinforcement Learning", "Q-Learning"],
    github: "https://github.com/max-saavedra/ACS2024-2-GRUPO_1",
    demo: null,
    featured: true,
  },
  {
    id: 2,
    name: "AI Dashboard – Enterprise Data Intelligence Platform",
    description:
      "Built a full-stack AI-powered analytics platform that transforms Excel/CSV datasets into dynamic dashboards through automated ETL and generative insights. The system leverages LLMs to clean data, generate visualizations, and produce executive-level summaries from natural language inputs.",
    why:
      "Most data analysis workflows require manual cleaning and technical expertise. This project was designed to democratize data intelligence by enabling non-technical users to extract insights from raw data using AI-driven automation.",
    stack: [
      "Python",
      "FastAPI",
      "Vue.js 3",
      "PostgreSQL",
      "Docker",
      "Google Cloud",
      "Supabase",
      "LLMs (Gemini, OpenAI)"
    ],
    github: "https://github.com/max-saavedra/AI-Dashboard",
    demo: "https://ai-dashboard-8jqr.vercel.app/",
    featured: true,
  },
  {
    id: 3,
    name: "AI Model Hub – Multi-Model Intelligence Platform",
    description:
      "Developed a full-stack platform for deploying and interacting with multiple AI models across different domains, including optimization, healthcare, energy forecasting, computer vision, and NLP. The system centralizes model access through a Python backend and an interactive web interface.",
    why:
      "AI solutions are often built in isolation. This project was designed to unify diverse machine learning approaches into a single platform, enabling practical experimentation and deployment of heterogeneous models in real-world scenarios.",
    stack: [
      "Python",
      "React",
      "TypeScript",
      "Vite",
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Computer Vision"
    ],
    github: "https://github.com/software-inteligente-G1/ia_hub",
    demo: null,
    featured: true,
  },
  {
    id: 4,
    name: "Acne Detection Mobile App using YOLOv8",
    description:
      "Developed a mobile application for acne detection using a YOLOv8-based computer vision model. The system processes user images through a Python backend service to identify and localize acne with real-time inference.",
    why:
      "Skin condition analysis is often subjective and inaccessible. This project was built to explore how computer vision can provide accessible and automated dermatological assistance through mobile platforms.",
    stack: [
      "Python",
      "YOLOv8",
      "Computer Vision",
      "Flutter",
      "Dart",
      "Deep Learning"
    ],
    github: "https://github.com/PopemobileFISI/acne_backend",
    demo: null,
    featured: false,
  },
];

// ---------------------------------------------------------------------------
// SKILLS
// Organized by domain. Add or remove items freely.
// ---------------------------------------------------------------------------
export const skills = {
  Systems: ["C", "C++", "Go", "Rust", "Linux", "TCP/IP", "Distributed Systems"],
  "AI & ML": ["Python", "PyTorch", "TensorFlow", "HuggingFace", "Scikit-learn", "CUDA", "Ultralitycs"],
  Backend: ["FastAPI", "Django", "Node.js", "PostgreSQL", "Redis", "gRPC", "Java"],
  Cloud: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Terraform", "CI/CD"],
  Frontend: ["Vue.js", "React", "TypeScript", "Tailwind CSS"],
  "Research & Tools": ["LaTeX", "Git", "MATLAB", "Jupyter", "Linux"],
};

// ---------------------------------------------------------------------------
// CERTIFICATIONS
// Place certificate images or PDFs in /src/assets/certificates/
// ---------------------------------------------------------------------------
export const certifications = [
  {
    id: 1,
    name: "HCIA-5G Training",
    issuer: "Huawei",
    year: 2024,
    logo: "https://upload.wikimedia.org/wikipedia/en/0/04/Huawei_Standard_logo.svg",
    file: `${import.meta.env.BASE_URL}assets/certificates/certified_hcia_5g_trainig_huawei.jpg`,
    verify: null,
  },
  {
    id: 2,
    name: "HCIA-Cloud Training",
    issuer: "Huawei",
    year: 2024,
    logo: "https://upload.wikimedia.org/wikipedia/en/0/04/Huawei_Standard_logo.svg",
    file: `${import.meta.env.BASE_URL}assets/certificates/certificado_hcia_cloud_trainig_huawei.jpg`,
    verify: null,
  },
  {
    id: 3,
    name: "HCIA-AI Training",
    issuer: "Huawei",
    year: 2024,
    logo: "https://upload.wikimedia.org/wikipedia/en/0/04/Huawei_Standard_logo.svg",
    file: `${import.meta.env.BASE_URL}assets/certificates/certificado_hcia_ia_trainig_huawei.jpg`,
    verify: null,
  },
  {
    id: 4,
    name: "Cloud Basics: Development and Basic Concepts",
    issuer: "Huawei Talent",
    year: 2025,
    logo: "https://upload.wikimedia.org/wikipedia/en/0/04/Huawei_Standard_logo.svg",
    file: `${import.meta.env.BASE_URL}assets/certificates/certified_Cloud Basics_ Development and Basic Concepts (Spanish).jpg`,
    verify: null,
  },
  {
    id: 5,
    name: "Java Fundamentals",
    issuer: "Universidad Nacional Mayor de San Marcos",
    year: 2024,
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/UNMSM_coatofarms_seal.svg",
    file: `${import.meta.env.BASE_URL}assets/certificates/constancia_fundamentos_java.jpg`,
    verify: "https://tramiteonline.unmsm.edu.pe/sgdfd/mcc/verifica/unmsm",
  },
  {
    id: 6,
    name: "Use AI as a Creative or Expert Partner",
    issuer: "Google (Coursera)",
    year: 2024,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png",
    file: `${import.meta.env.BASE_URL}assets/certificates/Coursera ACZ2UC1OZW6L.pdf`,
    verify: "https://coursera.org/verify/ACZ2UC1OZW6L",
  },
  {
    id: 7,
    name: "Speed Up Data Analysis and Presentation Building",
    issuer: "Google (Coursera)",
    year: 2024,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png",
    file: `${import.meta.env.BASE_URL}assets/certificates/Coursera Y78NX1Y3M95G.pdf`,
    verify: "https://coursera.org/verify/Y78NX1Y3M95G",
  },
  {
    id: 8,
    name: "QWorld Bronze – Qiskit",
    issuer: "QWorld",
    year: 2025,
    logo: "https://media.licdn.com/dms/image/v2/C4E0BAQGXzRiBdm4geg/company-logo_200_200/company-logo_200_200/0/1630622089601?e=2147483647&v=beta&t=bpUP4yfSqahrZ8WmzJlbLPp9oPNeFaAjXJXvmIJ7tds",
    file: `${import.meta.env.BASE_URL}assets/certificates/QBronze163-173.pdf`,
    verify: null,
  },
  {
    id: 9,
    name: "QWorld Nickel",
    issuer: "QWorld",
    year: 2025,
    logo: "https://media.licdn.com/dms/image/v2/C4E0BAQGXzRiBdm4geg/company-logo_200_200/company-logo_200_200/0/1630622089601?e=2147483647&v=beta&t=bpUP4yfSqahrZ8WmzJlbLPp9oPNeFaAjXJXvmIJ7tds",
    file: `${import.meta.env.BASE_URL}assets/certificates/QNickel22-113.pdf`,
    verify: null,
  },
  {
    id: 10,
    name: "Azure AI Engineer Associate Bootcamp",
    issuer: "Código Facilito",
    year: 2025,
    logo: "https://codigofacilito.com/assets/iso-2c915b58698845df3902effd7a958111fef40aab4c8c13db1db519b37fc1b2e8.png",
    file: `${import.meta.env.BASE_URL}assets/certificates/Certificado - Bootcamp Azure AI Engineer Associate.pdf`,
    verify: null,
  },
  {
    id: 11,
    name: "Complete Python Course: From Zero to Master",
    issuer: "Udemy",
    year: 2023,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/200px-Udemy_logo.svg.png",
    file: `${import.meta.env.BASE_URL}assets/certificates/certificado_python_udemy.jpg`,
    verify: null,
  },
  {
    id: 12,
    name: "ERP Odoo Functional and Technical",
    issuer: "Universidad Nacional de Ingeniería",
    year: 2025,
    logo: "https://w1.pngwing.com/pngs/892/30/png-transparent-engineering-logo-national-university-of-engineering-university-of-northern-iowa-public-university-school-higher-education-education-lima.png",
    file: `${import.meta.env.BASE_URL}assets/certificates/certificado_erp_odoo.pdf`,
    verify: null,
  },
  {
    id: 13,
    name: "Linux Fundamentals",
    issuer: "Universidad Nacional de Ingeniería",
    year: 2025,
    logo: "https://w1.pngwing.com/pngs/892/30/png-transparent-engineering-logo-national-university-of-engineering-university-of-northern-iowa-public-university-school-higher-education-education-lima.png",
    file: `${import.meta.env.BASE_URL}assets/certificates/certificado_fundamentos_linux.pdf`,
    verify: null,
  },
  {
    id: 14,
    name: "Blockchain Fundamentals",
    issuer: "Universidad Nacional de Ingeniería",
    year: 2025,
    logo: "https://w1.pngwing.com/pngs/892/30/png-transparent-engineering-logo-national-university-of-engineering-university-of-northern-iowa-public-university-school-higher-education-education-lima.png",
    file: `${import.meta.env.BASE_URL}assets/certificates/certificado_fundamentos_blockchain.pdf`,
    verify: null,
  },
  {
    id: 15,
    name: "Contributor – KCD Lima 2024",
    issuer: "The Linux Foundation",
    year: 2024,
    logo: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_1080,q_100,w_1080/v1/gcs/platform-data-cncf/chapter_banners/KCD%20Lima%202026%20-%20Prospecto%20de%20Patrocinio_YXaInaI.png",
    file: null,
    verify: "https://www.credly.com/badges/6558c101-2296-42d9-a3fa-6ab8be2f5bad/public_url",
  },
];

// ---------------------------------------------------------------------------
// BLOG POSTS (linked to Blogger)
// ---------------------------------------------------------------------------
export const blogPosts = [
  {
    id: 1,
    title: "Why Every Backend Engineer Should Implement Raft Once",
    summary:
      "Distributed consensus seems like an academic problem until you have to explain why your database has two leaders. Here's what building Raft taught me about real-world fault tolerance.",
    date: "2024-11-15",
    tags: ["Distributed Systems", "Go", "Architecture"],
    url: "https://yourblog.blogspot.com/2024/11/raft-consensus",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "Fine-tuning BERT for Low-Resource Spanish Legal Text",
    summary:
      "Most NLP tutorials use English. Here's the full technical breakdown of what changes when your domain is Spanish legal documents and your dataset is small.",
    date: "2024-09-03",
    tags: ["NLP", "BERT", "Python", "Research"],
    url: "https://yourblog.blogspot.com/2024/09/bert-legal-spanish",
    readTime: "12 min read",
  },
  {
    id: 3,
    title: "Observability Is Not Optional: A Practical Guide",
    summary:
      "Every microservice I have seen in production eventually breaks. The difference between a 2-hour incident and a 2-week debug nightmare is almost always observability.",
    date: "2024-07-20",
    tags: ["DevOps", "OpenTelemetry", "Architecture"],
    url: "https://yourblog.blogspot.com/2024/07/observability-guide",
    readTime: "10 min read",
  },
];

// ---------------------------------------------------------------------------
// EVENTS & SPEAKING
// Place one photo per event in /src/assets/events/
// Name files descriptively: e.g. "kubecon-2025.jpg"
// ---------------------------------------------------------------------------
export const events = [
  {
    id: 1,
    name: "KCD Lima 2024 (Kubernetes Community Days)",
    role: "Volunteer",
    date: "July 2024",
    location: "Lima, Peru",
    description:
      "Contributed as a volunteer in one of the most important cloud-native events in Peru. Supported event logistics, assisted attendees, and collaborated with organizers. Attended technical sessions on Kubernetes, cluster management, and cloud-native best practices while expanding professional network within the community.",
    photo: "volunteer_kcd_lima_2024.jpg",
  },
  {
    id: 2,
    name: "AWS Community Fest 2025",
    role: "Attendee",
    date: "September 2025",
    location: "Lima, Peru",
    description:
      "Participated in technical sessions and keynotes focused on cloud computing and emerging technologies. Highlight experience included insights from Amazon CTO Werner Vogels on continuous learning and the future of quantum computing.",
    photo: "community_fest_2025.jpeg",
  },
  {
    id: 3,
    name: "Huawei Seeds for the Future 2024",
    role: "Participant",
    date: "June 2024",
    location: "Peru",
    description:
      "Selected participant in Huawei’s global ICT talent program, focused on developing skills in emerging technologies and understanding industry trends in telecommunications and digital transformation.",
    photo: "huawei_seeds_for_the_future_2024.jpeg",
  },
];

// ---------------------------------------------------------------------------
// TESTIMONIALS
// Short quotes from professors, technical leads, or collaborators.
// ---------------------------------------------------------------------------
export const testimonials = [
  {
    id: 1,
    quote:
      "One of the most rigorous and self-directed students I have supervised. The quality of their research work is graduate-level.",
    name: "Dr. Example Professor",
    title: "Associate Professor, UNMSM Systems Engineering",
    avatar: null, // optional path to /src/assets/profile/testimonial-1.jpg
  },
  {
    id: 2,
    quote:
      "Shipped production-grade work from week one. Rare combination of theoretical depth and engineering pragmatism.",
    name: "Jane Smith",
    title: "Engineering Lead, Example Company",
    avatar: null,
  },
];

// ---------------------------------------------------------------------------
// ENDORSEMENTS (company/org logos)
// Use official logo URLs from Wikipedia or brand kits.
// ---------------------------------------------------------------------------
export const endorsements = [
  {
    name: "UNMSM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/UNMSM_coatofarms_seal.svg",
    url: "https://unmsm.edu.pe",
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png",
    url: "https://google.com",
  },
  {
    name: "Huawei",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Huawei_Standard_logo.svg/1280px-Huawei_Standard_logo.svg.png",
    url: "https://huawei.com",
  },
];
