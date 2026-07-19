import { useState, useEffect } from "react";
import { 
  RiImageAddLine, RiShieldLine, RiSwordLine, RiHistoryLine, 
  RiSaveLine, RiLoader4Line, RiCheckLine, RiErrorWarningLine,
  RiArrowLeftLine, RiHeartFill, RiMagicLine, RiFlashlightLine,
  RiTeamLine, RiSwordFill
} from "react-icons/ri";
import { useNavigate, useParams } from 'react-router';

// Importaciones de los tipos y diccionarios centralizados
import type { Carta, EditarCartaProps } from '../assets/types/types';
import { 
  MAPA_TIPO_A_GRUPO, 
  DICCIONARIO_ULTIS_POR_FAMILIA,
  type TipoCarta,
  type GrupoCarta
} from '../assets/types/atributosCartas';

// 1. Extraemos las familias únicas disponibles
const FAMILIAS_UNICAS = Array.from(new Set(Object.values(MAPA_TIPO_A_GRUPO)));

// 2. Creamos un mapa inverso para agrupar los tipos por familia fácilmente
const MAPA_GRUPO_A_TIPOS = Object.entries(MAPA_TIPO_A_GRUPO).reduce((acc, [tipo, grupo]) => {
  if (!acc[grupo]) acc[grupo] = [];
  acc[grupo].push(tipo as TipoCarta);
  return acc;
}, {} as Record<string, TipoCarta[]>);

