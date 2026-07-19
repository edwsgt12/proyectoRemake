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

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl max-w-2xl w-full p-8 text-white relative animate-fadeIn shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                
                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl text-yellow-400 hover:text-yellow-300 transition-colors z-10"
                >
                    ✕
                </button>

                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* COLUMNA IZQUIERDA: IMAGEN + TIPO + ULTI ESPECIAL */}
                    <div className="flex-shrink-0 flex flex-col gap-3 w-full md:w-64">
                        <div className="relative">
                            <img
                                src={carta.img}
                                alt={carta.name}
                                className="w-full h-80 object-cover rounded-xl border-2 border-gray-700 shadow-2xl"
                            />
                            <div className="absolute -bottom-2 left-4 right-4 h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                <div 
                                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.min(100, ((carta.vida || 100) / 100) * 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* TIPO DE CARTA */}
                        <div className="bg-white/5 py-1.5 px-3 rounded-lg border border-white/5 text-center flex items-center justify-center gap-1.5">
                            <RiMagicLine className="text-yellow-500 text-xs" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tipo:</span>
                            <span className="text-[11px] font-black text-white uppercase italic truncate">{carta.tipo || 'Hechicero'}</span>
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
                    <div className="flex-1 flex flex-col relative">
                        
                        {/* Cabecera */}
                        <div className="flex items-center gap-4 mb-4">
                            <span className="bg-yellow-500 text-black font-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg shadow-yellow-500/20 text-sm">
                                #{carta.id}
                            </span>
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                                {carta.name}
                            </h2>
                        </div>

                        {/* Stats Organizados: Vida arriba de Ataque/Defensa */}
                        <div className="flex flex-col gap-2 mb-4">
                            
                            {/* VIDA */}
                            <div className="flex items-center justify-between bg-green-500/10 p-3 rounded-xl border border-green-500/30">
                                <div className="flex items-center gap-2 text-green-500 font-black italic text-xs tracking-widest">
                                    ❤️ VIDA (HP)
                                </div>
                                <div className="text-2xl font-black text-green-400 font-mono">
                                    {carta.vida || "100"}
                                </div>
                            </div>

                            {/* ATAQUE Y DEFENSA */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-center bg-red-500/10 p-2 rounded-xl border border-red-500/30">
                                    <div className="text-[9px] text-red-500/70 font-black mb-0.5 tracking-widest uppercase">⚔️ Ataque</div>
                                    <div className="text-xl font-black text-white font-mono">{carta.ataque}</div>
                                </div>
                                <div className="text-center bg-blue-500/10 p-2 rounded-xl border border-blue-500/30">
                                    <div className="text-[9px] text-blue-500/70 font-black mb-0.5 tracking-widest uppercase">🛡️ Defensa</div>
                                    <div className="text-xl font-black text-white font-mono">{carta.defensa}</div>
                                </div>
                            </div>
                        </div>

                        {/* Meta Defensiva (La dejé aquí en la derecha por si la necesitas, de forma limpia) */}
                        <div className="mb-4 bg-white/5 px-3 py-2 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                <RiShieldLine /> Meta Defensiva
                            </span>
                            <span className="font-black text-blue-300 uppercase italic text-[11px]">{carta.tipoDefensiva || 'Escudo'}</span>
                        </div>

                        {/* Descripción */}
                        <div className="bg-white/5 p-4 pb-14 rounded-xl border border-white/5 flex-grow relative overflow-hidden">
                            <h3 className="text-xs font-black mb-2 text-white/30 flex items-center gap-2 tracking-[0.2em]">
                                <span>📖</span> DESCRIPCIÓN
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-xs italic">
                                {carta.descripcion || "Descripción no disponible."}
                            </p>

                            {/* Botón Editar */}
                            <Link to={`/editar/${carta.id}`} className="absolute bottom-3 right-3">
                                <button
                                    className="px-3 py-1.5 rounded-lg bg-yellow-500 text-black text-[9px] font-black flex items-center gap-1.5 shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all cursor-pointer active:scale-95 uppercase italic tracking-tighter"
                                >
                                    <FaPlus className="text-[8px]" />
                                    <span>Editar Carta</span>
                                </button>
                            </Link>
                        </div>

                        {/* Footer del Modal */}
                        <div className="mt-4 flex items-center justify-between">
                            {/* Puntos decorativos */}
                            <div className="flex gap-2">
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
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase italic tracking-tighter transition-all active:scale-95 shadow-md cursor-pointer ${
                                    estaSeleccionada
                                        ? "bg-red-950 text-red-400 border border-red-500/40 hover:bg-red-900"
                                        : "bg-blue-600 text-white border border-blue-400/20 hover:bg-blue-500 shadow-blue-500/10"
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