import { useState } from 'react';
import { RiMagicLine, RiFlashlightLine, RiShieldLine, RiTeamLine, RiCloseLine } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import { Link } from 'react-router';

// Importaciones reales desde tus archivos de tipos
import type { Carta } from "../assets/types/types";
import { 
    MAPA_TIPO_A_GRUPO, 
    type TipoCarta, 
    type TipoHabilidadIA,
    type GrupoCarta
} from "../assets/types/atributosCartas";

interface UltiAtaque {
    id: string;
    nombre: string;
    descripcion: string;
    mecanica: string;
}

// === TU DICCIONARIO REAL DE ULTIS ===
export const DICCIONARIO_ULTIS_POR_FAMILIA: Record<GrupoCarta, UltiAtaque[]> = {
  "Cónclave Arcano": [
    { id: "tormenta_mana", nombre: "Tormenta de Maná", descripcion: "Daño masivo del 300%, pero reduce tu defensa un 20% el próximo turno.", mecanica: "EXPLOSIVO_RIESGO" },
    { id: "sentencia_nova", nombre: "Sentencia de Nova", descripcion: "Daño del 150% que se duplica si al rival le queda menos del 25% de vida.", mecanica: "EJECUCON" }
  ],
  "Sindicato Cyberpunk": [
    { id: "pulso_emp", nombre: "Pulso Electromagnético", descripcion: "Daño del 200% que ignora por completo los escudos del oponente.", mecanica: "PERFORANTE" },
    { id: "inyeccion_malware", nombre: "Inyección de Malware", descripcion: "Daño inicial del 120% que se duplica en cada turno del rival.", mecanica: "DOT_CRECIENTE" }
  ],
  "Orden del Filo": [
    { id: "corte_rompearmaz", nombre: "Corte Rompe-Armaduras", descripcion: "Daño del 210% y reduce la defensa del rival un 40% permanente.", mecanica: "DEBUFF_DEFENSA" },
    { id: "danza_hojas", nombre: "Danza de las Hojas", descripcion: "Lanza 3 golpes rápidos del 80% con probabilidad crítica individual.", mecanica: "MULTIGOLPE" }
  ],
  "Sombras del Yermo": [
    { id: "emboscada_toxica", nombre: "Emboscada Tóxica", descripcion: "Daño del 160% y aplica veneno que quita 8% de vida actual por 3 turnos.", mecanica: "VENENO" },
    { id: "disparo_conmocion", nombre: "Disparo de Conmoción", descripcion: "Daño del 180% con 30% de probabilidad de aturdir al oponente.", mecanica: "CONTROL_ATURDIR" }
  ],
  "Fuerzas Primordiales": [
    { id: "furia_tierra", nombre: "Furia de la Tierra", descripcion: "Daño equivalente al 100% de tu ataque más el 10% de tu Vida Máxima.", mecanica: "ESCALADO_VIDA" },
    { id: "golpe_espinas", nombre: "Golpe de Espinas", descripcion: "Daño del 185% que aumenta un 40% extra si tienes un escudo activo.", mecanica: "SI_TIENE_ESCUDO" }
  ]
};

const FAMILIAS_UNICAS = Array.from(new Set(Object.values(MAPA_TIPO_A_GRUPO))) as GrupoCarta[];

const MAPA_GRUPO_A_TIPOS = Object.entries(MAPA_TIPO_A_GRUPO).reduce((acc, [tipo, grupo]) => {
  if (!acc[grupo]) acc[grupo] = [];
  acc[grupo].push(tipo as TipoCarta);
  return acc;
}, {} as Record<string, TipoCarta[]>);

