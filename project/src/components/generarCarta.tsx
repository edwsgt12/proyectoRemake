import { useState } from 'react';
import { RiMagicLine, RiFlashlightLine, RiShieldLine, RiTeamLine } from "react-icons/ri";

// Importaciones reales desde tus archivos de tipos
import type { Carta } from "../assets/types/types";
import { 
    MAPA_TIPO_A_GRUPO, 
    type TipoCarta, 
    type TipoHabilidadIA 
} from "../assets/types/atributosCartas"; // Asegúrate de apuntar a './tipos' o donde tengas MAPA_TIPO_A_GRUPO

// 1. Extraemos las familias reales de tu mapa: Cónclave Arcano, Sindicato Cyberpunk, etc.
const FAMILIAS_UNICAS = Array.from(new Set(Object.values(MAPA_TIPO_A_GRUPO)));

// 2. Mapeo inverso automático para agrupar los tipos por facción
const MAPA_GRUPO_A_TIPOS = Object.entries(MAPA_TIPO_A_GRUPO).reduce((acc, [tipo, grupo]) => {
  if (!acc[grupo]) acc[grupo] = [];
  acc[grupo].push(tipo as TipoCarta);
  return acc;
}, {} as Record<string, TipoCarta[]>);

// 3. CONFIGURACIÓN DE LÍMITES CON TUS FAMILIAS REALES
const LIMITES_POR_FAMILIA: Record<string, { maxAtaque: number; maxDefensa: number; maxVida: number }> = {
    "Cónclave Arcano":      { maxAtaque: 4000, maxDefensa: 1500, maxVida: 18000 },
    "Sindicato Cyberpunk":  { maxAtaque: 3500, maxDefensa: 2500, maxVida: 22000 },
    "Orden del Filo":       { maxAtaque: 3200, maxDefensa: 3500, maxVida: 28000 },
    "Sombras del Yermo":    { maxAtaque: 4500, maxDefensa: 1200, maxVida: 15000 },
    "Fuerzas Primordiales": { maxAtaque: 2000, maxDefensa: 4500, maxVida: 35000 },
};

const LIMITE_DEFECTO = { maxAtaque: 3000, maxDefensa: 3000, maxVida: 25000 };

