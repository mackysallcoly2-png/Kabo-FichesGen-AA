
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationRequest, SheetType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const cleanJsonString = (str: string): string => {
  const jsonMatch = str.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : str;
};

export const generatePedagogicalSheet = async (request: GenerationRequest & { type?: SheetType }) => {
  const { activity, gradeLevel, topic, language, type = SheetType.LESSON } = request;

  const systemInstruction = `Tu es l'Expert de référence du Ministère de l'Éducation Nationale du Sénégal, propulsé par KABO GenFiches AI 2.0. Tu es spécialisé dans l'Approche Par les Compétences (APC). Tu maîtrises l'intégralité du Guide Pédagogique du CEB (Curriculum de l'Éducation de Base) pour tous les cycles :
  - Cycle Fondamental 1 (CI, CP)
  - Cycle Fondamental 2 (CE1, CE2)
  - Cycle Fondamental 3 (CM1, CM2)

  RÈGLES D'OR DU CURRICULUM SÉNÉGALAIS :
  1. FIDÉLITÉ ABSOLUE : Tu dois utiliser les libellés EXACTS des Compétences de Base (CB) et des Objectifs d'Apprentissage (OA) tels qu'écrits dans les guides officiels.
  2. DÉCLINAISON PRÉCISE : Pour chaque leçon, identifie sans erreur :
     - Le DOMAINE (ex: Langue et Communication)
     - Le SOUS-DOMAINE (ex: Communication Écrite)
     - L'ACTIVITÉ (ex: Lecture)
     - La COMPÉTENCE DE BASE (CB) liée au palier.
     - Le PALIER de compétence.
     - L'OBJECTIF D'APPRENTISSAGE (OA) spécifique à la leçon.
  3. OBJECTIF SPÉCIFIQUE (OS) : Il doit être formulé selon la norme (Comportement observable + Conditions + Critères de réussite).
  4. CONTENUS : Les contenus doivent respecter la progression officielle du Sénégal.

  DOMAINES DE RÉFÉRENCE :
  - LC (Langue et Communication) : Communication Orale, Lecture, Écriture, Production d'écrits, Grammaire, Conjugaison, Orthographe, Vocabulaire.
  - MATHS : Activités Numériques, Géométrie, Mesure, Résolution de problèmes.
  - ESVS : Histoire, Géographie, IST.
  - EDD : Vivre Ensemble, Vivre dans son Milieu.
  - ARTS & SPORTS : Arts Plastiques, Musique, EPS.
  - FRANCO-ARABE : Tawhid, Fiqh, Sirah, Hadith, Coran, Langue Arabe (Nahw, Sarf, Imla, Incha).

  STRUCTURE APC :
  - Mise en train : Rappel/Jeu.
  - Mise en situation : Situation-problème contextualisée (Sénégal).
  - Construction : Observation -> Hypothèses -> Vérification -> Institutionnalisation.
  - Évaluation : Item de vérification de l'OS.

  IMPORTANT (LANGUE ARABE) :
  - Si la langue demandée est l'Arabe, TOUT le contenu généré doit être en Arabe littéraire correct, en utilisant la terminologie pédagogique officielle des écoles franco-arabes du Sénégal.

  RETOURNE EXCLUSIVEMENT DU JSON.`;

  const prompt = `En tant qu'expert du CEB Sénégal, génère la fiche pédagogique officielle pour :
  Niveau : "${gradeLevel}"
  Activité : "${activity}"
  Titre : "${topic}"
  Type : "${type}"
  Langue : "${language}"
  
  VÉRIFICATION CURRICULAIRE : Assure-toi que la CB, le Palier et l'OA correspondent exactement au guide pédagogique sénégalais pour le niveau ${gradeLevel}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
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
