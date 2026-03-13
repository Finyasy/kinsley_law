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
    name: "Jane Kinsley",
    email: "jane.kinsley@kinsleylaw.com",
    phone: "(123) 456-7890",
    bio: "Jane Kinsley is the founding partner of Kinsley Law Advocates with over 20 years of experience in corporate law. She has helped businesses navigate complex legal challenges with precision, structure, and commercial judgment.",
    position: "Founding Partner",
    specialization: "Corporate Law",
  },
  {
    name: "Robert Johnson",
    email: "robert.johnson@kinsleylaw.com",
    phone: "(123) 456-7891",
    bio: "Robert Johnson is a senior partner specializing in family law and civil litigation. He is known for measured courtroom advocacy and calm handling of emotionally complex matters.",
    position: "Senior Partner",
    specialization: "Family Law",
  },
  {
    name: "Amanda Lewis",
    email: "amanda.lewis@kinsleylaw.com",
    phone: "(123) 456-7892",
    bio: "Amanda Lewis focuses on real estate and property law, advising on residential and commercial transactions, landlord-tenant disputes, and property development matters.",
    position: "Associate",
    specialization: "Real Estate Law",
  },
  {
    name: "Michael Chen",
    email: "michael.chen@kinsleylaw.com",
    phone: "(123) 456-7893",
    bio: "Michael Chen is dedicated to criminal defense and civil rights advocacy. He protects clients through investigations, charges, and contested proceedings with disciplined preparation.",
    position: "Associate",
    specialization: "Criminal Defense",
  },
];

export const fallbackPracticeAreas: PracticeAreaSeed[] = [
  {
    name: "Family Law",
    description:
      "Compassionate guidance through divorce, custody, support, adoption, and other private family matters that require both discretion and clear legal direction.",
    highlights: [
      "Divorce and separation",
      "Child custody and support",
      "Adoption and guardianship",
      "Domestic violence protection",
      "Prenuptial agreements",
    ],
  },
  {
    name: "Corporate Law",
    description:
      "Legal support for founders, executives, and established businesses navigating formation, growth, governance, and strategic transactions.",
    highlights: [
      "Business formation",
      "Contract drafting and review",
      "Mergers and acquisitions",
      "Corporate governance",
      "Regulatory compliance",
    ],
  },
  {
    name: "Real Estate",
    description:
      "Practical legal counsel for residential and commercial property matters, from transaction structuring to disputes and title issues.",
    highlights: [
      "Residential and commercial transactions",
      "Landlord-tenant disputes",
      "Property development",
      "Land use and zoning",
      "Title issues",
    ],
  },
  {
    name: "Criminal Defense",
    description:
      "Assertive defense strategy for investigations, charges, and court proceedings where rights, reputation, and freedom are at stake.",
    highlights: [
      "Felony defense",
      "Misdemeanor defense",
      "DUI and DWI matters",
      "White collar crime",
      "Juvenile cases",
    ],
  },
  {
    name: "Estate Planning",
    description:
      "Forward-looking planning to preserve wealth, protect loved ones, and ensure decisions are carried out according to your intentions.",
    highlights: [
      "Wills and trusts",
      "Probate",
      "Power of attorney",
      "Healthcare directives",
      "Estate administration",
    ],
  },
  {
    name: "Personal Injury",
    description:
      "Representation for clients seeking accountability and fair compensation after accidents, negligence, and life-disrupting harm.",
    highlights: [
      "Auto accidents",
      "Slip and fall incidents",
      "Medical malpractice",
      "Workplace injuries",
      "Wrongful death",
    ],
  },
];

export const fallbackTestimonials: TestimonialSeed[] = [
  {
    name: "John Smith",
    title: "Family law client",
    quote:
      "The team handled a complex divorce with care and precision. Every step felt organized, transparent, and strategically sound.",
  },
  {
    name: "Sarah Johnson",
    title: "Corporate client",
    quote:
      "Kinsley Law Advocates gave our business practical legal advice that was both commercially sharp and easy to act on.",
  },
];

export const fallbackOfficeDetails: OfficeDetails = {
  addressLine1: "123 Legal Street",
  addressLine2: "Suite 500",
  city: "Nairobi, Kenya",
  phone: "(123) 456-7890",
  email: "info@kinsleylaw.com",
  hoursWeekday: "Monday - Friday: 9:00 AM - 5:00 PM",
  hoursWeekend: "Saturday - Sunday: Closed",
};

export const defaultHomePageContent: HomePageContent = {
  heroEyebrow: "Trusted counsel. Clear strategy. Decisive follow-through.",
  heroDescription:
    "Kinsley Law Advocates helps individuals, families, founders, and established businesses move through legal pressure with confidence. We pair rigorous legal analysis with a calm, premium client experience.",
  portraitEyebrow: "Built for high-trust representation",
  portraitText:
    "A refined legal partner for complex family, commercial, property, and defense matters.",
  valueRotatorLabel: "Excellence in law",
  valueRotatorPrefix: "Strategic counsel with",
  valueRotatorWords: ["Mastery", "Client Experience", "Integrity", "Teamwork"],
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
  legacySectionTitle: "A modern legal practice built on steadiness and trust.",
  legacyParagraphs: [
    "Founded in 2010, Kinsley Law Advocates was established to deliver legal representation that feels both exacting and deeply personal. Our team works across private client and business matters with a disciplined process, measured communication, and uncompromising attention to detail.",
    "The result is a practice that feels contemporary in service, strong in advocacy, and grounded in the long-term interests of the people and organizations we represent.",
  ],
  achievements: [
    "Client-first case strategy with senior oversight from intake to resolution.",
    "Cross-disciplinary counsel for personal, commercial, and regulatory matters.",
    "Responsive communication built for high-stakes, time-sensitive decisions.",
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
  ],
  servicesEyebrow: "Practice areas",
  servicesTitle: "Legal services organized the way clients actually search for help.",
  teamEyebrow: "The team that supports you",
  teamTitle: "Experienced lawyers with clearly defined strengths.",
  testimonialsEyebrow: "Client confidence",
  testimonialsTitle: "What clients value about the experience.",
  ctaEyebrow: "Ready when you are",
  ctaTitle: "Bring your matter to a team built for thoughtful, modern representation.",
};
