
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPageData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLandingPage = async (
  url: string,
  persona: string,
  productDescription?: string,
  language: string = 'English'
): Promise<GeneratedPageData> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are a World-Class UI/UX Art Director & Color Theorist specializing in Dynamic Personalization.

    **INPUT VECTORS**:
    - Product: "${url}" (${productDescription || 'Inferred'})
    - Target Persona: "${persona}"
    - Language: "${language}"

    **CORE OBJECTIVE**: 
    Create a landing page theme that is **VISUALLY DISTINCT** for this specific persona. 
    **CRITICAL**: If I generate this product for "CEO" and then for "Student", the two sites must look **COMPLETELY DIFFERENT** (Different Colors, Different Fonts, Different Shapes, Different Layout Vibe).

    **1. ADVANCED COLOR SYNTHESIS (THE "PERSONA FILTER")**:
    Detect the **Product's Natural Hue** and apply a drastic **Persona Filter**:

    *   **Luxury / Executive / High-Net-Worth**: 
        - **Palette**: Deep Jewel Tones (Midnight Blue, Emerald, Burgundy) OR Stark Monochrome (Black/White/Gold).
        - **Background**: STRICTLY DARK or Rich Colored.
        - **Vibe**: "Quiet Luxury", Expensive, Heavy.

    *   **Eco / Wellness / Parents**: 
        - **Palette**: Earth Tones (Sage, Clay, Terracotta, Sand, Soft Blue).
        - **Background**: STRICTLY LIGHT/SOFT (Off-White, Beige, Soft Grey).
        - **Vibe**: Organic, Calming, Trustworthy.

    *   **Tech / Developers / Gamers**: 
        - **Palette**: High Contrast. Dark Greys/Blacks with NEON accents (Acid Green, Electric Blue, Hot Pink).
        - **Background**: STRICTLY DARK (Zinc-950 or #000000).
        - **Vibe**: Precision, Future, Industrial.

    *   **Gen Z / Students / Lifestyle**: 
        - **Palette**: Bright Pop Colors (Yellow, Purple, Cyan) with Stark Black or White.
        - **Background**: Can be Bright White or Vibrant Color.
        - **Vibe**: Loud, Urgent, Bubbly.

    *   **General Audience / Enterprise**:
        - **Palette**: Trustworthy Blues, Greys, or the Brand's main color. Clean.
        - **Background**: Neutral.

    **2. STRUCTURAL DIVERSITY ENGINE (SHAPE & TYPOGRAPHY)**:
    You MUST vary the physical structure based on the persona to ensure uniqueness:

    - **Luxury**: 
      - fontStyle: 'classic' (Serif)
      - borderRadius: 'soft' (Elegant curves) OR 'sharp' (Brutalist luxury)
    
    - **Tech/Pro**: 
      - fontStyle: 'bold' (Display) OR 'modern' (Sans)
      - borderRadius: 'sharp' (Industrial/Machine-like)
    
    - **Lifestyle/Youth**: 
      - fontStyle: 'playful' or 'bold'
      - borderRadius: 'round' (Friendly/Bubble)
    
    - **Wellness/Eco**: 
      - fontStyle: 'modern' (Clean)
      - borderRadius: 'round' (Organic) or 'soft'

    **3. CONTENT RULES**:
    -   **Insights (The "Why"):** EXACTLY 3 items. 
        -   **CRITICAL MAPPING:** Insight 1 MUST explain Benefit 1. Insight 2 MUST explain Benefit 2. Insight 3 MUST explain Benefit 3.
        -   **Format:** Start with "Because...", "Meaning...", or "So that..." to explicitly connect the feature to the value.
    -   **Verdict**: **STRICTLY HUMAN & SIMPLE.** 
        -   **Max 2 short sentences (under 25 words).**
        -   **Vocabulary**: Grade 5 reading level. Simple words.
        -   **Tone**: Brutally honest friend. No marketing fluff.
        -   **Start with**: "Honestly,", "Look,", "Truth is,".
    -   **Floating CTA**: **NON-TRANSACTIONAL.** 
        -   No "Buy Now". Use "Start Journey", "Discover", "Peek Inside".

    **4. JSON OUTPUT CONSTRAINT**:
    - **backgroundColor**: Sets the dominant mood.
    - **cardColor**: Must contrast visible against backgroundColor.
    - **textColor**: WCAG AA compliant.

    Return JSON.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      temperature: 1.3, // Increased temperature for higher variance
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          meta: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              targetPersona: { type: Type.STRING },
            },
            required: ["productName", "targetPersona"]
          },
          suggestedSegments: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 4 distinct high-value customer segments. Names MUST be strictly 1-2 words (e.g. 'Prosumers', 'Students'). Direct and targeted."
          },
          theme: {
            type: Type.OBJECT,
            properties: {
              primaryColor: { type: Type.STRING, description: "Main CTA / Highlight (HEX)." },
              secondaryColor: { type: Type.STRING, description: "Secondary Element (HEX)." },
              accentColor: { type: Type.STRING, description: "Fine details (HEX)." },
              backgroundColor: { type: Type.STRING, description: "Main Canvas (HEX). CRITICAL: Varies by persona (Light vs Dark)." },
              cardColor: { type: Type.STRING, description: "Surface color for cards (HEX)." },
              textColor: { type: Type.STRING, description: "Main content text (HEX)." },
              fontStyle: { type: Type.STRING, enum: ["modern", "classic", "playful", "bold"] },
              borderRadius: { type: Type.STRING, enum: ["sharp", "soft", "round"], description: "Shape of UI elements" }
            },
            required: ["primaryColor", "secondaryColor", "accentColor", "backgroundColor", "cardColor", "textColor", "fontStyle", "borderRadius"]
          },
          content: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              subheadline: { type: Type.STRING },
              insights: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Exactly 3 short sentences. Index 0 explains Benefit 0, Index 1 explains Benefit 1. MUST BE CAUSAL explanations (e.g. 'Because x, you get y')." 
              },
              sonicBrand: {
                type: Type.OBJECT,
                properties: {
                  trackTitle: { type: Type.STRING },
                  mood: { type: Type.STRING, enum: ['energetic', 'calm', 'mysterious', 'futuristic'] }
                },
                required: ["trackTitle", "mood"]
              },
              ctaPrimary: { type: Type.STRING },
              verdict: { 
                type: Type.STRING,
                description: "A candid, short, human-to-human recommendation. Grade 5 vocabulary. Max 25 words."
              },
              floatingCta: { 
                type: Type.STRING,
                description: "A low-friction, exploratory CTA. NOT 'Buy Now'. Examples: 'Start Journey', 'Discover'."
              },
              benefits: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    icon: { type: Type.STRING },
                    stat: { type: Type.STRING }
                  },
                  required: ["title", "description", "icon", "stat"]
                },
                description: "Exactly 3 benefits."
              },
              socialProof: {
                type: Type.OBJECT,
                properties: {
                  quote: { type: Type.STRING },
                  author: { type: Type.STRING },
                  role: { type: Type.STRING }
                },
                required: ["quote", "author", "role"]
              }
            },
            required: ["headline", "subheadline", "insights", "ctaPrimary", "floatingCta", "benefits", "socialProof", "verdict", "sonicBrand"]
          }
        },
        required: ["meta", "theme", "content"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate content");
  }

  return JSON.parse(text) as GeneratedPageData;
};
