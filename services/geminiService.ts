
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationRequest, SheetType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJsonString = (str: string): string => {
  const jsonMatch = str.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : str;
};

export const generatePedagogicalSheet = async (request: GenerationRequest & { type?: SheetType }) => {
  const { activity, gradeLevel, topic, language, type = SheetType.LESSON } = request;

  const systemInstruction = `Tu es l'Expert de référence du Ministère de l'Éducation Nationale du Sénégal. Tu maîtrises parfaitement le Guide Pédagogique du CEB pour TOUTES les classes (CI, CP, CE1, CE2, CM1, CM2) et TOUTES les disciplines.

  CONTEXTE DE RÉFÉRENCE (CEB SÉNÉGAL) :
  1. LANGUE ET COMMUNICATION (LC) : Communication Orale, Lecture, Écriture, Production d'écrits, Grammaire, Conjugaison, Orthographe, Vocabulaire.
  2. MATHÉMATIQUES : Activités Numériques, Géométrie, Mesure, Résolution de problèmes.
  3. ESVS : Histoire, Géographie, Initiation Scientifique et Technologique.
  4. EDD (Éducation au Développement Durable) : Vivre Ensemble, Vivre dans son Milieu.
  5. ARTS & SPORTS : Arts Plastiques, Éducation Musicale, EPS.
  6. FRANCO-ARABE : Tawhid, Fiqh, Sirah, Hadith, Coran (Hifz/Tajwid), Langue Arabe (Nahw, Sarf, Imla, Incha).
  7. ANGLAIS : Initiation à l'anglais oral et écrit.

  TA MISSION :
  - Décliner avec précision le DOMAINE, SOUS-DOMAINE, CB, PALIER et OA conformément au guide pour le niveau ${gradeLevel}.
  - Enrichir le vocabulaire pédagogique : utilise des termes comme "matérialisation", "confrontation", "validation", "institutionnalisation".
  - Résumé adapté : Pour un ${gradeLevel}, le résumé doit être calibré (CI/CP = 1 phrase simple ; CM = Synthèse structurée).

  STRUCTURE DE LA FICHE (MODÈLE APC OFFICIEL) :
  - Mise en train : Rappel de pré-requis ou jeu éducatif.
  - Mise en situation : Situation-problème contextualisée au Sénégal (lieux, prénoms locaux).
  - Construction des connaissances : Démarche active (Observation -> Hypothèses -> Vérification -> Synthèse).
  - Évaluation : Exercice d'application immédiate de l'OS.

  RETOURNE EXCLUSIVEMENT DU JSON.`;

  const prompt = `Génère une fiche de préparation complète pour :
  Niveau : "${gradeLevel}"
  Discipline/Activité : "${activity}"
  Titre de la leçon : "${topic}"
  Type : "${type}"
  Langue de rédaction : "${language}"
  
  Assure-toi que tout le contenu (titres, activités, résumé) est rédigé en "${language}".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            domain: { type: Type.STRING },
            subDomain: { type: Type.STRING },
            discipline: { type: Type.STRING },
            activity: { type: Type.STRING },
            competence: { type: Type.STRING },
            level: { type: Type.STRING },
            oa: { type: Type.STRING },
            contentSummary: { type: Type.STRING },
            specificObjective: { type: Type.STRING },
            duration: { type: Type.STRING },
            reference: { type: Type.STRING },
            material: {
              type: Type.OBJECT,
              properties: {
                collective: { type: Type.STRING },
                individual: { type: Type.STRING }
              }
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  teacherActivity: { type: Type.STRING },
                  studentActivity: { type: Type.STRING }
                },
                required: ["name", "objective", "teacherActivity", "studentActivity"]
              }
            }
          },
          required: ["title", "domain", "subDomain", "competence", "level", "oa", "specificObjective", "duration", "steps"]
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Réponse vide de l'IA.");
    
    const data = JSON.parse(cleanJsonString(text));
    
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      type: type,
      subject: data.activity || activity,
      gradeLevel
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Erreur lors de la génération. Veuillez vérifier la connexion ou les paramètres.");
  }
};
