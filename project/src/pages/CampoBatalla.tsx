import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import type { Carta } from '../assets/types/types';

interface CampoBatallaProps {
  cartas: Carta[];
  setCartasSeleccionadas: (cartas: Carta[]) => void;
}

export default function CampoBatalla({ cartas, setCartasSeleccionadas }: CampoBatallaProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartas || cartas.length !== 2) {
      navigate('/');
    }
  }, [cartas, navigate]);

  if (!cartas || cartas.length !== 2) return null;

  const [carta1, carta2] = cartas;

  // --- ESTADOS DE VIDA Y TURNOS ---
  const [vidaJ1, setVidaJ1] = useState(carta1.vida);
  const [vidaJ2, setVidaJ2] = useState(carta2.vida);
  const [turnoActivo, setTurnoActivo] = useState<1 | 2 | null>(null);
  
  // Cooldowns de habilidades
  const [cdOfensivaJ1, setCdOfensivaJ1] = useState(0);
  const [cdDefensivaJ1, setCdDefensivaJ1] = useState(0);
  const [cdOfensivaJ2, setCdOfensivaJ2] = useState(0);
  const [cdDefensivaJ2, setCdDefensivaJ2] = useState(0);

  const [logs, setLogs] = useState<string[]>([]);
  const [ganador, setGanador] = useState<Carta | null>(null);

  const [escudoActivoJ1, setEscudoActivoJ1] = useState(false);
  const [escudoActivoJ2, setEscudoActivoJ2] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // --- SISTEMA DE INICIATIVA ---
  useEffect(() => {
    const dadoJ1 = Math.floor(Math.random() * 20) + 1;
    const dadoJ2 = Math.floor(Math.random() * 20) + 1;

    const inicioLogs = [
      "⚔️ ¡BIENVENIDOS A LA ARENA DE COMBATE MULTI-HABILIDAD! ⚔️",
      `🎲 Iniciativa: ${carta1.name} saca un [${dadoJ1}] en el dado.`,
      `🎲 Iniciativa: ${carta2.name} saca un [${dadoJ2}] en el dado.`,
    ];

    if (dadoJ1 >= dadoJ2) {
      inicioLogs.push(`🔥 ¡${carta1.name} toma la delantera y ataca primero!`);
      setTurnoActivo(1);
    } else {
      inicioLogs.push(`🔥 ¡${carta2.name} toma la delantera y ataca primero!`);
      setTurnoActivo(2);
    }
    setLogs(inicioLogs);
  }, [carta1, carta2]);

  const cambiarTurno = (siguienteTurno: 1 | 2) => {
    if (siguienteTurno === 1) {
      if (cdOfensivaJ1 > 0) setCdOfensivaJ1((prev) => prev - 1);
      if (cdDefensivaJ1 > 0) setCdDefensivaJ1((prev) => prev - 1);
      setEscudoActivoJ1(false);
    } else {
      if (cdOfensivaJ2 > 0) setCdOfensivaJ2((prev) => prev - 1);
      if (cdDefensivaJ2 > 0) setCdDefensivaJ2((prev) => prev - 1);
      setEscudoActivoJ2(false);
    }
    setTurnoActivo(siguienteTurno);
  };

  // --- ATAQUE BÁSICO ---
  const ejecutarAtaque = () => {
    if (ganador || turnoActivo === null) return;

    const atacante = turnoActivo === 1 ? carta1 : carta2;
    const defensor = turnoActivo === 1 ? carta2 : carta1;
    
    const defensaDefensor = turnoActivo === 1 
      ? (escudoActivoJ2 ? defensor.defensa * 2 : defensor.defensa)
      : (escudoActivoJ1 ? defensor.defensa * 2 : defensor.defensa);

    let danoBase = atacante.ataque / (1 + (defensaDefensor / 3000));
    if (danoBase <= 0) danoBase = 300;

    const suerte = Math.random() * (1.1 - 0.9) + 0.9;
    let danoFinal = Math.floor(danoBase * suerte);

    const esCritico = Math.random() < 0.15;
    if (esCritico) danoFinal = Math.floor(danoFinal * 1.5);

    const prefijo = esCritico ? "💥 ¡GOLPE CRÍTICO! " : "⚔️ ";
    let mensaje = `${prefijo}${atacante.name} ataca a ${defensor.name} causando ${danoFinal.toLocaleString()} de daño.`;
    if (turnoActivo === 1 && escudoActivoJ2) mensaje += " (Amortiguado por Escudo)";
    if (turnoActivo === 2 && escudoActivoJ1) mensaje += " (Amortiguado por Escudo)";
    
    setLogs((prev) => [...prev, mensaje]);

    if (turnoActivo === 1) {
      const nuevaVida = Math.max(0, vidaJ2 - danoFinal);
      setVidaJ2(nuevaVida);
      if (nuevaVida <= 0) {
        setGanador(carta1);
        setLogs((prev) => [...prev, `💀 ¡${carta2.name} ha caído!`, `🏆 ¡${carta1.name.toUpperCase()} GANA LA PARTIDA!`]);
      } else {
        cambiarTurno(2);
      }
    } else {
      const nuevaVida = Math.max(0, vidaJ1 - danoFinal);
      setVidaJ1(nuevaVida);
      if (nuevaVida <= 0) {
        setGanador(carta2);
        setLogs((prev) => [...prev, `💀 ¡${carta1.name} ha caído!`, `🏆 ¡${carta2.name.toUpperCase()} GANA LA PARTIDA!`]);
      } else {
        cambiarTurno(1);
      }
    }
  };

  // --- USAR HABILIDAD DIRECTA DESDE LOS SLOTS NUEVOS ---
  const usarHabilidadEspecial = (tipoSlot: 'ofensiva' | 'defensiva') => {
    if (ganador || turnoActivo === null) return;

    const atacante = turnoActivo === 1 ? carta1 : carta2;
    const hab = tipoSlot === 'ofensiva' ? atacante.habilidadOfensiva : atacante.habilidadDefensiva;

    if (!hab) return;

    setLogs((prev) => [...prev, `✨ ¡${atacante.name} usa: "${hab.nombre}"!`]);

    if (hab.efecto === 'ataque_especial') {
      const danoEspecial = Math.floor(atacante.ataque * (hab.valor * 0.4));
      setLogs((prev) => [...prev, `🔥 ¡Daño Crítico Especial! Inflige ${danoEspecial.toLocaleString()} ignorando protecciones.`]);

      if (turnoActivo === 1) {
        const nuevaVida = Math.max(0, vidaJ2 - danoEspecial);
        setVidaJ2(nuevaVida);
        if (nuevaVida <= 0) {
          setGanador(carta1);
          setLogs((prev) => [...prev, `🏆 ¡${carta1.name.toUpperCase()} GANA LA PARTIDA!`]);
          return;
        }
      } else {
        const nuevaVida = Math.max(0, vidaJ1 - danoEspecial);
        setVidaJ1(nuevaVida);
        if (nuevaVida <= 0) {
          setGanador(carta2);
          setLogs((prev) => [...prev, `🏆 ¡${carta2.name.toUpperCase()} GANA LA PARTIDA!`]);
          return;
        }
      }
    } 
    
    else if (hab.efecto === 'escudo') {
      if (turnoActivo === 1) setEscudoActivoJ1(true);
      else setEscudoActivoJ2(true);
      setLogs((prev) => [...prev, `🛡️ ¡Su Defensa se duplica por este turno!`]);
    } 
    
    else if (hab.efecto === 'curacion') {
      const saludRecuperada = Math.floor(atacante.vida * (hab.valor / 100));
      if (turnoActivo === 1) {
        setVidaJ1((v) => Math.min(carta1.vida, v + saludRecuperada));
      } else {
        setVidaJ2((v) => Math.min(carta2.vida, v + saludRecuperada));
      }
      setLogs((prev) => [...prev, `❤️ Recupera ${saludRecuperada.toLocaleString()} de salud.`]);
    }

    // Gestionar Cooldowns individuales
    if (turnoActivo === 1) {
      if (tipoSlot === 'ofensiva') setCdOfensivaJ1(3);
      else setCdDefensivaJ1(3);
      cambiarTurno(2);
    } else {
      if (tipoSlot === 'ofensiva') setCdOfensivaJ2(3);
      else setCdDefensivaJ2(3);
      cambiarTurno(1);
    }
  };

  const salirDeBatalla = () => {
    setCartasSeleccionadas([]); 
    navigate('/'); 
  };

  const pctJ1 = Math.max(0, (vidaJ1 / carta1.vida) * 100);
  const pctJ2 = Math.max(0, (vidaJ2 / carta2.vida) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-between relative select-none font-sans">
      
      <button 
        onClick={salirDeBatalla}
        className="absolute top-5 left-5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-gray-400 hover:text-white px-4 py-2 rounded-xl transition text-xs font-black tracking-wider cursor-pointer"
      >
        ⬅️ Salir de la Arena
      </button>

      {/* Marcador */}
      <div className="text-center mt-12 md:mt-4">
        {!ganador ? (
          <div className="flex items-center justify-center gap-3 bg-black/40 px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <h2 className="text-sm md:text-lg font-black tracking-[0.2em] uppercase italic">
              Turno Activo: <span className={turnoActivo === 1 ? "text-red-500" : "text-blue-500"}>{turnoActivo === 1 ? carta1.name : carta2.name}</span>
            </h2>
          </div>
        ) : (
          <h2 className="text-3xl md:text-4xl font-black text-yellow-500 tracking-widest uppercase animate-bounce drop-shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            🏆 ¡Victoria de {ganador.name}! 🏆
          </h2>
        )}
      </div>

      {/* ENFRENTAMIENTO */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 my-6">
        
        {/* JUGADOR 1 */}
        {carta1 && (
          <div className={`flex flex-col gap-3 w-80 p-4 rounded-2xl bg-neutral-900/60 border-2 transition-all duration-300 ${turnoActivo === 1 && !ganador ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)] scale-105" : "border-neutral-800 opacity-50"}`}>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-black font-mono tracking-wider">
                <span className="text-red-400">❤️ HP: {vidaJ1.toLocaleString()} / {carta1.vida.toLocaleString()}</span>
                <span>{Math.round(pctJ1)}%</span>
              </div>
              <div className="h-3 bg-black/80 rounded-full border border-neutral-800 p-0.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-green-500 rounded-full transition-all duration-300" style={{ width: `${pctJ1}%` }}></div>
              </div>
            </div>

            <div className="bg-black/40 border border-neutral-800/80 rounded-xl p-3 flex flex-col gap-3">
              <img src={carta1.img} alt={carta1.name} className="w-full h-40 object-cover rounded-lg border border-neutral-800 shadow-md" />
              <div>
                <h3 className="text-xl font-black tracking-tight text-white uppercase truncate">{carta1.name}</h3>
                <p className="text-[10px] text-gray-500 italic truncate">{carta1.descripcion || "Sin descripción."}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-1.5">
                  <div className="text-[8px] text-red-500 font-black uppercase tracking-widest">⚔️ ATK</div>
                  <div className="font-bold font-mono">{carta1.ataque.toLocaleString()}</div>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-1.5">
                  <div className="text-[8px] text-blue-500 font-black uppercase tracking-widest">🛡️ DEF</div>
                  <div className="font-bold font-mono">{escudoActivoJ1 ? (carta1.defensa * 2).toLocaleString() : carta1.defensa.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* CONTROL DE COMANDOS J1 */}
            {turnoActivo === 1 && !ganador && (
              <div className="flex flex-col gap-1.5 mt-1 animate-fadeIn">
                <button 
                  onClick={ejecutarAtaque}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic shadow-lg active:scale-95 transition cursor-pointer"
                >
                  ⚔️ Ataque Básico
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  <button 
                    onClick={() => usarHabilidadEspecial('ofensiva')}
                    disabled={cdOfensivaJ1 > 0}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-tight italic transition cursor-pointer truncate px-1 ${
                      cdOfensivaJ1 > 0 ? "bg-neutral-800 text-neutral-600 border border-neutral-700" : "bg-orange-600 hover:bg-orange-500 text-white"
                    }`}
                  >
                    {cdOfensivaJ1 > 0 ? `⏳ CD: ${cdOfensivaJ1}` : `🔥 ${carta1.habilidadOfensiva?.nombre}`}
                  </button>
                  <button 
                    onClick={() => usarHabilidadEspecial('defensiva')}
                    disabled={cdDefensivaJ1 > 0}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-tight italic transition cursor-pointer truncate px-1 ${
                      cdDefensivaJ1 > 0 ? "bg-neutral-800 text-neutral-600 border border-neutral-700" : "bg-purple-600 hover:bg-purple-500 text-white"
                    }`}
                  >
                    {cdDefensivaJ1 > 0 ? `⏳ CD: ${cdDefensivaJ1}` : `✨ ${carta1.habilidadDefensiva?.nombre}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VERSUS */}
        <div className="text-center">
          <span className="text-5xl font-black italic tracking-tighter bg-gradient-to-b from-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">VS</span>
        </div>

        {/* JUGADOR 2 */}
        {carta2 && (
          <div className={`flex flex-col gap-3 w-80 p-4 rounded-2xl bg-neutral-900/60 border-2 transition-all duration-300 ${turnoActivo === 2 && !ganador ? "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-105" : "border-neutral-800 opacity-50"}`}>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-black font-mono tracking-wider">
                <span className="text-blue-400">❤️ HP: {vidaJ2.toLocaleString()} / {carta2.vida.toLocaleString()}</span>
                <span>{Math.round(pctJ2)}%</span>
              </div>
              <div className="h-3 bg-black/80 rounded-full border border-neutral-800 p-0.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all duration-300" style={{ width: `${pctJ2}%` }}></div>
              </div>
            </div>

            <div className="bg-black/40 border border-neutral-800/80 rounded-xl p-3 flex flex-col gap-3">
              <img src={carta2.img} alt={carta2.name} className="w-full h-40 object-cover rounded-lg border border-neutral-800 shadow-md" />
              <div>
                <h3 className="text-xl font-black tracking-tight text-white uppercase truncate">{carta2.name}</h3>
                <p className="text-[10px] text-gray-500 italic truncate">{carta2.descripcion || "Sin descripción."}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-1.5">
                  <div className="text-[8px] text-red-500 font-black uppercase tracking-widest">⚔️ ATK</div>
                  <div className="font-bold font-mono">{carta2.ataque.toLocaleString()}</div>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-1.5">
                  <div className="text-[8px] text-blue-500 font-black uppercase tracking-widest">🛡️ DEF</div>
                  <div className="font-bold font-mono">{escudoActivoJ2 ? (carta2.defensa * 2).toLocaleString() : carta2.defensa.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* CONTROL DE COMANDOS J2 */}
            {turnoActivo === 2 && !ganador && (
              <div className="flex flex-col gap-1.5 mt-1 animate-fadeIn">
                <button 
                  onClick={ejecutarAtaque}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic shadow-lg active:scale-95 transition cursor-pointer"
                >
                  ⚔️ Ataque Básico
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  <button 
                    onClick={() => usarHabilidadEspecial('ofensiva')}
                    disabled={cdOfensivaJ2 > 0}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-tight italic transition cursor-pointer truncate px-1 ${
                      cdOfensivaJ2 > 0 ? "bg-neutral-800 text-neutral-600 border border-neutral-700" : "bg-orange-600 hover:bg-orange-500 text-white"
                    }`}
                  >
                    {cdOfensivaJ2 > 0 ? `⏳ CD: ${cdOfensivaJ2}` : `🔥 ${carta2.habilidadOfensiva?.nombre}`}
                  </button>
                  <button 
                    onClick={() => usarHabilidadEspecial('defensiva')}
                    disabled={cdDefensivaJ2 > 0}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-tight italic transition cursor-pointer truncate px-1 ${
                      cdDefensivaJ2 > 0 ? "bg-neutral-800 text-neutral-600 border border-neutral-700" : "bg-purple-600 hover:bg-purple-500 text-white"
                    }`}
                  >
                    {cdDefensivaJ2 > 0 ? `⏳ CD: ${cdDefensivaJ2}` : `✨ ${carta2.habilidadDefensiva?.nombre}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* LOGS */}
      <div className="w-full max-w-2xl flex flex-col gap-1.5 mt-auto">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-neutral-600 uppercase italic">📰 Registro de Combate</h4>
        <div className="h-32 bg-black/90 border border-neutral-900 rounded-xl p-3 overflow-y-auto font-mono text-[11px] flex flex-col gap-1 shadow-inner text-neutral-400">
          {logs.map((log, index) => {
            let claseColor = "text-neutral-400";
            if (log.includes("🏆")) claseColor = "text-yellow-400 font-bold bg-yellow-500/5 border border-yellow-500/20 p-2 text-center uppercase tracking-widest my-1 rounded-lg";
            else if (log.includes("💥")) claseColor = "text-orange-400 font-bold";
            else if (log.includes("🔥")) claseColor = "text-amber-400 font-medium italic";
            else if (log.includes("✨") || log.includes("🛡️") || log.includes("❤️")) claseColor = "text-purple-400 italic font-medium";
            else if (log.includes(carta1.name) && log.includes("ataca")) claseColor = "text-red-300";
            else if (log.includes(carta2.name) && log.includes("ataca")) claseColor = "text-blue-300";

            return <div key={index} className={`${claseColor} leading-relaxed animate-fadeIn`}>{log}</div>;
          })}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* BOTÓN VICTORIA */}
      {ganador && (
        <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 animate-fadeIn z-30">
          <button
            onClick={salirDeBatalla}
            className="px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black text-xs uppercase tracking-widest italic rounded-full shadow-2xl transition transform hover:scale-105 active:scale-95 border-2 border-white/20 cursor-pointer"
          >
            🏆 Volver y Limpiar Selección
          </button>
        </div>
      )}

    </div>
  );
}