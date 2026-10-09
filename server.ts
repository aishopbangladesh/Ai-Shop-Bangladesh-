import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. API: Generate Complete Legal Document
app.post('/api/legal/generate', async (req, res) => {
  try {
    const {
      docType,
      jurisdiction,
      partyA,
      partyB,
      effectiveDate,
      duration,
      governingLaw,
      specialClauses,
      language = 'en', // 'en' or 'bn' (Bengali)
      tone = 'protective_balanced', // 'protective_balanced' | 'favorable_party_a' | 'simplified'
    } = req.body;

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const systemInstruction = `You are aishopbangladesh Senior Legal Counsel & Contract Drafter.
Your duty is to draft an authoritative, exhaustive, enforceable legal document adhering to the legal standards of the selected jurisdiction.
Return structured JSON with comprehensive legal clauses, definitions, covenants, indemnities, remedies, dispute resolution mechanisms, and execution blocks.
Include a plain-language summary for each clause so laypersons and clients can understand their rights.
If language is 'bn', include Bengali titles and Bengali plain-language summaries alongside or in Bengali.`;

    const prompt = `Draft a comprehensive, highly enforceable ${docType || 'Commercial Agreement'}.
Jurisdiction: ${jurisdiction || 'United States / Delaware'}
Governing Law & Venue: ${governingLaw || jurisdiction || 'State of Delaware'}
Party A (Disclosing / Employer / First Party):
- Name/Entity: ${partyA?.name || 'Company Alpha Inc.'}
- Role/Designation: ${partyA?.role || 'Principal / Employer'}
- Address: ${partyA?.address || '100 Legal Avenue, Suite 400'}
- Representative: ${partyA?.rep || 'Authorized Signatory'}

Party B (Receiving / Employee / Second Party):
- Name/Entity: ${partyB?.name || 'Partner Beta LLC'}
- Role/Designation: ${partyB?.role || 'Contractor / Counterparty'}
- Address: ${partyB?.address || '200 Commercial Way, 5th Floor'}
- Representative: ${partyB?.rep || 'Managing Director'}

Effective Date: ${effectiveDate || 'Upon execution'}
Duration / Term: ${duration || '24 Months or Until Mutually Terminated'}
Special Clauses & Instructions: ${specialClauses || 'Standard comprehensive protective covenants, IP assignment, confidentiality, limitation of liability, and arbitration clause.'}
Language Target: ${language === 'bn' ? 'Bengali (বাংলা) with standard legal English terms' : 'English with plain-language explanations'}
Contract Strategy Tone: ${tone}

Generate an exhaustive, realistic contract with:
1. Exact Title & Preamble
2. Recitals ("WHEREAS...")
3. Definitions
4. Substantive Clauses (at least 6-9 robust sections, e.g. Scope, Rights, Payment/Consideration, Intellectual Property, Confidentiality, Warranties & Disclaimers, Indemnification & Limitation of Liability, Term & Termination, Dispute Resolution & Arbitration, Miscellaneous)
5. Execution / Signature block for both parties.
6. Plain language key takeaways and risk level for each section.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            jurisdiction: { type: Type.STRING },
            effectiveDate: { type: Type.STRING },
            preamble: { type: Type.STRING },
            recitals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            definitions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ['term', 'definition'],
              },
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.STRING },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  plainExplanation: { type: Type.STRING },
                  riskLevel: {
                    type: Type.STRING,
                    description: 'LOW, MEDIUM, HIGH, or CRITICAL',
                  },
                  keyObligations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['number', 'title', 'content', 'plainExplanation', 'riskLevel'],
              },
            },
            signatures: {
              type: Type.OBJECT,
              properties: {
                partyATitle: { type: Type.STRING },
                partyAName: { type: Type.STRING },
                partyBTitle: { type: Type.STRING },
                partyBName: { type: Type.STRING },
              },
            },
            clientExecutiveSummary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            complianceScore: { type: Type.NUMBER },
          },
          required: ['title', 'preamble', 'sections', 'clientExecutiveSummary'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, document: parsed });
  } catch (error: any) {
    console.error('Error generating document:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate legal document' });
  }
});

// 2. API: Legal Document Risk Analysis & Redlining
app.post('/api/legal/analyze', async (req, res) => {
  try {
    const { documentText, jurisdiction, targetPartyRole } = req.body;

    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required.' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const systemInstruction = `You are aishopbangladesh AI Legal Auditor.
Analyze the provided contract for potential legal risks, one-sided provisions, enforceability loopholes, and missing protective covenants.
Calculate an overall Risk Health Index (0-100, where 100 is pristine & safe, 0 is toxic).
Provide actionable redlining recommendations and simple-language explanations.`;

    const prompt = `Review this legal agreement for ${targetPartyRole || 'Signatory / Client'}.
Jurisdiction: ${jurisdiction || 'General Commercial / US / International'}

Document Content:
${documentText.slice(0, 15000)}

Perform an exhaustive legal risk audit:
1. Overall Risk Score (0-100, 100 = completely balanced/safe, 30 = severe traps).
2. Key Red Flags (Clauses that may severely disadvantage or bind the party).
3. Missing Critical Protections (e.g. mutual indemnity caps, cure periods, confidentiality carveouts).
4. Clause-by-Clause Audit highlights with proposed redline revisions.
5. Action checklist before signing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRiskScore: { type: Type.NUMBER },
            safetyVerdict: { type: Type.STRING },
            summaryAssessment: { type: Type.STRING },
            redFlags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clauseReference: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  potentialImpact: { type: Type.STRING },
                  suggestedFix: { type: Type.STRING },
                },
                required: ['clauseReference', 'severity', 'issue', 'suggestedFix'],
              },
            },
            missingSafeguards: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            plainLanguageSummary: { type: Type.STRING },
            preSignChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['overallRiskScore', 'safetyVerdict', 'summaryAssessment', 'redFlags', 'missingSafeguards'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, audit: parsed });
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze document' });
  }
});

// 3. API: Generate Automated Video Explainer Storyboard (ভিডিও বানিয়ে ব্রিফিং)
app.post('/api/legal/video-storyboard', async (req, res) => {
  try {
    const { documentData, language = 'en', avatarStyle = 'corporate_counsel' } = req.body;

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const systemInstruction = `You are aishopbangladesh AI Legal Video Producer & Director.
Transform complex legal contracts into engaging, structured, multi-scene visual explainer video presentations ("ভিডিও বানিয়ে ক্লায়েন্ট বা সাইনকারীকে সহজে বোঝানো").
Each scene must feature:
- An avatar presenter spoken script in natural fluent Bengali (বাংলা) and English.
- Key on-screen bullet points and visual badges.
- Highlighted contract clause text snippet.
- Bengali translation / Bengali narration lines.
- Estimated duration in seconds (10s to 30s per scene).`;

    const prompt = `Create a multi-scene client video explainer storyboard for this contract:
Document Title: ${documentData?.title || 'Commercial Agreement'}
Parties: ${documentData?.signatures?.partyAName || 'Party A'} & ${documentData?.signatures?.partyBName || 'Party B'}
Jurisdiction: ${documentData?.jurisdiction || 'General'}
Summary: ${JSON.stringify(documentData?.clientExecutiveSummary || [])}
Sections: ${JSON.stringify(
      (documentData?.sections || []).slice(0, 6).map((s: any) => ({
        number: s.number,
        title: s.title,
        plainExplanation: s.plainExplanation,
        riskLevel: s.riskLevel,
      }))
    )}

Avatar Persona: ${avatarStyle}
Primary Presentation Language: ${language}

Generate 5 to 6 distinct video scenes:
Scene 1: Introduction, Parties & Purpose (চুক্তি পরিচিতি ও পক্ষগণ)
Scene 2: Core Scope & Deliverables / Obligations (মূল দায়িত্ব ও কাজের পরিধি)
Scene 3: Financial & Payment Terms (অর্থ ও পারিশ্রমিক শর্তাবলী)
Scene 4: IP Rights, Ownership & Confidentiality (মেধা-স্বত্ব ও গোপনীয়তা)
Scene 5: Termination, Breaches & Liabilities (চুক্তি সমাপ্তি ও দায়বদ্ধতা)
Scene 6: Conclusion, Signing Advice & Action Steps (স্বাক্ষর ও পরবর্তী করণীয়)

Include both English script and Bengali script for each scene!`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            videoTitle: { type: Type.STRING },
            totalEstimatedDurationSec: { type: Type.NUMBER },
            presenterRole: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  bengaliTitle: { type: Type.STRING },
                  durationSec: { type: Type.NUMBER },
                  avatarScriptEn: { type: Type.STRING },
                  avatarScriptBn: { type: Type.STRING },
                  highlightClauseQuote: { type: Type.STRING },
                  onScreenBullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  riskBadge: { type: Type.STRING },
                  iconType: {
                    type: Type.STRING,
                    description: 'shield, scale, dollar, file, alert, check',
                  },
                  visualAdvice: { type: Type.STRING },
                },
                required: [
                  'sceneNumber',
                  'title',
                  'bengaliTitle',
                  'durationSec',
                  'avatarScriptEn',
                  'avatarScriptBn',
                  'onScreenBullets',
                  'riskBadge',
                  'iconType',
                ],
              },
            },
          },
          required: ['videoTitle', 'totalEstimatedDurationSec', 'scenes'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, storyboard: parsed });
  } catch (error: any) {
    console.error('Error generating video storyboard:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate video storyboard' });
  }
});

// 4. API: Text to Speech (TTS) Audio Generation for Video Presenter Avatar
app.post('/api/legal/tts', async (req, res) => {
  try {
    const { text, voice = 'Fenrir', style = 'authoritative legal advisor' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    // Call gemini-3.8-flash-lite-tts
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 1000), // optimal length per scene speech
              speechMetadata: {
                style: style || 'Clear, warm, professional legal attorney narrator',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated by model' });
    }

    return res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error generating speech TTS:', error);
    return res.status(500).json({ error: error?.message || 'TTS generation failed' });
  }
});

// Mount Vite in Dev mode or serve static files in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`aishopbangladesh Legal Engine running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
