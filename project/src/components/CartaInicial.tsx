import type { Carta } from "../assets/types/types";

function Cartainicial({
  carta,
  onDelete, 
  onClick
}: {
  carta: Carta,
  onDelete: (id: number) => void,
  onClick: () => void
}) {
  const { 
    id,
    name,
    ataque,
    defensa,
    img,
    vida,
    tipo,
    ultiSeleccionada,
    nivel = 1 
  } = carta;

  // Definición de paletas exactas en formato RGB (r, g, b)
  const PALETA_RGB: Record<number, { rgb: string; texto: string }> = {
    1: { rgb: "34, 197, 94", texto: "text-green-400" },      // Nivel 1: Verde
    2: { rgb: "59, 130, 246", texto: "text-blue-400" },     // Nivel 2: Azul
    3: { rgb: "168, 85, 247", texto: "text-purple-400" },   // Nivel 3: Morado
    4: { rgb: "148, 163, 184", texto: "text-slate-300" },   // Nivel 4: Plateado
    5: { rgb: "245, 158, 11", texto: "text-amber-400" },     // Nivel 5: Dorado
  };

  // Caída limpia si el nivel supera el rango esperado
  const configActual = PALETA_RGB[nivel] || PALETA_RGB[5];
  const colorRGB = configActual.rgb;

  return (
    <div 
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-4 w-64 text-white transition-all duration-300 cursor-pointer relative overflow-hidden group style-glow"
      onClick={onClick}
      // Pasamos el color RGB dinámico como variable CSS personalizada
      style={{
        border: `2px solid rgb(${colorRGB})`,
        boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 0 0px rgba(${colorRGB}, 0)`
      }}
      // Modificamos el resplandor de la caja usando clases personalizadas o inyectando el hover en línea
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px 2px rgba(${colorRGB}, 0.35)`;
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 0 0px rgba(${colorRGB}, 0)`;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Botón de eliminar */}
      <button
        onClick={(e) => {
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

      {/* Indicador de Nivel */}
      <div className="flex justify-between mt-4">
        <div 
          className={`absolute top-3 left-3 ${configActual.texto} font-black rounded-full w-8 h-8 flex items-center justify-center text-[11px] shadow-md`}
          style={{ 
            backgroundColor: `rgba(${colorRGB}, 0.1)`, 
            border: `1px solid rgba(${colorRGB}, 0.3)` 
          }}
          title={`ID de la carta: #${id}`}
        >
          LV{nivel}
        </div>
      </div>

      {/* Contenedor de la Imagen */}
      <div className="mt-6 mb-4 flex justify-center">
        <img 
          src={img} 
          alt={name} 
          className="w-32 h-32 object-cover rounded-xl border-2 border-gray-700"
        />
      </div>

      {/* Nombre del Personaje */}
      <h2 className={`text-2xl font-bold text-center mb-1 ${configActual.texto} tracking-tighter uppercase italic`}>
        {name}
      </h2>

      {/* Badges de Atributos */}
      <div className="flex flex-col items-center gap-1.5 mb-3">
        {/* Badge del Tipo de Carta */}
        <span 
          className={`text-[10px] font-mono font-bold uppercase px-3 py-0.5 rounded-md tracking-wider ${configActual.texto}`}
          style={{ 
            backgroundColor: `rgba(${colorRGB}, 0.1)`, 
            border: `1px solid rgba(${colorRGB}, 0.2)` 
          }}
        >
          {tipo || 'Hechicero'}
        </span>

        {/* Badge Dinámico de la Habilidad Suprema (Ulti) */}
        {ultiSeleccionada ? (
          <span className="text-[9px] font-mono uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2.5 py-0.5 rounded-md tracking-tight font-semibold">
            💥 {ultiSeleccionada.nombre}
          </span>
        ) : (
          <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-md tracking-tight">
            💥 Sin Ulti
          </span>
        )}
      </div>

      {/* Estadísticas de Combate */}
      <div className="flex justify-between mt-4 border-t border-white/5 pt-3">
        <div className="text-center">
          <div className="text-[10px] text-gray-400 font-bold tracking-wider">ATAQUE</div>
          <div className="text-xl font-bold text-red-500">{ataque}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-400 font-bold tracking-wider">VIDA</div>
          <div className="text-xl font-bold text-green-500">{vida}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-400 font-bold tracking-wider">DEFENSA</div>
          <div className="text-xl font-bold text-blue-500">{defensa}</div>
        </div>
      </div>

      {/* Efecto de brillo al hacer hover general */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      
      {/* Brillo sutil de fondo en base a la opacidad del RGB */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-70" 
        style={{
          background: `linear-gradient(135deg, rgba(${colorRGB}, 0.25), transparent)`
        }}
      />
    </div>
  );
}

export default Cartainicial;