const LIMITES_POR_FAMILIA: Record<GrupoCarta, { maxAtaque: number; maxDefensa: number; maxVida: number }> = {
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
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState<GrupoCarta>(FAMILIAS_UNICAS[0]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoCarta>(
    (MAPA_GRUPO_A_TIPOS[FAMILIAS_UNICAS[0]]?.[0]) || "" as TipoCarta
  );
  
  const [tipoUlti, setTipoUlti] = useState<TipoHabilidadIA>('Daño');
  const [tipoDefensiva, setTipoDefensiva] = useState<TipoHabilidadIA>('Escudo');
  const [indiceUlti, setIndiceUlti] = useState<number>(0);

  const limitesActuales = LIMITES_POR_FAMILIA[familiaSeleccionada] || LIMITE_DEFECTO;
  const ultisDisponibles = DICCIONARIO_ULTIS_POR_FAMILIA[familiaSeleccionada] || [];

  // === FUNCIÓN PARA REGRESAR AL HOME ===
  const volverAlHome = () => {
    // Integra aquí tu método de navegación (p.ej. setVista('home') o navigate('/'))
    console.log("Cerrando vista de IA y regresando al home principal...");
  };

  const handleFamiliaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaFamilia = e.target.value as GrupoCarta;
    setFamiliaSeleccionada(nuevaFamilia);
    setIndiceUlti(0);

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

    const ultiSeleccionadaPorUsuario = ultisDisponibles[indiceUlti] || ultisDisponibles[0];

    const contextoSistema = `
      Eres un asistente experto diseñando cartas equilibradas para un videojuego RPG. 
      Debes generar estadísticas de combate, integrar la habilidad definitiva asignada manualmente por el formulario y una habilidad defensiva basada en el prompt del usuario respetando ESTRICTAMENTE los límites de balanceo por facción.
      
      PARÁMETROS ASIGNADOS POR EL FORMULARIO:
      - FAMILIA / FACCIÓN: "${familiaSeleccionada}"
      - TIPO ESPECÍFICO: "${tipoSeleccionado}"
      - ENFOQUE DE LA HABILIDAD DEFINITIVA (ULTI): "${tipoUlti}"
      - ENFOQUE DE LA HABILIDAD DEFENSIVA: "${tipoDefensiva}"
      
      REGLAS DE ATRIBUTOS MÁXIMOS PERMITIDOS PARA LA FAMILIA "${familiaSeleccionada}":
      - "ataque" DEBE ser un entero entre 100 y ${limitesActuales.maxAtaque}.
      - "defensa" DEBE ser un entero entre 100 y ${limitesActuales.maxDefensa}.
      - "vida" DEBE ser un entero entre 1000 y ${limitesActuales.maxVida}.
      
      REGLA CRÍTICA PARA "ultiSeleccionada":
      El usuario ya ha elegido manualmente la habilidad definitiva para esta carta en la interfaz. 
      DEBES incrustar EXACTAMENTE este objeto en la propiedad "ultiSeleccionada" del JSON de respuesta sin modificar sus valores:
      ${JSON.stringify(ultiSeleccionadaPorUsuario)}
      
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
        "ultiSeleccionada": ${JSON.stringify(ultiSeleccionadaPorUsuario)},
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
      <div className="w-full max-w-xl bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 relative">
        
        {/* === BOTÓN DE CIERRE (X) EN LA PARTE SUPERIOR DERECHA === */}
        <Link to={"/"}>
            <FaTimes className="text-yellow-400 shadow-2xl hover:scale-130 transition-transform cursor-pointer relative overflow-hidden" />
        </Link>

        <h1 className="text-3xl font-black mb-2 text-yellow-500 text-center uppercase tracking-tighter pr-6">
          Generar Carta con IA
        </h1>
        
        {/* Marcadores de límites dinámicos */}
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

          {/* Selector manual de Ultis */}
          <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-700/40">
            <label className="block text-[10px] font-black uppercase text-purple-400 flex items-center gap-1">
              💥 Asignar Habilidad Suprema (Manual)
            </label>
            <select
              value={indiceUlti}
              onChange={(e) => setIndiceUlti(Number(e.target.value))}
              disabled={loading}
              className="w-full p-2.5 bg-slate-900 border border-purple-500/30 rounded-lg text-white text-xs font-medium outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              {ultisDisponibles.map((ulti, index) => (
                <option key={ulti.id} value={index}>
                  🔥 {ulti.nombre} — [{ulti.mecanica}]
                </option>
              ))}
            </select>
            {/* Texto descriptivo de la Ulti */}
            {ultisDisponibles[indiceUlti] && (
              <p className="text-[11px] text-purple-300/80 italic mt-1 px-1">
                Efecto: {ultisDisponibles[indiceUlti].descripcion}
              </p>
            )}
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

            {/* Muestra la habilidad definitiva devuelta */}
            {cartaGenerada.ultiSeleccionada && (
              <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-1">
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-wider">
                  💥 Suprema Equipada: {cartaGenerada.ultiSeleccionada.nombre}
                </p>
                <p className="text-xs text-purple-200/80 italic">
                  {cartaGenerada.ultiSeleccionada.descripcion}
                </p>
                <span className="inline-block text-[9px] font-mono bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20 mt-1">
                  Mecánica: {cartaGenerada.ultiSeleccionada.mecanica}
                </span>
              </div>
            )}

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