
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SheetEditor from './components/SheetEditor';
import { PedagogicalSheet } from './types';

const App: React.FC = () => {
  const [sheets, setSheets] = useState<PedagogicalSheet[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('edu_sheets');
    if (saved) setSheets(JSON.parse(saved));
  }, []);

  const saveSheets = (updated: PedagogicalSheet[]) => {
    setSheets(updated);
    localStorage.setItem('edu_sheets', JSON.stringify(updated));
  };

  const addSheet = (sheet: PedagogicalSheet) => {
    saveSheets([sheet, ...sheets]);
  };

  const updateSheet = (updatedSheet: PedagogicalSheet) => {
    saveSheets(sheets.map(s => s.id === updatedSheet.id ? updatedSheet : s));
  };

  const deleteSheet = (id: string) => {
    saveSheets(sheets.filter(s => s.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-graduation-cap text-xl"></i>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Kabo FichesGen
              </span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                Mes Fiches
              </Link>
              <Link to="/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-sm flex items-center space-x-2">
                <i className="fas fa-plus"></i>
                <span>Créer</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard sheets={sheets} onDelete={deleteSheet} />} />
            <Route path="/create" element={<SheetEditor onSave={addSheet} />} />
            <Route path="/edit/:id" element={<SheetEditor sheets={sheets} onSave={updateSheet} />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-8 no-print">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Kabo FichesGen. Conçu pour faciliter la vie des enseignants.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
