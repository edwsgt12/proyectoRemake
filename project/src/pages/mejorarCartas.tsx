import { useState } from "react";
import { useNavigate } from "react-router";
import { RiArrowUpCircleLine, RiFlashlightLine, RiShieldLine, RiHeartFill, RiCoinsLine, RiArrowLeftLine } from "react-icons/ri";
import type { Carta } from "../assets/types/types";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router";

interface SubirNivelProps {
  cartas: Carta[];
  setCartas?: React.Dispatch<React.SetStateAction<Carta[]>>;
  onSubirNivel?: (carta: Carta) => Promise<{ success: boolean }>;
}

const NIVEL_MAXIMO = 10;

export default function SubirNivelCarta({ cartas, setCartas, onSubirNivel }: SubirNivelProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [idCartaSeleccionada, setIdCartaSeleccionada] = useState<number | string>(cartas[0]?.id || '');

  if (!cartas || cartas.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto my-10 p-6 bg-[#111111] border border-white/10 rounded-2xl text-center text-gray-400 font-mono flex flex-col items-center gap-4">
        <p>No tienes cartas disponibles para mejorar.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer hover:bg-amber-400 transition"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Carta seleccionada actual
  const carta = cartas.find(c => String(c.id) === String(idCartaSeleccionada)) || cartas[0];

  const nivelActual = carta.nivel || 1;
  const esNivelMax = nivelActual >= NIVEL_MAXIMO;
  const siguienteNivel = nivelActual + 1;

  // Cálculos (+10% por nivel)
  const factorIncremento = 0.10;
  const costeAumento = Math.round(400 * Math.pow(1.5, nivelActual - 1));
  const cristalesUsuario = carta.cristales || 0;

  const ataquesNuevo = Math.round(carta.ataque * (1 + factorIncremento));
  const defensaNueva = Math.round(carta.defensa * (1 + factorIncremento));
  const vidaNueva = Math.round(carta.vida * (1 + factorIncremento));

  const tieneFondos = cristalesUsuario >= costeAumento;

  const handleSubirNivel = async () => {
    if (esNivelMax || !tieneFondos || loading) return;
    
    setLoading(true);
    try {
      const cartaActualizada: Carta = {
        ...carta,
        nivel: siguienteNivel,
        ataque: ataquesNuevo,
        defensa: defensaNueva,
        vida: vidaNueva,
        cristales: cristalesUsuario - costeAumento
      };

      if (setCartas) {
        setCartas(prev => prev.map(c => String(c.id) === String(cartaActualizada.id) ? cartaActualizada : c));
      }

      if (onSubirNivel) {
        await onSubirNivel(cartaActualizada);
      }
    } catch (error) {
      console.error("Error al subir de nivel", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 bg-[#111111] border border-white/10 rounded-2xl p-6 text-gray-200 font-mono shadow-2xl relative">
      
      {/* Header con botón volver */}
      <div className="flex items-center justify-between mb-6">
        <Link to={"/"}>
            <FaTimes className="text-yellow-400 shadow-2xl hover:scale-130 transition-transform cursor-pointer relative overflow-hidden" />
        </Link>
      </div>

      {/* CARTA EN GRANDE */}
      <div className="flex flex-col items-center mb-6 bg-[#161616] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="relative group">
          <img 
            src={carta.img} 
            alt={carta.name} 
            className="w-40 h-56 object-cover rounded-xl shadow-2xl border-2 border-amber-500/30 mb-3"
          />
          <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-amber-400 font-black text-[10px] px-2 py-0.5 rounded-full border border-amber-500/40">
            LVL {nivelActual}
          </span>
        </div>

        <h2 className="text-lg font-black text-white uppercase tracking-wider">{carta.name}</h2>
        <p className="text-xs text-amber-400 font-bold mt-1">💎 {cristalesUsuario} Cristales</p>
      </div>

      {/* Rango / Progresión */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl mb-4">
        <div>
          <p className="text-[10px] text-white/40 uppercase">Rango Actual</p>
          <p className="text-xl font-black italic text-white">LVL {nivelActual}</p>
        </div>
        {!esNivelMax && (
          <>
            <div className="h-[2px] w-12 bg-amber-500/30 animate-pulse" />
            <div className="text-right">
              <p className="text-[10px] text-amber-500 uppercase">Siguiente Rango</p>
              <p className="text-xl font-black italic text-amber-400">LVL {siguienteNivel}</p>
            </div>
          </>
        )}
      </div>

      {/* Comparativa de Stats */}
      {!esNivelMax ? (
        <div className="space-y-3 bg-[#161616] p-4 rounded-xl border border-white/5 mb-6">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-red-400 font-bold"><RiFlashlightLine/> ATK:</span>
            <p className="text-white font-bold">
              {carta.ataque} <span className="text-green-400">➔ {ataquesNuevo}</span>
            </p>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-blue-400 font-bold"><RiShieldLine/> DEF:</span>
            <p className="text-white font-bold">
              {carta.defensa} <span className="text-green-400">➔ {defensaNueva}</span>
            </p>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-green-400 font-bold"><RiHeartFill/> HP:</span>
            <p className="text-white font-bold">
              {carta.vida} <span className="text-green-400">➔ {vidaNueva}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-bold uppercase mb-6">
          ✨ ¡NIVEL MÁXIMO ALCANZADO! ✨
        </div>
      )}

      {/* Botón Mejorar */}
      {!esNivelMax && (
        <button
          onClick={handleSubirNivel}
          disabled={!tieneFondos || loading}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all mb-2 ${
            tieneFondos 
              ? 'bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] shadow-lg shadow-amber-500/10 cursor-pointer' 
              : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
          }`}
        >
          {loading ? (
            "Procesando..."
          ) : (
            <>
              <RiCoinsLine className="text-base" /> Mejorar por {costeAumento} Cristales
            </>
          )}
        </button>
      )}

      {!tieneFondos && !esNivelMax && (
        <p className="text-[9px] text-red-500 text-center mb-6 uppercase italic tracking-tighter">
          ❌ Cristales insuficientes (Tienes: {cristalesUsuario} / Requieres: {costeAumento})
        </p>
      )}

      {/* CARTA CHIQUITAS ABAJO (CARRUSEL) */}
      <div className="pt-4 border-t border-white/10">
        <label className="text-[10px] text-white/40 uppercase block mb-3 font-bold tracking-wider">
          Tus Cartas (Haz clic para seleccionar):
        </label>
        
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-amber-500/20">
          {cartas.map((c) => {
            const esSeleccionada = String(c.id) === String(carta.id);
            return (
              <button
                key={c.id}
                onClick={() => setIdCartaSeleccionada(c.id)}
                className={`flex-shrink-0 p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center ${
                  esSeleccionada
                    ? 'border-amber-500 bg-amber-500/10 scale-105 shadow-md shadow-amber-500/20'
                    : 'border-white/10 bg-[#161616] opacity-50 hover:opacity-100 hover:border-white/30'
                }`}
              >
                <img 
                  src={c.img} 
                  alt={c.name} 
                  className="w-14 h-20 object-cover rounded-lg mb-1.5" 
                />
                <p className="text-[10px] font-bold text-white truncate max-w-[60px] text-center">{c.name}</p>
                <span className="text-[8px] font-black text-amber-400 bg-black/60 px-1.5 py-0.5 rounded mt-1">
                  LVL {c.nivel || 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}