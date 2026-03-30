import { useState, useEffect } from "react";
import { 
  RiImageAddLine, RiShieldLine, RiSwordLine, RiHistoryLine, 
  RiSaveLine, RiLoader4Line, RiCheckLine, RiErrorWarningLine,
  RiArrowLeftLine, RiHeartFill
} from "react-icons/ri";
import { useNavigate, useParams } from 'react-router';
import type { Carta, EditarCartaProps } from '../assets/types/types';

const EditarCarta = ({ onGuardar, loading = false, cartas }: EditarCartaProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [error, setError] = useState<string | null>(null);  
  const [success, setSuccess] = useState(false);
  
  // Buscamos la carta inicial
  const cartaInicial = cartas.find(c => c.id === parseInt(id || ''));
  const [formData, setFormData] = useState<Carta | null>(cartaInicial || null);

  // Efecto para asegurar que los datos carguen si las props cambian
  useEffect(() => {
    if (cartaInicial) setFormData(cartaInicial);
  }, [cartaInicial]);

  if (!formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <RiErrorWarningLine className="text-amber-500 text-6xl mb-4" />
        <h2 className="text-2xl font-bold">CARTA NO ENCONTRADA</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-amber-500 underline">Volver al inicio</button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Convertir a número si el campo es de stats
    const numericFields = ['ataque', 'defensa', 'vida'];
    
    setFormData(prev => prev ? ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }) : null);
    
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.descripcion.trim()) {
      setError("El nombre y la descripción son obligatorios.");
      return;
    }

    const result = await onGuardar(formData);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError("Error al conectar con la API.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-gray-200 p-4 md:p-10 flex items-center justify-center font-sans">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-12">
        
        {/* Lado Izquierdo: Previsualización o Info */}
        <div className="md:col-span-4 bg-[#161616] p-8 border-r border-white/5 flex flex-col justify-center items-center text-center">
            <div className="relative group mb-6">
                <div className="absolute -inset-1 bg-gradient-to-b from-amber-500 to-amber-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <img 
                    src={formData.img} 
                    alt="Preview" 
                    className="relative w-full aspect-[3/4] object-cover rounded-xl border border-white/10 shadow-2xl"
                />
            </div>
            <h3 className="text-amber-500 font-black italic text-xl tracking-tighter uppercase">{formData.name || "Sin nombre"}</h3>
            <p className="text-white/40 text-xs mt-2 font-mono uppercase tracking-widest">Previsualización de Enlace</p>
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
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
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

export default EditarCarta;