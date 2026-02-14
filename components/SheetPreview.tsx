
import React from 'react';
import { PedagogicalSheet } from '../types';

interface SheetPreviewProps {
  sheet: PedagogicalSheet;
}

const SheetPreview: React.FC<SheetPreviewProps> = ({ sheet }) => {
  const isArabic = /[\u0600-\u06FF]/.test(sheet.title) || /[\u0600-\u06FF]/.test(sheet.competence);
  const dir = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'text-right' : 'text-left';

  return (
    <div className="sheet-container bg-white p-10 print:p-0 text-slate-900 font-sans min-h-[1080px] flex flex-col" dir={dir}>
      {/* En-tête Institutionnel Premium */}
      <div className={`flex justify-between items-center border-b-4 border-black pb-4 mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className={`text-[10px] font-bold uppercase space-y-1 ${textAlign} w-1/3`}>
          <p>République du Sénégal</p>
          <p>Ministère de l'Éducation Nationale</p>
          <p>Inspection de l'Éducation : .........................</p>
          <p>École : ...........................................................</p>
        </div>
        <div className="text-center w-1/3">
          <div className="inline-block border-2 border-black p-3 mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-xl font-black uppercase leading-none">FICHE DE PRÉPARATION</h1>
          </div>
          <p className="text-[11px] font-black uppercase tracking-widest text-indigo-600 print:text-black">Modèle APC - Guide Pédagogique</p>
        </div>
        <div className={`text-[10px] font-bold uppercase space-y-1 ${isArabic ? 'text-left' : 'text-right'} w-1/3`}>
          <p className="text-[12px] font-black bg-slate-100 print:bg-transparent px-2 py-1 rounded">Classe : {sheet.gradeLevel}</p>
          <p>Effectif : ........... G: .... F: ....</p>
          <p>Date : {new Date(sheet.createdAt).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      {/* Cadre Curriculaire - Déclinaison Complète */}
      <div className="mb-6">
        <div className={`grid grid-cols-2 border-2 border-black p-3 bg-slate-50 print:bg-white ${textAlign} text-[11px] gap-y-2`}>
          <div>
            <span className="font-black underline">DOMAINE :</span> <span className="uppercase">{sheet.domain}</span>
          </div>
          <div>
            <span className="font-black underline">S-DOMAINE :</span> <span className="uppercase">{sheet.subDomain}</span>
          </div>
          <div>
            <span className="font-black underline">DISCIPLINE :</span> <span className="uppercase">{sheet.discipline || '/'}</span>
          </div>
          <div>
            <span className="font-black underline">ACTIVITÉ :</span> <span className="uppercase">{sheet.subject}</span>
          </div>
        </div>
        
        <div className={`p-4 border-2 border-black border-t-0 ${textAlign} space-y-3`}>
          <div className="flex items-start gap-3">
            <span className="font-black text-[12px] uppercase whitespace-nowrap bg-black text-white px-2 py-0.5">TITRE :</span>
            <span className="font-black text-[14px] uppercase underline decoration-2 underline-offset-4">{sheet.title}</span>
          </div>
          
          <div className="text-[11px] leading-relaxed">
            <span className="font-black uppercase text-indigo-700 print:text-black">Compétence de Base (CB) :</span> 
            <p className="mt-1 pl-4 border-l-4 border-slate-200 print:border-black italic font-medium">{sheet.competence}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-[11px]">
            <div className="bg-slate-50 print:bg-transparent p-2 border border-slate-200 print:border-black">
              <span className="font-black uppercase block border-b border-black mb-1">Palier :</span>
              <span>{sheet.level}</span>
            </div>
            <div className="bg-slate-50 print:bg-transparent p-2 border border-slate-200 print:border-black">
              <span className="font-black uppercase block border-b border-black mb-1">Obj. d'Apprentissage (OA) :</span>
              <span>{sheet.oa}</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="bg-indigo-600 text-white print:bg-slate-200 print:text-black p-3 rounded-sm border-l-8 border-indigo-900 print:border-black shadow-md">
              <span className="font-black uppercase text-[11px]">Objectif Spécifique (OS) :</span>
              <p className="font-bold text-[12px] mt-1 italic">
                {sheet.specificObjective}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Intrants - Style Tableau compact */}
      <div className={`grid grid-cols-4 gap-0 text-[10px] font-bold border-2 border-black border-t-0 mb-6 bg-slate-100 print:bg-white ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className="border-r-2 border-black p-2 text-center flex flex-col justify-center">
          <span className="text-[9px] uppercase">Durée</span>
          <span className="text-[12px] font-black">{sheet.duration}</span>
        </div>
        <div className="border-r-2 border-black p-2 text-center flex flex-col justify-center col-span-2">
          <span className="text-[9px] uppercase">Supports / Matériel</span>
          <span className="italic truncate">{sheet.material?.collective || 'Tableau, Craies, Guides CEB'}</span>
        </div>
        <div className="p-2 text-center flex flex-col justify-center">
          <span className="text-[9px] uppercase">Référence</span>
          <span className="truncate">{sheet.reference || 'Guide Pédagogique'}</span>
        </div>
      </div>

      {/* Tableau de Déroulement - Occupation Optimale */}
      <div className="flex-grow">
        <table className="w-full border-collapse border-2 border-black text-[11pt]" dir={dir}>
          <thead>
            <tr className="bg-slate-900 text-white print:bg-slate-300 print:text-black font-black uppercase text-[10px]">
              <th className="p-4 w-[14%] border-r-2 border-black text-center">Étapes</th>
              <th className="p-4 w-[16%] border-r-2 border-black text-center">Objectifs</th>
              <th className="p-4 w-[35%] border-r-2 border-black">Activités du Maître</th>
              <th className="p-4 w-[35%]">Activités des Élèves</th>
            </tr>
          </thead>
          <tbody>
            {sheet.steps.map((step, idx) => (
              <tr key={idx} className="align-top border-b-2 border-black group">
                <td className={`p-3 font-black uppercase text-[10px] bg-slate-50 print:bg-transparent border-r-2 border-black ${textAlign}`}>
                  {step.name}
                </td>
                <td className={`p-3 text-[10px] italic border-r-2 border-black ${textAlign}`}>
                  {step.objective}
                </td>
                <td className={`p-4 text-[11px] leading-relaxed text-justify border-r-2 border-black ${textAlign}`}>
                  {step.teacherActivity}
                </td>
                <td className={`p-4 text-[11px] leading-relaxed text-justify ${textAlign}`}>
                  {step.studentActivity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Observations */}
      <div className="mt-6 border-2 border-black p-3 text-[10px] italic h-24 relative">
        <span className="font-black uppercase not-italic bg-white px-2 absolute -top-3 left-4 border border-black">Observations du Directeur / IEF :</span>
        <div className="mt-4 space-y-3 opacity-20">
          <div className="border-b border-black w-full"></div>
          <div className="border-b border-black w-full"></div>
        </div>
      </div>

      {/* Pied de page et Signatures */}
      <div className={`mt-8 grid grid-cols-2 gap-20 px-16 text-[11px] font-black uppercase text-center ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className="space-y-16">
          <p className="underline underline-offset-8">L'Enseignant</p>
          <div className="h-12 border-2 border-dashed border-slate-200 print:border-none"></div>
        </div>
        <div className="space-y-16">
          <p className="underline underline-offset-8">Visa Direction / IEF</p>
          <div className="h-12 border-2 border-dashed border-slate-200 print:border-none"></div>
        </div>
      </div>

      <footer className="mt-auto pt-6 text-center text-[8px] text-slate-400 font-black uppercase tracking-[0.3em] no-print border-t border-slate-100">
        Kabo FichesGen Premium v2.5 • Le Guide Pédagogique Numérique du Sénégal
      </footer>
    </div>
  );
};

export default SheetPreview;
