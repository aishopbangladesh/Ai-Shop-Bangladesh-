import { LegalDocument, VideoStoryboard, AvatarOption } from '../types/legal';

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'sarah-vance',
    name: 'Advocate Sarah Vance',
    title: 'Senior Corporate Counsel (US/International)',
    jurisdictionExperience: 'Corporate M&A, SaaS & Venture Law',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    voiceGender: 'female',
    voiceName: 'Kore',
    badge: 'Managing Partner',
  },
  {
    id: 'tanvir-rahman',
    name: 'Barrister Tanvir Rahman',
    title: 'Supreme Court Advocate & Contract Arbitrator',
    jurisdictionExperience: 'Commercial Disputes, BD & Common Law',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    voiceGender: 'male',
    voiceName: 'Fenrir',
    badge: 'Senior Advocate',
  },
  {
    id: 'marcus-sterling',
    name: 'Attorney Marcus Sterling',
    title: 'Intellectual Property & Technology Strategist',
    jurisdictionExperience: 'Patent, Copyright & Tech Licensing',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    voiceGender: 'male',
    voiceName: 'Zephyr',
    badge: 'IP Counsel',
  },
  {
    id: 'elena-rostova',
    name: 'Dr. Elena Rostova',
    title: 'Cross-Border Trade & Regulatory Specialist',
    jurisdictionExperience: 'EU GDPR, Cross-Border Trade & Fintech',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    voiceGender: 'female',
    voiceName: 'Puck',
    badge: 'Regulatory Counsel',
  },
];

