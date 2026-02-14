
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PedagogicalSheet, SheetType, GenerationRequest } from '../types';
import { generatePedagogicalSheet } from '../services/geminiService';
import SheetPreview from './SheetPreview';

interface SheetEditorProps {
  sheets?: PedagogicalSheet[];
  onSave: (sheet: PedagogicalSheet) => void;
}

const SheetEditor: React.FC<SheetEditorProps> = ({ sheets = [], onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  
  const [formData, setFormData] = useState<GenerationRequest & { type: SheetType }>({
    activity: '',
    gradeLevel: 'CM2',
    topic: '',
    language: 'Français',
    type: SheetType.LESSON
  });

  const [sheet, setSheet] = useState<PedagogicalSheet | null>(null);

  useEffect(() => {
    if (id) {
      const existing = sheets.find(s => s.id === id);
      if (existing) {
        setSheet(existing);
        setFormData({
          activity: existing.subject,
          gradeLevel: existing.gradeLevel,
          topic: existing.title,
          language: 'Français',
          type: existing.type
        });
      }
    }
  }, [id, sheets]);

  const handleGenerate = async () => {
    if (!formData.activity || !formData.topic) {
      alert("Précisez l'activité et le titre pour interroger le guide.");
      return;
    }

    setLoading(true);
    try {
      const generated = await generatePedagogicalSheet(formData);
      setSheet({ ...generated, type: formData.type });
      setViewMode('preview');
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erreur de connexion au guide pédagogique IA.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (sheet) {
      onSave(sheet);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/');
      }, 1500);
    }
  };

  const handlePrint = () => {
    if (viewMode === 'edit') {
        setViewMode('preview');
        setTimeout(() => window.print(), 500);
    } else {
        window.print();
    }
  };

  const exportToPDF = async () => {
    if (!sheet) return;
    if (viewMode === 'edit') {
      setViewMode('preview');
      setTimeout(() => triggerPdf(), 800);
    } else {
      triggerPdf();
    }
  };

  const triggerPdf = async () => {
    if (!previewRef.current || !sheet) return;

    setPdfLoading(true);
    try {
      const element = previewRef.current;
      const opt = {
        margin: [0, 0, 0, 0],
        filename: `CEB_SENEGAL_${sheet.gradeLevel}_${sheet.title.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      const html2pdfLib = (window as any).html2pdf;
      if (typeof html2pdfLib === 'function') {
        await html2pdfLib().set(opt).from(element).save();
      } else {
        throw new Error("html2pdf non disponible.");
      }
    } catch (err) {
      console.error(err);
      alert("Échec de l'export. Utilisez l'impression PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  const exportToWord = () => {
    if (!previewRef.current || !sheet) return;
    const content = previewRef.current.innerHTML;
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>body{font-family:Arial;font-size:11pt}table{border-collapse:collapse;width:100%;border:1px solid black}th,td{border:1px solid black;padding:6px}</style></head><body>${content}</body></html>`;
    const blob = new Blob(['\ufeff', header], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CEB_${sheet.title}.doc`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {saveSuccess && (
        <div className="fixed top-20 right-4 z-[100] bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <i className="fas fa-check-circle text-xl"></i>
          <span className="font-bold">Fiche archivée !</span>
        </div>
      )}

      {pdfLoading && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center space-y-6 border-b-8 border-indigo-600">
            <div className="w-20 h-20 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="text-center">
               <p className="font-black text-slate-900 uppercase tracking-widest text-sm mb-2">Finalisation du Document</p>
               <p className="text-xs text-slate-400 font-bold uppercase">Format A4 Officiel • Haute Résolution</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-[380px] no-print shrink-0">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl sticky top-24">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">Configuration</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Éditeur Curriculaire</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                <i className="fas fa-book-open text-xl"></i>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Type de document</label>
                <div className="grid grid-cols-3 gap-2">
                   {[
                     { id: SheetType.LESSON, label: 'Leçon', icon: 'chalkboard' },
                     { id: SheetType.EXERCISE, label: 'TD/Exos', icon: 'file-pen' },
                     { id: SheetType.EVALUATION, label: 'Éval.', icon: 'award' }
                   ].map(type => (
                     <button 
                      key={type.id}
                      onClick={() => setFormData({...formData, type: type.id as SheetType})}
                      className={`flex flex-col items-center py-4 rounded-2xl border-2 transition-all ${formData.type === type.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-indigo-200'}`}
                     >
                       <i className={`fas fa-${type.icon} mb-2 text-lg`}></i>
                       <span className="text-[10px] font-black uppercase tracking-tight">{type.label}</span>
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest flex items-center">
                    <i className="fas fa-microscope mr-2 text-indigo-500"></i> Discipline / Activité
                  </label>
                  <input 
                    type="text"
                    placeholder="ex: Grammaire, Fiqh, Mesure..."
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none text-sm font-bold transition-all"
                    value={formData.activity}
                    onChange={e => setFormData({...formData, activity: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest flex items-center">
                    <i className="fas fa-heading mr-2 text-indigo-500"></i> Titre de la leçon
                  </label>
                  <input 
                    type="text"
                    placeholder="ex: Le pluriel des noms, La prière..."
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none text-sm font-bold transition-all"
                    value={formData.topic}
                    onChange={e => setFormData({...formData, topic: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Classe / Niveau</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none text-sm font-black transition-all"
                    value={formData.gradeLevel}
                    onChange={e => setFormData({...formData, gradeLevel: e.target.value})}
                  >
                    {['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Langue</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none text-sm font-black transition-all"
                    value={formData.language}
                    onChange={e => setFormData({...formData, language: e.target.value})}
                  >
                    <option value="Français">Français</option>
                    <option value="Arabe">Arabe (العربية)</option>
                    <option value="Anglais">Anglais</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-3 shadow-2xl shadow-slate-200 uppercase tracking-widest text-[11px]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Interrogation du Guide...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-wand-sparkles text-sm"></i>
                    <span>Consulter le Guide IA</span>
                  </>
                )}
              </button>
            </div>

            {sheet && (
              <div className="mt-10 pt-8 border-t-2 border-slate-100 space-y-4">
                <button onClick={handleSave} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center uppercase text-xs tracking-widest shadow-lg shadow-emerald-100">
                  <i className="fas fa-check-double mr-2"></i> Finaliser & Sauvegarder
                </button>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={handlePrint} className="py-4 bg-indigo-50 text-indigo-700 border-2 border-indigo-100 rounded-2xl font-black text-[10px] uppercase flex flex-col items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                    <i className="fas fa-print mb-2 block text-xl"></i> Print
                  </button>
                  <button onClick={exportToPDF} className="py-4 bg-rose-50 text-rose-700 border-2 border-rose-100 rounded-2xl font-black text-[10px] uppercase flex flex-col items-center justify-center hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all">
                    <i className="fas fa-file-export mb-2 block text-xl"></i> PDF
                  </button>
                  <button onClick={exportToWord} className="py-4 bg-blue-50 text-blue-700 border-2 border-blue-100 rounded-2xl font-black text-[10px] uppercase flex flex-col items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                    <i className="fas fa-file-word mb-2 block text-xl"></i> Word
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow">
          {!sheet ? (
            <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-20 text-center flex flex-col items-center justify-center min-h-[800px] shadow-sm group">
              <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-10 border-8 border-white shadow-inner group-hover:scale-110 transition-transform duration-700">
                <i className="fas fa-book-reader text-6xl"></i>
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Moteur Curriculaire CEB</h3>
              <p className="text-slate-400 max-w-md text-center leading-relaxed font-bold text-lg">
                Kabo Gen possède l'intégralité du Guide Pédagogique du Sénégal. 
                <span className="text-indigo-500 block mt-4">Saisissez n'importe quelle leçon pour commencer la déclinaison automatique.</span>
              </p>
              <div className="mt-12 flex gap-4">
                 <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">Franco-Arabe</span>
                 <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Public Sénégal</span>
                 <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">Anglais Élémentaire</span>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex bg-slate-200/40 backdrop-blur p-1.5 rounded-3xl no-print w-fit border border-slate-200 shadow-inner">
                <button 
                  onClick={() => setViewMode('edit')}
                  className={`px-10 py-4 rounded-[1.25rem] text-[11px] font-black transition-all flex items-center tracking-widest uppercase ${viewMode === 'edit' ? 'bg-white text-indigo-600 shadow-xl scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <i className="fas fa-pen-fancy mr-2 text-sm"></i> Correction
                </button>
                <button 
                  onClick={() => setViewMode('preview')}
                  className={`px-10 py-4 rounded-[1.25rem] text-[11px] font-black transition-all flex items-center tracking-widest uppercase ${viewMode === 'preview' ? 'bg-white text-indigo-600 shadow-xl scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <i className="fas fa-file-contract mr-2 text-sm"></i> Format Officiel A4
                </button>
              </div>
              
              <div className="bg-white border-2 border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden min-h-[1000px]">
                {viewMode === 'edit' ? (
                  <div className="p-12 space-y-12" dir={/^[A-Za-z0-9\s]*$/.test(sheet.title) ? 'ltr' : 'rtl'}>
                     <div className="space-y-10">
                        <div className="border-b-8 border-slate-100 pb-6 relative">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Titre de la séance de travail</label>
                          <input 
                            className="text-4xl font-black text-slate-900 w-full outline-none focus:text-indigo-600 bg-transparent transition-all placeholder:text-slate-100"
                            value={sheet.title}
                            onChange={e => setSheet({...sheet, title: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="p-8 bg-slate-50 rounded-[2.5rem] border-4 border-slate-100 shadow-inner transition-all hover:bg-white hover:border-indigo-50">
                            <label className="text-[11px] font-black text-indigo-400 uppercase mb-4 block tracking-widest border-b border-indigo-100 pb-2">Compétence de base (CB)</label>
                            <textarea 
                              className="w-full text-[13px] font-medium text-slate-700 bg-transparent border-none outline-none focus:ring-0 min-h-[140px] leading-relaxed resize-none font-serif italic"
                              value={sheet.competence}
                              onChange={e => setSheet({...sheet, competence: e.target.value})}
                            />
                          </div>
                          <div className="p-8 bg-indigo-50/30 rounded-[2.5rem] border-4 border-indigo-100 shadow-inner transition-all hover:bg-white hover:border-indigo-200">
                            <label className="text-[11px] font-black text-indigo-700 uppercase mb-4 block tracking-widest border-b border-indigo-200 pb-2">Objectif Spécifique (OS)</label>
                            <textarea 
                              className="w-full text-sm font-black text-slate-900 bg-transparent border-none outline-none focus:ring-0 min-h-[140px] leading-relaxed resize-none"
                              value={sheet.specificObjective}
                              onChange={e => setSheet({...sheet, specificObjective: e.target.value})}
                            />
                          </div>
                        </div>
                     </div>

                      <section className="space-y-10">
                        <div className="flex items-center justify-between border-l-[12px] border-indigo-600 pl-6 py-4 bg-indigo-50/20 rounded-r-[2rem]">
                           <div>
                             <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Déroulement de la séquence</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Conformité APC • 5 Étapes du guide</p>
                           </div>
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                             <i className="fas fa-route"></i>
                           </div>
                        </div>
                        
                        <div className="space-y-6">
                          {sheet.steps.map((step, idx) => (
                            <div key={idx} className="bg-white border-2 border-slate-100 p-8 rounded-[3rem] transition-all hover:shadow-2xl hover:border-indigo-100 group relative">
                              <div className="flex items-center mb-8">
                                 <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-lg font-black mr-6 shadow-xl group-hover:bg-indigo-600 group-hover:scale-110 transition-all">
                                   {idx + 1}
                                 </div>
                                 <input 
                                  className="font-black text-indigo-600 bg-transparent border-none focus:ring-0 uppercase w-full text-xl tracking-tight"
                                  value={step.name}
                                  onChange={e => {
                                    const newSteps = [...sheet.steps];
                                    newSteps[idx].name = e.target.value;
                                    setSheet({...sheet, steps: newSteps});
                                  }}
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center tracking-widest">
                                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span> Maître
                                    </label>
                                    <textarea 
                                      className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm min-h-[180px] focus:ring-4 focus:ring-indigo-50 outline-none leading-relaxed transition-all shadow-inner font-medium text-slate-700"
                                      value={step.teacherActivity}
                                      onChange={e => {
                                        const newSteps = [...sheet.steps];
                                        newSteps[idx].teacherActivity = e.target.value;
                                        setSheet({...sheet, steps: newSteps});
                                      }}
                                    />
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center tracking-widest">
                                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span> Élèves
                                    </label>
                                    <textarea 
                                      className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 text-sm min-h-[180px] focus:ring-4 focus:ring-emerald-50 outline-none leading-relaxed transition-all shadow-inner font-medium text-slate-700"
                                      value={step.studentActivity}
                                      onChange={e => {
                                        const newSteps = [...sheet.steps];
                                        newSteps[idx].studentActivity = e.target.value;
                                        setSheet({...sheet, steps: newSteps});
                                      }}
                                    />
                                 </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                  </div>
                ) : (
                  <div ref={previewRef} className="bg-slate-500 p-8 print:p-0">
                    <div className="mx-auto shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] bg-white print:shadow-none">
                      <SheetPreview sheet={sheet} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SheetEditor;
