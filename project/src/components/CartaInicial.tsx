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
  onClick,
}: CartainicialProps) {
  return (
    <div 
      className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl p-4 w-64 text-white shadow-2xl hover:scale-105 transition-transform cursor-pointer relative overflow-hidden"
      onClick={onClick}
    >

      <div className="absolute top-3 left-3 bg-yellow-500 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
        #{id}
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

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
    </div>
  );
}

export default Cartainicial;