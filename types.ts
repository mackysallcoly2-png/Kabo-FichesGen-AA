
export enum SheetType {
  LESSON = 'LESSON',
  EXERCISE = 'EXERCISE',
  EVALUATION = 'EVALUATION'
}

export interface PedagogicalStep {
  name: string;
  objective: string;
  teacherActivity: string;
  studentActivity: string;
}

export interface PedagogicalSheet {
  id: string;
  title: string;
  discipline?: string; // Discipline générale
  subject: string; // Activité spécifique
  domain: string; // Domaine
  subDomain: string; // Sous-domaine
  gradeLevel: string; // Classe (CI, CP, CE1, CE2, CM1, CM2)
  competence: string; // Compétence de base (CB)
  level: string; // Palier
  oa: string; // Objectif d'Apprentissage (OA)
  contentSummary: string; // Contenu
  specificObjective: string; // Objectif spécifique (OS)
  type: SheetType;
  duration: string;
  material: {
    collective: string;
    individual: string;
  };
  reference: string; // Bibliographie/Référence
  steps: PedagogicalStep[];
  createdAt: number;
}

export interface GenerationRequest {
  topic: string;
  gradeLevel: string;
  activity: string;
  language: string;
}