export const SAMPLE_NDA_DOCUMENT: LegalDocument = {
  id: 'doc-nda-001',
  title: 'MUTUAL NON-DISCLOSURE & CONFIDENTIALITY AGREEMENT',
  subtitle: 'দ্বিপাক্ষিক গোপনীয়তা ও তথ্য সুরক্ষা চুক্তি',
  docType: 'Non-Disclosure Agreement (NDA)',
  jurisdiction: 'United States & International Standard',
  effectiveDate: 'October 15, 2026',
  duration: '3 Years from Disclosure',
  preamble:
    'THIS MUTUAL NON-DISCLOSURE AGREEMENT ("Agreement") is entered into and made effective as of the date first written above, by and between Nexus Global Technologies Inc., a Delaware corporation ("Disclosing Party / Party A"), and Vertex Solutions Ltd., an enterprise legal partnership ("Receiving Party / Party B").',
  recitals: [
    'WHEREAS, the Parties wish to explore and engage in mutual commercial discussions regarding proprietary enterprise software development, system architecture, and strategic integrations;',
    'WHEREAS, in the course of such collaboration, either Party may disclose to the other confidential, non-public, sensitive proprietary information;',
    'NOW, THEREFORE, in consideration of the mutual covenants contained herein and other valuable consideration, the receipt and sufficiency of which are acknowledged, the Parties agree as follows:',
  ],
  definitions: [
    {
      term: 'Confidential Information',
      definition:
        'All technical data, trade secrets, source code, financial projections, customer directories, business models, algorithms, and proprietary workflows disclosed directly or indirectly.',
    },
    {
      term: 'Representatives',
      definition:
        'Affiliates, directors, officers, employees, legal advisors, and independent auditors bound by confidentiality obligations at least as restrictive as this Agreement.',
    },
  ],
  sections: [
    {
      number: '1.0',
      title: 'SCOPE & DEFINITION OF CONFIDENTIAL MATERIAL',
      content:
        '1.1 "Confidential Information" shall encompass all information disclosed by either party, whether oral, visual, electronic, or written, marked or reasonably understood to be proprietary. 1.2 Exclusions: Information shall not be deemed confidential if it was rightfully in the receiving party\'s possession prior to disclosure, becomes publicly known through no breach, or is independently developed without reference to proprietary assets.',
      plainExplanation:
        'What counts as a secret: Code, financials, clients, and technical blueprints. What does NOT count: Things already public or known before signing.',
      riskLevel: 'LOW',
      keyObligations: ['Maintain strict secrecy', 'Treat data as proprietary', 'Notify immediately if leaked'],
    },
    {
      number: '2.0',
      title: 'NON-DISCLOSURE & DUTY OF CARE',
      content:
        '2.1 Standard of Care: The Receiving Party shall protect Disclosing Party\'s Confidential Information with at least the same degree of care it exercises with respect to its own proprietary information of like nature, but in no event less than a reasonable degree of care. 2.2 Need-to-Know: Access shall be limited strictly to authorized Representatives who require knowledge to evaluate the Collaboration.',
      plainExplanation:
        'You must lock down the other party\'s secrets with high security and only let essential team members see it under non-disclosure.',
      riskLevel: 'MEDIUM',
      keyObligations: ['Never share with third parties', 'Enforce internal NDA with employees'],
    },
    {
      number: '3.0',
      title: 'NON-CIRCUMVENTION & NON-SOLICITATION',
      content:
        '3.1 The Receiving Party covenants that for a period of eighteen (18) months following the Effective Date, it shall not directly or indirectly circumvent, bypass, or solicit any introduced clients, key engineering talent, or proprietary vendors without express prior written consent of the Disclosing Party.',
      plainExplanation:
        'Non-Circumvention: You cannot poach their introduced clients or hire away their key engineers for 1.5 years.',
      riskLevel: 'HIGH',
      keyObligations: ['Do not hire engineers from the other party', 'Do not steal introduced client contacts'],
    },
    {
      number: '4.0',
      title: 'INTELLECTUAL PROPERTY RIGHTS RESERVATION',
      content:
        '4.1 All Confidential Information remains the exclusive property of the Disclosing Party. Nothing in this Agreement grants, conveys, or implies any license, patent right, trademark, copyright, or ownership interest in any intellectual property to the Receiving Party.',
      plainExplanation:
        'Looking at someone\'s proprietary code or tech does not give you any license or right to own or copy it.',
      riskLevel: 'LOW',
      keyObligations: ['Zero IP transfer', 'Strictly for evaluation purposes'],
    },
    {
      number: '5.0',
      title: 'RETURN OR DESTRUCTION OF CONFIDENTIAL DATA',
      content:
        '5.1 Upon written notice or expiration of this Agreement, the Receiving Party shall within ten (10) business days return or permanently delete and purge all materials containing Confidential Information, and certify compliance in writing signed by an executive officer.',
      plainExplanation:
        'When the deal ends, you must wipe all files, cloud backups, and confidential records and sign a certificate confirming deletion.',
      riskLevel: 'MEDIUM',
      keyObligations: ['10-day purge deadline', 'Officer certification of destruction'],
    },
    {
      number: '6.0',
      title: 'EQUITABLE RELIEF & INJUNCTION REMEDIES',
      content:
        '6.1 The Parties acknowledge that any breach of this Agreement would cause irreparable harm for which monetary damages alone would be inadequate. Accordingly, Disclosing Party shall be entitled to seek immediate injunctive relief and restraining orders in any court of competent jurisdiction without the requirement of posting bond.',
      plainExplanation:
        'If someone leaks secrets, the other party can go straight to court for an immediate freeze order/injunction without having to wait for monetary trials.',
      riskLevel: 'HIGH',
      keyObligations: ['Subject to immediate court restraining orders without bond'],
    },
    {
      number: '7.0',
      title: 'GOVERNING LAW & ARBITRATION',
      content:
        '7.1 This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware (or jurisdiction of choice), without regard to conflict of law principles. Any dispute arising out of or relating to this Agreement shall be settled by binding arbitration in accordance with the International Chamber of Commerce (ICC) rules.',
      plainExplanation:
        'Disputes will be decided under Delaware law through binding arbitration rather than standard public courtroom battles.',
      riskLevel: 'MEDIUM',
      keyObligations: ['Binding arbitration', 'Delaware legal forum'],
    },
  ],
  signatures: {
    partyATitle: 'Chief Executive Officer, Nexus Global Technologies Inc.',
    partyAName: 'Jonathan Sterling, Esq.',
    partyBTitle: 'Managing Partner, Vertex Solutions Ltd.',
    partyBName: 'Dr. Kimberly Chen, Ph.D.',
  },
  clientExecutiveSummary: [
    'Strict 3-year mutual confidentiality covering software, trade secrets, and customer lists.',
    '18-month non-solicitation preventing talent and customer poaching.',
    'Fast-track injunctive relief allowing immediate court injunctions upon leak.',
    '10-day mandatory data purge upon contract conclusion.',
  ],
  complianceScore: 94,
  language: 'en',
  createdAt: '2026-10-09',
};

