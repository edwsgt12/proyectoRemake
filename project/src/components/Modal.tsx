import type { Carta } from "../assets/types/types";
import { Link } from "react-router";
import { FaPlus } from "react-icons/fa";
import { RiMagicLine, RiFlashlightLine, RiShieldLine } from "react-icons/ri";

interface ModalProps {
  carta: Carta;
  onClose: () => void;
  seleccionarCartaParaBatalla: (carta: Carta) => void;
  estaSeleccionada: boolean;
}

function Modal({ carta, onClose, seleccionarCartaParaBatalla, estaSeleccionada }: ModalProps) {
  const { nivel = 1 } = carta;

  // Rango de colores exactos RGB según el nivel (CADA 2 NIVELES HASTA NIVEL 10)
  const getPaletaPorNivel = (lvl: number) => {
    if (lvl >= 9) {
      return { rgb: "239, 68, 68", texto: "text-red-500", titulo: "DIVINO" };      // Niv 9-10: Rojo Fuego
    }
    if (lvl >= 7) {
      return { rgb: "234, 179, 8", texto: "text-yellow-400", titulo: "ÉPICO" };   // Niv 7-8: Dorado Neón
    }
    if (lvl >= 5) {
      return { rgb: "168, 85, 247", texto: "text-purple-400", titulo: "ELITE" };  // Niv 5-6: Morado Místico
    }
    if (lvl >= 3) {
      return { rgb: "59, 130, 246", texto: "text-blue-400", titulo: "RARO" };     // Niv 3-4: Azul Eléctrico
    }
    return { rgb: "34, 197, 94", texto: "text-green-400", titulo: "NOVATO" };     // Niv 1-2: Verde Esmeralda
  };

  const configActual = getPaletaPorNivel(nivel);
  const colorRGB = configActual.rgb;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-2xl w-full p-6 md:p-8 text-white relative animate-fadeIn transition-all duration-300 my-auto overflow-hidden shadow-2xl"
        style={{
          border: `2px solid rgb(${colorRGB})`,
          boxShadow: `0 0 40px rgba(${colorRGB}, 0.25)`
        }}
      >
        
        {/* Botón de cerrar adaptado al color dinámico */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-xl ${configActual.texto} hover:opacity-80 transition-opacity z-20 cursor-pointer bg-black/40 w-8 h-8 rounded-full flex items-center justify-center border border-white/10`}
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: IMAGEN + TIPO + ULTI ESPECIAL */}
          <div className="md:col-span-5 flex flex-col gap-3 w-full">
            <div className="relative w-full">
              <img
                src={carta.img || carta.img}
                alt={carta.name}
                className="w-full h-72 md:h-80 object-cover rounded-xl border-2 border-gray-700 shadow-2xl"
              />
              <div className="absolute -bottom-2 left-4 right-4 h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((carta.vida || 100) / 100) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* TIPO DE CARTA con estilo dinámico */}
            <div 
              className="py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 mt-2"
              style={{ 
                backgroundColor: `rgba(${colorRGB}, 0.08)`, 
                border: `1px solid rgba(${colorRGB}, 0.25)` 
              }}
            >
              <RiMagicLine className={`${configActual.texto} text-xs`} />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tipo:</span>
              <span className={`text-[11px] font-black ${configActual.texto} uppercase italic truncate`}>
                {carta.tipo || 'Hechicero'}
              </span>
            </div>

            {/* HABILIDAD SUPREMA/ULTI ESPECIAL */}
            {carta.ultiSeleccionada && (
              <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-1">
                <p className="text-[9px] font-black text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  <RiFlashlightLine /> Suprema: {carta.ultiSeleccionada.nombre}
                </p>
                <p className="text-[11px] text-purple-200/80 italic leading-relaxed">
                  {carta.ultiSeleccionada.descripcion}
                </p>
                {carta.ultiSeleccionada.mecanica && (
                  <span className="inline-block text-[8px] font-mono bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20 mt-1 uppercase">
                    {carta.ultiSeleccionada.mecanica}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: INFORMACIÓN Y STATS */}
          <div className="md:col-span-7 flex flex-col justify-between h-full min-w-0">
            
            <div>
              {/* Cabecera con Insignia de Nivel y Rango Dinámico */}
              <div className="flex flex-col gap-2 mb-4 pr-8">
                <div className="flex items-center">
                  <span 
                    className={`font-black rounded-full px-2.5 py-0.5 text-[10px] tracking-wider font-mono shadow-md ${configActual.texto}`}
                    style={{ 
                      backgroundColor: `rgba(${colorRGB}, 0.15)`, 
                      border: `1px solid rgba(${colorRGB}, 0.4)` 
                    }}
                  >
                    #{carta.id} • LV{nivel} {configActual.titulo}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tight break-words leading-tight">
                  {carta.name}
                </h2>
              </div>

              {/* Stats Organizados: Vida arriba de Ataque/Defensa */}
              <div className="flex flex-col gap-2 mb-3">
                
                {/* VIDA */}
                <div className="flex items-center justify-between bg-green-500/10 p-2.5 rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-2 text-green-500 font-black italic text-xs tracking-widest">
                    ❤️ VIDA (HP)
                  </div>
                  <div className="text-xl font-black text-green-400 font-mono">
                    {carta.vida || "100"}
                  </div>
                </div>

                {/* ATAQUE Y DEFENSA */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center bg-red-500/10 p-2 rounded-xl border border-red-500/30">
                    <div className="text-[9px] text-red-500/70 font-black mb-0.5 tracking-widest uppercase">⚔️ Ataque</div>
                    <div className="text-lg font-black text-white font-mono">{carta.ataque}</div>
                  </div>
                  <div className="text-center bg-blue-500/10 p-2 rounded-xl border border-blue-500/30">
                    <div className="text-[9px] text-blue-500/70 font-black mb-0.5 tracking-widest uppercase">🛡️ Defensa</div>
                    <div className="text-lg font-black text-white font-mono">{carta.defensa}</div>
                  </div>
                </div>
              </div>

              {/* Meta Defensiva */}
              <div className="mb-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <RiShieldLine /> Meta Defensiva
                </span>
                <span className="font-black text-blue-300 uppercase italic text-[10px]">{carta.tipoDefensiva || 'Escudo'}</span>
              </div>

              {/* Descripción */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 relative mb-4">
                <h3 className="text-[10px] font-black mb-1 text-white/40 flex items-center gap-1.5 tracking-[0.2em]">
                  <span>📖</span> DESCRIPCIÓN
                </h3>
                <p className="text-gray-300 leading-relaxed text-xs italic max-h-24 overflow-y-auto pr-1">
                  {carta.descripcion || "Descripción no disponible."}
                </p>

                {/* Botón Editar dentro de la descripción */}
                <div className="flex justify-end mt-2">
                  <Link to={`/editar/${carta.id}`}>
                    <button
                      className="px-2.5 py-1 rounded-lg text-black text-[9px] font-black flex items-center gap-1 shadow-lg transition-all cursor-pointer active:scale-95 uppercase italic tracking-tighter"
                      style={{
                        backgroundColor: `rgb(${colorRGB})`,
                        boxShadow: `0 2px 10px rgba(${colorRGB}, 0.3)`
                      }}
                    >
                      <FaPlus className="text-[8px]" />
                      <span>Editar Carta</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
              {/* Puntos decorativos */}
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
              </div>

              {/* Botón de Selección para la Batalla */}
              <button
                onClick={() => {
                  seleccionarCartaParaBatalla(carta);
                  onClose();
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-tighter transition-all active:scale-95 shadow-md cursor-pointer ${
                  estaSeleccionada
                    ? "bg-red-950 text-red-400 border border-red-500/40 hover:bg-red-900"
                    : "bg-blue-600 text-white border border-blue-400/20 hover:bg-blue-500 shadow-blue-500/20"
                }`}
              >
                {estaSeleccionada ? "❌ Quitar de Batalla" : "⚔️ Elegir para Batalla"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;