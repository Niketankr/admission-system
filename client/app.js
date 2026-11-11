// IEM Admissions Portal Engine - Institute of Engineering & Management, Kolkata
const API_BASE = window.location.origin.includes('localhost')
  ? `${window.location.origin}/api`
  : '/api';

// B.Tech Programme Data with Real-Time Fee Structures & Curricula
const BTECH_PROGRAMMES = [
  {
    code: 'BTECH-CSE',
    title: 'B.Tech - CSE',
    deptName: 'B.Tech - Computer Science & Engineering (CSE)',
    subtitle: 'Computer Science & Engineering',
    desc: 'NBA Accredited • Focus on Cloud Computing, Distributed Systems, Software Engineering & High-Performance Algorithms',
    semesterTuition: 92000,
    labFee: 8000,
    totalTuitionFee: 800000,
    campus: 'Gurukul Campus (Salt Lake Sector V)',
    intake: 240,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  },
  {
    code: 'BTECH-AIML',
    title: 'B.Tech - CSE (AI & ML)',
    deptName: 'B.Tech - CSE (AI & ML)',
    subtitle: 'Artificial Intelligence & Machine Learning',
    desc: 'Specialized Track with Deep Learning, Generative AI, Computer Vision, Reinforcement Learning & NVIDIA DGX Station Labs',
    semesterTuition: 95000,
    labFee: 8000,
    totalTuitionFee: 824000,
    campus: 'Gurukul Campus (Salt Lake Sector V)',
    intake: 120,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  },
  {
    code: 'BTECH-ECE',
    title: 'B.Tech - ECE',
    deptName: 'B.Tech - Electronics & Communication Engineering (ECE)',
    subtitle: 'Electronics & Communication Engineering',
    desc: 'NBA Accredited • VLSI Architecture, Embedded Robotics, 5G Wireless Communications, RF Engineering & IoT Hardware',
    semesterTuition: 86000,
    labFee: 8000,
    totalTuitionFee: 752000,
    campus: 'Gurukul Campus (Salt Lake Sector V)',
    intake: 180,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  },
  {
    code: 'BTECH-IT',
    title: 'B.Tech - IT',
    deptName: 'B.Tech - Information Technology (IT)',
    subtitle: 'Information Technology',
    desc: 'Enterprise Systems, Cloud Infrastructure, Cyber Security, Full-Stack Engineering, Big Data Analytics & DevOps',
    semesterTuition: 88000,
    labFee: 8000,
    totalTuitionFee: 768000,
    campus: 'Management House Campus (Sector V)',
    intake: 180,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  },
  {
    code: 'BTECH-CSBS',
    title: 'B.Tech - CSBS',
    deptName: 'B.Tech - Computer Science & Business Systems (CSBS)',
    subtitle: 'Computer Science & Business Systems',
    desc: 'TCS Industry-Designed Curriculum blending Quantitative Finance, Business Analytics, FinTech Architecture & Cognitive Computing',
    semesterTuition: 88000,
    labFee: 8000,
    totalTuitionFee: 768000,
    campus: 'Management House Campus (Sector V)',
    intake: 60,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  },
  {
    code: 'BTECH-ME',
    title: 'B.Tech - Mechanical',
    deptName: 'B.Tech - Mechanical Engineering (ME)',
    subtitle: 'Mechanical Engineering',
    desc: 'Industry 4.0 Robotics, Autonomous EV Systems, CAD/CAM Prototyping, Renewable Thermal Engineering & Mechatronics',
    semesterTuition: 82000,
    labFee: 8000,
    totalTuitionFee: 720000,
    campus: 'Gurukul Campus (Salt Lake Sector V)',
    intake: 60,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  }
];

// Departmental Innovation Channels & Specialized Labs Data
const INNOVATION_LABS = [
  {
    id: 'aiml',
    title: 'AI & Machine Learning Supercomputing Center',
    tag: 'NVIDIA DGX Station A100 Cluster',
    image: '/assets/aiml-lab.jpg',
    lead: 'Prof. Dr. Debashis De & Dr. Malay Gangopadhyaya',
    desc: 'A dedicated high-performance supercomputing testbed equipped with NVIDIA DGX Station A100 (640GB Tensor Core VRAM), supporting large language model fine-tuning, autonomous drone navigation, and clinical medical imaging.',
    features: [
      'NVIDIA DGX A100 Supercomputer Cluster with 2.5 PetaFLOPS AI computing power',
      'Dual 4K workstation monitors with PyTorch, TensorFlow & CUDA acceleration',
      'Live Research: Indic Multilingual LLM, Vision-Based Tumor Detection & Autonomous Drone Swarms',
      '14 High-Impact IEEE/Springer Publications & 3 Patent Grants (2025–26)'
    ],
    patents: '3 Patents Granted • 5 Technology Licenses'
  },
  {
    id: 'iot',
    title: 'IoT & Smart Connected Systems Laboratory',
    tag: '5G, LoRaWAN & Industrial Telemetry',
    image: '/assets/iot-lab.jpg',
    lead: 'Dr. Senjuti Saha & Prof. Subhabrata Sengupta',
    desc: 'Sponsored by DST & industry partners, this laboratory houses digital storage oscilloscopes, RF spectrum analyzers, and programmable microcontroller rigs for developing smart-city infrastructure and industrial telemetric hardware.',
    features: [
      'Keysight 1GHz Digital Storage Oscilloscopes & RF Spectrum Analyzers',
      'LoRaWAN Long-Range Gateways & Private 5G NR Software-Defined Radio Testbed',
      'Embedded STM32, ESP32, Raspberry Pi 5 & FPGA Development Benches',
      'Smart Campus Project: Deployed 200+ Environmental & Energy telemetry sensors in Sector V'
    ],
    patents: 'Live Smart Campus IoT Grid • 4 Patents Filed'
  },
  {
    id: 'iedc',
    title: 'IEDC Innovation & Entrepreneurship FabLab',
    tag: 'DST Supported Incubation Hub',
    image: '/assets/iedc-lab.jpg',
    lead: 'Prof. Dr. Satyajit Chakraborty (Director & Head of Incubation)',
    desc: 'Established with financial grant support from the Department of Science & Technology (DST), Govt. of India. Features rapid-prototyping 3D printers, laser engravers, PCB milling machines, and dedicated startup co-working pods.',
    features: [
      'Stratasys & Creality Industrial High-Precision Dual-Extruder 3D Printers',
      'CNC PCB Milling Machines & Automated Laser Prototyping Systems',
      '40+ Student Startups Incubated with ₹2.5 Crore+ in Seed Grants & Angel Capital',
      '65+ Patents Filed by Undergraduate Student Founders & Faculty Mentors'
    ],
    patents: '40+ Startups Incubated • ₹2.5 Cr Seed Grants'
  }
];

// Branch-Wise Placement Statistics
const PLACEMENT_STATS = [
  {
    branch: 'Computer Science & Engineering (CSE)',
    code: 'CSE',
    placed: '99.4%',
    highest: '₹72 LPA',
    average: '₹10.8 LPA',
    median: '₹9.5 LPA',
    superDreamOffers: 84,
    recruiters: ['Google', 'Microsoft', 'Amazon', 'Oracle', 'Adobe', 'Cisco']
  },
  {
    branch: 'CSE (Artificial Intelligence & Machine Learning)',
    code: 'AI & ML',
    placed: '99.1%',
    highest: '₹48 LPA',
    average: '₹10.4 LPA',
    median: '₹9.2 LPA',
    superDreamOffers: 42,
    recruiters: ['Microsoft', 'Amazon', 'AMD', 'Intel', 'NVIDIA', 'Adobe']
  },
  {
    branch: 'Information Technology (IT)',
    code: 'IT',
    placed: '98.7%',
    highest: '₹42 LPA',
    average: '₹9.8 LPA',
    median: '₹8.8 LPA',
    superDreamOffers: 56,
    recruiters: ['Cisco', 'Adobe', 'Morgan Stanley', 'PwC', 'Goldman Sachs']
  },
  {
    branch: 'Computer Science & Business Systems (CSBS)',
    code: 'CSBS',
    placed: '98.2%',
    highest: '₹36 LPA',
    average: '₹9.4 LPA',
    median: '₹8.5 LPA',
    superDreamOffers: 18,
    recruiters: ['TCS Digital', 'Deloitte', 'Goldman Sachs', 'PwC', 'Fintech Labs']
  },
  {
    branch: 'Electronics & Communication Engineering (ECE)',
    code: 'ECE',
    placed: '96.8%',
    highest: '₹28 LPA',
    average: '₹8.6 LPA',
    median: '₹7.8 LPA',
    superDreamOffers: 38,
    recruiters: ['Qualcomm', 'Texas Instruments', 'Intel', 'Samsung', 'L&T Tech']
  },
  {
    branch: 'Mechanical Engineering (ME)',
    code: 'ME',
    placed: '94.5%',
    highest: '₹18 LPA',
    average: '₹7.4 LPA',
    median: '₹6.8 LPA',
    superDreamOffers: 12,
    recruiters: ['Tata Motors', 'L&T Heavy', 'Siemens', 'Hero MotoCorp', 'Adani Power']
  }
];

// DEPARTMENT-SPECIFIC UPCOMING SEMESTER CURRICULUM & ACADEMIC EVALUATION
const DEPARTMENT_CURRICULUM = {
  'B.Tech - Computer Science & Engineering (CSE)': {
    branchCode: 'CSE',
    upcomingSem: 'Semester 1 (Autumn 2026)',
    totalCredits: 20.5,
    orientationGroup: 'Group Alpha (Core Computing)',
    subjects: [
      { code: 'BS-PH101', name: 'Engineering Physics & Quantum Principles', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Prof. (Dr.) A. Bhattacharya', room: 'Raman Block - LT 1' },
      { code: 'BS-M101', name: 'Mathematics - I (Calculus & Linear Algebra)', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Dr. S. Mukherjee', room: 'Aryabhatta Hall 2' },
      { code: 'ES-CS101', name: 'Programming for Problem Solving using C', type: 'Theory', ltp: '3-0-0', credits: 3.0, faculty: 'Prof. Dr. Arun Kumar Bar', room: 'Turing Lecture Complex' },
      { code: 'HM-HU101', name: 'Professional English & Technical Writing', type: 'Humanities', ltp: '2-0-0', credits: 2.0, faculty: 'Prof. M. Roy', room: 'Management Block CR 4' },
      { code: 'BS-PH191', name: 'Optics & Semiconductor Physics Laboratory', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'Gurukul Physics Block', room: 'Central Optics Lab' },
      { code: 'ES-CS191', name: 'Programming & Data Structures Practice Lab', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'Turing Computing Center', room: 'AI & Supercomputing Cluster' },
      { code: 'ES-ME192', name: 'Engineering Workshop & Rapid Prototyping', type: 'Workshop', ltp: '1-0-3', credits: 2.5, faculty: 'IEDC Fabrication Hub', room: 'Maker Studio 104' },
      { code: 'MC-101', name: 'Induction & Environmental Sustainability', type: 'Audit / Mandatory', ltp: '2-0-0', credits: 2.0, faculty: 'Academic Cell', room: 'Main Auditorium' }
    ],
    previousScores: {
      examTitle: 'Secondary, Higher Secondary & Foundation Diagnostic Review',
      sgpaEquivalent: '9.75 / 10.0',
      foundationStatus: 'Outstanding (Rank #1 Tier)',
      courses: [
        { code: 'FND-MAT10', subject: 'Calculus & Vector Geometry Diagnostic', marks: '96/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-PHY10', subject: 'Mechanics, Heat & Modern Physics', marks: '92/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-CHM10', subject: 'Atomic Structure & Thermodynamics', marks: '88/100', grade: 'E (Excellent)', points: 9 },
        { code: 'FND-CS10', subject: 'Algorithmic Thinking & Computational Logic', marks: '98/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-ENG10', subject: 'Technical Writing & Verbal Communication', marks: '91/100', grade: 'O (Outstanding)', points: 10 }
      ]
    }
  },
  'B.Tech - CSE (AI & ML)': {
    branchCode: 'AIML',
    upcomingSem: 'Semester 1 (Autumn 2026)',
    totalCredits: 21.0,
    orientationGroup: 'Group AI & Cognitive Computing',
    subjects: [
      { code: 'BS-PH101', name: 'Physics of Neural & Sensor Networks', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Dr. K. Banerjee', room: 'Raman Hall 3' },
      { code: 'BS-M102', name: 'Discrete Mathematics & Matrix Theory for ML', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Prof. T. Sen', room: 'Aryabhatta Complex 1' },
      { code: 'ES-AI101', name: 'Python Programming & Problem Solving for AI', type: 'Theory', ltp: '3-0-0', credits: 3.0, faculty: 'Dr. P. Chakraborty', room: 'AI Innovation Hub' },
      { code: 'HM-HU101', name: 'AI Ethics, Philosophy & Scientific Writing', type: 'Humanities', ltp: '2-0-0', credits: 2.0, faculty: 'Prof. R. Dutta', room: 'Management Block CR 2' },
      { code: 'ES-AI191', name: 'AI Supercomputing & Exploratory ML Lab', type: 'Practical Lab', ltp: '0-0-4', credits: 2.0, faculty: 'NVIDIA AI Innovation Center', room: 'NVIDIA DGX Station A1' },
      { code: 'BS-PH191', name: 'Applied Optics & Sensor Telemetry Lab', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'Gurukul Sensors Lab', room: 'Opto-Electronics Bay' },
      { code: 'ES-ME192', name: 'Intelligent Systems Prototyping Workshop', type: 'Workshop', ltp: '1-0-3', credits: 2.5, faculty: 'IEDC Fabrication Hub', room: 'Robotics Workshop' },
      { code: 'MC-101', name: 'Environmental Intelligence & Sustainability', type: 'Audit / Mandatory', ltp: '2-0-0', credits: 2.0, faculty: 'Academic Cell', room: 'Main Auditorium' }
    ],
    previousScores: {
      examTitle: 'Secondary, Higher Secondary & AI Merit Baseline',
      sgpaEquivalent: '9.82 / 10.0',
      foundationStatus: 'High Distinction',
      courses: [
        { code: 'FND-MAT10', subject: 'Linear Algebra & Calculus Diagnostic', marks: '98/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-LOG10', subject: 'Discrete Mathematics & Boolean Logic', marks: '96/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-PHY10', subject: 'Sensor Physics & Wave Dynamics', marks: '90/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-PRG10', subject: 'Introductory Python & Data Structures', marks: '100/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-ENG10', subject: 'Scientific Reasoning & Technical English', marks: '93/100', grade: 'O (Outstanding)', points: 10 }
      ]
    }
  },
  'B.Tech - Electronics & Communication Engineering (ECE)': {
    branchCode: 'ECE',
    upcomingSem: 'Semester 1 (Autumn 2026)',
    totalCredits: 20.5,
    orientationGroup: 'Group Signals & Embedded Hardware',
    subjects: [
      { code: 'BS-CH101', name: 'Semiconductor Chemistry & Nano-materials', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Dr. N. Sengupta', room: 'Materials Hall 1' },
      { code: 'BS-M101', name: 'Calculus, Transforms & Complex Analysis', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Prof. Dr. S. K. Das', room: 'Aryabhatta Complex 2' },
      { code: 'ES-EE101', name: 'Basic Electrical & Circuit Theory', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Prof. Dr. Malay Gangopadhyay', room: 'Tesla Circuit Room' },
      { code: 'HM-HU101', name: 'Professional Communication & Ethics', type: 'Humanities', ltp: '2-0-0', credits: 2.0, faculty: 'Prof. S. Ghosal', room: 'Seminar Hall B' },
      { code: 'BS-CH191', name: 'Semiconductor Materials Testing Lab', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'Materials Science Lab', room: 'Solid State Bay' },
      { code: 'ES-EE191', name: 'Circuits, SPICE Simulation & Telemetry Lab', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'IoT & Telemetry Lab', room: 'IoT Lab Gurukul' },
      { code: 'ES-ME191', name: 'Engineering Graphics & PCB Design CAD', type: 'Workshop', ltp: '1-0-3', credits: 2.5, faculty: 'Hardware Design Studio', room: 'CAD Studio 2' },
      { code: 'MC-101', name: 'Environmental Science & Green Electronics', type: 'Audit / Mandatory', ltp: '2-0-0', credits: 1.0, faculty: 'Academic Cell', room: 'Main Auditorium' }
    ],
    previousScores: {
      examTitle: 'Secondary, Higher Secondary & Circuit Diagnostic Assessment',
      sgpaEquivalent: '9.50 / 10.0',
      foundationStatus: 'First Class with Distinction',
      courses: [
        { code: 'FND-MAT10', subject: 'Differential Equations & Trigonometry', marks: '92/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-PHY10', subject: 'Electromagnetism & Circuit Laws', marks: '94/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-CHM10', subject: 'Physical Chemistry & Solid State', marks: '86/100', grade: 'E (Excellent)', points: 9 },
        { code: 'FND-LOG10', subject: 'Logic Gates & Binary Systems', marks: '92/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-ENG10', subject: 'Professional Expression & Report Crafting', marks: '89/100', grade: 'E (Excellent)', points: 9 }
      ]
    }
  },
  'B.Tech - Information Technology (IT)': {
    branchCode: 'IT',
    upcomingSem: 'Semester 1 (Autumn 2026)',
    totalCredits: 20.0,
    orientationGroup: 'Group Cloud & Enterprise Systems',
    subjects: [
      { code: 'BS-PH101', name: 'Applied Physics & Quantum Information', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Dr. A. Bhattacharya', room: 'Raman Block LT 2' },
      { code: 'BS-M101', name: 'Mathematics - I (Calculus & Linear Algebra)', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Dr. S. Mukherjee', room: 'Aryabhatta Hall 1' },
      { code: 'ES-IT101', name: 'Computer Fundamentals & Programming in C', type: 'Theory', ltp: '3-0-0', credits: 3.0, faculty: 'Dr. Sneha Mukherjee', room: 'IT Complex 201' },
      { code: 'HM-HU101', name: 'Technical English & Digital Collaboration', type: 'Humanities', ltp: '2-0-0', credits: 2.0, faculty: 'Prof. M. Roy', room: 'CR 102' },
      { code: 'ES-IT191', name: 'Enterprise Computing & Linux Lab', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'Enterprise Cloud Lab', room: 'Cloud Server Bay' },
      { code: 'BS-PH191', name: 'Optics & Measurement Instrumentation Lab', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'Gurukul Physics Block', room: 'Optics Lab 2' },
      { code: 'ES-ME192', name: 'Rapid Prototyping Workshop', type: 'Workshop', ltp: '1-0-3', credits: 2.5, faculty: 'IEDC Fabrication Hub', room: 'Workshop Bay' },
      { code: 'MC-101', name: 'Induction & Environmental Technology', type: 'Audit / Mandatory', ltp: '2-0-0', credits: 1.5, faculty: 'Academic Cell', room: 'Auditorium' }
    ],
    previousScores: {
      examTitle: 'Secondary, Higher Secondary & Enterprise Baseline',
      sgpaEquivalent: '9.45 / 10.0',
      foundationStatus: 'High Distinction',
      courses: [
        { code: 'FND-MAT10', subject: 'Calculus & Algebra Diagnostic', marks: '90/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-PHY10', subject: 'Electrodynamics & Optics', marks: '88/100', grade: 'E (Excellent)', points: 9 },
        { code: 'FND-CHM10', subject: 'General Chemistry Diagnostic', marks: '85/100', grade: 'E (Excellent)', points: 9 },
        { code: 'FND-CS10', subject: 'Problem Solving & Web Fundamentals', marks: '96/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-ENG10', subject: 'Technical Writing', marks: '92/100', grade: 'O (Outstanding)', points: 10 }
      ]
    }
  },
  'B.Tech - Computer Science & Business Systems (CSBS)': {
    branchCode: 'CSBS',
    upcomingSem: 'Semester 1 (Autumn 2026)',
    totalCredits: 21.0,
    orientationGroup: 'Group TCS-Aligned Business Analytics',
    subjects: [
      { code: 'BS-PH101', name: 'Physics for Business Computing Systems', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Dr. A. Bhattacharya', room: 'Raman Block 1' },
      { code: 'BS-M103', name: 'Business Mathematics, Statistics & Calculus', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Prof. T. Sen', room: 'Management House Hall 1' },
      { code: 'ES-CS101', name: 'Programming & Enterprise Architecture', type: 'Theory', ltp: '3-0-0', credits: 3.0, faculty: 'Dr. P. Chakraborty', room: 'Turing Hall 2' },
      { code: 'HM-BS101', name: 'Business Communication & Financial Acumen', type: 'Business Core', ltp: '3-0-0', credits: 3.0, faculty: 'Prof. S. Ghosal', room: 'CR 301' },
      { code: 'ES-CS191', name: 'Analytics & Financial Modeling Lab', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'FinTech Computing Lab', room: 'FinTech Hub' },
      { code: 'BS-PH191', name: 'Physics & Experimental Instrumentation Lab', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'Gurukul Physics Block', room: 'Physics Lab' },
      { code: 'ES-ME192', name: 'Product Design & Prototyping Workshop', type: 'Workshop', ltp: '1-0-3', credits: 2.5, faculty: 'IEDC Fabrication Hub', room: 'IEDC Lab' },
      { code: 'MC-101', name: 'Corporate Sustainability & Ethics', type: 'Audit / Mandatory', ltp: '2-0-0', credits: 1.5, faculty: 'Academic Cell', room: 'Auditorium' }
    ],
    previousScores: {
      examTitle: 'Secondary, Higher Secondary & Business Systems Diagnostic',
      sgpaEquivalent: '9.62 / 10.0',
      foundationStatus: 'High Distinction',
      courses: [
        { code: 'FND-MAT10', subject: 'Applied Mathematics & Statistics', marks: '94/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-PHY10', subject: 'Applied Physics Diagnostic', marks: '90/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-LOG10', subject: 'Logical Reasoning & Business Systems', marks: '98/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-ENG10', subject: 'Corporate English & Case Studies', marks: '95/100', grade: 'O (Outstanding)', points: 10 }
      ]
    }
  },
  'B.Tech - Mechanical Engineering (ME)': {
    branchCode: 'ME',
    upcomingSem: 'Semester 1 (Autumn 2026)',
    totalCredits: 20.0,
    orientationGroup: 'Group Mechatronics & Thermal Systems',
    subjects: [
      { code: 'BS-CH101', name: 'Materials Chemistry & Metallurgy', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Dr. N. Sengupta', room: 'Materials LT 2' },
      { code: 'BS-M101', name: 'Calculus, Vectors & Differential Equations', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Prof. Dr. S. K. Das', room: 'Aryabhatta 3' },
      { code: 'ES-ME101', name: 'Engineering Mechanics & Statics', type: 'Theory', ltp: '3-1-0', credits: 4.0, faculty: 'Prof. A. Ray', room: 'Newton Hall' },
      { code: 'HM-HU101', name: 'Technical Communication & Safety Standards', type: 'Humanities', ltp: '2-0-0', credits: 2.0, faculty: 'Prof. M. Roy', room: 'CR 104' },
      { code: 'ES-ME191', name: 'Computer Aided Drafting (CAD) & SolidWorks', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'CAD/CAM Supercenter', room: 'CAD Lab 1' },
      { code: 'ES-ME192', name: 'Fitting, Machining & Welding Practice Workshop', type: 'Workshop', ltp: '1-0-3', credits: 2.5, faculty: 'Central Mechanical Workshop', room: 'Foundry & Welding Bay' },
      { code: 'BS-CH191', name: 'Engineering Materials & Testing Lab', type: 'Practical Lab', ltp: '0-0-3', credits: 1.5, faculty: 'Materials Lab', room: 'Testing Bay' },
      { code: 'MC-101', name: 'Industrial Safety & Environmental Science', type: 'Audit / Mandatory', ltp: '2-0-0', credits: 0.5, faculty: 'Academic Cell', room: 'Auditorium' }
    ],
    previousScores: {
      examTitle: 'Secondary, Higher Secondary & Mechanics Baseline',
      sgpaEquivalent: '9.38 / 10.0',
      foundationStatus: 'First Class with Distinction',
      courses: [
        { code: 'FND-MAT10', subject: 'Vector Calculus & Algebra', marks: '91/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-PHY10', subject: 'Newtonian Mechanics & Statics', marks: '93/100', grade: 'O (Outstanding)', points: 10 },
        { code: 'FND-CHM10', subject: 'Materials & Thermodynamics', marks: '87/100', grade: 'E (Excellent)', points: 9 },
        { code: 'FND-CAD10', subject: 'Spatial Visualization & Drafting', marks: '92/100', grade: 'O (Outstanding)', points: 10 }
      ]
    }
  }
};

// Application State
const state = {
  token: localStorage.getItem('admission_token') || null,
  user: JSON.parse(localStorage.getItem('admission_user') || 'null'),
  currentView: 'home', // 'home', 'login', 'register', 'apply', 'my-status', 'admin-dashboard', 'admin-applicants'
  myApplication: null,
  adminStats: null,
  adminApplicants: [],
  filters: { department: 'All', status: 'All', search: '' },
  selectedApplicant: null,
  selectedBranchForApply: null,
  alert: null,
  showStaffModal: false,

  // Multi-Admin Portal & Provisioning State
  loginMode: 'applicant', // 'applicant' or 'admin'
  adminTab: 'analytics', // 'analytics' or 'staff'
  adminList: [],
  adminPersonas: [],
  studentAcademicTab: 'curriculum', // 'curriculum' or 'scores'

  // Hero Quick Evaluator State
  wizard: {
    twelfthPct: 88,
    entranceScore: 82,
    resultMsg: null
  },

  // Placement Active Branch Filter
  activePlacementBranch: 'All'
};

// Helper: Show temporary alert
function showAlert(message, type = 'info', timeout = 4000) {
  state.alert = { message, type };
  render();
  if (timeout > 0) {
    setTimeout(() => {
      if (state.alert?.message === message) {
        state.alert = null;
        render();
      }
    }, timeout);
  }
}

// API Service Call Wrapper with JWT Auth header
async function apiCall(endpoint, options = {}) {
  const headers = options.headers || {};
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

// Auth Handlers
async function handleLogin(email, password) {
  try {
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    state.token = res.token;
    state.user = res.user;
    state.showStaffModal = false;
    localStorage.setItem('admission_token', res.token);
    localStorage.setItem('admission_user', JSON.stringify(res.user));

    showAlert(`Welcome, ${res.user.name}!`, 'success');
    if (res.user.role === 'admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('my-status');
    }
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

async function handleRegister(name, email, password, role = 'applicant') {
  try {
    const res = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });

    state.token = res.token;
    state.user = res.user;
    localStorage.setItem('admission_token', res.token);
    localStorage.setItem('admission_user', JSON.stringify(res.user));

    showAlert('Candidate profile registered successfully!', 'success');
    if (role === 'admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('apply');
    }
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

function handleLogout() {
  state.token = null;
  state.user = null;
  state.myApplication = null;
  localStorage.removeItem('admission_token');
  localStorage.removeItem('admission_user');
  showAlert('You have been signed out successfully.', 'info');
  navigateTo('home');
}

// Navigation router
async function navigateTo(view, targetId = null) {
  state.currentView = view;
  state.alert = null;

  if (view === 'login') {
    fetchAdminPersonas();
  }

  if (view === 'my-status' && state.token) {
    try {
      const res = await apiCall('/applications/my');
      state.myApplication = res.application;
    } catch (err) {
      state.myApplication = null;
      if (err.message.includes('No application found')) {
        state.currentView = 'apply';
      }
    }
  }

  if (view === 'admin-dashboard' && state.user?.role === 'admin') {
    try {
      const stats = await apiCall('/applications/stats/summary');
      state.adminStats = stats;
      fetchAdminStaffList();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  }

  if (view === 'admin-applicants' && state.user?.role === 'admin') {
    await fetchAdminApplicants();
  }

  render();

  if (view === 'home' && targetId) {
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}

async function fetchAdminPersonas() {
  try {
    const res = await apiCall('/auth/admin-personas');
    if (res?.admins && res.admins.length > 0) {
      state.adminPersonas = res.admins;
      render();
    }
  } catch (err) {
    console.error('Error fetching admin personas:', err);
  }
}

async function fetchAdminStaffList() {
  try {
    const res = await apiCall('/auth/admins');
    if (res?.admins) {
      state.adminList = res.admins;
      render();
    }
  } catch (err) {
    console.error('Error fetching admin staff:', err);
  }
}

async function handleAddAdmin(name, email, password, designation, department) {
  try {
    const res = await apiCall('/auth/admins', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, designation, department })
    });

    showAlert(`Administrator ${res.admin?.name || name} created successfully!`, 'success');
    await fetchAdminStaffList();
    await fetchAdminPersonas();
    render();
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

async function fetchAdminApplicants() {
  try {
    const params = new URLSearchParams();
    if (state.filters.department !== 'All') params.append('department', state.filters.department);
    if (state.filters.status !== 'All') params.append('status', state.filters.status);
    if (state.filters.search) params.append('search', state.filters.search);

    const res = await apiCall(`/applications?${params.toString()}`);
    state.adminApplicants = res.applications || [];
    render();
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

// Submission Handler for Admission Form
async function handleApplicationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const fileInput = form.querySelector('input[name="document"]');
  if (!fileInput.files.length) {
    showAlert('Please upload your Class 12 marksheet or qualifying rankcard.', 'error');
    return;
  }

  try {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Submitting Application...';

    const res = await apiCall('/applications', {
      method: 'POST',
      body: formData
    });

    state.myApplication = res.application;
    showAlert('Application submitted successfully for verification!', 'success');
    navigateTo('my-status');
  } catch (err) {
    showAlert(err.message, 'error');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Submit B.Tech Admission Application';
    }
  }
}

// Admin Status Transition Handler
async function handleStatusChange(applicationId, newStatus, comments) {
  try {
    const res = await apiCall(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, comments })
    });

    showAlert(`Application status updated to '${newStatus}'!`, 'success');
    state.selectedApplicant = null;
    await fetchAdminApplicants();
    if (state.currentView === 'admin-dashboard') {
      const stats = await apiCall('/applications/stats/summary');
      state.adminStats = stats;
    }
    render();
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

function evaluateWizard() {
  const p = Number(state.wizard.twelfthPct) || 0;
  const e = Number(state.wizard.entranceScore) || 0;

  if (p < 45) {
    state.wizard.resultMsg = {
      eligible: false,
      title: 'Ineligible for Direct Counseling',
      text: 'Minimum 45% aggregate in 10+2 (Physics & Mathematics) is mandatory per AICTE norms.'
    };
  } else if (p >= 85 && e >= 75) {
    state.wizard.resultMsg = {
      eligible: true,
      title: 'High Merit: Eligible for B.Tech CSE & AI-ML',
      text: 'Congratulations! Your score qualifies for Top-Tier counseling and 25% Academic Merit Scholarship.'
    };
  } else if (p >= 70 && e >= 50) {
    state.wizard.resultMsg = {
      eligible: true,
      title: 'Eligible for B.Tech IT, CSBS & ECE',
      text: 'Good performance! You are eligible for counseling across B.Tech IT, CSBS, and ECE programmes.'
    };
  } else {
    state.wizard.resultMsg = {
      eligible: true,
      title: 'Eligible for Mechanical & ECE Rounds',
      text: 'You satisfy minimum eligibility. Qualifies for IEMJEE Direct Counseling seat allotment.'
    };
  }
  render();
}

// Navigation Bar
function renderNavbar() {
  const isAuth = !!state.token;
  const isAdmin = state.user?.role === 'admin';

  return `
    <div class="top-announcement">
      <div class="top-announcement-inner">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span class="announcement-badge">ADMISSION NOTICE</span>
          <span>B.Tech Session 2026–27 Online Counseling & Allotment • Approved by AICTE • NAAC 'A' Grade</span>
        </div>
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <span>📞 Helpline: +91 33 2357 2059</span>
          <span>✉️ admissions@iem.edu.in</span>
        </div>
      </div>
    </div>

    <header>
      <div class="nav-container">
        <div class="brand" onclick="navigateTo('home')">
          <img src="/logo.png" alt="IEM Logo" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-title">IEM Admissions 2026–27</span>
            <span class="brand-subtext">Institute of Engineering & Management, Kolkata</span>
          </div>
        </div>
        
        <div class="nav-links">
          ${
            !isAuth
              ? `
            <a class="nav-link-item" onclick="navigateTo('home')">Home</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'programmes')">B.Tech Degrees</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'innovation-labs')">Innovation Labs</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'placements')">Placement Analytics</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'contact')">Contact</a>
            <button class="nav-btn btn-outline" style="margin-left:0.5rem;" onclick="navigateTo('login')">Sign In</button>
            <button class="nav-btn btn-primary" onclick="navigateTo('register')">Apply Online</button>
          `
              : isAdmin
              ? `
            <button class="nav-btn ${state.currentView === 'admin-dashboard' && state.adminTab === 'analytics' ? 'btn-primary' : 'btn-outline'}" onclick="state.adminTab = 'analytics'; navigateTo('admin-dashboard')">📊 Admissions Analytics</button>
            <button class="nav-btn ${state.currentView === 'admin-applicants' ? 'btn-primary' : 'btn-outline'}" onclick="navigateTo('admin-applicants')">📋 Review Applicants</button>
            <button class="nav-btn ${state.currentView === 'admin-dashboard' && state.adminTab === 'staff' ? 'btn-primary' : 'btn-outline'}" onclick="state.adminTab = 'staff'; navigateTo('admin-dashboard')">🏛️ Admin Access Control</button>
            <span style="font-size:0.85rem; color:#1e293b; font-weight:700; background:#f1f5f9; padding:0.35rem 0.75rem; border-radius:9999px; border:1px solid #e2e8f0;">
              ${state.user?.name || 'Administrator'} ${state.user?.designation ? `<span style="color:#2563eb; font-weight:600;">(${state.user.designation})</span>` : ''}
            </span>
            <button class="nav-btn btn-outline" onclick="handleLogout()">Sign Out</button>
          `
              : `
            <button class="nav-btn ${state.currentView === 'my-status' ? 'btn-primary' : 'btn-outline'}" onclick="navigateTo('my-status')">📄 My Application Status</button>
            ${!state.myApplication ? `<button class="nav-btn btn-primary" onclick="navigateTo('apply')">📝 Fill Form</button>` : ''}
            <span style="font-size:0.85rem; color:#1e293b; font-weight:700; background:#f1f5f9; padding:0.35rem 0.75rem; border-radius:9999px;">
              Candidate: ${state.user.name}
            </span>
            <button class="nav-btn btn-outline" onclick="handleLogout()">Sign Out</button>
          `
          }
        </div>
      </div>
    </header>
  `;
}

function renderAlert() {
  if (!state.alert) return '';
  return `
    <div class="alert alert-${state.alert.type}">
      <span>${state.alert.type === 'error' ? '⚠️' : '✅'}</span>
      <span>${state.alert.message}</span>
    </div>
  `;
}

// HOME PAGE VIEW (Redesigned with Distinct Visual Identity)
function renderHome() {
  return `
    <div>
      <!-- HERO SECTION: Executive Immersive Design (Not a screenshot copy) -->
      <section class="hero-executive">
        <div class="hero-executive-inner">
          <div>
            <div class="hero-pill-dark">
              <span class="pill-dot"></span>
              <span>Autonomous Institute • Approved by AICTE • NAAC 'A' Grade Accredited</span>
            </div>

            <h1 class="hero-title-dark">
              Engineering Future Tech & <span>Global Leadership</span>
            </h1>
            
            <p class="hero-subtitle-dark">
              Welcome to the official undergraduate portal of the <strong>Institute of Engineering & Management (IEM), Kolkata</strong>. Explore AICTE-accredited 4-Year B.Tech degrees, transparent semester-wise tuition structures, world-class innovation laboratories, and proven career records.
            </p>

            <div class="hero-quick-stats">
              <div class="stat-metric-dark">
                <div class="stat-num">₹72 LPA</div>
                <div class="stat-text">Highest International CTC</div>
              </div>
              <div class="stat-metric-dark">
                <div class="stat-num">98.4%</div>
                <div class="stat-text">Overall B.Tech Placement</div>
              </div>
              <div class="stat-metric-dark">
                <div class="stat-num">35+ Yrs</div>
                <div class="stat-text">Excellence (Est. 1989)</div>
              </div>
            </div>

            <div class="hero-actions-dark">
              <button class="nav-btn btn-primary" style="padding:0.8rem 2rem; font-size:1rem;" onclick="${state.token ? "navigateTo('apply')" : "navigateTo('register')"}">
                Start B.Tech Application →
              </button>
              <button class="nav-btn btn-outline" style="background:rgba(255,255,255,0.1); color:#fff; border-color:rgba(255,255,255,0.25);" onclick="navigateTo('home', 'innovation-labs')">
                Virtual Lab Tour
              </button>
            </div>
          </div>

          <!-- Hero Right: Interactive Eligibility & Cutoff Evaluator -->
          <div>
            <div class="hero-wizard-card">
              <div class="wizard-header">
                <div class="wizard-title">Candidate Eligibility Evaluator</div>
                <span class="wizard-badge">Session 2026–27</span>
              </div>

              <div class="wizard-input-group">
                <label>Class 12th PCM Aggregate Percentage: <strong style="color:#38bdf8;">${state.wizard.twelfthPct}%</strong></label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value="${state.wizard.twelfthPct}"
                  oninput="state.wizard.twelfthPct = this.value; evaluateWizard();"
                />
              </div>

              <div class="wizard-input-group">
                <label>Entrance Exam Score / Rank Percentile: <strong style="color:#38bdf8;">${state.wizard.entranceScore}/100</strong></label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value="${state.wizard.entranceScore}"
                  oninput="state.wizard.entranceScore = this.value; evaluateWizard();"
                />
              </div>

              <div class="wizard-result-box">
                ${
                  state.wizard.resultMsg
                    ? `
                  <strong>${state.wizard.resultMsg.title}</strong>
                  <div>${state.wizard.resultMsg.text}</div>
                `
                    : `
                  <strong>High Probability for B.Tech CSE & AI-ML</strong>
                  <div>Your score qualifies for Tier-1 counseling and Merit Scholarship Scheme.</div>
                `
                }
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                <button class="nav-btn btn-primary" style="justify-content:center; width:100%; font-size:0.85rem;" onclick="${state.token ? "navigateTo('apply')" : "navigateTo('register')"}">
                  Apply with this Score
                </button>
                <button class="nav-btn btn-outline" style="justify-content:center; width:100%; font-size:0.85rem; background:rgba(255,255,255,0.1); color:#fff;" onclick="navigateTo('home', 'programmes')">
                  View Cutoff Trends
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DEPARTMENTAL INNOVATION CHANNELS & SPECIALIZED LABS SECTION -->
      <section id="innovation-labs" class="section-wrapper">
        <div class="section-header">
          <div>
            <span class="section-tag">R&D Ecosystem</span>
            <h2 class="section-title">Departmental Innovation Channels & Specialized Labs</h2>
            <p class="section-subtitle">
              Explore state-of-the-art supercomputing clusters, IoT telemetry hubs, and the DST-funded IEDC Incubation Center at IEM.
            </p>
          </div>
          <div>
            <span class="badge badge-review" style="font-size:0.85rem; padding:0.4rem 0.85rem;">
              🔬 ₹12+ Crore Research Infrastructure
            </span>
          </div>
        </div>

        <div class="labs-grid">
          ${INNOVATION_LABS.map(
            lab => `
            <div class="lab-card">
              <div class="lab-image-wrapper">
                <img src="${lab.image}" alt="${lab.title}" onerror="this.onerror=null; this.src='/logo.png';" />
                <span class="lab-badge-floating">${lab.tag}</span>
              </div>
              <div class="lab-body">
                <h3 class="lab-title">${lab.title}</h3>
                <p class="lab-desc">${lab.desc}</p>
                
                <ul class="lab-features-list">
                  ${lab.features.map(f => `<li>${f}</li>`).join('')}
                </ul>

                <div class="lab-footer">
                  <span class="lab-meta">Head: <strong>${lab.lead.split('&')[0].trim()}</strong></span>
                  <span class="badge badge-selected" style="font-size:0.75rem;">${lab.patents.split('•')[0].trim()}</span>
                </div>
              </div>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- PLACEMENT ANALYTICS & RECRUITER SPECTRUM -->
      <section id="placements" class="section-wrapper">
        <div class="section-header">
          <div>
            <span class="section-tag">Institutional Placements</span>
            <h2 class="section-title">Placement Statistics (Batch 2025–26)</h2>
            <p class="section-subtitle">
              Audited campus recruitment metrics showcasing branch-wise average packages, highest international offers, and marquee recruiter visits.
            </p>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="nav-btn ${state.activePlacementBranch === 'All' ? 'btn-primary' : 'btn-outline'}" style="padding:0.35rem 0.75rem; font-size:0.8rem;" onclick="state.activePlacementBranch = 'All'; render();">
              All Branches
            </button>
            ${PLACEMENT_STATS.map(
              p => `
              <button class="nav-btn ${state.activePlacementBranch === p.code ? 'btn-primary' : 'btn-outline'}" style="padding:0.35rem 0.75rem; font-size:0.8rem;" onclick="state.activePlacementBranch = '${p.code}'; render();">
                ${p.code}
              </button>
            `
            ).join('')}
          </div>
        </div>

        <div class="placement-kpis">
          <div class="kpi-card">
            <div class="kpi-number" style="color:#2563eb;">₹72 LPA</div>
            <div class="kpi-label">Highest International CTC</div>
          </div>
          <div class="kpi-card emerald">
            <div class="kpi-number" style="color:#10b981;">₹9.2 LPA</div>
            <div class="kpi-label">Overall B.Tech Average Package</div>
          </div>
          <div class="kpi-card amber">
            <div class="kpi-number" style="color:#f59e0b;">98.4%</div>
            <div class="kpi-label">Placement Conversion Rate</div>
          </div>
          <div class="kpi-card purple">
            <div class="kpi-number" style="color:#8b5cf6;">1,450+</div>
            <div class="kpi-label">Offers Received by Cohort</div>
          </div>
        </div>

        <div class="card" style="padding:0; overflow:hidden; margin-bottom:2.5rem;">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>B.Tech Branch</th>
                  <th>Placement Rate</th>
                  <th>Highest CTC</th>
                  <th>Average CTC</th>
                  <th>Median CTC</th>
                  <th>Super Dream Offers (> ₹15L)</th>
                  <th>Key Corporate Recruiters</th>
                </tr>
              </thead>
              <tbody>
                ${PLACEMENT_STATS.filter(
                  p => state.activePlacementBranch === 'All' || p.code === state.activePlacementBranch
                )
                  .map(
                    p => `
                  <tr>
                    <td><strong>${p.branch}</strong></td>
                    <td><span class="badge badge-selected">${p.placed}</span></td>
                    <td><strong style="color:#2563eb;">${p.highest}</strong></td>
                    <td><strong>${p.average}</strong></td>
                    <td>${p.median}</td>
                    <td><span class="badge badge-review">${p.superDreamOffers} Students</span></td>
                    <td style="color:#475569; font-size:0.825rem;">${p.recruiters.join(', ')}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div class="recruiter-category-block">
            <div class="recruiter-category-title">🌐 Tier-1 Big Tech & Global R&D Centers</div>
            <div class="recruiters-marquee">
              <span class="recruiter-pill">Google</span>
              <span class="recruiter-pill">Microsoft</span>
              <span class="recruiter-pill">Amazon</span>
              <span class="recruiter-pill">Adobe</span>
              <span class="recruiter-pill">Oracle</span>
              <span class="recruiter-pill">Cisco</span>
              <span class="recruiter-pill">AMD</span>
              <span class="recruiter-pill">Intel</span>
              <span class="recruiter-pill">NVIDIA</span>
              <span class="recruiter-pill">Samsung R&D</span>
            </div>
          </div>

          <div class="recruiter-category-block">
            <div class="recruiter-category-title">💼 Global Banking, FinTech & Strategic Consulting</div>
            <div class="recruiters-marquee">
              <span class="recruiter-pill">Goldman Sachs</span>
              <span class="recruiter-pill">Morgan Stanley</span>
              <span class="recruiter-pill">PwC India</span>
              <span class="recruiter-pill">Deloitte</span>
              <span class="recruiter-pill">EY</span>
              <span class="recruiter-pill">Nomura</span>
            </div>
          </div>
        </div>
      </section>

      <!-- B.TECH PROGRAMMES OVERVIEW SECTION -->
      <section id="programmes" class="section-wrapper">
        <div class="section-header">
          <div>
            <span class="section-tag">Academic Portfolio</span>
            <h2 class="section-title">Undergraduate Degree Programmes (B.Tech Only)</h2>
            <p class="section-subtitle">
              4-Year Engineering Degrees Approved by AICTE & Accredited by NBA
            </p>
          </div>
        </div>

        <div class="programmes-grid">
          ${BTECH_PROGRAMMES.map(
            prog => `
            <div class="programme-card">
              <div class="prog-badges">
                <span class="prog-badge-code">${prog.code}</span>
                <span class="prog-badge-duration">4 Years (8 Semesters)</span>
              </div>
              <h3 class="prog-title">${prog.title}</h3>
              <div class="prog-subtitle">${prog.subtitle}</div>
              <p class="prog-desc">${prog.desc}</p>
              
              <div class="prog-fees-box">
                <div>
                  <div class="fee-item-label">Semester Fee</div>
                  <div class="fee-item-val">₹${prog.semesterTuition.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div class="fee-item-label">Total Tuition</div>
                  <div class="fee-item-val">₹${prog.totalTuitionFee.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div class="fee-item-label">Campus</div>
                  <div class="fee-item-campus">${prog.campus.split('(')[0]}</div>
                </div>
              </div>

              <button class="nav-btn btn-outline" style="width:100%; justify-content:center; font-weight:600;" onclick="selectBranchAndApply('${prog.deptName}')">
                Apply for this Degree →
              </button>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- CONTACT & HELPDESK SECTION -->
      <section id="contact" class="section-wrapper">
        <div class="section-header">
          <div>
            <span class="section-tag">Admissions Desk</span>
            <h2 class="section-title">Campus Information & Helpline</h2>
            <p class="section-subtitle">Counseling sessions active Monday through Saturday at Gurukul & Management House Campuses</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem;">
          <div class="card" style="margin:0;">
            <h4 style="font-weight:700; color:#0f172a; margin-bottom:0.5rem;">Gurukul Campus (Engineering Headquarters)</h4>
            <p style="font-size:0.85rem; color:#64748b; line-height:1.6;">
              Y-12, Block EP, Sector V, Salt Lake Electronics Complex, Kolkata, West Bengal 700091
            </p>
            <div style="margin-top:0.75rem; font-size:0.85rem; font-weight:600; color:#2563eb;">
              📞 +91 33 2357 2059 / 2995
            </div>
          </div>
          <div class="card" style="margin:0;">
            <h4 style="font-weight:700; color:#0f172a; margin-bottom:0.5rem;">Management House Campus</h4>
            <p style="font-size:0.85rem; color:#64748b; line-height:1.6;">
              D-1, Management House, Sector V, Salt Lake, Kolkata, West Bengal 700091
            </p>
            <div style="margin-top:0.75rem; font-size:0.85rem; font-weight:600; color:#2563eb;">
              📞 +91 33 2357 2969
            </div>
          </div>
          <div class="card" style="margin:0;">
            <h4 style="font-weight:700; color:#0f172a; margin-bottom:0.5rem;">Admissions Secretariat</h4>
            <p style="font-size:0.85rem; color:#64748b; line-height:1.6;">
              Executive Desk: <strong>director@iem.edu.in</strong><br/>
              Admissions Helpdesk: <strong>admissions@iem.edu.in</strong>
            </p>
            <div style="margin-top:0.75rem; font-size:0.85rem; font-weight:600; color:#16a34a;">
              🟢 In-Person & Online Counseling Active
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function selectBranchAndApply(deptName) {
  state.selectedBranchForApply = deptName;
  if (!state.token) {
    navigateTo('register');
  } else {
    navigateTo('apply');
  }
}

// Multi-Role Unified Portal Sign In View (Student & Various Administrators)
function renderLogin() {
  const isApplicantMode = state.loginMode === 'applicant';
  const defaultAdminPersonas = [
    {
      id: 'usr_admin_002',
      name: 'Prof. Dr. Satyajit Chakraborty',
      email: 'director@iem.edu.in',
      designation: 'Director & Main Administrator',
      department: 'Academic Directorate',
      isMainAdmin: true
    },
    {
      id: 'usr_admin_003',
      name: 'Dr. Arundhati Ray',
      email: 'admissions.officer@iem.edu.in',
      designation: 'Convener & Head of Admissions',
      department: 'Central Admissions Office',
      isMainAdmin: false
    },
    {
      id: 'usr_admin_004',
      name: 'Prof. Dr. Arun Kumar Bar',
      email: 'hod.cse@iem.edu.in',
      designation: 'Head of Department (CSE & AI-ML)',
      department: 'Computer Science & Engineering',
      isMainAdmin: false
    },
    {
      id: 'usr_admin_005',
      name: 'Prof. Dr. Malay Gangopadhyay',
      email: 'hod.ece@iem.edu.in',
      designation: 'Head of Department (ECE)',
      department: 'Electronics & Communication Engineering',
      isMainAdmin: false
    },
    {
      id: 'usr_admin_006',
      name: 'Dr. Subhabrata Sengupta',
      email: 'exam.controller@iem.edu.in',
      designation: 'Controller of Examinations',
      department: 'Office of the Controller of Examinations',
      isMainAdmin: false
    }
  ];

  const adminList = state.adminPersonas?.length > 0 ? state.adminPersonas : defaultAdminPersonas;

  return `
    <div style="max-width:880px; margin:2.5rem auto 4rem; padding:0 1rem;">
      <div class="login-tabs-nav">
        <button class="login-tab-btn ${isApplicantMode ? 'active' : ''}" onclick="state.loginMode = 'applicant'; render();">
          🎓 Candidate Student Sign In
        </button>
        <button class="login-tab-btn ${!isApplicantMode ? 'active' : ''}" onclick="state.loginMode = 'admin'; fetchAdminPersonas(); render();">
          🏛️ Faculty & Administrator Portal
        </button>
      </div>

      ${
        isApplicantMode
          ? `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:2rem;">
          <!-- Left: Standard Student Form -->
          <div class="card">
            <div class="card-header">
              <div>
                <h2 class="card-title">Applicant Sign In</h2>
                <p class="card-subtitle">Access your B.Tech admission profile & enrollment status</p>
              </div>
            </div>
            <form onsubmit="event.preventDefault(); handleLogin(this.email.value, this.password.value);">
              <div class="form-group" style="margin-bottom:1rem;">
                <label>Registered Email Address</label>
                <input type="email" name="email" required placeholder="e.g. aarav@example.com" />
              </div>
              <div class="form-group" style="margin-bottom:1.5rem;">
                <label>Account Password</label>
                <input type="password" name="password" required placeholder="••••••••" />
              </div>
              <button type="submit" class="nav-btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;">
                Sign In as Candidate
              </button>
            </form>
            <div style="text-align:center; margin-top:1.25rem; font-size:0.85rem; color:#64748b;">
              New applicant? <a href="#" style="color:#2563eb; text-decoration:none; font-weight:600;" onclick="navigateTo('register')">Register online</a>
            </div>
          </div>

          <!-- Right: Instant Demo Candidates -->
          <div class="card" style="background:#f8fafc; border-color:#e2e8f0;">
            <div class="card-header">
              <div>
                <h3 class="card-title" style="font-size:1.05rem;">Quick Candidate Switcher</h3>
                <p class="card-subtitle">Test lifecycle states with pre-configured student accounts</p>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <div style="background:#fff; border:1px solid #bbf7d0; border-radius:8px; padding:0.85rem; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:700; color:#0f172a; font-size:0.9rem;">Aarav Sharma</div>
                  <div style="font-size:0.78rem; color:#15803d; font-weight:600;">✅ Confirmed & Selected (B.Tech CSE)</div>
                  <div style="font-size:0.72rem; color:#64748b;">aarav@example.com • Pass: student123</div>
                </div>
                <button class="nav-btn btn-outline" style="font-size:0.8rem; padding:0.4rem 0.75rem;" onclick="handleLogin('aarav@example.com', 'student123')">
                  Sign In →
                </button>
              </div>

              <div style="background:#fff; border:1px solid #bae6fd; border-radius:8px; padding:0.85rem; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:700; color:#0f172a; font-size:0.9rem;">Diya Patel</div>
                  <div style="font-size:0.78rem; color:#0284c7; font-weight:600;">🔍 Under Review (B.Tech CSE AI & ML)</div>
                  <div style="font-size:0.72rem; color:#64748b;">diya@example.com • Pass: student123</div>
                </div>
                <button class="nav-btn btn-outline" style="font-size:0.8rem; padding:0.4rem 0.75rem;" onclick="handleLogin('diya@example.com', 'student123')">
                  Sign In →
                </button>
              </div>

              <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:0.85rem; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:700; color:#0f172a; font-size:0.9rem;">Rohan Verma</div>
                  <div style="font-size:0.78rem; color:#d97706; font-weight:600;">📥 Submitted (B.Tech ECE)</div>
                  <div style="font-size:0.72rem; color:#64748b;">rohan@example.com • Pass: student123</div>
                </div>
                <button class="nav-btn btn-outline" style="font-size:0.8rem; padding:0.4rem 0.75rem;" onclick="handleLogin('rohan@example.com', 'student123')">
                  Sign In →
                </button>
              </div>
            </div>
          </div>
        </div>
      `
          : `
        <div>
          <!-- Top Form: Administrator Direct Login -->
          <div class="card" style="margin-bottom:2rem;">
            <div class="card-header">
              <div>
                <h2 class="card-title">Administrative Credentials Sign In</h2>
                <p class="card-subtitle">Institute of Engineering & Management, Kolkata • Official Committee Access</p>
              </div>
            </div>
            <form onsubmit="event.preventDefault(); handleLogin(this.email.value, this.password.value);" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)) 160px; gap:1rem; align-items:flex-end;">
              <div class="form-group">
                <label>Administrator Email Address</label>
                <input type="email" name="email" required placeholder="director@iem.edu.in" />
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required placeholder="••••••••" />
              </div>
              <div>
                <button type="submit" class="nav-btn btn-primary" style="width:100%; justify-content:center; padding:0.7rem;">
                  Sign In →
                </button>
              </div>
            </form>
          </div>

          <!-- Bottom: Multi-Admin Instant Switcher Grid -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a;">Various Institutional Administrator Profiles</h3>
                <p style="font-size:0.85rem; color:#64748b;">Click any administrator to immediately access their authorized scrutiny view:</p>
              </div>
              <span class="badge badge-selected" style="font-size:0.75rem;">
                Default Password: admin123
              </span>
            </div>

            <div class="admin-personas-grid">
              ${adminList
                .map(
                  adm => `
                <div class="admin-persona-card" onclick="handleLogin('${adm.email}', 'admin123')">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                      <span style="font-size:1.5rem;">${adm.isMainAdmin ? '🏛️' : '📋'}</span>
                      <span class="${adm.isMainAdmin ? 'persona-badge-main' : 'persona-badge-sub'}">
                        ${adm.isMainAdmin ? 'Main Admin (Director)' : 'Dept Administrator'}
                      </span>
                    </div>
                    <div style="font-weight:800; color:#0f172a; font-size:0.95rem; line-height:1.3; margin-bottom:0.25rem;">
                      ${adm.name}
                    </div>
                    <div style="font-size:0.8rem; color:#2563eb; font-weight:600; margin-bottom:0.25rem;">
                      ${adm.designation}
                    </div>
                    <div style="font-size:0.75rem; color:#64748b; margin-bottom:0.5rem;">
                      ${adm.department}
                    </div>
                  </div>
                  <div style="border-top:1px solid #f1f5f9; padding-top:0.75rem; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.75rem; color:#94a3b8; font-family:monospace;">${adm.email}</span>
                    <button class="nav-btn btn-outline" style="font-size:0.75rem; padding:0.3rem 0.65rem;" onclick="event.stopPropagation(); handleLogin('${adm.email}', 'admin123')">
                      Sign In →
                    </button>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>

            <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:1rem; margin-top:1.5rem; font-size:0.85rem; color:#1e40af; line-height:1.5;">
              💡 <strong>Administrative Privileges:</strong> Sign in as the <strong>Director & Main Administrator</strong> (Prof. Dr. Satyajit Chakraborty) to view global intake statistics, confirm student admissions, and provision new administrator accounts.
            </div>
          </div>
        </div>
      `
      }
    </div>
  `;
}

// Student Register View
function renderRegister() {
  return `
    <div style="max-width:460px; margin:3rem auto;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Student Registration</h2>
            <p class="card-subtitle">Create your candidate profile for B.Tech Admission 2026–27</p>
          </div>
        </div>
        <form onsubmit="event.preventDefault(); handleRegister(this.name.value, this.email.value, this.password.value, 'applicant');">
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Candidate Full Name *</label>
            <input type="text" name="name" required placeholder="As in Class 10 Certificate" />
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Email Address *</label>
            <input type="email" name="email" required placeholder="active-email@example.com" />
          </div>
          <div class="form-group" style="margin-bottom:1.5rem;">
            <label>Create Password *</label>
            <input type="password" name="password" required minlength="6" placeholder="Minimum 6 characters" />
          </div>
          <button type="submit" class="nav-btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;">
            Create Profile & Continue
          </button>
        </form>
        <div style="text-align:center; margin-top:1.25rem; font-size:0.85rem; color:#64748b;">
          Already registered? <a href="#" style="color:#2563eb; text-decoration:none; font-weight:600;" onclick="navigateTo('login')">Sign in here</a>
        </div>
      </div>
    </div>
  `;
}

// Student Admission Form View
function renderApplyForm() {
  const defaultDept = state.selectedBranchForApply || 'B.Tech - Computer Science & Engineering (CSE)';

  return `
    <div style="max-width:850px; margin:1rem auto 3rem;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">B.Tech Admission Application (Session 2026–27)</h2>
            <p class="card-subtitle">Institute of Engineering & Management, Kolkata</p>
          </div>
        </div>

        <form onsubmit="handleApplicationSubmit(event)">
          <h3 style="font-size:1rem; font-weight:700; color:#1e293b; margin-bottom:1rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            1. Personal Details
          </h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" name="fullName" required value="${state.user?.name || ''}" placeholder="Candidate Full Name" />
            </div>
            <div class="form-group">
              <label>Date of Birth *</label>
              <input type="date" name="dob" required />
            </div>
            <div class="form-group">
              <label>Gender *</label>
              <select name="gender" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="phone" required placeholder="+91 98765 43210" />
            </div>
            <div class="form-group">
              <label>Contact Email *</label>
              <input type="email" name="email" required value="${state.user?.email || ''}" />
            </div>
            <div class="form-group">
              <label>Father / Guardian Name *</label>
              <input type="text" name="guardianName" required placeholder="Parent or Guardian" />
            </div>
            <div class="form-group full-width">
              <label>Permanent Residential Address *</label>
              <textarea name="address" required rows="2" placeholder="Street, City, State, PIN Code"></textarea>
            </div>
          </div>

          <h3 style="font-size:1rem; font-weight:700; color:#1e293b; margin:1.5rem 0 1rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            2. Academic Qualification (10+2 & Entrance)
          </h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Class 10 Board *</label>
              <input type="text" name="tenthBoard" required placeholder="CBSE / ICSE / WBCHSE" />
            </div>
            <div class="form-group">
              <label>Class 10 Aggregate (%) *</label>
              <input type="number" step="0.01" min="0" max="100" name="tenthPercentage" required placeholder="e.g. 92.5" />
            </div>
            <div class="form-group">
              <label>Class 12 Qualifying Board *</label>
              <input type="text" name="twelfthBoard" required placeholder="CBSE / ISC / WBCHSE" />
            </div>
            <div class="form-group">
              <label>Class 12 Aggregate Percentage (%) *</label>
              <input type="number" step="0.01" min="0" max="100" name="twelfthPercentage" required placeholder="e.g. 94.0" />
            </div>
            <div class="form-group full-width">
              <label>Entrance Exam Score / Rank Percentile (IEMJEE / WBJEE / JEE Main)</label>
              <input type="number" step="0.01" min="0" max="100" name="entranceScore" placeholder="Score / Percentile out of 100" />
            </div>
          </div>

          <h3 style="font-size:1rem; font-weight:700; color:#1e293b; margin:1.5rem 0 1rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            3. B.Tech Branch Preference & Document Upload
          </h3>
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Select B.Tech Programme Applied For *</label>
              <select name="department" required>
                ${BTECH_PROGRAMMES.map(
                  p => `<option value="${p.deptName}" ${p.deptName === defaultDept ? 'selected' : ''}>${p.deptName} (${p.campus})</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-group full-width">
              <label>Upload Class 12 Marksheet / Transcript * (PDF, PNG, JPG - max 5MB)</label>
              <div class="file-upload-zone" onclick="document.getElementById('marksheetInput').click()">
                <div style="font-size:2rem; margin-bottom:0.5rem;">📄</div>
                <div style="font-weight:600; color:#1e293b;">Click to upload academic transcript or mark statement</div>
                <div style="font-size:0.8rem; color:#64748b; margin-top:0.25rem;">Accepted formats: PDF, PNG, JPEG (Maximum 5MB)</div>
                <div id="fileSelectionName" style="font-weight:700; color:#2563eb; margin-top:0.75rem;"></div>
              </div>
              <input
                id="marksheetInput"
                type="file"
                name="document"
                accept=".pdf,image/png,image/jpeg,image/jpg"
                style="display:none;"
                onchange="document.getElementById('fileSelectionName').innerText = this.files[0] ? 'Selected: ' + this.files[0].name + ' (' + (this.files[0].size/1024).toFixed(1) + ' KB)' : ''"
                required
              />
            </div>
          </div>

          <div style="margin-top:2rem; display:flex; justify-content:flex-end; gap:1rem;">
            <button type="button" class="nav-btn btn-outline" onclick="navigateTo('home')">Cancel</button>
            <button type="submit" class="nav-btn btn-primary" style="padding:0.75rem 2rem;">
              Submit B.Tech Admission Application
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Student Status View with 5-Step Enrollment Pipeline, Curriculum, Credits & Prior Scores
function renderStudentStatus() {
  const app = state.myApplication;
  if (!app) {
    return `
      <div style="text-align:center; padding:4rem 1rem;">
        <h3>No application submitted yet</h3>
        <p style="color:#64748b; margin:1rem 0;">Ready to apply for B.Tech admission at IEM Kolkata?</p>
        <button class="nav-btn btn-primary" onclick="navigateTo('apply')">Fill B.Tech Application Form</button>
      </div>
    `;
  }

  const isConfirmed = app.status === 'Selected';
  const isUnderReview = app.status === 'Under Review';
  const isSubmitted = app.status === 'Submitted';
  const isRejected = app.status === 'Rejected';

  const badgeClass =
    isSubmitted
      ? 'badge-submitted'
      : isUnderReview
      ? 'badge-review'
      : isConfirmed
      ? 'badge-selected'
      : 'badge-rejected';

  // Retrieve department specific curriculum or fallback
  const curr =
    DEPARTMENT_CURRICULUM[app.department] ||
    DEPARTMENT_CURRICULUM['B.Tech - Computer Science & Engineering (CSE)'];

  const studentUID = `IEM/2026/BTECH-${curr.branchCode}/${app._id.slice(-4).toUpperCase()}`;

  return `
    <div style="max-width:960px; margin:1rem auto 4rem; padding:0 1rem;">
      <div class="card">
        <!-- Top Status Banner -->
        <div class="card-header" style="flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.35rem;">
              <span class="announcement-badge" style="font-size:0.75rem;">SESSION 2026–27</span>
              <span style="font-size:0.85rem; color:#64748b; font-weight:600;">Reference ID: #${app._id.slice(-8).toUpperCase()}</span>
            </div>
            <h2 class="card-title">Undergraduate Admission & Enrollment Status</h2>
            <p class="card-subtitle">Institute of Engineering & Management (IEM), Kolkata • Candidate: <strong>${app.fullName}</strong></p>
          </div>
          <div style="text-align:right;">
            <span class="badge ${badgeClass}" style="font-size:1rem; padding:0.5rem 1.15rem;">
              ● ${isConfirmed ? 'Admission Confirmed & Enrolled' : app.status}
            </span>
            ${
              isConfirmed
                ? `<div style="font-size:0.78rem; color:#15803d; font-weight:700; margin-top:0.4rem;">UID: ${studentUID}</div>`
                : ''
            }
          </div>
        </div>

        <!-- 5-Step Academic Lifecycle Stepper Pipeline -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.5rem 1.25rem; margin:1.25rem 0 2rem;">
          <div style="font-size:0.82rem; text-transform:uppercase; letter-spacing:0.5px; color:#475569; font-weight:800; margin-bottom:1rem; text-align:center;">
            Institutional Admission & Academic Allotment Pipeline
          </div>
          
          <div class="stepper-pipeline">
            <!-- Step 1 -->
            <div class="stepper-step completed">
              <div class="stepper-circle">✓</div>
              <div class="stepper-title">Step 1: Application</div>
              <div class="stepper-desc">KYC Transcripts & Marksheet Uploaded</div>
            </div>

            <!-- Step 2 -->
            <div class="stepper-step ${isSubmitted ? 'active' : 'completed'}">
              <div class="stepper-circle">${isSubmitted ? '2' : '✓'}</div>
              <div class="stepper-title">Step 2: Scrutiny</div>
              <div class="stepper-desc">${isSubmitted ? 'Cutoff In Scrutiny Queue' : '10+2 & Merit Cutoff Cleared'}</div>
            </div>

            <!-- Step 3 -->
            <div class="stepper-step ${isConfirmed ? 'completed' : isUnderReview ? 'active' : isRejected ? 'locked' : 'locked'}">
              <div class="stepper-circle">${isConfirmed ? '✓' : isUnderReview ? '3' : isRejected ? '✕' : '3'}</div>
              <div class="stepper-title">Step 3: Confirmation</div>
              <div class="stepper-desc">
                ${isConfirmed ? 'Directorate Approved Seat' : isUnderReview ? 'Under Active Review' : isRejected ? 'Cutoff Unmet' : 'Awaiting Review'}
              </div>
            </div>

            <!-- Step 4 -->
            <div class="stepper-step ${isConfirmed ? 'completed' : 'locked'}">
              <div class="stepper-circle">${isConfirmed ? '✓' : '🔒'}</div>
              <div class="stepper-title">Step 4: Curriculum</div>
              <div class="stepper-desc">${isConfirmed ? 'Sem-1 Subjects & Credits Enrolled' : 'Unlocks upon Confirmation'}</div>
            </div>

            <!-- Step 5 -->
            <div class="stepper-step ${isConfirmed ? 'completed' : 'locked'}">
              <div class="stepper-circle">${isConfirmed ? '✓' : '🔒'}</div>
              <div class="stepper-title">Step 5: Scorecard</div>
              <div class="stepper-desc">${isConfirmed ? 'Prior Scores & Foundation Card' : 'Unlocks upon Confirmation'}</div>
            </div>
          </div>
        </div>

        ${
          isConfirmed
            ? `
          <!-- CONFIRMED ADMISSION ENROLLMENT CARD & TABS -->
          <div style="background:linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border:1px solid #bfdbfe; border-radius:12px; padding:1.5rem; margin-bottom:2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
              <div>
                <div style="font-size:0.8rem; text-transform:uppercase; color:#1e40af; font-weight:800; letter-spacing:0.5px;">Official Admission Allotment Order</div>
                <div style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0.25rem 0;">
                  ${app.department}
                </div>
                <div style="font-size:0.88rem; color:#475569;">
                  Enrolled Candidate: <strong>${app.fullName}</strong> • Roll / UID: <strong style="color:#2563eb;">${studentUID}</strong> • Campus: <strong>Salt Lake Sector V</strong>
                </div>
              </div>
              <div>
                <span class="badge badge-selected" style="font-size:0.85rem; padding:0.45rem 0.9rem;">
                  🎓 Semester 1 Course Allocation Active
                </span>
              </div>
            </div>
          </div>

          <!-- Tab Bar for Confirmed Student -->
          <div class="login-tabs-nav" style="margin-bottom:1.5rem;">
            <button class="login-tab-btn ${state.studentAcademicTab === 'curriculum' ? 'active' : ''}" onclick="state.studentAcademicTab = 'curriculum'; render();">
              📚 Step 4: Upcoming Semester 1 Curriculum & Credits (${curr.totalCredits} Credits)
            </button>
            <button class="login-tab-btn ${state.studentAcademicTab === 'scores' ? 'active' : ''}" onclick="state.studentAcademicTab = 'scores'; render();">
              📊 Step 5: Previous Examination Baseline & Foundation Scorecard
            </button>
            <button class="login-tab-btn ${state.studentAcademicTab === 'timeline' ? 'active' : ''}" onclick="state.studentAcademicTab = 'timeline'; render();">
              📜 Application Dossier & Timeline
            </button>
          </div>

          ${
            state.studentAcademicTab === 'curriculum'
              ? `
            <!-- STEP 4: UPCOMING SEMESTER CURRICULUM & CREDITS TABLE -->
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
                <div>
                  <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a;">
                    Enrolled Courses & Credits for ${curr.upcomingSem}
                  </h3>
                  <p style="font-size:0.85rem; color:#64748b;">
                    Cohort: <strong>${curr.orientationGroup}</strong> • Total Credit Allocation: <strong style="color:#2563eb;">${curr.totalCredits} AICTE Model Credits</strong>
                  </p>
                </div>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                  <span class="type-pill type-pill-theory">Theory (4 Courses)</span>
                  <span class="type-pill type-pill-lab">Practical Labs (2 Units)</span>
                  <span class="type-pill type-pill-workshop">Workshop Studio (1 Unit)</span>
                </div>
              </div>

              <div style="overflow-x:auto;">
                <table class="curriculum-table">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Title</th>
                      <th>Category</th>
                      <th>L-T-P</th>
                      <th>Credits</th>
                      <th>Assigned Professor / Laboratory</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${curr.subjects
                      .map(
                        sub => `
                      <tr>
                        <td style="font-family:monospace; font-weight:700; color:#2563eb;">${sub.code}</td>
                        <td style="font-weight:700; color:#0f172a;">
                          ${sub.name}
                          <div style="font-size:0.75rem; color:#64748b; font-weight:normal;">Room / Bay: ${sub.room}</div>
                        </td>
                        <td>
                          <span class="type-pill ${
                            sub.type.includes('Theory')
                              ? 'type-pill-theory'
                              : sub.type.includes('Lab')
                              ? 'type-pill-lab'
                              : sub.type.includes('Workshop')
                              ? 'type-pill-workshop'
                              : 'type-pill-humanities'
                          }">
                            ${sub.type}
                          </span>
                        </td>
                        <td style="font-family:monospace; font-size:0.82rem; color:#475569;">${sub.ltp}</td>
                        <td>
                          <span class="credit-pill">${sub.credits.toFixed(1)} Credits</span>
                        </td>
                        <td style="font-size:0.85rem; color:#334155;">
                          <strong>${sub.faculty}</strong>
                        </td>
                      </tr>
                    `
                      )
                      .join('')}
                  </tbody>
                  <tfoot>
                    <tr style="background:#f8fafc; font-weight:800; border-top:2px solid #0f172a;">
                      <td colspan="4" style="text-align:right; font-size:0.95rem; color:#0f172a;">
                        Total Upcoming Semester Registered Academic Credit Load:
                      </td>
                      <td style="font-size:1.1rem; color:#2563eb;">${curr.totalCredits.toFixed(1)} Credits</td>
                      <td style="font-size:0.8rem; color:#16a34a;">Status: Confirmed by Controller of Exams</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:1rem; margin-top:1rem; font-size:0.825rem; color:#475569; line-height:1.6;">
                📌 <strong>Academic Directive:</strong> Full attendance in laboratories and workshops is mandatory per IEM Autonomous Curriculum. Course syllabus packages and IEEE digital access tokens will be dispatched to your student email.
              </div>
            </div>
          `
              : state.studentAcademicTab === 'scores'
              ? `
            <!-- STEP 5: PREVIOUS SEMESTER & ACADEMIC EVALUATION SCORECARD -->
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
                <div>
                  <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a;">
                    Prior Academic Evaluation & Foundation Scorecard
                  </h3>
                  <p style="font-size:0.85rem; color:#64748b;">
                    Class 10th, 12th Board Transcripts & Pre-Engineering Diagnostic Assessment Baseline
                  </p>
                </div>
                <span class="badge badge-selected" style="font-size:0.85rem;">
                  SGPA Equivalent: ${curr.previousScores.sgpaEquivalent}
                </span>
              </div>

              <!-- Top Metrics Grid -->
              <div class="scorecard-grid">
                <div class="scorecard-item">
                  <div>
                    <div style="font-size:0.75rem; text-transform:uppercase; color:#64748b; font-weight:700;">Class 10th Secondary</div>
                    <div style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-top:0.2rem;">${app.tenthPercentage}%</div>
                    <div style="font-size:0.75rem; color:#64748b;">Board: ${app.tenthBoard}</div>
                  </div>
                  <span class="grade-badge-o">Grade: A1</span>
                </div>

                <div class="scorecard-item">
                  <div>
                    <div style="font-size:0.75rem; text-transform:uppercase; color:#64748b; font-weight:700;">Class 12th Higher Sec.</div>
                    <div style="font-size:1.25rem; font-weight:800; color:#16a34a; margin-top:0.2rem;">${app.twelfthPercentage}%</div>
                    <div style="font-size:0.75rem; color:#64748b;">PCM Aggregate (${app.twelfthBoard})</div>
                  </div>
                  <span class="grade-badge-o">Grade: Distinction</span>
                </div>

                <div class="scorecard-item">
                  <div>
                    <div style="font-size:0.75rem; text-transform:uppercase; color:#64748b; font-weight:700;">Entrance Exam Percentile</div>
                    <div style="font-size:1.25rem; font-weight:800; color:#2563eb; margin-top:0.2rem;">${app.entranceScore || 94.5} / 100</div>
                    <div style="font-size:0.75rem; color:#64748b;">WBJEE / IEMJEE Merit Merit Rank</div>
                  </div>
                  <span class="grade-badge-o">Rank #142</span>
                </div>
              </div>

              <!-- Foundation Diagnostics Course Table -->
              <div style="margin-top:1.5rem;">
                <div style="font-weight:700; font-size:0.95rem; color:#0f172a; margin-bottom:0.75rem;">
                  Evaluated Foundation Diagnostics & Prior Course Performance
                </div>
                <div style="overflow-x:auto;">
                  <table class="curriculum-table">
                    <thead>
                      <tr>
                        <th>Subject Code</th>
                        <th>Foundation Discipline</th>
                        <th>Score Obtained</th>
                        <th>Letter Grade</th>
                        <th>Grade Points (10.0 Scale)</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${curr.previousScores.courses
                        .map(
                          c => `
                        <tr>
                          <td style="font-family:monospace; font-weight:700; color:#2563eb;">${c.code}</td>
                          <td style="font-weight:700; color:#0f172a;">${c.subject}</td>
                          <td style="font-weight:800; color:#15803d;">${c.marks}</td>
                          <td>
                            <span class="${c.grade.startsWith('O') ? 'grade-badge-o' : 'grade-badge-e'}">
                              ${c.grade}
                            </span>
                          </td>
                          <td style="font-weight:800; color:#0f172a;">${c.points}.0</td>
                        </tr>
                      `
                        )
                        .join('')}
                    </tbody>
                    <tfoot>
                      <tr style="background:#f8fafc; font-weight:800;">
                        <td colspan="4" style="text-align:right; font-size:0.9rem; color:#0f172a;">
                          Cumulative Foundation Index (Prior Term SGPA Equivalent):
                        </td>
                        <td style="font-size:1.15rem; color:#16a34a;">${curr.previousScores.sgpaEquivalent}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem; font-size:0.8rem; color:#64748b; border-top:1px solid #f1f5f9; padding-top:0.75rem;">
                  <span>Evaluator: <strong>Office of Controller of Examinations (Dr. Subhabrata Sengupta)</strong></span>
                  <span>Certified by: <strong>Director, Prof. Dr. Satyajit Chakraborty</strong></span>
                </div>
              </div>
            </div>
          `
              : `
            <!-- TIMELINE & DOSSIER TAB -->
            <div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem; margin-bottom:1.5rem;">
                <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0;">
                  <div style="font-size:0.8rem; text-transform:uppercase; color:#64748b; font-weight:700;">Programme Admitted</div>
                  <div style="font-size:1.05rem; font-weight:700; color:#0f172a; margin-top:0.35rem;">${app.department}</div>
                </div>
                <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0;">
                  <div style="font-size:0.8rem; text-transform:uppercase; color:#64748b; font-weight:700;">Contact & Roll Record</div>
                  <div style="font-size:0.95rem; font-weight:700; color:#0f172a; margin-top:0.35rem;">
                    ${app.phone} • ${app.email}
                  </div>
                </div>
                <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0;">
                  <div style="font-size:0.8rem; text-transform:uppercase; color:#64748b; font-weight:700;">Uploaded Certificate</div>
                  <div style="margin-top:0.35rem;">
                    <a href="${app.document.path}" target="_blank" style="color:#2563eb; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem;">
                      📎 ${app.document.originalName}
                    </a>
                  </div>
                </div>
              </div>

              <h3 style="font-size:1.1rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">
                Official Admissions Audit Log & Verification Timeline
              </h3>
              
              <div class="timeline">
                ${(app.statusHistory || [])
                  .map(
                    hist => `
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <strong>${hist.status}</strong>
                        <span style="font-size:0.8rem; color:#64748b;">${new Date(hist.timestamp).toLocaleDateString()} ${new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div style="font-size:0.9rem; color:#475569;">${hist.comments || 'Status update logged.'}</div>
                      ${hist.updatedBy ? `<div style="font-size:0.75rem; color:#64748b; margin-top:0.25rem;">Authorized Signatory: <strong>${hist.updatedBy.name || 'Admissions Directorate'}</strong></div>` : ''}
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
          }
        `
            : `
          <!-- UNCONFIRMED / PENDING STATE: LOCKED CURRICULUM & SCORES DISPLAY -->
          <div class="academic-locked-card">
            <div style="font-size:2.8rem; margin-bottom:0.75rem;">🔒</div>
            <h3 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem;">
              Step 4 (Upcoming Semester Curriculum & Credits) & Step 5 (Scorecard) are Locked
            </h3>
            <p style="color:#475569; max-width:620px; margin:0 auto 1.5rem; font-size:0.92rem; line-height:1.6;">
              Your upcoming semester subjects, <strong>${curr.totalCredits} AICTE course credits</strong>, laboratory room allotments, and prior examination scorecard will unlock automatically as soon as an Admissions Administrator confirms your seat allotment.
            </p>
            <div style="display:inline-flex; align-items:center; gap:0.75rem; background:#ffffff; border:1px solid #e2e8f0; padding:0.6rem 1.25rem; border-radius:9999px; font-size:0.85rem; color:#0f172a; box-shadow:var(--shadow-sm);">
              <span>Current Status: <strong style="color:${isUnderReview ? '#0284c7' : '#d97706'};">${app.status}</strong></span>
              <span>•</span>
              <span>Applied Branch: <strong>${app.department}</strong></span>
            </div>
            
            <div style="margin-top:2rem; font-size:0.85rem; color:#64748b;">
              💡 <strong>Want to test this feature?</strong> Sign in as an administrator (e.g. Director Prof. Dr. Satyajit Chakraborty) via the multi-admin switcher, navigate to <strong>Review Applicants</strong>, and transition this candidate to <strong>"Selected"</strong>. Returning here will immediately display all enrolled subjects, credits, and scores!
            </div>
          </div>

          <!-- Basic Timeline for Pending Candidate -->
          <div style="margin-top:2.5rem; border-top:1px solid #e2e8f0; padding-top:1.5rem;">
            <h4 style="font-size:1rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">
              Current Processing Log
            </h4>
            <div class="timeline">
              ${(app.statusHistory || [])
                .map(
                  hist => `
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <strong>${hist.status}</strong>
                      <span style="font-size:0.8rem; color:#64748b;">${new Date(hist.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style="font-size:0.88rem; color:#475569;">${hist.comments || 'Status update logged.'}</div>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
        }
      </div>
    </div>
  `;
}

// Admin Dashboard View with Analytics & Main Admin Staff Management
function renderAdminDashboard() {
  const stats = state.adminStats;
  if (!stats) {
    return `<div style="text-align:center; padding:4rem;">Loading admissions statistics...</div>`;
  }

  const isMainAdmin =
    state.user?.isMainAdmin ||
    state.user?.email === 'director@iem.edu.in' ||
    state.user?.email === 'admin@college.edu';

  const maxDept = Math.max(...Object.values(stats.departmentCounts || {}), 1);
  const adminStaffList = state.adminList || [];

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:1.75rem; font-weight:800; color:#0f172a;">Admissions Committee Dashboard</h1>
          <p style="color:#64748b; font-size:0.9rem;">
            Institute of Engineering & Management (IEM), Kolkata • Authenticated: <strong>${state.user.name}</strong> ${state.user.designation ? `(${state.user.designation})` : ''}
          </p>
        </div>
        <div style="display:flex; gap:0.75rem;">
          <button class="nav-btn btn-primary" onclick="navigateTo('admin-applicants')">
            📋 Review Applicants (${stats.total})
          </button>
        </div>
      </div>

      <!-- Dashboard Sub-Navigation Tabs -->
      <div class="admin-subnav">
        <button class="admin-subnav-btn ${state.adminTab === 'analytics' ? 'active' : ''}" onclick="state.adminTab = 'analytics'; render();">
          📊 Admissions Analytics & Benchmarks
        </button>
        <button class="admin-subnav-btn ${state.adminTab === 'staff' ? 'active' : ''}" onclick="state.adminTab = 'staff'; fetchAdminStaffList(); render();">
          🏛️ Administrative Staff & Access Control (${adminStaffList.length})
        </button>
      </div>

      ${
        state.adminTab === 'analytics'
          ? `
        <!-- ANALYTICS TAB CONTENT -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon" style="background:#eff6ff; color:#2563eb;">👥</div>
            <div>
              <div class="metric-val">${stats.total}</div>
              <div class="metric-label">Total Applicants</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon" style="background:#fffbeb; color:#d97706;">⏳</div>
            <div>
              <div class="metric-val">${stats.statusCounts['Submitted'] || 0}</div>
              <div class="metric-label">New Applications</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon" style="background:#f0f9ff; color:#0284c7;">🔍</div>
            <div>
              <div class="metric-val">${stats.statusCounts['Under Review'] || 0}</div>
              <div class="metric-label">Under Verification</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon" style="background:#f0fdf4; color:#16a34a;">🎓</div>
            <div>
              <div class="metric-val">${stats.statusCounts['Selected'] || 0}</div>
              <div class="metric-label">Selected / Allotted</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon" style="background:#fef2f2; color:#dc2626;">❌</div>
            <div>
              <div class="metric-val">${stats.statusCounts['Rejected'] || 0}</div>
              <div class="metric-label">Ineligible</div>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:1.5rem;">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">B.Tech Branch Demand Distribution</h3>
                <p class="card-subtitle">Volume of applications per engineering branch</p>
              </div>
            </div>
            <div>
              ${
                Object.keys(stats.departmentCounts || {}).length === 0
                  ? `<p style="color:#64748b;">No department records yet.</p>`
                  : Object.entries(stats.departmentCounts)
                      .map(([dept, count]) => {
                        const pct = Math.round((count / maxDept) * 100);
                        return `
                    <div class="dept-bar">
                      <div class="dept-bar-label" title="${dept}">${dept}</div>
                      <div class="dept-bar-track">
                        <div class="dept-bar-fill" style="width:${pct}%;"></div>
                      </div>
                      <div style="font-weight:700; font-size:0.85rem; width:30px; text-align:right;">${count}</div>
                    </div>
                  `;
                      })
                      .join('')
              }
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Candidate Merit Benchmark</h3>
                <p class="card-subtitle">Aggregated cutoff averages across applicant pool</p>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:1.25rem;">
              <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:600; color:#334155;">Average Class 10th Aggregate</div>
                  <div style="font-size:0.8rem; color:#64748b;">Secondary board merit benchmark</div>
                </div>
                <div style="font-size:1.75rem; font-weight:800; color:#2563eb;">${stats.averages?.avgTenth || 0}%</div>
              </div>

              <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:600; color:#334155;">Average Class 12th Aggregate</div>
                  <div style="font-size:0.8rem; color:#64748b;">Higher secondary qualifying cutoff</div>
                </div>
                <div style="font-size:1.75rem; font-weight:800; color:#16a34a;">${stats.averages?.avgTwelfth || 0}%</div>
              </div>

              <div style="background:#eff6ff; padding:1rem; border-radius:8px; border:1px solid #bfdbfe; font-size:0.85rem; color:#1e40af;">
                🏛️ <strong>Admissions Committee Note:</strong> Minimum qualifying threshold is 45% aggregate in 10+2 with Physics & Mathematics as mandatory subjects.
              </div>
            </div>
          </div>
        </div>
      `
          : `
        <!-- STAFF & ACCESS CONTROL TAB -->
        <div style="display:grid; grid-template-columns:${isMainAdmin ? '1.2fr 1fr' : '1fr'}; gap:2rem; align-items:start;">
          <!-- Left: Current Administrators Directory -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Authorized Institutional Administrators</h3>
                <p class="card-subtitle">Committee members, department chairs & examination controllers</p>
              </div>
              <button class="nav-btn btn-outline" style="font-size:0.8rem; padding:0.35rem 0.75rem;" onclick="fetchAdminStaffList()">
                🔄 Refresh Roster
              </button>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              ${adminStaffList
                .map(
                  adm => `
                <div style="border:1px solid #e2e8f0; border-radius:8px; padding:1rem; display:flex; justify-content:space-between; align-items:center; background:#fff;">
                  <div>
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                      <span style="font-weight:800; color:#0f172a; font-size:0.95rem;">${adm.name}</span>
                      <span class="${adm.isMainAdmin ? 'persona-badge-main' : 'persona-badge-sub'}">
                        ${adm.isMainAdmin ? 'Main Admin (Director)' : 'Dept Administrator'}
                      </span>
                    </div>
                    <div style="font-size:0.82rem; color:#2563eb; font-weight:600;">${adm.designation || 'Administrator'}</div>
                    <div style="font-size:0.75rem; color:#64748b;">${adm.department || 'Central Directorate'} • <span style="font-family:monospace;">${adm.email}</span></div>
                  </div>
                  <div>
                    <span style="font-size:0.75rem; background:#f1f5f9; padding:0.25rem 0.6rem; border-radius:9999px; color:#475569; font-weight:600;">
                      Active
                    </span>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Right: Provision New Admin (Only for Main Admin) -->
          <div>
            ${
              isMainAdmin
                ? `
              <div class="card" style="border:2px solid #bfdbfe; background:#fcfdfe;">
                <div class="card-header">
                  <div>
                    <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:#2563eb; letter-spacing:0.5px;">Director Privileges</div>
                    <h3 class="card-title">Provision New Administrator</h3>
                    <p class="card-subtitle">Grant faculty or scrutiny officers administrative review authority</p>
                  </div>
                </div>

                <form onsubmit="
                  event.preventDefault();
                  handleAddAdmin(
                    this.adminName.value,
                    this.adminEmail.value,
                    this.adminPassword.value,
                    this.adminDesignation.value,
                    this.adminDepartment.value
                  );
                  this.reset();
                ">
                  <div class="form-group" style="margin-bottom:0.85rem;">
                    <label>Administrator Full Name *</label>
                    <input type="text" name="adminName" required placeholder="e.g. Dr. Sneha Mukherjee" />
                  </div>

                  <div class="form-group" style="margin-bottom:0.85rem;">
                    <label>Official Institutional Email *</label>
                    <input type="email" name="adminEmail" required placeholder="e.g. sneha.it@iem.edu.in" />
                  </div>

                  <div class="form-group" style="margin-bottom:0.85rem;">
                    <label>Temporary Password * (Min 6 characters)</label>
                    <input type="password" name="adminPassword" required minlength="6" placeholder="admin123" value="admin123" />
                  </div>

                  <div class="form-group" style="margin-bottom:0.85rem;">
                    <label>Official Administrative Designation *</label>
                    <select name="adminDesignation" required>
                      <option value="Head of Department (IT)">Head of Department (IT)</option>
                      <option value="Head of Department (CSBS)">Head of Department (CSBS)</option>
                      <option value="Associate Dean (Academics)">Associate Dean (Academics)</option>
                      <option value="Senior Scrutiny Officer">Senior Scrutiny Officer</option>
                      <option value="Admission Counseling Officer">Admission Counseling Officer</option>
                      <option value="Laboratory Director">Laboratory Director</option>
                    </select>
                  </div>

                  <div class="form-group" style="margin-bottom:1.25rem;">
                    <label>Associated Academic Department *</label>
                    <select name="adminDepartment" required>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Computer Science & Business Systems">Computer Science & Business Systems</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Central Admissions Directorate">Central Admissions Directorate</option>
                      <option value="Office of the Controller of Examinations">Office of the Controller of Examinations</option>
                    </select>
                  </div>

                  <button type="submit" class="nav-btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;">
                    + Grant Administrator Access
                  </button>
                </form>

                <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:0.75rem; font-size:0.8rem; color:#1e40af; margin-top:1rem;">
                  ℹ️ Once created, this administrator will immediately appear in the <strong>Faculty & Administrator Portal</strong> login switcher.
                </div>
              </div>
            `
                : `
              <div class="card" style="background:#f8fafc; border:1px solid #e2e8f0; text-align:center; padding:2.5rem 1.5rem;">
                <div style="font-size:2.2rem; margin-bottom:0.5rem;">🔒</div>
                <h4 style="font-size:1.05rem; font-weight:700; color:#0f172a; margin-bottom:0.35rem;">
                  Administrator Provisioning Restricted
                </h4>
                <p style="font-size:0.85rem; color:#64748b; line-height:1.5;">
                  You are signed in as an Institutional Administrator (<strong>${state.user.name}</strong>). Only the <strong>Director & Main Administrator</strong> (Prof. Dr. Satyajit Chakraborty) is authorized to provision new administrative accounts.
                </p>
              </div>
            `
            }
          </div>
        </div>
      `
      }
    </div>
  `;
}

// Admin Applicants Review View
function renderAdminApplicants() {
  const applicants = state.adminApplicants;

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:1.75rem; font-weight:800; color:#0f172a;">Candidate Verification & Allotment</h1>
          <p style="color:#64748b; font-size:0.9rem;">Review uploaded marksheets and issue provisional admission decisions</p>
        </div>
        <div>
          <button class="nav-btn btn-outline" onclick="navigateTo('admin-dashboard')">
            ← Back to Analytics
          </button>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem; padding:1.25rem;">
        <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
          <div style="flex:1; min-width:220px;">
            <input
              type="text"
              placeholder="🔍 Search candidate name, email, or phone..."
              value="${state.filters.search}"
              style="width:100%;"
              oninput="state.filters.search = this.value; fetchAdminApplicants();"
            />
          </div>
          <div>
            <select onchange="state.filters.department = this.value; fetchAdminApplicants();">
              <option value="All" ${state.filters.department === 'All' ? 'selected' : ''}>All B.Tech Branches</option>
              ${BTECH_PROGRAMMES.map(
                p => `<option value="${p.deptName}" ${state.filters.department === p.deptName ? 'selected' : ''}>${p.title}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <select onchange="state.filters.status = this.value; fetchAdminApplicants();">
              <option value="All" ${state.filters.status === 'All' ? 'selected' : ''}>All Statuses</option>
              <option value="Submitted" ${state.filters.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
              <option value="Under Review" ${state.filters.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Selected" ${state.filters.status === 'Selected' ? 'selected' : ''}>Selected</option>
              <option value="Rejected" ${state.filters.status === 'Rejected' ? 'selected' : ''}>Ineligible</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card" style="padding:0; overflow:hidden;">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>B.Tech Branch</th>
                <th>10th / 12th %</th>
                <th>Transcript</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              ${
                applicants.length === 0
                  ? `<tr><td colspan="6" style="text-align:center; padding:2.5rem; color:#64748b;">No applicants match the current filter criteria.</td></tr>`
                  : applicants
                      .map(
                        app => `
                <tr>
                  <td>
                    <div style="font-weight:700; color:#0f172a;">${app.fullName}</div>
                    <div style="font-size:0.8rem; color:#64748b;">${app.email} | ${app.phone}</div>
                  </td>
                  <td>
                    <span style="font-size:0.85rem; font-weight:600; color:#334155;">${app.department}</span>
                  </td>
                  <td>
                    <div style="font-size:0.85rem;"><strong>10th:</strong> ${app.tenthPercentage}%</div>
                    <div style="font-size:0.85rem;"><strong>12th:</strong> ${app.twelfthPercentage}%</div>
                  </td>
                  <td>
                    <a href="${app.document?.path}" target="_blank" style="color:#2563eb; text-decoration:none; font-weight:600; font-size:0.85rem; display:inline-flex; align-items:center; gap:0.25rem;">
                      📄 View Document
                    </a>
                  </td>
                  <td>
                    <span class="badge ${
                      app.status === 'Submitted'
                        ? 'badge-submitted'
                        : app.status === 'Under Review'
                        ? 'badge-review'
                        : app.status === 'Selected'
                        ? 'badge-selected'
                        : 'badge-rejected'
                    }">
                      ${app.status}
                    </span>
                  </td>
                  <td>
                    <button class="nav-btn btn-outline" style="padding:0.4rem 0.8rem; font-size:0.8rem;" onclick="state.selectedApplicant = ${JSON.stringify(app).replace(/"/g, '&quot;')}; render();">
                      Review & Decide
                    </button>
                  </td>
                </tr>
              `
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Review Decision Modal
function renderReviewModal() {
  const app = state.selectedApplicant;
  if (!app) return '';

  const allowedNextStatuses = {
    Submitted: ['Under Review'],
    'Under Review': ['Selected', 'Rejected'],
    Selected: ['Under Review'],
    Rejected: ['Under Review']
  }[app.status] || [];

  return `
    <div class="modal-overlay" onclick="if(event.target === this) { state.selectedApplicant = null; render(); }">
      <div class="modal">
        <div class="card-header">
          <div>
            <h3 class="card-title">Applicant Scrutiny: ${app.fullName}</h3>
            <p class="card-subtitle">Current State: <strong style="color:#2563eb;">${app.status}</strong></p>
          </div>
          <button class="nav-btn" style="padding:0.25rem 0.5rem;" onclick="state.selectedApplicant = null; render();">✕</button>
        </div>

        <div style="margin-bottom:1.5rem; font-size:0.9rem; line-height:1.6;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; background:#f8fafc; padding:1rem; border-radius:8px;">
            <div><strong>Email:</strong> ${app.email}</div>
            <div><strong>Phone:</strong> ${app.phone}</div>
            <div><strong>Gender / DOB:</strong> ${app.gender} (${new Date(app.dob).toLocaleDateString()})</div>
            <div><strong>Guardian:</strong> ${app.guardianName}</div>
            <div><strong>10th Board:</strong> ${app.tenthBoard} (${app.tenthPercentage}%)</div>
            <div><strong>12th Board:</strong> ${app.twelfthBoard} (${app.twelfthPercentage}%)</div>
            <div style="grid-column:1 / -1;"><strong>Programme:</strong> ${app.department}</div>
            <div style="grid-column:1 / -1;"><strong>Address:</strong> ${app.address}</div>
            <div style="grid-column:1 / -1;">
              <strong>Marksheet / Rankcard:</strong> 
              <a href="${app.document?.path}" target="_blank" style="color:#2563eb; font-weight:600;">
                📎 Open ${app.document?.originalName}
              </a>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #e2e8f0; padding-top:1.25rem;">
          <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.75rem; color:#0f172a;">
            Admissions Committee Decision (${state.user?.name || 'Authorized Reviewer'})
          </h4>
          
          ${
            allowedNextStatuses.length === 0
              ? `<p style="color:#64748b; font-size:0.85rem;">No further status transitions allowed from '${app.status}'.</p>`
              : `
            <form onsubmit="event.preventDefault(); handleStatusChange('${app._id}', this.nextStatus.value, this.comments.value);">
              <div class="form-group" style="margin-bottom:0.75rem;">
                <label>Next State Decision</label>
                <select name="nextStatus" required onchange="
                  const infoEl = document.getElementById('enrollment-confirm-info');
                  if (infoEl) infoEl.style.display = this.value === 'Selected' ? 'block' : 'none';
                ">
                  ${allowedNextStatuses
                    .map(
                      s => `
                    <option value="${s}">
                      ${s === 'Selected' ? 'Selected (Confirm Admission & Allocate Credits)' : s}
                    </option>
                  `
                    )
                    .join('')}
                </select>
              </div>

              <div id="enrollment-confirm-info" style="display:${allowedNextStatuses.includes('Selected') ? 'block' : 'none'}; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:0.75rem; font-size:0.825rem; color:#166534; margin-bottom:0.85rem;">
                🎓 <strong>Confirmation Trigger:</strong> Selecting <strong>Selected</strong> confirms the candidate's seat, issues their IEM Registration Roll No, and automatically unlocks their <strong>Upcoming Semester 1 Curriculum (20.5 Credits)</strong> and <strong>Previous Evaluation Scorecard</strong> on their student portal.
              </div>

              <div class="form-group" style="margin-bottom:1.25rem;">
                <label>Committee Evaluation Remarks</label>
                <textarea name="comments" rows="2" placeholder="e.g. WBJEE merit verified. Seat allotment confirmed for B.Tech with course credits enrolled."></textarea>
              </div>

              <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
                <button type="button" class="nav-btn btn-outline" onclick="state.selectedApplicant = null; render();">Cancel</button>
                <button type="submit" class="nav-btn btn-primary">Save & Apply Decision</button>
              </div>
            </form>
          `
          }
        </div>
      </div>
    </div>
  `;
}

// Discreet Staff / Reviewer Quick-Login Modal
function renderStaffModal() {
  if (!state.showStaffModal) return '';

  return `
    <div class="modal-overlay" onclick="if(event.target === this) { state.showStaffModal = false; render(); }">
      <div class="modal" style="max-width:520px;">
        <div class="card-header">
          <div>
            <h3 class="card-title">Admissions Portal Quick Sign-In</h3>
            <p class="card-subtitle">One-click testing for institutional admins & student accounts</p>
          </div>
          <button class="nav-btn" style="padding:0.25rem 0.5rem;" onclick="state.showStaffModal = false; render();">✕</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.65rem;">
          <button class="nav-btn btn-primary" style="justify-content:center; padding:0.65rem;" onclick="handleLogin('director@iem.edu.in', 'admin123')">
            🏛️ Director & Main Admin: Prof. Dr. Satyajit Chakraborty
          </button>
          <button class="nav-btn btn-outline" style="justify-content:center; padding:0.65rem;" onclick="handleLogin('admissions.officer@iem.edu.in', 'admin123')">
            📋 Head of Admissions: Dr. Arundhati Ray
          </button>
          <button class="nav-btn btn-outline" style="justify-content:center; padding:0.65rem;" onclick="handleLogin('hod.cse@iem.edu.in', 'admin123')">
            💻 HOD Computer Science: Prof. Dr. Arun Kumar Bar
          </button>
          <button class="nav-btn btn-outline" style="justify-content:center; padding:0.65rem;" onclick="handleLogin('exam.controller@iem.edu.in', 'admin123')">
            📜 Controller of Examinations: Dr. Subhabrata Sengupta
          </button>
          <hr style="border:none; border-top:1px solid #f1f5f9; margin:0.25rem 0;" />
          <button class="nav-btn btn-outline" style="justify-content:center; padding:0.65rem; background:#f0fdf4;" onclick="handleLogin('aarav@example.com', 'student123')">
            🎓 Candidate: Aarav Sharma (Confirmed - View Subjects & Credits)
          </button>
          <button class="nav-btn btn-outline" style="justify-content:center; padding:0.65rem; background:#f0f9ff;" onclick="handleLogin('diya@example.com', 'student123')">
            🔍 Candidate: Diya Patel (Under Review - Locked Subjects)
          </button>
        </div>
      </div>
    </div>
  `;
}

// Master Render Function
function render() {
  const root = document.getElementById('app');
  let viewHtml = '';

  switch (state.currentView) {
    case 'home':
      viewHtml = renderHome();
      break;
    case 'login':
      viewHtml = renderLogin();
      break;
    case 'register':
      viewHtml = renderRegister();
      break;
    case 'apply':
      viewHtml = renderApplyForm();
      break;
    case 'my-status':
      viewHtml = renderStudentStatus();
      break;
    case 'admin-dashboard':
      viewHtml = renderAdminDashboard();
      break;
    case 'admin-applicants':
      viewHtml = renderAdminApplicants();
      break;
    default:
      viewHtml = renderHome();
  }

  root.innerHTML = `
    ${renderNavbar()}
    <main class="main-content">
      ${renderAlert()}
      ${viewHtml}
    </main>
    ${renderReviewModal()}
    ${renderStaffModal()}
    <footer>
      <div class="footer-inner">
        <div class="footer-top">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <img src="/logo.png" alt="IEM Logo" style="height:48px;" />
            <div>
              <div style="font-weight:800; color:#0f172a; font-size:1.1rem;">Institute of Engineering & Management (IEM), Kolkata</div>
              <div style="font-size:0.75rem; color:#64748b;">Autonomous Institution • Approved by AICTE • NAAC 'A' Grade Accredited • NBA Accredited Programmes</div>
            </div>
          </div>
          <div>
            <button class="nav-btn btn-outline" style="font-size:0.8rem; padding:0.4rem 0.85rem;" onclick="state.showStaffModal = true; render();">
              🔒 Committee / Staff Access
            </button>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© 2026 Institute of Engineering & Management (IEM). All Rights Reserved.</div>
          <div>Salt Lake Electronics Complex, Sector V, Kolkata, West Bengal 700091</div>
        </div>
      </div>
    </footer>
  `;
}

// Global exposure for inline events
window.navigateTo = navigateTo;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.handleApplicationSubmit = handleApplicationSubmit;
window.handleStatusChange = handleStatusChange;
window.fetchAdminApplicants = fetchAdminApplicants;
window.fetchAdminStaffList = fetchAdminStaffList;
window.fetchAdminPersonas = fetchAdminPersonas;
window.handleAddAdmin = handleAddAdmin;
window.selectBranchAndApply = selectBranchAndApply;
window.evaluateWizard = evaluateWizard;
window.state = state;
window.render = render;

// Auto-navigate if already authenticated on initial page load
if (state.token && state.user) {
  if (state.user.role === 'admin') {
    navigateTo('admin-dashboard');
  } else {
    navigateTo('my-status');
  }
} else {
  render();
}
