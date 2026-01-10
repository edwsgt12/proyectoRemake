import type { Carta } from "../assets/types/types";

interface ModalProps {
    carta: Carta;
    onClose: () => void;
}

function Modal({ carta, onClose }: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-yellow-500 rounded-2xl max-w-2xl w-full p-8 text-white relative animate-fadeIn">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl text-yellow-400 hover:text-yellow-300 transition-colors">
                    ✕
                </button>

                <div className="flex flex-col md:flex-row gap-8">

                    <div className="flex-shrink-0">
                        <img
                            src={carta.img}
                            alt={carta.name}
                            className="w-64 h-64 object-cover rounded-xl border-4 border-gray-700"
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
                                #{carta.id}
                            </span>
                            <h2 className="text-3xl font-bold text-yellow-300">{carta.name}</h2>
                        </div>

                        <div className="flex gap-8 mb-6">
                            <div className="text-center">
                                <div className="text-gray-400">ATAQUE</div>
                                <div className="text-2xl font-bold text-red-500">{carta.ataque}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-400">DEFENSA</div>
                                <div className="text-2xl font-bold text-blue-500">{carta.defensa}</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-3 text-gray-300">📖 DESCRIPCIÓN</h3>
                            <p className="text-gray-300 leading-relaxed">
                                {carta.descripcion || "Descripción no disponible."}
                            </p>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse delay-75"></div>
                            <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse delay-150"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;