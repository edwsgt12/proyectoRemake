import type { Carta } from "../assets/types/types";

interface ModalProps {
    carta: Carta;
    onClose: () => void;
}

function Modal({ carta, onClose }: ModalProps) {
    const hp = carta.vida;

    return (

       <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
  <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-yellow-500 rounded-2xl max-w-2xl w-full p-8 text-white relative animate-fadeIn">
    
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-2xl text-yellow-400 hover:text-yellow-300 transition-colors z-10">
      ✕
    </button>

    <div className="flex flex-col md:flex-row gap-8">
      
      {/* Sección de la imagen con indicador de vida integrado */}
      <div className="flex-shrink-0 relative">
        {/* Imagen principal */}
        <img
          src={carta.img}
          alt={carta.name}
          className="w-64 h-64 object-cover rounded-xl border-4 border-gray-700"
        />
        
        {/* Indicador de vida en la esquina superior derecha de la imagen */}
        <div className="absolute -top-3 -right-3">
          <div className="relative group">
            {/* Fondo principal con gradiente */}
            <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg px-4 py-2 flex items-center gap-3 border-2 border-red-400 shadow-xl shadow-red-900/50 backdrop-blur-sm">
              
              {/* Contenedor del corazón y número */}
              <div className="flex items-center gap-2">
                {/* Corazón con latido */}
                <div className="relative">
                  <svg 
                    className="w-6 h-6 text-red-300 animate-pulse" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  
                  {/* Partículas de brillo */}
                  <div className="absolute -inset-1 bg-red-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                </div>
                
                {/* Número de vida - AHORA SÍ SE MUESTRA */}
                <span className="text-4xl font-black text-white italic tabular-nums">{carta.vida}</span>
              </div>
              
              {/* Etiqueta HP */}
              <div className="h-8 w-px bg-red-400/30 mx-1"></div>
              <span className="text-sm font-bold text-red-200 uppercase tracking-wider drop-shadow-lg">
                HP
              </span>
            </div>
            
            {/* Efectos decorativos */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-lg pointer-events-none"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-red-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          </div>
        </div>
        
        {/* Barra de vida decorativa */}
        <div className="absolute -bottom-2 left-4 right-4 h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, ((carta.vida || hp || 100) / 100) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Información de la carta */}
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            #{carta.id}
          </span>
          <h2 className="text-3xl font-bold text-yellow-300">{carta.name}</h2>
        </div>

        {/* Stats con vida incluida */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center bg-red-500/10 p-3 rounded-lg border border-red-500/30">
            <div className="text-sm text-gray-400 mb-1">⚔️ ATAQUE</div>
            <div className="text-2xl font-bold text-red-500">{carta.ataque}</div>
          </div>
          <div className="text-center bg-blue-500/10 p-3 rounded-lg border border-blue-500/30">
            <div className="text-sm text-gray-400 mb-1">🛡️ DEFENSA</div>
            <div className="text-2xl font-bold text-blue-500">{carta.defensa}</div>
          </div>
          <div className="text-center bg-green-500/10 p-3 rounded-lg border border-green-500/30">
            <div className="text-sm text-gray-400 mb-1">❤️ VIDA</div>
            <div className="text-2xl font-bold text-green-500">{carta.vida || hp || "100"}</div>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-3 text-gray-300 flex items-center gap-2">
            <span>📖</span> DESCRIPCIÓN
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {carta.descripcion || "Descripción no disponible."}
          </p>
        </div>

        {/* Puntos decorativos */}
        <div className="mt-6 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  </div>
</div>)}

export default Modal;