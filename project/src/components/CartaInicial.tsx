import type { Carta } from "../assets/types/types";
function Cartainicial({
carta,
  onDelete, 
  onClick
}: {
  carta:Carta,
  onDelete: (id: number) => void,
  onClick: () => void
}) {
  const {  id,
  name,
  ataque,
  defensa,
  img,
  vida,
} = carta

  return (
<div 
  className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl p-4 w-64 text-white shadow-2xl hover:scale-105 transition-transform cursor-pointer relative overflow-hidden"
  onClick={onClick}
>
  <button
    onClick={(e) =>{
      e.stopPropagation();
      onDelete(id);
    }}
    className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 z-10 shadow-lg hover:shadow-red-500/50"
    title="Eliminar carta"
  >
    <svg 
      className="w-5 h-5" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
      />
    </svg>
  </button>

  <div className="flex justify-between mt-4">
    <div className="absolute top-3 left-3 bg-yellow-500 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
      #{id}
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
      <div className="text-sm text-gray-400">Vida</div>
      <div className="text-xl font-bold text-green-500">{vida}</div>
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