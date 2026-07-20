import { useState } from "react";
import { RiFlashlightLine, RiShieldLine, RiHeartFill, RiCoinsLine } from "react-icons/ri";
import type { Carta } from "../assets/types/types";
import { Link } from "react-router";
import { FaTimes } from "react-icons/fa";

interface SubirNivelProps {
  cartas: Carta[];
  setCartas?: React.Dispatch<React.SetStateAction<Carta[]>>;
  onSubirNivel?: (carta: Carta) => Promise<{ success: boolean }>;
}

const NIVEL_MAXIMO = 10;

export default function SubirNivelCarta({ cartas, setCartas, onSubirNivel }: SubirNivelProps) {
  const [loading, setLoading] = useState(false);
  const [idCartaSeleccionada, setIdCartaSeleccionada] = useState<number | string>(cartas[0]?.id || '');

  if (!cartas || cartas.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto my-10 p-6 bg-[#111111] border border-white/10 rounded-2xl text-center text-gray-400 font-mono">
        No tienes cartas disponibles para mejorar.
      </div>
    );
  }

  // Carta individual seleccionada
  const carta = cartas.find(c => String(c.id) === String(idCartaSeleccionada)) || cartas[0];

  const nivelActual = carta.nivel || 1;
  const esNivelMax = nivelActual >= NIVEL_MAXIMO;
  const siguienteNivel = nivelActual + 1;

  // Cálculo de costos y stats (+10% por nivel)
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
    <div className="w-full max-w-md mx-auto my-6 bg-[#111111] border border-white/10 rounded-2xl p-6 text-gray-200 font-mono shadow-2xl">
      <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Link to={"/"}>
            <FaTimes className="text-yellow-400 shadow-2xl hover:scale-130 transition-transform cursor-pointer relative overflow-hidden" />
        </Link> Laboratorio de Mejoras
      </h3>

      {/* Vista previa de la Carta Seleccionada */}
      <div className="mb-4 text-center bg-[#161616] p-4 rounded-xl border border-white/5">
        {carta.img && (
          <img 
            src={carta.img} 
            alt={carta.name} 
            className="w-28 h-36 object-cover mx-auto rounded-lg mb-2 shadow-md border border-white/10" 
          />
        )}
        <h4 className="text-base font-black text-white">{carta.name}</h4>
        <p className="text-[10px] text-amber-400 font-bold">💎 {cristalesUsuario} Cristales</p>
      </div>

      {/* Panel de Nivel */}
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

      {/* Botón de Acción para subir nivel */}
      {!esNivelMax && (
        <button
          onClick={handleSubirNivel}
          disabled={!tieneFondos || loading}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all mb-6 ${
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
        <p className="text-[9px] text-red-500 text-center -mt-4 mb-6 uppercase italic tracking-tighter">
          ❌ Cristales insuficientes (Tienes: {cristalesUsuario} / Requieres: {costeAumento})
        </p>
      )}

      {/* Carrusel / Lista de Cartas en Miniatura abajo */}
      <div className="pt-4 border-t border-white/10">
        <label className="text-[10px] text-white/40 uppercase block mb-2">Seleccionar otra carta</label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          {cartas.map((c) => {
            const esSeleccionada = String(c.id) === String(carta.id);
            return (
              <button
                key={c.id}
                onClick={() => setIdCartaSeleccionada(c.id)}
                className={`flex-shrink-0 p-1.5 rounded-xl border transition-all text-left cursor-pointer ${
                  esSeleccionada
                    ? 'border-amber-500 bg-amber-500/10 scale-105'
                    : 'border-white/10 bg-[#161616] opacity-60 hover:opacity-100'
                }`}
              >
                {c.img ? (
                  <img src={c.img} alt={c.name} className="w-12 h-16 object-cover rounded-lg mb-1" />
                ) : (
                  <div className="w-12 h-16 bg-white/5 rounded-lg mb-1 flex items-center justify-center text-[8px] text-white/40">Sin foto</div>
                )}
                <p className="text-[9px] font-bold text-white truncate max-w-[50px]">{c.name}</p>
                <p className="text-[8px] text-amber-400">LVL {c.nivel || 1}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}