export const SAMPLE_STORYBOARD: VideoStoryboard = {
  videoTitle: 'Client Legal Walkthrough: Mutual Non-Disclosure Agreement (NDA)',
  totalEstimatedDurationSec: 120,
  presenterRole: 'Senior Legal Counsel & Deal Strategist',
  scenes: [
    {
      sceneNumber: 1,
      title: 'Introduction & Contract Purpose',
      bengaliTitle: 'চুক্তি পরিচিতি ও মূল উদ্দেশ্য',
      durationSec: 18,
      avatarScriptEn:
        'Welcome. I am your aishopbangladesh Legal Counsel. Before you sign this Mutual NDA between Nexus Global and Vertex Solutions, let us review your rights, protections, and obligations in this 2-minute visual briefing.',
      avatarScriptBn:
        'স্বাগতম। আমি আপনার aishopbangladesh লিগ্যাল কাউন্সেল। নেক্সাস গ্লোবাল ও ভার্টেক্স সলিউশনসের মধ্যকার এই দ্বিপাক্ষিক গোপনীয়তা চুক্তিতে সাক্ষর করার পূর্বে, চলুন পরবর্তী ২ মিনিটে আপনার অধিকার ও দায়িত্বগুলো সংক্ষেপে দেখে নেই।',
      highlightClauseQuote: 'THIS MUTUAL NON-DISCLOSURE AGREEMENT is made effective between Nexus Global & Vertex Solutions.',
      onScreenBullets: [
        'Mutual 2-way confidentiality protection',
        'Applies to proprietary software, algorithms & client data',
        'Official governing period: 3 Years',
      ],
      riskBadge: 'SAFE (Score 94%)',
      iconType: 'shield',
      visualAdvice: 'Displays company crest and official agreement seal.',
    },
    {
      sceneNumber: 2,
      title: 'Scope of Secret Information',
      bengaliTitle: 'গোপনীয় তথ্যের পরিধি ও সুরক্ষা',
      durationSec: 22,
      avatarScriptEn:
        'Under Clause 1, Confidential Information covers all source code, business logic, customer databases, and financial blueprints. Importantly, anything already published or discovered independently is strictly excluded from liability.',
      avatarScriptBn:
        '১ নম্বর ধারা অনুযায়ী, সমস্ত সোর্স কোড, বাণিজ্যিক ডাটাবেস ও আর্থিক পরিকল্পনা সুরক্ষিত থাকবে। তবে পূর্বে থেকেই সর্বজনীন বা পাবলিক কোনো তথ্য এর আওতাভুক্ত হবে না।',
      highlightClauseQuote: 'Confidential Information encompasses all technical data, trade secrets, and algorithms.',
      onScreenBullets: [
        'Proprietary code & technical architecture',
        'Business roadmap & financial projections',
        'Carveout: Publicly available information is exempt',
      ],
      riskBadge: 'STANDARD COVENANT',
      iconType: 'file',
      visualAdvice: 'Animated blueprint icon with security lock badge.',
    },
    {
      sceneNumber: 3,
      title: 'Non-Poaching & Non-Circumvention',
      bengaliTitle: 'কর্মী বা ক্লায়েন্ট ছিনতাই নিষেধ (১৮ মাস)',
      durationSec: 24,
      avatarScriptEn:
        'Pay close attention to Clause 3. You cannot solicit or hire away each other\'s software engineers or introduced business clients for eighteen months. This is a high-impact restriction you must ensure your recruitment team respects.',
      avatarScriptBn:
        'ধারা ৩ এর দিকে বিশেষ নজর দিন! আগামী ১৮ মাস অপর পক্ষের কোনো সফটওয়্যার ইঞ্জিনিয়ার বা তাদের মাধ্যমে পরিচিত ক্লায়েন্টদের নিজের প্রতিষ্ঠানে টানা বা কাজ করানো যাবে না।',
      highlightClauseQuote: 'Receiving Party shall not directly or indirectly solicit any introduced clients or key talent for 18 months.',
      onScreenBullets: [
        '18-Month non-solicitation restriction',
        'Protects key developers & client pipelines',
        'Requires recruitment team compliance memo',
      ],
      riskBadge: 'HIGH IMPACT CLAUSE',
      iconType: 'alert',
      visualAdvice: 'Warning badge with handshake symbol crossed out for poaching.',
    },
    {
      sceneNumber: 4,
      title: 'Zero Intellectual Property Transfer',
      bengaliTitle: 'কোনো মেধা-স্বত্ব বা লাইসেন্স হস্তান্তর হবে না',
      durationSec: 20,
      avatarScriptEn:
        'Clause 4 guarantees that merely inspecting code or reviewing designs transfers zero IP ownership. All copyrights, patents, and trade secrets remain 100 percent in the hands of the original creator.',
      avatarScriptBn:
        'ধারা ৪ নিশ্চিত করে যে, অপরের কোনো কোড বা ডিজাইন দেখার মাধ্যমে কোনো মালিকানা সৃষ্টি হবে না। যাবতীয় স্বত্ব বা কপিরাইট মূল মালিকের নিকটেই অপরিবর্তিত থাকবে।',
      highlightClauseQuote: 'Nothing in this Agreement grants or conveys any patent, trademark, or copyright ownership.',
      onScreenBullets: [
        'Strict reservation of all IP rights',
        'Zero implied software licenses',
        'Evaluation only; no commercial derivation',
      ],
      riskBadge: 'PROTECTIVE',
      iconType: 'check',
      visualAdvice: 'Copyright and registered trademark shield glowing in gold.',
    },
    {
      sceneNumber: 5,
      title: 'Breach Penalties & Injunction Relief',
      bengaliTitle: 'লঙ্ঘন করলে আদালতের তাৎক্ষণিক নিষেধাজ্ঞা',
      durationSec: 22,
      avatarScriptEn:
        'If either party leaks confidential data, the disclosing party can immediately petition the court for an emergency injunction order without posting bond. Furthermore, upon contract termination, all files must be permanently purged within 10 days.',
      avatarScriptBn:
        'যদি কেউ তথ্য ফাঁস করে, অপর পক্ষ আদালতে গিয়ে তাৎক্ষণিক স্থগিতাদেশ বা ইনজাংশন জারি করতে পারবে। চুক্তি শেষ হলে ১০ দিনের মধ্যে সমস্ত ডাটা মুছে ফেলতে হবে।',
      highlightClauseQuote: 'Disclosing Party shall be entitled to seek immediate injunctive relief without the requirement of posting bond.',
      onScreenBullets: [
        'Immediate court injunction without bond',
        '10-Day mandatory data deletion timeline',
        'Officer certification of complete erasure',
      ],
      riskBadge: 'STRICT REMEDY',
      iconType: 'scale',
      visualAdvice: 'Scale of justice with legal gavel striking.',
    },
    {
      sceneNumber: 6,
      title: 'Final Action Checklist Before Signing',
      bengaliTitle: 'স্বাক্ষর করার পূর্বে চূড়ান্ত যাচাই তালিকা',
      durationSec: 18,
      avatarScriptEn:
        'aishopbangladesh rates this agreement as highly safe and well-balanced with a 94 percent health score. Ensure your signatory titles are correct, execute with digital signatures, and retain an encrypted archive copy. You are cleared to proceed!',
      avatarScriptBn:
        'aishopbangladesh এই চুক্তিটিকে ৯৪% সেফটি স্কোর দিয়ে অত্যন্ত সুষম হিসেবে রেটিং দিয়েছে। উভয় পক্ষের প্রতিনিধির নাম ও পদবি যাচাই করে নিশ্চিন্তে ডিজিটাল স্বাক্ষর করতে পারেন!',
      highlightClauseQuote: 'IN WITNESS WHEREOF, the Parties have executed this Mutual Agreement.',
      onScreenBullets: [
        'Audit Score: 94/100 (Safe & Balanced)',
        'Delaware arbitration jurisdiction verified',
        'Ready for e-Signatures & execution',
      ],
      riskBadge: 'READY FOR SIGNATURE',
      iconType: 'check',
      visualAdvice: 'Signature stamp and celebratory green checkmark.',
    },
  ],
};