export const FormularioEditarCarta = ({ onGuardar, loading = false, cartas }: EditarCartaProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [error, setError] = useState<string | null>(null);  
  const [success, setSuccess] = useState(false);
  
  // Buscamos la carta inicial dentro del array que llega por props
  const cartaInicial = cartas.find(c => c.id === parseInt(id || ''));
  const [formData, setFormData] = useState<Carta | null>(cartaInicial || null);

  // Estado local para manejar la familia seleccionada en el primer selector
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState<string>("");

  // Efecto para asegurar que los datos carguen si las props cambian
  useEffect(() => {
    if (cartaInicial) {
      setFormData(cartaInicial);
      const grupoActual = cartaInicial.grupo || MAPA_TIPO_A_GRUPO[cartaInicial.tipo] || FAMILIAS_UNICAS[0];
      setFamiliaSeleccionada(grupoActual);
    }
  }, [cartaInicial]);

  if (!formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <RiErrorWarningLine className="text-amber-500 text-6xl mb-4" />
        <h2 className="text-2xl font-bold">CARTA NO ENCONTRADA</h2>
        <button type="button" onClick={() => navigate('/')} className="mt-4 text-amber-500 underline">Volver al inicio</button>
      </div>
    );
  }

  const handleFamiliaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaFamilia = e.target.value as GrupoCarta;
    setFamiliaSeleccionada(nuevaFamilia);

    // Al cambiar la familia, obtenemos sus tipos y sus 2 ultis exclusivas
    const tiposFiltrados = MAPA_GRUPO_A_TIPOS[nuevaFamilia] || [];
    const ultisFiltradas = DICCIONARIO_ULTIS_POR_FAMILIA[nuevaFamilia] || [];
    
    setFormData(prev => prev ? ({
      ...prev,
      grupo: nuevaFamilia, 
      tipo: tiposFiltrados[0] as any,
      // Asigna por defecto la primera de las 2 ultis correspondientes a la nueva familia
      ultiSeleccionada: ultisFiltradas[0] || undefined 
    }) : null);
    
    if (error) setError(null);
  };

  const handleUltiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ultiId = e.target.value;
    const ultisDeFamilia = DICCIONARIO_ULTIS_POR_FAMILIA[familiaSeleccionada as GrupoCarta] || [];
    const ultiEncontrada = ultisDeFamilia.find(u => u.id === ultiId);

    if (ultiEncontrada) {
      setFormData(prev => prev ? ({
        ...prev,
        ultiSeleccionada: ultiEncontrada
      }) : null);
    }
  };

  // Soportamos selectores en el manejador de cambios general
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['ataque', 'defensa', 'vida'];
    
    setFormData(prev => prev ? ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }) : null);
    
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;

    if (!formData.name.trim() || !formData.descripcion.trim()) {
      setError("El nombre y la descripción son obligatorios.");
      return;
    }

    // Aseguramos que el grupo guardado sea el correcto según el tipo final asignado
    const grupoAsignado = MAPA_TIPO_A_GRUPO[formData.tipo] || familiaSeleccionada;

    // Si por alguna razón no tiene ulti asignada todavía, le forzamos la primera por defecto del grupo
    const ultiFinal = formData.ultiSeleccionada || DICCIONARIO_ULTIS_POR_FAMILIA[grupoAsignado as GrupoCarta]?.[0];

    const cartaActualizada: Carta = {
      ...formData,
      grupo: grupoAsignado as GrupoCarta,
      nivel: formData.nivel || 1,
      ultiSeleccionada: ultiFinal
    };

    const result = await onGuardar(cartaActualizada);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError("Error al conectar con la API.");
    }
  };

  // Listas auxiliares filtradas dinámicamente según la familia seleccionada
  const tiposDisponiblesFiltrados = MAPA_GRUPO_A_TIPOS[familiaSeleccionada] || [];
  const ultisDisponiblesFiltradas = DICCIONARIO_ULTIS_POR_FAMILIA[familiaSeleccionada as GrupoCarta] || [];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-gray-200 p-4 md:p-10 flex items-center justify-center font-sans">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-12">
        
        {/* Lado Izquierdo: Previsualización */}
        <div className="md:col-span-4 bg-[#161616] p-8 border-r border-white/5 flex flex-col justify-center items-center text-center">
            <div className="relative group mb-6 w-full">
                <div className="absolute -inset-1 bg-gradient-to-b from-amber-500 to-amber-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <img 
                    src={formData.img} 
                    alt="Preview" 
                    className="relative w-full aspect-[3/4] object-cover rounded-xl border border-white/10 shadow-2xl"
                />
            </div>
            <h3 className="text-amber-500 font-black italic text-xl tracking-tighter uppercase">{formData.name || "Sin nombre"}</h3>
            <div className="flex flex-col gap-1 items-center mt-2">
              <span className="text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                {formData.tipo || 'Hechicero'}
              </span>
              {formData.ultiSeleccionada && (
                <span className="text-[9px] font-mono uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-0.5 rounded-full mt-1">
                  ⚔️ {formData.ultiSeleccionada.nombre}
                </span>
              )}
              <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                Nivel {formData.nivel || 1}
              </span>
            </div>
            <p className="text-white/40 text-xs mt-4 font-mono uppercase tracking-widest">Previsualización de Enlace</p>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="md:col-span-8 p-8 md:p-12">
          <header className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                <span className="w-8 h-[2px] bg-amber-500"></span>
                Editor de <span className="text-amber-500">Cartas</span>
              </h1>
              <p className="text-white/30 text-xs font-mono mt-1 ml-11">SISTEMA DE ACTUALIZACIÓN DE LORE V2.0</p>
            </div>
            <button type="button" onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <RiArrowLeftLine className="text-2xl text-white/50" />
            </button>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Nombre */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-amber-500/80 uppercase tracking-[0.2em] ml-1">Nombre del Guerrero</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-amber-500/50 outline-none transition-all text-white font-medium"
                placeholder="Nombre de la carta..."
              />
            </div>

            {/* Grid de Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/2 p-4 rounded-2xl border border-white/5">
                <label className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1 mb-2"><RiSwordLine/> Ataque</label>
                <input type="number" name="ataque" value={formData.ataque} onChange={handleChange} className="bg-transparent text-xl font-bold w-full outline-none text-white" />
              </div>
              <div className="bg-white/2 p-4 rounded-2xl border border-white/5">
                <label className="text-[9px] font-bold text-blue-400 uppercase flex items-center gap-1 mb-2"><RiShieldLine/> Defensa</label>
                <input type="number" name="defensa" value={formData.defensa} onChange={handleChange} className="bg-transparent text-xl font-bold w-full outline-none text-white" />
              </div>
              <div className="bg-white/2 p-4 rounded-2xl border border-white/5">
                <label className="text-[9px] font-bold text-green-400 uppercase flex items-center gap-1 mb-2"><RiHeartFill/> Vida</label>
                <input type="number" name="vida" value={formData.vida} onChange={handleChange} className="bg-transparent text-xl font-bold w-full outline-none text-white" />
              </div>
            </div>

            {/* Selectores de Atributos del Sistema (Facciones, Clases y Metas) */}
            <div className="space-y-4 bg-white/2 p-4 rounded-2xl border border-white/5">
              
              {/* Fila 1: Familia y Tipo filtrado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-amber-500 uppercase flex items-center gap-1 mb-1">
                    <RiTeamLine /> Familia / Facción
                  </label>
                  <select
                    value={familiaSeleccionada}
                    onChange={handleFamiliaChange}
                    className="w-full bg-[#161616] border border-white/10 p-2.5 rounded-xl text-xs font-medium text-white outline-none focus:border-amber-500/50 transition-all cursor-pointer"
                  >
                    {FAMILIAS_UNICAS.map((familia) => (
                      <option key={familia} value={familia}>
                        🛡️ {familia}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-amber-500 uppercase flex items-center gap-1 mb-1">
                    <RiMagicLine /> Tipo Específico
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full bg-[#161616] border border-white/10 p-2.5 rounded-xl text-xs font-medium text-white outline-none focus:border-amber-500/50 transition-all cursor-pointer"
                  >
                    {tiposDisponiblesFiltrados.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        ✨ {tipo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NUEVA FILA: Selector dinámico de Ultis (solo muestra las 2 de la familia) */}
              <div className="space-y-1 pt-2 border-t border-white/5">
                <label className="text-[9px] font-bold text-purple-400 uppercase flex items-center gap-1 mb-1">
                  <RiSwordFill /> Habilidad Suprema (Ulti Ofensiva Exclusiva)
                </label>
                <select
                  value={formData.ultiSeleccionada?.id || ""}
                  onChange={handleUltiChange}
                  className="w-full bg-[#161616] border border-white/10 p-2.5 rounded-xl text-xs font-medium text-white outline-none focus:border-purple-500/50 transition-all cursor-pointer"
                >
                  {ultisDisponiblesFiltradas.map((ulti) => (
                    <option key={ulti.id} value={ulti.id}>
                      💥 {ulti.nombre} — ({ulti.descripcion})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fila 3: Metas de Inteligencia de Combate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-purple-400 uppercase flex items-center gap-1 mb-1">
                    <RiFlashlightLine /> Meta IA Ulti
                  </label>
                  <select
                    name="tipoUlti"
                    value={formData.tipoUlti || 'Daño'}
                    onChange={handleChange}
                    className="w-full bg-[#161616] border border-white/10 p-2.5 rounded-xl text-xs font-medium text-white outline-none focus:border-purple-500/50 transition-all cursor-pointer"
                  >
                    <option value="Daño">💥 Daño Directo</option>
                    <option value="Curación">🩸 Curación</option>
                    <option value="Efecto de Estado">🧪 Estado Alterado</option>
                    <option value="Buff/Debuff">⚡ Potenciador</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-blue-400 uppercase flex items-center gap-1 mb-1">
                    <RiShieldLine /> Meta IA Defensiva
                  </label>
                  <select
                    name="tipoDefensiva"
                    value={formData.tipoDefensiva || 'Escudo'}
                    onChange={handleChange}
                    className="w-full bg-[#161616] border border-white/10 p-2.5 rounded-xl text-xs font-medium text-white outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                  >
                    <option value="Escudo">🛡️ Escudo</option>
                    <option value="Curación">🩹 Auto-Curación</option>
                    <option value="Buff/Debuff">❄️ Mitigar Daño</option>
                  </select>
                </div>
              </div>

            </div>

            {/* URL Imagen */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <RiImageAddLine className="text-amber-500"/> Enlace de Imagen
              </label>
              <input 
                name="img" 
                value={formData.img} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-amber-500/50 outline-none transition-all text-white/70 text-sm"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <RiHistoryLine className="text-amber-500"/> Descripción del Lore
              </label>
              <textarea 
                name="descripcion" 
                rows={4} 
                value={formData.descripcion} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-amber-500/50 outline-none transition-all text-white resize-none"
              />
            </div>

            {/* Acciones */}
            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => navigate('/')}
                className="flex-1 py-4 rounded-xl border border-white/10 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={loading || success}
                className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
                  success ? 'bg-green-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] shadow-lg shadow-amber-500/20'
                }`}
              >
                {loading ? <RiLoader4Line className="animate-spin text-xl"/> : success ? <RiCheckLine className="text-xl"/> : <RiSaveLine className="text-xl"/>}
                {success ? '¡LISTO!' : loading ? 'GUARDANDO...' : 'ACTUALIZAR DATOS'}
              </button>
            </div>

            {error && <p className="text-red-500 text-[10px] font-mono text-center uppercase tracking-tighter italic">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioEditarCarta;