import {
  FIRM_CONTACT_EMAIL,
  FIRM_CONTACT_PHONE,
} from "@/lib/firm-contact";

export type AttorneySeed = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  position: string;
  specialization: string;
  photoUrl?: string | null;
};

export type PracticeAreaSeed = {
  name: string;
  description: string;
  highlights: string[];
};

export type OfficeDetails = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  phone: string;
  email: string;
  hoursWeekday: string;
  hoursWeekend: string;
};

export type HomePageContent = {
  heroEyebrow: string;
  heroDescription: string;
  portraitEyebrow: string;
  portraitText: string;
  valueRotatorLabel: string;
  valueRotatorPrefix: string;
  valueRotatorWords: string[];
  highlights: Array<{
    value: string;
    label: string;
  }>;
  credibilityBand: Array<{
    label: string;
    value: string;
  }>;
  legacySectionEyebrow: string;
  legacySectionTitle: string;
  legacyParagraphs: string[];
  achievements: string[];
  legacyMetrics: Array<{
    value: string;
    text: string;
  }>;
  servicesEyebrow: string;
  servicesTitle: string;
  teamEyebrow: string;
  teamTitle: string;
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  ctaEyebrow: string;
  ctaTitle: string;
};

export type TestimonialSeed = {
  name: string;
  title: string;
  quote: string;
};

export const fallbackAttorneys: AttorneySeed[] = [
  {
    name: "Deng Majak",
    email: "deng.majak@kinsleylaw.com",
    phone: FIRM_CONTACT_PHONE,
    bio: "Deng Majak serves as Managing Partner and leads the firm's South Sudan desk. He advises on oil and gas, aviation, cross-border consultancy mandates, and regional commercial engagements, bringing structured leadership to matters that span East African regulatory and investment environments.",
    position: "Managing Partner",
    specialization: "Oil, Gas, Aviation, and Regional Consultancy",
    photoUrl: "/images/attorneys/deng-majak.svg",
  },
  {
    name: "Ongeri Ocharo",
    email: "ongeri.ocharo@kinsleylaw.com",
    phone: FIRM_CONTACT_PHONE,
    bio: "Ongeri Ocharo is Head of Litigation, focusing on Kenyan arbitration, criminal and civil disputes, gold-sector conflicts, and emerging crypto-related controversies. He works fluently across Kenyan, Swahili, and French-speaking client environments and is known for disciplined courtroom preparation.",
    position: "Head of Litigation",
    specialization: "Arbitration, Civil and Criminal Litigation, Gold, and Crypto",
    photoUrl: "/images/attorneys/ongeri-ocharo.svg",
  },
  {
    name: "Rohan Shah",
    email: "rohan.shah@kinsleylaw.com",
    phone: FIRM_CONTACT_PHONE,
    bio: "Rohan Shah is a Senior Associate handling commercial disputes and arbitration for Kenyan and cross-border clients. He supports complex private-sector conflicts with strong drafting discipline, analytical clarity, and a commercially grounded approach to negotiations and hearings.",
    position: "Senior Associate",
    specialization: "Commercial Disputes and Arbitration",
    photoUrl: "/images/attorneys/rohan-shah.svg",
  },
  {
    name: "Aline Uwase",
    email: "aline.uwase@kinsleylaw.com",
    phone: FIRM_CONTACT_PHONE,
    bio: "Aline Uwase is a Rwandan legal consultant advising on gold and mineral transactions, strategic minerals consulting, and investor-facing project support. Her MSc-level training strengthens the firm's technical perspective on extractives, compliance, and advisory structuring.",
    position: "Partner",
    specialization: "Gold, Minerals, and Strategic Advisory",
    photoUrl: "/images/attorneys/aline-uwase.svg",
  },
  {
    name: "Jean Ilunga",
    email: "jean.ilunga@kinsleylaw.com",
    phone: FIRM_CONTACT_PHONE,
    bio: "Jean Ilunga supports clients operating in the Democratic Republic of Congo across mineral-rights, project advisory, French-language commercial coordination, and extractives-related engagements. He brings strong regional insight to DRC-facing mineral matters and counterpart negotiations.",
    position: "Partner",
    specialization: "DRC Minerals, Francophone Advisory, and Cross-Border Transactions",
    photoUrl: "/images/attorneys/jean-ilunga.svg",
  },
  {
    name: "Nomsa Naidoo",
    email: "nomsa.naidoo@kinsleylaw.com",
    phone: FIRM_CONTACT_PHONE,
    bio: "Nomsa Naidoo advises from the South African market on crypto regulation, tax exposure, banking relationships, and finance mandates. She supports clients that need a practical view of digital-asset risk, financial structuring, and compliance-sensitive transactions.",
    position: "Partner",
    specialization: "Crypto, Tax, Banking, and Finance",
    photoUrl: "/images/attorneys/nomsa-naidoo.svg",
  },
];

