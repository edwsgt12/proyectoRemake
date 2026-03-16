import type { Carta } from "../assets/types/types";

interface CartainicialProps extends Carta {
  onClick?: () => void;
}

function Cartainicial({
  id,
  name,
  ataque,
  defensa,
  img,
  vida,
  onClick,
}: CartainicialProps) {
  return (
<div 
  className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl p-4 w-64 text-white shadow-2xl hover:scale-105 transition-transform cursor-pointer relative overflow-hidden"
  onClick={onClick}
>
  <div className="flex justify-between mt-4">
    <div className="absolute top-3 left-3 bg-yellow-500 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
      #{id}
    </div>
    
    <div className="absolute top-3 right-3">
      <div className="relative">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-lg px-3 py-1.5 flex items-center gap-2 border border-black-400 shadow-lg shadow-yellow-900/50">
          <svg 
            className="w-4 h-4 text-yellow-500 animate-pulse" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
              clipRule="evenodd" 
            />
          </svg>
          
          <span className="text-lg font-bold text-white drop-shadow-lg">
            {vida}
          </span>
          
          <span className="text-xs font-semibold text-white-300 uppercase tracking-wider">
            HP
          </span>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-lg pointer-events-none" />
      </div>
    </div>
  </div>

  <div className="mt-6 mb-4 flex justify-center">
    <img 
      src={img} 
      alt={name} 
      className="w-32 h-32 object-cover rounded-xl border-2 border-gray-700"
    />
  </div>

  <h2 className="text-2xl font-bold text-center mb-2 text-yellow-300">
    {name}
  </h2>

  <div className="flex justify-between mt-4">
    <div className="text-center">
      <div className="text-sm text-gray-400">ATAQUE</div>
      <div className="text-xl font-bold text-red-500">{ataque}</div>
    </div>
    <div className="text-center">
      <div className="text-sm text-gray-400">DEFENSA</div>
      <div className="text-xl font-bold text-blue-500">{defensa}</div>
    </div>
  </div>

  {/* Efecto de brillo al hacer hover */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
  
  {/* Efecto de brillo sutil en la esquina de vida */}
  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-xl pointer-events-none" />
</div>
  ) }

export default Cartainicial;