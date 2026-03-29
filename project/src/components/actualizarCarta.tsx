import { useState } from "react";
import { 
  RiImageAddLine, 
  RiShieldLine, 
  RiSwordLine, 
  RiHistoryLine, 
  RiSaveLine, 
  RiLoader4Line,
  RiCheckLine,
  RiErrorWarningLine,
  RiArrowGoBackLine
} from "react-icons/ri";
import { BsFeather } from "react-icons/bs";
import { useNavigate, useParams } from 'react-router';
import type { Carta } from "../assets/types/types";
import type { EditarCartaProps } from '../assets/types/types';


const EditarCarta = ({ onGuardar, loading = false, cartas }: EditarCartaProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [error, setError] = useState<string | null>(null);  
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(cartas.find(c => c.id === parseInt(id || ''))!);

  console.log("FormData",formData)

  // Cargar datos de la carta al montar el componente

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'poder' || name === 'defensa' || name === 'hp' ? Number(value) : value
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError(null);
  };

  // Validar formulario
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (formData.ataque < 0 || formData.ataque > 99999) {
      setError("El poder debe estar entre 0 y 99999");
      return false;
    }
    if (formData.defensa < 0 || formData.defensa > 99999) {
      setError("La defensa debe estar entre 0 y 99999");
      return false;
    }
    if (formData.vida< 0 || formData.vida > 99999) {
      setError("Los puntos de vida deben estar entre 0 y 99999");
      return false;
    }
    if (!formData.descripcion.trim()) {
      setError("La descripción es obligatoria");
      return false;
    }
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    // Verificar que tenemos un ID válido
    if (!id || isNaN(parseInt(id))) {
      setError("ID de carta no válido");
      return;
    }

    // Crear objeto con la estructura correcta
    const cartaEditada: Carta = {
      id: parseInt(id),
      name: formData.name.trim(),
      ataque: Number(formData.ataque),
      defensa: Number(formData.defensa),
      vida: Number(formData.vida),
      img: formData.img.trim() || "https://via.placeholder.com/400x600?text=Sin+Imagen",
      descripcion: formData.descripcion.trim(),
      tipo: formData.tipo
    };

    try {
      const result = await onGuardar(cartaEditada);
      
      if (result.success) {
        setSuccess(true);
        // Pequeña pausa para mostrar el éxito antes de navegar
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError("Error al guardar los cambios. Intenta de nuevo.");
      }
    } catch (err) {
      setError("Error de conexión. Verifica tu internet.");
      console.error("Error en submit:", err);
    }
  };

  // Manejar cancelar
  const handleCancel = () => {
    navigate('/');
  };

  // Loading state - Cargando datos iniciales
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#030303]">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full animate-pulse"></div>
          <RiLoader4Line className="relative z-10 text-amber-400 text-6xl animate-spin mb-4" />
        </div>
        <div className="text-amber-400 text-2xl font-black animate-pulse mb-2">
          CARGANDO DATOS
        </div>
        <div className="text-white/30 text-sm font-mono flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
          ID: {id}
        </div>
        <button
          onClick={handleCancel}
          className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 transition-all flex items-center gap-2 border border-white/10"
        >
          <RiArrowGoBackLine /> Volver al inicio
        </button>
      </div>
    );
  }

  // Error state - No se pudo cargar la carta
  if (error && !formData.name) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#030303]">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-500">
          <RiErrorWarningLine className="text-red-400 text-5xl" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">ERROR AL CARGAR</h2>
        <p className="text-red-400/70 mb-8">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black transition-all"
          >
            Reintentar
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Success state - Actualización exitosa
  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
            <div className="relative w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
              <RiCheckLine className="text-green-400 text-5xl" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">¡CAMBIOS GUARDADOS!</h2>
          <p className="text-green-400/70 mb-4">La carta ha sido actualizada exitosamente</p>
          <div className="w-16 h-1 bg-green-500/30 mx-auto rounded-full overflow-hidden">
            <div className="h-full w-full bg-green-500 animate-[loading_1s_ease-in-out]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de edición
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 overflow-hidden bg-[#030303]">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* Tarjeta del Formulario */}
      <div className="relative z-10 w-full max-w-4xl bg-white/3 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        
        {/* Adorno de esquina */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-500/30 rounded-tl-[2.5rem] pointer-events-none" />

        {/* Header */}
        <header className="mb-12 relative">
          <div className="flex items-center gap-5 mb-4">
            <div className="h-12 w-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
              Editando <span className="text-amber-400">{formData.name || 'Carta'}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-white/40 font-mono text-[9px] tracking-[0.4em] uppercase">
            <span>ID: {id}</span>
            <span className="h-px w-20 bg-white/10" />
            <span className="flex items-center gap-1 text-amber-400/60">
              <BsFeather /> Modo Edición
            </span>
          </div>
        </header>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
            <RiErrorWarningLine className="text-red-500 text-xl shrink-0" />
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          
          {/* Nombre */}
          <div className="group space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest group-focus-within:text-amber-400 transition-colors">
              Nombre del Personaje <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              required
              placeholder="Ej: Pegasus Seiya"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white placeholder-white/30 focus:border-amber-500/50 focus:bg-amber-500/5 outline-none transition-all italic font-semibold shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Tipo */}
          <div className="group space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest group-focus-within:text-amber-400 transition-colors">
              Tipo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white focus:border-amber-500/50 outline-none transition-all cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="Luchador">Luchador</option>
                <option value="Estratega">Estratega</option>
                <option value="Mago">Mago</option>
                <option value="Ninja">Ninja</option>
                <option value="Dios">Dios</option>
                <option value="Tanque">Tanque</option>
                <option value="Espadachin">Espadachin</option>
                <option value="Asesino">Asesino</option>
                <option value="Héroe">Héroe</option>
                <option value="Villano">Villano</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500">
                ▼
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-linear-to-br from-white/2 to-transparent p-8 rounded-4xl border border-white/5 relative overflow-hidden">
            
            {/* HP */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-green-500/80 font-black italic text-xs tracking-tighter uppercase">
                <RiShieldLine /> Vitalidad (HP) <span className="text-red-500">*</span>
              </div>
              <input
                type="number"
                name="hp"
                required
                min="0"
                max="99999"
                value={formData.vida}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black/60 border border-green-500/20 p-4 rounded-xl text-white text-2xl font-mono focus:border-green-500 transition-all outline-none disabled:opacity-50"
              />
            </div>

            {/* Ataque */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-red-500/80 font-black italic text-xs tracking-tighter uppercase">
                <RiSwordLine /> Ataque <span className="text-red-500">*</span>
              </div>
              <input
                type="number"
                name="poder"
                required
                min="0"
                max="99999"
                value={formData.ataque}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black/60 border border-red-500/20 p-4 rounded-xl text-white text-2xl font-mono focus:border-red-500 transition-all outline-none disabled:opacity-50"
              />
            </div>

            {/* Defensa */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-blue-500/80 font-black italic text-xs tracking-tighter uppercase">
                <RiShieldLine /> Defensa <span className="text-red-500">*</span>
              </div>
              <input
                type="number"
                name="defensa"
                required
                min="0"
                max="99999"
                value={formData.defensa}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black/60 border border-blue-500/20 p-4 rounded-xl text-white text-2xl font-mono focus:border-blue-500 transition-all outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* URL de la Imagen */}
          <div className="md:col-span-2 group space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest group-focus-within:text-amber-400">
              URL de la Imagen
            </label>
            <div className="relative">
              <RiImageAddLine className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50 text-xl" />
              <input
                type="url"
                name="imagen"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.img}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 pl-12 p-4 rounded-2xl text-white placeholder-white/30 focus:border-amber-500/50 outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>


          {/* Descripción / Lore */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
              <RiHistoryLine /> Lore / Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              required
              rows={3}
              value={formData.descripcion}
              onChange={handleChange}
              disabled={loading}
              placeholder="Historia del personaje, origen, poderes..."
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white placeholder-white/30 focus:border-amber-500/50 outline-none resize-none disabled:opacity-50"
            />
          </div>

          {/* Botones */}
          <div className="md:col-span-2 pt-6 flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="group relative flex-1 bg-white/5 hover:bg-white/10 py-6 rounded-2xl transition-all duration-500 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 text-white/70 font-black uppercase italic tracking-tighter text-xl flex items-center justify-center gap-2">
                <RiArrowGoBackLine /> Cancelar
              </span>
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`group relative flex-1 py-6 rounded-2xl transition-all duration-500 overflow-hidden ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-amber-500 hover:bg-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.25)]'
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 text-black font-black uppercase italic tracking-tighter text-xl flex items-center justify-center gap-3">
                {loading ? (
                  <div>
                    <RiLoader4Line className="animate-spin text-2xl" />
                    GUARDANDO...
                  </div>
                ) : (
                  <div>
                    Guardar Cambios <RiSaveLine className="text-2xl" />
                  </div>
                )}
              </span>
            </button>
          </div>

          {/* Campos requeridos hint */}
          <div className="md:col-span-2 text-right">
            <p className="text-[8px] text-white/20 font-mono">
              <span className="text-red-500">*</span> Campos obligatorios
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarCarta;