import type { Carta } from "../assets/types/types";
import { Link } from "react-router";
import { FaPlus } from "react-icons/fa";

interface ModalProps {
    carta: Carta;
    onClose: () => void;
}

function Modal({ carta, onClose }: ModalProps) {
    const hp = carta.vida;

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
                    
                    <div className="flex-shrink-0 relative">
                        <img
                            src={carta.img}
                            alt={carta.name}
                            className="w-64 h-80 object-cover rounded-xl border-2 border-gray-700 shadow-2xl"
                        />
                        <div className="absolute -bottom-2 left-4 right-4 h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                            <div 
                                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(100, ((carta.vida || 100) / 100) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Sección de Información de la carta */}
                    <div className="flex-1 flex flex-col relative">
                        
                        {/* Cabecera */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="bg-yellow-500 text-black font-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg shadow-yellow-500/20 text-sm">
                                #{carta.id}
                            </span>
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter italic">
                                {carta.name}
                            </h2>
                        </div>

                        {/* Stats Organizados: Vida arriba de Ataque/Defensa */}
                        <div className="flex flex-col gap-3 mb-6">
                            
                            {/* VIDA - Única visualización destacada */}
                            <div className="flex items-center justify-between bg-green-500/10 p-4 rounded-xl border border-green-500/30">
                                <div className="flex items-center gap-2 text-green-500 font-black italic text-xs tracking-widest">
                                    ❤️ VIDA (HP)
                                </div>
                                <div className="text-3xl font-black text-green-400 font-mono">
                                    {carta.vida || "100"}
                                </div>
                            </div>

                            {/* ATAQUE Y DEFENSA - En cuadrícula debajo */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center bg-red-500/10 p-3 rounded-xl border border-red-500/30">
                                    <div className="text-[10px] text-red-500/70 font-black mb-1 tracking-widest uppercase">⚔️ Ataque</div>
                                    <div className="text-2xl font-black text-white font-mono">{carta.ataque}</div>
                                </div>
                                <div className="text-center bg-blue-500/10 p-3 rounded-xl border border-blue-500/30">
                                    <div className="text-[10px] text-blue-500/70 font-black mb-1 tracking-widest uppercase">🛡️ Defensa</div>
                                    <div className="text-2xl font-black text-white font-mono">{carta.defensa}</div>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="bg-white/5 p-5 pb-16 rounded-xl border border-white/5 flex-grow relative overflow-hidden">
                            <h3 className="text-xs font-black mb-3 text-white/30 flex items-center gap-2 tracking-[0.2em]">
                                <span>📖</span> DESCRIPCIÓN
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-sm italic">
                                {carta.descripcion || "Descripción no disponible."}
                            </p>

                            {/* Botón Editar */}
                            <Link to={`/editar/${carta.id}`} className="absolute bottom-3 right-3">
                                <button
                                    className="px-4 py-2 rounded-lg bg-yellow-500 text-black text-[10px] font-black flex items-center gap-2 shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all cursor-pointer active:scale-95 uppercase italic tracking-tighter"
                                >
                                    <FaPlus />
                                    <span>Editar Carta</span>
                                </button>
                            </Link>
                        </div>

                        {/* Puntos decorativos */}
                        <div className="mt-4 flex gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;