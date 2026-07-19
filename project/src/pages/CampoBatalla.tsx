import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import type { Carta } from '../assets/types/types';
import { RiSwordLine, RiShieldFlashLine, RiHeartPulseLine, RiCompassDiscoverLine, RiFlashlightLine } from "react-icons/ri";
import { aplicarEfectoUlti } from '../components/batallaEfectos';

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
  const [cdSupremaJ1, setCdSupremaJ1] = useState(0); 
  const [cdOfensivaJ2, setCdOfensivaJ2] = useState(0);
  const [cdDefensivaJ2, setCdDefensivaJ2] = useState(0);
  const [cdSupremaJ2, setCdSupremaJ2] = useState(0); 

  const [logs, setLogs] = useState<string[]>([]);
  const [ganador, setGanador] = useState<Carta | null>(null);

  // Estados de Mitigación / Efectos
  const [escudoActivoJ1, setEscudoActivoJ1] = useState(false);
  const [escudoActivoJ2, setEscudoActivoJ2] = useState(false);
  const [evasionActivaJ1, setEvasionActivaJ1] = useState(false);
  const [evasionActivaJ2, setEvasionActivaJ2] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // --- SISTEMA DE INICIATIVA ---
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const dadoJ1 = Math.floor(Math.random() * 20) + 1;
    const dadoJ2 = Math.floor(Math.random() * 20) + 1;

    const inicioLogs = [
      "🔥 ¡BIENVENIDOS A LA ARENA DE COMBATE INCENDIARIA! 🔥",
      `🎲 Iniciativa: ${carta1.name} saca un [${dadoJ1}] en el dado.`,
      `🎲 Iniciativa: ${carta2.name} saca un [${dadoJ2}] en el dado.`,
    ];

    if (dadoJ1 >= dadoJ2) {
      inicioLogs.push(`💥 ¡${carta1.name} toma la delantera y ataca primero!`);
      setTurnoActivo(1);
    } else {
      inicioLogs.push(`💥 ¡${carta2.name} toma la delantera y ataca primero!`);
      setTurnoActivo(2);
    }
    setLogs(inicioLogs);
  }, [carta1, carta2]);

  const cambiarTurno = (siguienteTurno: 1 | 2) => {
    if (siguienteTurno === 1) {
      if (cdOfensivaJ1 > 0) setCdOfensivaJ1((prev) => prev - 1);
      if (cdDefensivaJ1 > 0) setCdDefensivaJ1((prev) => prev - 1);
      if (cdSupremaJ1 > 0) setCdSupremaJ1((prev) => prev - 1); 
      setEscudoActivoJ1(false);
      setEvasionActivaJ1(false);
    } else {
      if (cdOfensivaJ2 > 0) setCdOfensivaJ2((prev) => prev - 1);
      if (cdDefensivaJ2 > 0) setCdDefensivaJ2((prev) => prev - 1);
      if (cdSupremaJ2 > 0) setCdSupremaJ2((prev) => prev - 1); 
      setEscudoActivoJ2(false);
      setEvasionActivaJ2(false);
    }
    setTurnoActivo(siguienteTurno);
  };

  // --- ATAQUE BÁSICO ---
  const ejecutarAtaque = () => {
    if (ganador || turnoActivo === null) return;

    const atacante = turnoActivo === 1 ? carta1 : carta2;
    const defensor = turnoActivo === 1 ? carta2 : carta1;
    const esEvasionActiva = turnoActivo === 1 ? evasionActivaJ2 : evasionActivaJ1;

    if (esEvasionActiva && Math.random() < 0.5) {
      setLogs((prev) => [...prev, `💨 ¡${defensor.name} esquivó completamente el ataque de ${atacante.name}!`]);
      cambiarTurno(turnoActivo === 1 ? 2 : 1);
      return;
    }
    
    const escudoDefensor = turnoActivo === 1 ? escudoActivoJ2 : escudoActivoJ1;
    const defensaDefensor = escudoDefensor ? defensor.defensa * 2 : defensor.defensa;

    const multiplicadorTipo = atacante.tipo?.toLowerCase() === 'hechicero' ? 1.15 : 1.0;
    let danoBase = (atacante.ataque * multiplicadorTipo) / (1 + (defensaDefensor / 3000));
    if (danoBase <= 0) danoBase = 300;

    const suerte = Math.random() * (1.1 - 0.9) + 0.9;
    let danoFinal = Math.floor(danoBase * suerte);

    const esCritico = Math.random() < 0.15;
    if (esCritico) danoFinal = Math.floor(danoFinal * 1.5);

    const prefijo = esCritico ? "⚡ ¡IMPACTO CRÍTICO! " : "⚔️ ";
    let mensaje = `${prefijo}${atacante.name} golpea a ${defensor.name} causando ${danoFinal.toLocaleString()} de daño.`;
    if (escudoDefensor) mensaje += " (Amortiguado por Escudo Metálico)";
    
    setLogs((prev) => [...prev, mensaje]);

    if (turnoActivo === 1) {
      const nuevaVida = Math.max(0, vidaJ2 - danoFinal);
      setVidaJ2(nuevaVida);
      if (nuevaVida <= 0) {
        setGanador(carta1);
        setLogs((prev) => [...prev, `💀 ¡${carta2.name} ha sido incinerado!`, `🏆 ¡${carta1.name.toUpperCase()} REINA EN LA ARENA!`]);
      } else {
        cambiarTurno(2);
      }
    } else {
      const nuevaVida = Math.max(0, vidaJ1 - danoFinal);
      setVidaJ1(nuevaVida);
      if (nuevaVida <= 0) {
        setGanador(carta2);
        setLogs((prev) => [...prev, `💀 ¡${carta1.name} ha sido incinerado!`, `🏆 ¡${carta2.name.toUpperCase()} REINA EN LA ARENA!`]);
      } else {
        cambiarTurno(1);
      }
    }
  };

  // --- LÓGICA DE PROCESAMIENTO DE ACCIONES ---
  const usarHabilidadEspecial = (tipoSlot: 'ofensiva' | 'defensiva' | 'suprema') => {
    if (ganador || turnoActivo === null) return;

    const atacante = turnoActivo === 1 ? carta1 : carta2;
    
    if (tipoSlot === 'suprema') {
      const nombreSuprema = atacante.ultiSeleccionada?.nombre || 'Habilidad Suprema de Familia';
      const tipoUlti = (atacante.ultiSeleccionada as any)?.tipo || 'daño';      
      const juegoTerminado = aplicarEfectoUlti({
          tipoUlti,
          nombreUlti: nombreSuprema,
          atacante,
          defensor: turnoActivo === 1 ? carta2 : carta1,
          vidaAtacante: turnoActivo === 1 ? vidaJ1 : vidaJ2,
          vidaDefensor: turnoActivo === 1 ? vidaJ2 : vidaJ1,
          setVidaAtacante: turnoActivo === 1 ? setVidaJ1 : setVidaJ2,
          setVidaDefensor: turnoActivo === 1 ? setVidaJ2 : setVidaJ1,
          setLogs,
          setGanador
      });

      if (juegoTerminado) return;

    } else if (tipoSlot === 'ofensiva') {
      const tipoUlti = atacante.tipoUlti || 'daño';
      const nombreUlti = atacante.habilidadOfensiva?.nombre || 'Ataque Supremo';
      
      const juegoTerminado = aplicarEfectoUlti({
          tipoUlti,
          nombreUlti,
          atacante,
          defensor: turnoActivo === 1 ? carta2 : carta1,
          vidaAtacante: turnoActivo === 1 ? vidaJ1 : vidaJ2,
          vidaDefensor: turnoActivo === 1 ? vidaJ2 : vidaJ1,
          setVidaAtacante: turnoActivo === 1 ? setVidaJ1 : setVidaJ2,
          setVidaDefensor: turnoActivo === 1 ? setVidaJ2 : setVidaJ1,
          setLogs,
          setGanador
      });

      if (juegoTerminado) return;

    } else {
      const metaDef = atacante.tipoDefensiva?.toLowerCase() || 'escudo';
      const nombreDefensiva = atacante.habilidadDefensiva?.nombre || 'Defensa Absoluta';

      if (metaDef === 'esquivar') {
        if (turnoActivo === 1) setEvasionActivaJ1(true);
        else setEvasionActivaJ2(true);
        setLogs((prev) => [...prev, `💨 ¡${atacante.name} activa [${nombreDefensiva}]! 50% de probabilidad de esquivar el próximo golpe.`]);
      } else {
        if (turnoActivo === 1) setEscudoActivoJ1(true);
        else setEscudoActivoJ2(true);
        setLogs((prev) => [...prev, `🛡️ ¡${atacante.name} levanta [${nombreDefensiva}]! Su defensa se duplica temporalmente.`]);
      }
    }

    // Cooldowns e intercambio de turnos
    if (turnoActivo === 1) {
      if (tipoSlot === 'suprema') setCdSupremaJ1(4);
      else if (tipoSlot === 'ofensiva') setCdOfensivaJ1(3);
      else setCdDefensivaJ1(2);
      cambiarTurno(2);
    } else {
      if (tipoSlot === 'suprema') setCdSupremaJ2(4);
      else if (tipoSlot === 'ofensiva') setCdOfensivaJ2(3);
      else setCdDefensivaJ2(2);
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
    <div className="min-h-screen bg-neutral-950 text-orange-100 p-6 flex flex-col items-center justify-between relative select-none font-sans overflow-x-hidden">
      
      {/* Botón Salir */}
      <button 
        onClick={salirDeBatalla}
        className="absolute top-5 left-5 bg-orange-950/40 border border-orange-900/40 hover:bg-orange-900/60 text-orange-400 hover:text-orange-200 px-4 py-2 rounded-xl transition text-xs font-black tracking-wider cursor-pointer backdrop-blur-md z-20"
      >
        ⬅️ Salir de la Arena
      </button>

      {/* Marcador Central */}
      <div className="text-center mt-12 md:mt-4">
        {!ganador ? (
          <div className="flex items-center justify-center gap-3 bg-orange-950/20 px-6 py-2 rounded-full border border-orange-500/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <h2 className="text-sm md:text-lg font-black tracking-[0.2em] uppercase italic text-orange-300">
              Turno Activo: <span className={turnoActivo === 1 ? "text-orange-400 font-extrabold" : "text-amber-400 font-extrabold"}>{turnoActivo === 1 ? carta1.name : carta2.name}</span>
            </h2>
          </div>
        ) : (
          <h2 className="text-3xl md:text-4xl font-black text-orange-500 tracking-widest uppercase animate-bounce drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]">
            🏆 ¡Victoria de {ganador.name}! 🏆
          </h2>
        )}
      </div>

      {/* PANEL DE ENFRENTAMIENTO */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-10 my-6">
        
        {/* CONTENDIENTE J1 */}
        {carta1 && (
          <div className={`flex flex-col gap-3 w-80 p-5 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 transition-all duration-300 ${turnoActivo === 1 && !ganador ? "border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.25)] scale-105 z-10" : "border-neutral-900 opacity-40"}`}>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-black font-mono tracking-wider">
                <span className="text-orange-400">❤️ HP: {vidaJ1.toLocaleString()} / {carta1.vida.toLocaleString()}</span>
                <span>{Math.round(pctJ1)}%</span>
              </div>
              <div className="h-3 bg-black/80 rounded-full border border-orange-950 p-0.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 rounded-full transition-all duration-300" style={{ width: `${pctJ1}%` }}></div>
              </div>
            </div>

            <div className="bg-black/50 border border-neutral-900 rounded-xl p-3 flex flex-col gap-3 relative flex-1">
              {escudoActivoJ1 && <span className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">🛡️ Escudo</span>}
              {evasionActivaJ1 && <span className="absolute top-2 right-2 bg-purple-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">💨 Ágil</span>}

              <img src={carta1.img} alt={carta1.name} className="w-full h-40 object-cover rounded-lg border border-neutral-800 shadow-md grayscale-[20%]" />
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black tracking-tight text-white uppercase truncate max-w-[70%]">{carta1.name}</h3>
                  <span className="text-[9px] bg-orange-950 text-orange-400 border border-orange-800/50 px-2 py-0.5 rounded font-bold uppercase italic font-mono">{carta1.tipo || 'Guerrero'}</span>
                </div>
                <p className="text-[10px] text-neutral-500 italic truncate mt-1">{carta1.descripcion || "Sin descripción de combate."}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs mt-auto">
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-1.5">
                  <div className="text-[8px] text-orange-400 font-black uppercase tracking-widest">⚔️ ATK</div>
                  <div className="font-bold font-mono text-white">{carta1.ataque.toLocaleString()}</div>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-1.5">
                  <div className="text-[8px] text-amber-400 font-black uppercase tracking-widest">🛡️ DEF</div>
                  <div className="font-bold font-mono text-white">
                    {escudoActivoJ1 ? (carta1.defensa * 2).toLocaleString() : carta1.defensa.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROLES ACCIONES J1 */}
            {turnoActivo === 1 && !ganador && (
              <div className="flex flex-col gap-2 mt-1 animate-fadeIn">
                <button 
                  onClick={ejecutarAtaque}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic shadow-lg shadow-orange-950/50 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <RiSwordLine /> Ataque Básico
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => usarHabilidadEspecial('ofensiva')}
                    disabled={cdOfensivaJ1 > 0}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-tight italic transition cursor-pointer truncate px-2 flex items-center justify-center gap-1 ${
                      cdOfensivaJ1 > 0 ? "bg-neutral-900 text-neutral-600 border border-neutral-800" : "bg-neutral-800 hover:bg-neutral-700 text-orange-400 border border-orange-500/30"
                    }`}
                  >
                    {cdOfensivaJ1 > 0 ? `⏳ ${cdOfensivaJ1}` : (
                      <>
                        {carta1.tipoUlti?.toString().toLowerCase() === 'curacion' || carta1.tipoUlti?.toString().toLowerCase() === 'curación' ? <RiHeartPulseLine /> : <RiShieldFlashLine />}
                        <span>{carta1.habilidadOfensiva?.nombre || 'Clase CD'}</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => usarHabilidadEspecial('defensiva')}
                    disabled={cdDefensivaJ1 > 0}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-tight italic transition cursor-pointer truncate px-2 flex items-center justify-center gap-1 ${
                      cdDefensivaJ1 > 0 ? "bg-neutral-900 text-neutral-600 border border-neutral-800" : "bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {cdDefensivaJ1 > 0 ? `⏳ ${cdDefensivaJ1}` : (
                      <>
                        <RiCompassDiscoverLine />
                        <span>{carta1.habilidadDefensiva?.nombre || 'Defensa'}</span>
                      </>
                    )}
                  </button>
                </div>
                {/* NUEVA ULTI DE FAMILIA */}
                <button 
                  onClick={() => usarHabilidadEspecial('suprema')}
                  disabled={cdSupremaJ1 > 0}
                  className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-tight italic transition cursor-pointer truncate px-2 flex items-center justify-center gap-1.5 ${
                    cdSupremaJ1 > 0 
                      ? "bg-neutral-900 text-neutral-600 border border-neutral-800" 
                      : "bg-gradient-to-r from-purple-900/80 to-indigo-950/80 hover:from-purple-800 hover:to-indigo-900 text-purple-300 border border-purple-500/40 shadow-md shadow-purple-950/40"
                  }`}
                >
                  {cdSupremaJ1 > 0 ? `🔮 CD SUPREMA: ${cdSupremaJ1}` : (
                    <>
                      <RiFlashlightLine className="animate-pulse text-purple-400" />
                      <span>✨ {carta1.ultiSeleccionada?.nombre || 'Suprema Mítica'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* CONTENEDOR VS */}
        <div className="flex items-center justify-center py-2 md:py-0">
          <span className="text-5xl md:text-6xl font-black italic tracking-tighter bg-gradient-to-b from-orange-400 via-amber-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(249,115,22,0.3)] select-none">VS</span>
        </div>

        {/* CONTENDIENTE J2 */}
        {carta2 && (
          <div className={`flex flex-col gap-3 w-80 p-5 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 transition-all duration-300 ${turnoActivo === 2 && !ganador ? "border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.25)] scale-105 z-10" : "border-neutral-900 opacity-40"}`}>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-black font-mono tracking-wider">
                <span className="text-orange-400">❤️ HP: {vidaJ2.toLocaleString()} / {carta2.vida.toLocaleString()}</span>
                <span>{Math.round(pctJ2)}%</span>
              </div>
              <div className="h-3 bg-black/80 rounded-full border border-orange-950 p-0.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 rounded-full transition-all duration-300" style={{ width: `${pctJ2}%` }}></div>
              </div>
            </div>

            <div className="bg-black/50 border border-neutral-900 rounded-xl p-3 flex flex-col gap-3 relative flex-1">
              {escudoActivoJ2 && <span className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">🛡️ Escudo</span>}
              {evasionActivaJ2 && <span className="absolute top-2 right-2 bg-purple-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">💨 Ágil</span>}

              <img src={carta2.img} alt={carta2.name} className="w-full h-40 object-cover rounded-lg border border-neutral-800 shadow-md grayscale-[20%]" />
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black tracking-tight text-white uppercase truncate max-w-[70%]">{carta2.name}</h3>
                  <span className="text-[9px] bg-orange-950 text-orange-400 border border-orange-800/50 px-2 py-0.5 rounded font-bold uppercase italic font-mono">{carta2.tipo || 'Guerrero'}</span>
                </div>
                <p className="text-[10px] text-neutral-500 italic truncate mt-1">{carta2.descripcion || "Sin descripción de combate."}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs mt-auto">
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-1.5">
                  <div className="text-[8px] text-orange-400 font-black uppercase tracking-widest">⚔️ ATK</div>
                  <div className="font-bold font-mono text-white">{carta2.ataque.toLocaleString()}</div>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-1.5">
                  <div className="text-[8px] text-amber-400 font-black uppercase tracking-widest">🛡️ DEF</div>
                  <div className="font-bold font-mono text-white">
                    {escudoActivoJ2 ? (carta2.defensa * 2).toLocaleString() : carta2.defensa.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROLES ACCIONES J2 */}
            {turnoActivo === 2 && !ganador && (
              <div className="flex flex-col gap-2 mt-1 animate-fadeIn">
                <button 
                  onClick={ejecutarAtaque}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic shadow-lg shadow-orange-950/50 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <RiSwordLine /> Ataque Básico
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => usarHabilidadEspecial('ofensiva')}
                    disabled={cdOfensivaJ2 > 0}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-tight italic transition cursor-pointer truncate px-2 flex items-center justify-center gap-1 ${
                      cdOfensivaJ2 > 0 ? "bg-neutral-900 text-neutral-600 border border-neutral-800" : "bg-neutral-800 hover:bg-neutral-700 text-orange-400 border border-orange-500/30"
                    }`}
                  >
                    {cdOfensivaJ2 > 0 ? `⏳ ${cdOfensivaJ2}` : (
                      <>
                        {carta2.tipoUlti?.toString().toLowerCase() === 'curacion' || carta2.tipoUlti?.toString().toLowerCase() === 'curación' ? <RiHeartPulseLine /> : <RiShieldFlashLine />}
                        <span>{carta2.habilidadOfensiva?.nombre || 'Clase CD'}</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => usarHabilidadEspecial('defensiva')}
                    disabled={cdDefensivaJ2 > 0}
                    className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-tight italic transition cursor-pointer truncate px-2 flex items-center justify-center gap-1 ${
                      cdDefensivaJ2 > 0 ? "bg-neutral-900 text-neutral-600 border border-neutral-800" : "bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {cdDefensivaJ2 > 0 ? `⏳ ${cdDefensivaJ2}` : (
                      <>
                        <RiCompassDiscoverLine />
                        <span>{carta2.habilidadDefensiva?.nombre || 'Defensa'}</span>
                      </>
                    )}
                  </button>
                </div>
                {/* NUEVA ULTI DE FAMILIA */}
                <button 
                  onClick={() => usarHabilidadEspecial('suprema')}
                  disabled={cdSupremaJ2 > 0}
                  className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-tight italic transition cursor-pointer truncate px-2 flex items-center justify-center gap-1.5 ${
                    cdSupremaJ2 > 0 
                      ? "bg-neutral-900 text-neutral-600 border border-neutral-800" 
                      : "bg-gradient-to-r from-purple-900/80 to-indigo-950/80 hover:from-purple-800 hover:to-indigo-900 text-purple-300 border border-purple-500/40 shadow-md shadow-purple-950/40"
                  }`}
                >
                  {cdSupremaJ2 > 0 ? `🔮 CD SUPREMA: ${cdSupremaJ2}` : (
                    <>
                      <RiFlashlightLine className="animate-pulse text-purple-400" />
                      <span>✨ {carta2.ultiSeleccionada?.nombre || 'Suprema Mítica'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* BITÁCORA DE LOGS */}
      <div className="w-full max-w-2xl flex flex-col gap-1.5 mt-auto">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-orange-700/80 uppercase italic">📰 Registro de Combate Termo-Visual</h4>
        <div className="h-32 bg-black/90 border border-orange-950/40 rounded-xl p-3 overflow-y-auto font-mono text-[11px] flex flex-col gap-1 shadow-inner shadow-orange-950/20 text-neutral-400 scrollbar-thin">
          {logs.map((log, index) => {
            let claseColor = "text-neutral-400";
            if (log.includes("🏆")) claseColor = "text-orange-400 font-bold bg-orange-500/5 border border-orange-500/20 p-2 text-center uppercase tracking-widest my-1 rounded-lg";
            else if (log.includes("💥") || log.includes("⚡")) claseColor = "text-red-400 font-bold";
            else if (log.includes("🔥")) claseColor = "text-orange-300 font-medium italic";
            else if (log.includes("✨") || log.includes("🛡️") || log.includes("❤️") || log.includes("💨")) claseColor = "text-amber-400 italic font-medium";
            else if (log.includes(carta1.name) && log.includes("golpea")) claseColor = "text-orange-200/90";
            else if (log.includes(carta2.name) && log.includes("golpea")) claseColor = "text-amber-200/90";

            return <div key={index} className={`${claseColor} leading-relaxed animate-fadeIn`}>{log}</div>;
          })}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* CONFIRMACIÓN DE VICTORIA */}
      {ganador && (
        <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 animate-fadeIn z-30">
          <button
            onClick={salirDeBatalla}
            className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-widest italic rounded-full shadow-2xl transition transform hover:scale-105 active:scale-95 border border-orange-400/30 cursor-pointer"
          >
            🏆 Volver y Reajustar Equipos
          </button>
        </div>
      )}

    </div>
  );
}