export const GenerarCartaIA = () => {
  const [cardPrompt, setCardPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cartaGenerada, setCartaGenerada] = useState<Carta | null>(null);

  // === ESTADOS DE LOS SELECTORES ===
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState<string>(FAMILIAS_UNICAS[0]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoCarta>(
    (MAPA_GRUPO_A_TIPOS[FAMILIAS_UNICAS[0]]?.[0]) || "" as TipoCarta
  );
  
  const [tipoUlti, setTipoUlti] = useState<TipoHabilidadIA>('Daño');
  const [tipoDefensiva, setTipoDefensiva] = useState<TipoHabilidadIA>('Escudo');

  // Obtener límites basados en tu facción real seleccionada
  const limitesActuales = LIMITES_POR_FAMILIA[familiaSeleccionada] || LIMITE_DEFECTO;

  const handleFamiliaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaFamilia = e.target.value;
    setFamiliaSeleccionada(nuevaFamilia);
    const tiposFiltrados = MAPA_GRUPO_A_TIPOS[nuevaFamilia] || [];
    if (tiposFiltrados.length > 0) {
      setTipoSeleccionado(tiposFiltrados[0]);
    }
  };

  const generarCarta = async () => {
    if (!cardPrompt.trim()) {
      setError('Por favor, escribe una descripción para la carta.');
      return;
    }

    setLoading(true);
    setError(null);
    setCartaGenerada(null);

    const contextoSistema = `
      Eres un asistente experto diseñando cartas equilibradas para un videojuego RPG. 
      Debes generar estadísticas de combate, una habilidad definitiva y una habilidad defensiva basada en el prompt del usuario respetando ESTRICTAMENTE los límites de balanceo por facción.
      
      PARÁMETROS ASIGNADOS POR EL FORMULARIO:
      - FAMILIA / FACCIÓN: "${familiaSeleccionada}"
      - TIPO ESPECÍFICO: "${tipoSeleccionado}"
      - ENFOQUE DE LA HABILIDAD DEFINITIVA (ULTI): "${tipoUlti}"
      - ENFOQUE DE LA HABILIDAD DEFENSIVA: "${tipoDefensiva}"
      
      REGLAS DE ATRIBUTOS MÁXIMOS PERMITIDOS PARA LA FAMILIA "${familiaSeleccionada}":
      - "ataque" DEBE ser un entero entre 100 y ${limitesActuales.maxAtaque}.
      - "defensa" DEBE ser un entero entre 100 y ${limitesActuales.maxDefensa}.
      - "vida" DEBE ser un entero entre 1000 y ${limitesActuales.maxVida}.
      
      Responde EXCLUSIVAMENTE con un JSON plano que tenga esta estructura exacta:
      {
        "name": "Nombre original del personaje",
        "tipo": "${tipoSeleccionado}",
        "grupo": "${familiaSeleccionada}",
        "descripcion": "Breve trasfondo épico del personaje",
        "ataque": 1200,
        "defensa": 800,
        "vida": 15000,
        "tipoUlti": "${tipoUlti}",
        "tipoDefensiva": "${tipoDefensiva}",
        "img": ""
      }
    `;

    try {
      const response = await fetch('https://educapi-v2.onrender.com/ai/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'usersecretpasskey': 'Edwa735923IA' 
        },
        body: JSON.stringify({
          globalContext: contextoSistema,
          cardPrompt: cardPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo procesar con la IA.`);
      }

      const data: Carta = await response.json();
      setCartaGenerada(data);
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al conectar con la API.');
    } finally {
      setLoading(false);
    }
  };

  const tiposDisponiblesFiltrados = MAPA_GRUPO_A_TIPOS[familiaSeleccionada] || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <div className="w-full max-w-xl bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-black mb-2 text-yellow-500 text-center uppercase tracking-tighter">Generar Carta con IA</h1>
        
        {/* Marcadores de límites dinámicos en la interfaz */}
        <p className="text-center text-[10px] text-slate-400 mb-6 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50 uppercase tracking-wider">
          Topes {familiaSeleccionada}: <span className="text-red-400 font-bold">⚔️ {limitesActuales.maxAtaque}</span> | <span className="text-blue-400 font-bold">🛡️ {limitesActuales.maxDefensa}</span> | <span className="text-green-400 font-bold">❤️ {limitesActuales.maxVida}</span>
        </p>
        
        <div className="space-y-4 mb-6 bg-slate-900/40 p-4 rounded-xl border border-slate-700/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><RiTeamLine/> Familia / Facción</label>
              <select
                value={familiaSeleccionada}
                onChange={handleFamiliaChange}
                disabled={loading}
                className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white text-xs font-medium outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
              >
                {FAMILIAS_UNICAS.map((fam) => (
                  <option key={fam} value={fam}>🛡️ {fam}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><RiMagicLine/> Tipo Específico</label>
              <select
                value={tipoSeleccionado}
                onChange={(e) => setTipoSeleccionado(e.target.value as TipoCarta)}
                disabled={loading}
                className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white text-xs font-medium outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
              >
                {tiposDisponiblesFiltrados.map((tipo) => (
                  <option key={tipo} value={tipo}>✨ {tipo}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-700/40">
            <div>
              <label className="block mb-1.5 text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><RiFlashlightLine/> Enfoque Ulti</label>
              <select
                value={tipoUlti}
                onChange={(e) => setTipoUlti(e.target.value as TipoHabilidadIA)}
                disabled={loading}
                className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white text-xs font-medium outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
              >
                <option value="Daño">💥 Daño Directo</option>
                <option value="Curación">🩸 Curación</option>
                <option value="Efecto de Estado">🧪 Estado Alterado</option>
                <option value="Buff/Debuff">⚡ Potenciador</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-black uppercase text-slate-400 flex items-center gap-1"><RiShieldLine/> Enfoque Defensivo</label>
              <select
                value={tipoDefensiva}
                onChange={(e) => setTipoDefensiva(e.target.value as TipoHabilidadIA)}
                disabled={loading}
                className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white text-xs font-medium outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
              >
                <option value="Escudo">🛡️ Escudo</option>
                <option value="Curación">🩹 Auto-Curación</option>
                <option value="Buff/Debuff">❄️ Mitigar Daño</option>
              </select>
            </div>
          </div>
        </div>

        <label className="block mb-2 text-xs font-black uppercase text-slate-300">
          Idea de Trasfondo para la IA
        </label>
        <textarea
          className="w-full p-4 mb-6 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 resize-none"
          rows={4}
          placeholder="Ej: Un androide renegado de plasma o un chamán elemental..."
          value={cardPrompt}
          onChange={(e) => setCardPrompt(e.target.value)}
          disabled={loading}
        />

        <button
          onClick={generarCarta}
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            loading 
              ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
              : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]'
          }`}
        >
          {loading ? 'Invocando estadísticas...' : 'Generar Carta con Balance'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold text-center uppercase">
            {error}
          </div>
        )}

        {/* CARD PREVIEW */}
        {cartaGenerada && (
          <div className="mt-6 p-6 bg-slate-900 border border-yellow-500/40 rounded-xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-xl font-black text-yellow-400 uppercase tracking-tight">{cartaGenerada.name}</h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {cartaGenerada.grupo} • {cartaGenerada.tipo}
                </span>
              </div>
              <span className="px-2.5 py-1 bg-yellow-500/10 rounded-md text-[10px] font-black uppercase text-yellow-400 border border-yellow-500/20">
                Nivel 1
              </span>
            </div>

            <p className="text-xs text-slate-400 italic">"{cartaGenerada.descripcion}"</p>

            <div className="grid grid-cols-3 gap-2 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-700/30 text-center font-semibold">
              <div>⚔️ ATK: <span className="font-bold text-red-400">{cartaGenerada.ataque}</span></div>
              <div>🛡️ DEF: <span className="font-bold text-blue-400">{cartaGenerada.defensa}</span></div>
              <div>❤️ HP: <span className="font-bold text-green-400">{cartaGenerada.vida}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerarCartaIA;