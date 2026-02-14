
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PedagogicalSheet, SheetType } from '../types';

interface DashboardProps {
  sheets: PedagogicalSheet[];
  onDelete: (id: string) => void;
}

const getTypeColor = (type: SheetType) => {
  switch (type) {
    case SheetType.LESSON: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case SheetType.EXERCISE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case SheetType.EVALUATION: return 'bg-rose-100 text-rose-700 border-rose-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const Dashboard: React.FC<DashboardProps> = ({ sheets, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSheets = sheets.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la fiche "${title}" ?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Cahier de Préparation</h1>
          <p className="text-slate-500 mt-2 text-lg">Gérez vos supports pédagogiques intelligents en un seul endroit.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Fiches</p>
              <p className="text-2xl font-black text-indigo-600">{sheets.length}</p>
           </div>
           <Link to="/create" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center space-x-2">
              <i className="fas fa-plus"></i>
              <span>Nouvelle Fiche</span>
           </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <i className="fas fa-search"></i>
        </div>
        <input 
          type="text" 
          placeholder="Rechercher par titre, discipline (ex: Anglais)..."
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredSheets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <i className="fas fa-folder-open text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {searchTerm ? "Aucun résultat trouvé" : "Votre cahier est vide"}
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            {searchTerm ? "Essayez d'autres mots-clés." : "Commencez par créer votre première fiche assistée par Kabo FichesGen."}
          </p>
          {!searchTerm && (
            <Link to="/create" className="inline-flex items-center space-x-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all">
              <i className="fas fa-magic"></i>
              <span>Générer ma première fiche</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSheets.map((sheet) => (
            <div key={sheet.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-2xl transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                 <Link to={`/edit/${sheet.id}`} className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">
                    <i className="fas fa-edit text-xs"></i>
                 </Link>
                 <button 
                  onClick={() => handleDelete(sheet.id, sheet.title)}
                  className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                 >
                    <i className="fas fa-trash text-xs"></i>
                 </button>
              </div>

              <div>
                <div className="flex mb-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getTypeColor(sheet.type)}`}>
                    {sheet.type === SheetType.LESSON ? 'Leçon' : sheet.type === SheetType.EXERCISE ? 'Exercices' : 'Évaluation'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight min-h-[3rem] line-clamp-2">
                  {sheet.title}
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Activité</span>
                    <span className="text-sm font-medium text-slate-700 truncate">{sheet.subject}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Classe</span>
                    <span className="text-sm font-medium text-slate-700">{sheet.gradeLevel}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center text-slate-400 space-x-2">
                  <i className="far fa-calendar-alt text-xs"></i>
                  <span className="text-[10px] font-medium">{new Date(sheet.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <Link to={`/edit/${sheet.id}`} className="text-indigo-600 text-sm font-bold flex items-center group-hover:translate-x-1 transition-transform">
                  Ouvrir <i className="fas fa-arrow-right ml-2 text-xs"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