export const TEMPLATE_CATEGORIES = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement (NDA)',
    bengaliName: 'গোপনীয়তা রক্ষা চুক্তি (এনডিএ)',
    icon: 'Shield',
    desc: 'Bilateral or unilateral confidentiality covenants, IP protections, and trade secret safeguards.',
    popularity: 'Very High',
  },
  {
    id: 'software_saas',
    name: 'SaaS & Software Services Agreement',
    bengaliName: 'সফটওয়্যার ও ক্লাউড সেবা চুক্তি',
    icon: 'Code',
    desc: 'Service level agreements (SLA), uptime commitments, data ownership, and recurring subscription terms.',
    popularity: 'High',
  },
  {
    id: 'contractor_freelance',
    name: 'Independent Contractor Agreement',
    bengaliName: 'ফ্রিল্যান্সার ও কনসালট্যান্ট চুক্তি',
    icon: 'Briefcase',
    desc: 'Work-for-hire provisions, milestone billing, IP assignment, and non-employee tax declarations.',
    popularity: 'Very High',
  },
  {
    id: 'employment',
    name: 'Executive Employment Contract',
    bengaliName: 'নিয়োগপত্র ও চাকরি চুক্তি',
    icon: 'UserCheck',
    desc: 'Equity vesting, non-compete, invention assignment, severance terms, and probation clauses.',
    popularity: 'High',
  },
  {
    id: 'power_of_attorney',
    name: 'General Power of Attorney',
    bengaliName: 'আমমোক্তারনামা (পাওয়ার অব অ্যাটর্নি)',
    icon: 'FileText',
    desc: 'Legal agent authorization, property management powers, banking authorities, and revocability.',
    popularity: 'Medium',
  },
  {
    id: 'commercial_lease',
    name: 'Commercial Property Lease Deed',
    bengaliName: 'বাণিজ্যিক স্পেস ভাড়া চুক্তি',
    icon: 'Building2',
    desc: 'Security deposit terms, utility apportionment, subletting restrictions, and eviction protocols.',
    popularity: 'High',
  },
  {
    id: 'partnership_deed',
    name: 'Business Partnership Deed',
    bengaliName: 'অংশীদারি কারবার চুক্তি',
    icon: 'Users',
    desc: 'Profit/loss sharing percentages, capital contributions, decision vetoes, and exit dissolution rules.',
    popularity: 'Medium',
  },
  {
    id: 'last_will',
    name: 'Last Will & Testament',
    bengaliName: 'অসিয়তনামা ও উইল',
    icon: 'Scroll',
    desc: 'Asset distribution, executor designation, guardianship provisions, and probate instructions.',
    popularity: 'Medium',
  },
];
