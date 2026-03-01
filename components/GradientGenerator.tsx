import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

type GradientType = 'linear' | 'radial' | 'conic';
type LinearDirection = 'to top' | 'to bottom' | 'to left' | 'to right' | 'to top left' | 'to top right' | 'to bottom left' | 'to bottom right';

const predefinedColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8B500', '#00CED1', '#FF69B4', '#32CD32', '#FF4500',
  '#8A2BE2', '#00FF7F', '#FF1493', '#1E90FF', '#FFD700'
];

const directionLabels: Record<LinearDirection, string> = {
  'to top': '↑ Haut',
  'to bottom': '↓ Bas',
  'to left': '← Gauche',
  'to right': '→ Droite',
  'to top left': '↖ Haut-Gauche',
  'to top right': '↗ Haut-Droite',
  'to bottom left': '↙ Bas-Gauche',
  'to bottom right': '↘ Bas-Droite'
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const GradientGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [linearDirection, setLinearDirection] = useState<LinearDirection>('to bottom');
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('circle');
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: generateId(), color: '#667eea', position: 0 },
    { id: generateId(), color: '#764ba2', position: 100 }
  ]);
  const [previewSize, setPreviewSize] = useState<{ width: number; height: number }>({ width: 400, height: 300 });
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const generateGradientCSS = (): string => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stops = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${linearDirection}, ${stops})`;
      case 'radial':
        return `radial-gradient(${radialShape} at center, ${stops})`;
      case 'conic':
        return `conic-gradient(from 0deg at center, ${stops})`;
      default:
        return `linear-gradient(${linearDirection}, ${stops})`;
    }
  };

  const gradientCSS = generateGradientCSS();

  const addColorStop = () => {
    const positions = colorStops.map(s => s.position).sort((a, b) => a - b);
    let newPos = 50;
    for (let i = 0; i < positions.length - 1; i++) {
      const mid = (positions[i] + positions[i + 1]) / 2;
      if (mid !== newPos) {
        newPos = mid;
        break;
      }
    }
    const newStop: ColorStop = {
      id: generateId(),
      color: '#ffffff',
      position: newPos
    };
    setColorStops([...colorStops, newStop]);
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length <= 2) return;
    setColorStops(colorStops.filter(stop => stop.id !== id));
  };

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setColorStops(colorStops.map(stop =>
      stop.id === id ? { ...stop, ...updates } : stop
    ));
  };

  const copyToClipboard = async () => {
    const cssCode = `background: ${gradientCSS};`;
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSS = () => {
    const cssContent = `/* Generated Gradient CSS */
.gradient-background {
  background: ${gradientCSS};
}

/* Alternative formats */
.gradient-background-linear {
  background: linear-gradient(${linearDirection}, ${colorStops.sort((a, b) => a.position - b.position).map(s => `${s.color} ${s.position}%`).join(', ')});
}

.gradient-background-radial {
  background: radial-gradient(${radialShape} at center, ${colorStops.sort((a, b) => a.position - b.position).map(s => `${s.color} ${s.position}%`).join(', ')});
}

.gradient-background-conic {
  background: conic-gradient(from 0deg at center, ${colorStops.sort((a, b) => a.position - b.position).map(s => `${s.color} ${s.position}%`).join(', ')});
}
`;
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient-styles.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    const config = {
      type: gradientType,
      direction: gradientType === 'linear' ? linearDirection : undefined,
      shape: gradientType === 'radial' ? radialShape : undefined,
      colors: colorStops.sort((a, b) => a.position - b.position)
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadPreset = (preset: string) => {
    const presets: Record<string, { type: GradientType; direction?: LinearDirection; stops: ColorStop[] }> = {
      'sunset': {
        type: 'linear',
        direction: 'to bottom',
        stops: [
          { id: generateId(), color: '#FF512F', position: 0 },
          { id: generateId(), color: '#DD2476', position: 100 }
        ]
      },
      'ocean': {
        type: 'linear',
        direction: 'to right',
        stops: [
          { id: generateId(), color: '#2193b0', position: 0 },
          { id: generateId(), color: '#6dd5ed', position: 100 }
        ]
      },
      'purple-haze': {
        type: 'linear',
        direction: 'to top right',
        stops: [
          { id: generateId(), color: '#7303c0', position: 0 },
          { id: generateId(), color: '#ec38bc', position: 50 },
          { id: generateId(), color: '#fdeff9', position: 100 }
        ]
      },
      'forest': {
        type: 'linear',
        direction: 'to bottom',
        stops: [
          { id: generateId(), color: '#134E5E', position: 0 },
          { id: generateId(), color: '#71B280', position: 100 }
        ]
      },
      'fire': {
        type: 'radial',
        stops: [
          { id: generateId(), color: '#f12711', position: 0 },
          { id: generateId(), color: '#f5af19', position: 100 }
        ]
      }
    };

    const p = presets[preset];
    if (p) {
      setGradientType(p.type);
      if (p.direction) setLinearDirection(p.direction);
      setColorStops(p.stops);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-slate-800">
              Générateur de Dégradés CSS
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panneau de contrôle */}
          <div className="space-y-6">
            {/* Type de dégradé */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Type de Dégradé</h2>
              <div className="flex gap-3">
                {(['linear', 'radial', 'conic'] as GradientType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      gradientType === type
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'linear' ? 'Linéaire' : type === 'radial' ? 'Radial' : 'Conique'}
                  </button>
                ))}
              </div>
            </div>

            {/* Direction (pour linéaire) */}
            {gradientType === 'linear' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Direction</h2>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(directionLabels) as LinearDirection[]).map(dir => (
                    <button
                      key={dir}
                      onClick={() => setLinearDirection(dir)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        linearDirection === dir
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {directionLabels[dir]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Forme (pour radial) */}
            {gradientType === 'radial' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Forme</h2>
                <div className="flex gap-3">
                  {(['circle', 'ellipse'] as const).map(shape => (
                    <button
                      key={shape}
                      onClick={() => setRadialShape(shape)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        radialShape === shape
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {shape === 'circle' ? 'Cercle' : 'Ellipse'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Couleurs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Couleurs</h2>
                <button
                  onClick={addColorStop}
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                >
                  + Ajouter couleur
                </button>
              </div>
              
              <div className="space-y-4">
                {[...colorStops].sort((a, b) => a.position - b.position).map((stop, index) => (
                  <div key={stop.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <div className="flex-shrink-0">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-600">Couleur {index + 1}</span>
                        <span className="text-sm text-slate-500">{stop.position}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) => updateColorStop(stop.id, { position: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                    {colorStops.length > 2 && (
                      <button
                        onClick={() => removeColorStop(stop.id)}
                        className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Palette de couleurs prédéfinies */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-600 mb-3">Palette rapide</h3>
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
                        const middleIndex = Math.floor(sortedStops.length / 2);
                        updateColorStop(sortedStops[middleIndex].id, { color });
                      }}
                      className="w-8 h-8 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Préréglages */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Préréglages</h2>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { name: 'sunset', colors: ['#FF512F', '#DD2476'] },
                  { name: 'ocean', colors: ['#2193b0', '#6dd5ed'] },
                  { name: 'purple', colors: ['#7303c0', '#ec38bc'] },
                  { name: 'forest', colors: ['#134E5E', '#71B280'] },
                  { name: 'fire', colors: ['#f12711', '#f5af19'] }
                ].map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset.name)}
                    className="h-12 rounded-xl border-2 border-slate-200 hover:border-indigo-500 transition-colors overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Panneau d'aperçu */}
          <div className="space-y-6">
            {/* Aperçu en direct */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Aperçu en Direct</h2>
              
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">L:</label>
                  <input
                    type="number"
                    value={previewSize.width}
                    onChange={(e) => setPreviewSize({ ...previewSize, width: parseInt(e.target.value) || 100 })}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    min="50"
                    max="800"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">H:</label>
                  <input
                    type="number"
                    value={previewSize.height}
                    onChange={(e) => setPreviewSize({ ...previewSize, height: parseInt(e.target.value) || 100 })}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    min="50"
                    max="600"
                  />
                </div>
              </div>

              <div 
                ref={previewRef}
                className="rounded-2xl shadow-inner border-4 border-slate-200 mx-auto transition-all duration-300"
                style={{ 
                  width: `${previewSize.width}px`, 
                  height: `${previewSize.height}px`,
                  background: gradientCSS,
                  maxWidth: '100%'
                }}
              />
            </div>

            {/* Code CSS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Code CSS</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copié!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copier
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                <code className="text-green-400 font-mono text-sm">
                  background: {gradientCSS};
                </code>
              </div>

              {/* Export buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={exportCSS}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exporter CSS
                </button>
                <button
                  onClick={exportAsJSON}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exporter JSON
                </button>
              </div>
            </div>

            {/* Instructions d'utilisation */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">Comment utiliser</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Ajoutez jusqu'à 5 couleurs pour créer des dégradés complexes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Ajustez la position de chaque couleur avec le curseur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Utilisez les préréglages pour Inspiration rapide</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Exportez votre dégradé en CSS ou en JSON pour réutilisation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
