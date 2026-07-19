import { useState } from "react";
import Cartainicial from "./CartaInicial"; 
import type { Carta } from "../assets/types/types";
import { Link } from "react-router";
import { RiSwordLine, RiLoader4Line, RiUser3Line } from "react-icons/ri";

type Props = {
    mazo: Carta[];
    loading: boolean;
}

function SeleccionarCartas({ mazo, loading }: Props) {
    const [cartaSeleccionada1, setCartaSeleccionada1] = useState<Carta | null>(null);
    const [cartaSeleccionada2, setCartaSeleccionada2] = useState<Carta | null>(null);

    // Derivamos el estado directamente en el render para evitar desincronizaciones de estado
    const listoBatalla = Boolean(cartaSeleccionada1 && cartaSeleccionada2);

    const handleSeleccionarCarta = (carta: Carta) => {
        const isSelected1 = cartaSeleccionada1?.id === carta.id;
        const isSelected2 = cartaSeleccionada2?.id === carta.id;

        if (isSelected1) {
            setCartaSeleccionada1(null);
            return;
        }

        if (isSelected2) {
            setCartaSeleccionada2(null);
            return;
        }

        // Asignación inteligente de espacios vacíos
        if (!cartaSeleccionada1) {
            setCartaSeleccionada1(carta);
        } else if (!cartaSeleccionada2) {
            setCartaSeleccionada2(carta);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 p-6 md:p-12 font-sans flex flex-col items-center relative">
            
            {/* Encabezado Épico */}
            <header className="text-center mb-12 select-none">
                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                    SELECCIÓN DE <span className="text-yellow-400">CONTENDIENTES</span>
                </h1>
                <p className="text-white/30 font-mono text-xs mt-2 tracking-widest">ELIGE 2 GUERREROS PARA EL CAMPO DE BATALLA</p>
            </header>

            {/* Estado de Carga */}
            {loading && (
                <div className="flex flex-col items-center justify-center my-20 gap-3 select-none">
                    <RiLoader4Line className="text-4xl text-yellow-400 animate-spin" />
                    <p className="text-sm font-mono tracking-widest text-white/40">SINCRONIZANDO MAZO DE COMBATE...</p>
                </div>
            )}

            {/* Renderizado de Mazo */}
            {!loading && mazo && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl w-full justify-items-center mb-32"> 
                    {mazo.map((carta) => { 
                        const is1 = cartaSeleccionada1?.id === carta.id;
                        const is2 = cartaSeleccionada2?.id === carta.id;
                        const estaSeleccionada = is1 || is2;

                        return (
                            <div 
                                onClick={() => handleSeleccionarCarta(carta)}
                                key={carta.id}
                                className={`relative rounded-2xl transition-all duration-300 transform select-none cursor-pointer ${
                                    is1 
                                      ? "ring-4 ring-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.45)] scale-102 hover:opacity-80" 
                                      : is2 
                                      ? "ring-4 ring-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.45)] scale-102 hover:opacity-80" 
                                      : "hover:scale-105 opacity-80 hover:opacity-100"
                                }`}
                            >
                                {/* Indicador Visual Flotante sobre la carta */}
                                {estaSeleccionada && (
                                    <div className={`absolute -top-3 -left-3 px-3 py-1 rounded-md text-[10px] font-black z-20 shadow-lg flex items-center gap-1 uppercase tracking-wider animate-fadeIn ${
                                        is1 ? "bg-cyan-500 text-black" : "bg-purple-500 text-white"
                                    }`}>
                                        <RiUser3Line /> {is1 ? "ATACANTE 1" : "RIVAL 2"}
                                    </div>
                                )}

                                <Cartainicial
                                    carta={carta}
                                    onClick={() => {}} // Delegado de forma segura al contenedor superior
                                    onDelete={() => {}} // Desactivado para evitar accidentes en selección
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Barra Inferior Fija para Confirmar Batalla */}
            <div className="fixed bottom-8 z-40 bg-black/75 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-6 shadow-[0_15px_50px_rgba(0,0,0,0.9)] select-none animate-slideUp">
                <div className="text-left font-mono">
                    <p className="text-[10px] text-white/40 tracking-widest uppercase">Estado</p>
                    <p className={`text-xs font-bold transition-colors duration-300 ${listoBatalla ? "text-green-400" : "text-yellow-500"}`}>
                        {listoBatalla ? "💥 ¡ARENA LISTA!" : "⏳ ELIGE 2 CARTAS"}
                    </p>
                </div>

                {listoBatalla ? (
                    <Link
                        to={`/campo-de-batalla/${cartaSeleccionada1?.id}/${cartaSeleccionada2?.id}`}
                        className="relative group block"
                    >
                        {/* Brillo exterior dinámico */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-amber-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                        <button
                            className="relative bg-gradient-to-r from-red-600 to-amber-600 text-white font-black px-6 py-3 rounded-full flex items-center gap-2 text-sm tracking-widest uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                            <RiSwordLine className="text-xl animate-bounce" />
                            <span>Iniciar Choque</span>
                        </button>
                    </Link>
                ) : (
                    <button
                        disabled
                        className="bg-white/5 border border-white/10 text-white/20 px-6 py-3 rounded-full flex items-center gap-2 text-sm tracking-widest uppercase font-bold cursor-not-allowed transition-all duration-300"
                    >
                        <RiSwordLine className="text-xl" />
                        <span>Faltan Héroes</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default SeleccionarCartas;