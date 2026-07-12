import { useState } from "react";
import { RiArrowUpCircleLine, RiFlashlightLine, RiShieldLine, RiHeartFill, RiCoinsLine } from "react-icons/ri";
import type { Carta } from "../assets/types/types";
import { calcularStatsPorNivel } from "../assets/types/atributosCartas";

interface SubirNivelProps {
  carta: Carta;
  fragmentosUsuario: number;
  onNivelSubido: (cartaActualizada: Carta, coste: number) => Promise<void>;
}

// Mapa de costes por nivel de destino
const COSTES_NIVEL: Record<number, number> = {
  2: 100,
  3: 250,
  4: 500,
  5: 1000
};

export const SubirNivelCarta = ({ carta, fragmentosUsuario, onNivelSubido }: SubirNivelProps) => {
  const [loading, setLoading] = useState(false);
  
  const nivelActual = carta.nivel || 1;
  const esNivelMax = nivelActual >= 5;
  const siguienteNivel = nivelActual + 1;
  const costeAumento = COSTES_NIVEL[siguienteNivel] || 0;
  
  // Calculamos cómo se vería la carta si sube de nivel para mostrárselo al usuario
  const cartaSiguienteNivel = !esNivelMax ? calcularStatsPorNivel(carta, siguienteNivel) : null;
  const tieneFondos = fragmentosUsuario >= costeAumento;

  const handleSubirNivel = async () => {
    if (esNivelMax || !tieneFondos || loading) return;
    
    setLoading(false);
    try {
      setLoading(true);
      // Enviamos la carta con el nuevo nivel a la función que conecta con la API
      await onNivelSubido(cartaSiguienteNivel!, costeAumento);
    } catch (error) {
      console.error("Error al subir de nivel", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 text-gray-200 font-mono">
      <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <RiArrowUpCircleLine className="text-xl" /> Laboratorio de Mejoras
      </h3>

      {/* Selector de Nivel Visual */}
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

      {/* Comparativa de Atributos */}
      {!esNivelMax && cartaSiguienteNivel ? (
        <div className="space-y-3 bg-[#161616] p-4 rounded-xl border border-white/5 mb-6">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-red-400"><RiFlashlightLine/> ATK:</span>
            <p className="text-white font-bold">
              {carta.ataque} <span className="text-green-400">➔ {cartaSiguienteNivel.ataque}</span>
            </p>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-blue-400"><RiShieldLine/> DEF:</span>
            <p className="text-white font-bold">
              {carta.defensa} <span className="text-green-400">➔ {cartaSiguienteNivel.defensa}</span>
            </p>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-green-400"><RiHeartFill/> HP:</span>
            <p className="text-white font-bold">
              {carta.vida} <span className="text-green-400">➔ {cartaSiguienteNivel.vida}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-bold uppercase mb-6">
          ✨ ¡CARTA EN SU MÁXIMO POTENCIAL! ✨
        </div>
      )}

      {/* Botón de Acción y Coste */}
      {!esNivelMax && (
        <button
          onClick={handleSubirNivel}
          disabled={!tieneFondos || loading}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
            tieneFondos 
              ? 'bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] shadow-lg shadow-amber-500/10 cursor-pointer' 
              : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
          }`}
        >
          {loading ? (
            "Procesando..."
          ) : (
            <>
              <RiCoinsLine className="text-base" /> Mejorar por {costeAumento} Frags
            </>
          )}
        </button>
      )}
      
      {!tieneFondos && !esNivelMax && (
        <p className="text-[9px] text-red-500 text-center mt-2 uppercase italic tracking-tighter">
          ❌ Recursos insuficientes (Tienes: {fragmentosUsuario} / Requieres: {costeAumento})
        </p>
      )}
    </div>
  );
};