export const fallbackPracticeAreas: PracticeAreaSeed[] = [
  {
    name: "Arbitration and Commercial Disputes",
    description:
      "Strategic representation in shareholder disputes, contract breakdowns, arbitral proceedings, and sensitive commercial conflicts that require strong drafting and disciplined case management.",
    highlights: [
      "Domestic and cross-border arbitration",
      "Commercial contract disputes",
      "Shareholder and partnership conflicts",
      "Negotiated settlements and hearing strategy",
      "Urgent relief and interim protection",
    ],
  },
  {
    name: "Civil and Criminal Litigation",
    description:
      "Courtroom-focused representation for clients facing criminal exposure, civil claims, and contentious proceedings where rights, reputation, and commercial leverage are on the line.",
    highlights: [
      "Criminal defense and investigations",
      "Civil claims and contested hearings",
      "Litigation strategy and evidence preparation",
      "Regulatory and enforcement response",
      "French- and Swahili-facing matter coordination",
    ],
  },
  {
    name: "Gold, Minerals, and Extractives",
    description:
      "Advisory support for gold, mineral, and extractives work across Kenya, Rwanda, South Sudan, and the DRC, including structuring, permits, counterpart risk, and disputes.",
    highlights: [
      "Gold trade and mineral transaction structuring",
      "Mining and mineral-rights agreements",
      "Licensing, permits, and compliance",
      "DRC-facing mineral advisory",
      "Investor and operator dispute support",
    ],
  },
  {
    name: "Crypto, Tax, Banking, and Finance",
    description:
      "Practical guidance from attorneys for digital-asset businesses, finance-sensitive transactions, tax exposure, and banking relationships that demand commercially grounded legal advice.",
    highlights: [
      "Crypto-related compliance strategy",
      "Tax structuring and risk review",
      "Banking and lender-facing matters",
      "Finance transactions and documentation",
      "Cross-border financial regulation support",
    ],
  },
  {
    name: "Oil, Gas, Aviation, and Regional Advisory",
    description:
      "Regional advisory services for oil and gas, aviation-facing mandates, and strategic consultancy work across South Sudan and neighboring markets.",
    highlights: [
      "Oil and gas project support",
      "Aviation and transport-facing advisory",
      "Regional consultancy mandates",
      "Cross-border structuring and counterpart review",
      "Operational and regulatory coordination",
    ],
  },
  {
    name: "Cross-Border Consultancy and Investment Structuring",
    description:
      "Integrated support for investors, consultants, and operators structuring mandates across East and Southern Africa, with multilingual coordination and commercially focused execution.",
    highlights: [
      "Cross-border mandate structuring",
      "Investment entry and local partnerships",
      "French-speaking counterparty coordination",
      "Consultancy agreements and risk allocation",
      "Boardroom and stakeholder advisory",
    ],
  },
];

export const fallbackTestimonials: TestimonialSeed[] = [
  {
    name: "John Mwangi",
    title: "Nairobi, Kenya arbitration and commercial disputes client",
    quote:
      "Kinsley Advocates handled a sensitive arbitration and commercial dispute with clarity, precision, and steady follow-through from first strategy call to final resolution.",
  },
  {
    name: "Sarah Whitmore",
    title: "UK commercial client",
    quote:
      "Kinsley Advocates gave our business practical legal advice that was both commercially sharp and easy to act on.",
  },
  {
    name: "John Smith",
    title: "Dubai gold and minerals client",
    quote:
      "Kinsley Advocates brought calm legal control to a sensitive gold and minerals matter, with commercially grounded guidance and disciplined follow-through throughout.",
  },
  {
    name: "Daniel Arop",
    title: "South Sudan oil and regional advisory client",
    quote:
      "The firm brought structure and calm judgment to an oil-sector matter that required regional coordination, practical advice, and communication we could trust under pressure.",
  },
];

export const fallbackOfficeDetails: OfficeDetails = {
  addressLine1: "P.O. Box 18627-00100",
  addressLine2: "Global Trading Center (GTC), Westlands, 9th Floor, Suite D36",
  city: "Nairobi, Kenya",
  phone: FIRM_CONTACT_PHONE,
  email: FIRM_CONTACT_EMAIL,
  hoursWeekday: "Consultations arranged by appointment.",
  hoursWeekend: "Digital enquiries accepted through the website.",
};

export const defaultHomePageContent: HomePageContent = {
  heroEyebrow:
    "Private clients, disputes, transactions, and mineral-sector matters handled with senior-led discipline.",
  heroDescription:
    "Kinsley Advocates supports individuals, families, founders, investors, and established businesses through legal pressure that needs disciplined judgment, careful communication, and visible control from the first conversation onward.",
  portraitEyebrow: "Built for high-trust representation",
  portraitText:
    "A refined legal partner for complex disputes, commercial mandates, private client work, and gold, mining, and mineral-sector matters.",
  valueRotatorLabel: "How clients describe the standard",
  valueRotatorPrefix: "Strategic attorneys with",
  valueRotatorWords: ["Clarity", "Restraint", "Preparation", "Follow-through"],
  highlights: [
    {
      value: "15+",
      label: "Years guiding sensitive legal matters",
    },
    {
      value: "500+",
      label: "Clients and businesses advised",
    },
    {
      value: "98%",
      label: "Client satisfaction target maintained",
    },
    {
      value: "6",
      label: "Core practice areas under one roof",
    },
  ],
  credibilityBand: [
    {
      label: "Response Standard",
      value: "Within one business day",
    },
    {
      label: "Lead Office",
      value: "Nairobi, Kenya",
    },
    {
      label: "Approach",
      value: "Strategic, discreet, outcomes-focused",
    },
  ],
  legacySectionEyebrow: "Our legacy",
  legacySectionTitle: "A modern Nairobi practice built for steadier legal control.",
  legacyParagraphs: [
    "Founded in 2010, Kinsley Advocates was established to deliver legal representation that feels both exacting and deeply personal. Our team works across private client and business matters with a disciplined process, measured communication, and uncompromising attention to detail.",
    "The result is a practice that feels contemporary in service, strong in advocacy, and grounded in the long-term interests of the people and organizations we represent.",
  ],
  achievements: [
    "Client-first case strategy with senior oversight from intake to resolution.",
    "Cross-disciplinary support from attorneys for personal, commercial, and regulatory matters.",
    "Responsive communication built for high-stakes, time-sensitive decisions.",
    "Team members with advanced degrees and guest lectures delivered in law-school and professional training settings.",
  ],
  legacyMetrics: [
    {
      value: "2010",
      text: "Firm founded with a mission to combine ethics, rigor, and access.",
    },
    {
      value: "4",
      text: "Lead attorneys profiled with distinct specializations.",
    },
    {
      value: "6",
      text: "Practice groups serving families, businesses, and individuals.",
    },
    {
      value: "1",
      text: "Integrated client journey from first call to final resolution.",
    },
    {
      value: "Masters",
      text: "Advanced postgraduate training represented across litigation, commercial, and minerals advisory work.",
    },
  ],
  servicesEyebrow: "Practice areas",
  servicesTitle: "Legal services organized around the pressure clients actually need solved.",
  teamEyebrow: "The team that supports you",
  teamTitle: "A regional legal team with clearly defined strengths and cross-border range.",
  testimonialsEyebrow: "Client confidence",
  testimonialsTitle: "Clients remember the clarity, discipline, and preparation.",
  ctaEyebrow: "Ready when you are",
  ctaTitle: "Tell us what you are facing, and we will route it to the right advocate.",
};
