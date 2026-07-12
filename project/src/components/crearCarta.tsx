import { useState } from "react";
import { RiImageAddLine, RiMagicLine, RiFlashlightLine, RiShieldLine, RiTeamLine } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router";

// Importamos los tipos y diccionarios desde el archivo centralizado
import type { Carta } from "../assets/types/types";
import { 
    MAPA_TIPO_A_GRUPO, 
    type TipoCarta, 
    type TipoHabilidadIA 
} from "../assets/types/atributosCartas";

interface FormularioCartaProps {
    onCrear: (carta: Carta) => void;
    cantidadCartas: number;
}

// 1. Extraemos las familias/facciones únicas disponibles
const FAMILIAS_UNICAS = Array.from(new Set(Object.values(MAPA_TIPO_A_GRUPO)));

// 2. Creamos el mapa inverso para agrupar los tipos por familia
const MAPA_GRUPO_A_TIPOS = Object.entries(MAPA_TIPO_A_GRUPO).reduce((acc, [tipo, grupo]) => {
  if (!acc[grupo]) acc[grupo] = [];
  acc[grupo].push(tipo as TipoCarta);
  return acc;
}, {} as Record<string, TipoCarta[]>);

// 3. DEFINICIÓN DE LÍMITES MÁXIMOS POR FAMILIA REAL
const LIMITES_POR_FAMILIA: Record<string, { maxAtaque: number; maxDefensa: number; maxVida: number }> = {
    "Cónclave Arcano":      { maxAtaque: 4000, maxDefensa: 1500, maxVida: 18000 },
    "Sindicato Cyberpunk":  { maxAtaque: 3500, maxDefensa: 2500, maxVida: 22000 },
    "Orden del Filo":       { maxAtaque: 3200, maxDefensa: 3500, maxVida: 28000 },
    "Sombras del Yermo":    { maxAtaque: 4500, maxDefensa: 1200, maxVida: 15000 },
    "Fuerzas Primordiales": { maxAtaque: 2000, maxDefensa: 4500, maxVida: 35000 },
};

// Límite por defecto en caso de que una familia no esté explícitamente mapeada arriba
const LIMITE_DEFECTO = { maxAtaque: 3000, maxDefensa: 3000, maxVida: 25000 };

const FormularioCarta = ({ onCrear, cantidadCartas }: FormularioCartaProps) => {
    const estadoInicial: Omit<Carta, 'id' | 'grupo'> & { tipo: TipoCarta } = {
        name: "",
        ataque: 0,
        nivel: 1,
        defensa: 0,
        vida: 1000,
        img: "",
        descripcion: '',
        tipo: "Hechicero",
        tipoUlti: "Daño",
        tipoDefensiva: "Escudo"
    };

    const [formData, setFormData] = useState(estadoInicial);
    
    const [familiaSeleccionada, setFamiliaSeleccionada] = useState<string>(
        MAPA_TIPO_A_GRUPO[estadoInicial.tipo] || FAMILIAS_UNICAS[0]
    );

    // Obtener los límites de la familia actualmente seleccionada
    const limitesActuales = LIMITES_POR_FAMILIA[familiaSeleccionada] || LIMITE_DEFECTO;

    // VALIDACIONES EN TIEMPO REAL (Devuelven true si se abusa del límite)
    const excedeAtaque = formData.ataque > limitesActuales.maxAtaque;
    const excedeDefensa = formData.defensa > limitesActuales.maxDefensa;
    const excedeVida = formData.vida > limitesActuales.maxVida;
    
    // Si cualquiera de las tres estadísticas supera el límite de la facción, bloqueamos
    const tieneEstadisticasIlegales = excedeAtaque || excedeDefensa || excedeVida;

    const handleFamiliaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nuevaFamilia = e.target.value;
        setFamiliaSeleccionada(nuevaFamilia);

        const tiposFiltrados = MAPA_GRUPO_A_TIPOS[nuevaFamilia] || [];
        if (tiposFiltrados.length > 0) {
            setFormData(prev => ({
                ...prev,
                tipo: tiposFiltrados[0]
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Salvaguarda en submit por si acaso inspeccionan el HTML y quitan el 'disabled'
        if (tieneEstadisticasIlegales) return;

        const grupoAsignado = MAPA_TIPO_A_GRUPO[formData.tipo] || familiaSeleccionada;

        onCrear({ 
            ...formData, 
            id: cantidadCartas + 1,
            grupo: grupoAsignado,
            nivel: 1 
        } as Carta);
        
        setFormData(estadoInicial);
        setFamiliaSeleccionada(MAPA_TIPO_A_GRUPO[estadoInicial.tipo] || FAMILIAS_UNICAS[0]);
    };

    const tiposDisponiblesFiltrados = MAPA_GRUPO_A_TIPOS[familiaSeleccionada] || [];

    return (
        <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-xl p-8 rounded-xl border border-white/10 shadow-2xl mb-12">
            <div className="flex items-center gap-3 mb-2">
                <Link to={"/"}>
                    <FaTimes className="text-yellow-400 shadow-2xl hover:scale-130 transition-transform cursor-pointer relative overflow-hidden" />
                </Link>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                    Crea <span className="text-yellow-400">Una</span> Nueva <span className="text-yellow-400">Carta</span>
                </h2>
            </div>

            {/* BARRA DE TOPES DINÁMICA POR FAMILiA */}
            <p className="text-center text-[10px] text-slate-400 mb-6 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50 uppercase tracking-wider">
                TOPES {familiaSeleccionada}: <span className="text-red-400 font-bold">⚔️ {limitesActuales.maxAtaque}</span> | <span className="text-blue-400 font-bold">🛡️ {limitesActuales.maxDefensa}</span> | <span className="text-green-400 font-bold">❤️ {limitesActuales.maxVida}</span>
            </p>

            {/* Muestra un Banner global de advertencia si los límites son violados */}
            {tieneEstadisticasIlegales && (
                <div className="mb-6 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-center">
                    <p className="text-xs font-bold text-red-400 uppercase tracking-wider animate-pulse">
                        ⚠️ ¡Límites excedidos para la facción {familiaSeleccionada}! Reduce los atributos.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Input Para el Nombre */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all italic"
                    />
                </div>

                {/* Selector de Familia / Facción primero para ajustar los límites visibles */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <RiTeamLine className="text-yellow-500"/> Familia / Facción
                    </label>
                    <select
                        value={familiaSeleccionada}
                        onChange={handleFamiliaChange}
                        className="bg-white/5 border border-white/10 p-3 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer transition-all"
                    >
                        {FAMILIAS_UNICAS.map((familia) => (
                            <option key={familia} value={familia} className="bg-[#111]">
                                🛡️ {familia}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Input Para el ataque (Poder) */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Poder</label>
                        <span className={`text-[9px] font-mono ${excedeAtaque ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                            Anterior Máx: {limitesActuales.maxAtaque}
                        </span>
                    </div>
                    <input
                        type="number"
                        required
                        placeholder="1000"
                        value={formData.ataque || ""}
                        onChange={(e) => {
                            if (e.target.value.length < 7) {
                                setFormData({ ...formData, ataque: Number(e.target.value) })
                            }
                        }}
                        className={`bg-white/5 p-3 rounded-xl text-white outline-none transition-all border ${
                            excedeAtaque ? 'border-red-500 text-red-400 focus:ring-2 focus:ring-red-500 bg-red-500/5' : 'border-white/10 focus:ring-2 focus:ring-yellow-500'
                        }`}
                    />
                </div>

                {/* Input Para la Defensa */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Defensa</label>
                        <span className={`text-[9px] font-mono ${excedeDefensa ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                            Anterior Máx: {limitesActuales.maxDefensa}
                        </span>
                    </div>
                    <input
                        type="number"
                        required
                        placeholder="1000"
                        value={formData.defensa || ""}
                        onChange={(e) => {
                            if (e.target.value.length < 7) {
                                setFormData({ ...formData, defensa: Number(e.target.value) })
                            }
                        }}
                        className={`bg-white/5 p-3 rounded-xl text-white outline-none transition-all border ${
                            excedeDefensa ? 'border-red-500 text-red-400 focus:ring-2 focus:ring-red-500 bg-red-500/5' : 'border-white/10 focus:ring-2 focus:ring-yellow-500'
                        }`}
                    />
                </div>

                {/* Input Para la Vida */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Vida</label>
                        <span className={`text-[9px] font-mono ${excedeVida ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                            Anterior Máx: {limitesActuales.maxVida}
                        </span>
                    </div>
                    <input
                        type="number"
                        required
                        placeholder="20000"
                        value={formData.vida || ""}
                        onChange={(e) => {
                            if (e.target.value.length < 8) {
                                setFormData({ ...formData, vida: Number(e.target.value) })
                            }
                        }}
                        className={`bg-white/5 p-3 rounded-xl text-white outline-none transition-all border ${
                            excedeVida ? 'border-red-500 text-red-400 focus:ring-2 focus:ring-red-500 bg-red-500/5' : 'border-white/10 focus:ring-2 focus:ring-yellow-500'
                        }`}
                    />
                </div>

                {/* === CONFIGURACIÓN ATRIBUTOS INTERNOS (Clases y Metas) === */}
                <div className="space-y-4 md:col-span-2 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-bold text-yellow-500 uppercase flex items-center gap-1">
                                <RiMagicLine /> Tipo
                            </label>
                            <select
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoCarta })}
                                className="w-full bg-[#111111] border border-white/10 p-2.5 rounded-xl text-xs font-medium text-white outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer transition-all"
                            >
                                {tiposDisponiblesFiltrados.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        ✨ {tipo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-bold text-yellow-500 uppercase flex items-center gap-1">
                                <RiFlashlightLine /> Meta Ulti
                            </label>
                            <select
                                value={formData.tipoUlti}
                                onChange={(e) => setFormData({ ...formData, tipoUlti: e.target.value as TipoHabilidadIA })}
                                className="w-full bg-[#111111] border border-white/10 p-2.5 rounded-xl text-xs font-medium text-white outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer transition-all"
                            >
                                <option value="Daño">💥 Daño Directo</option>
                                <option value="Curación">🩸 Curación</option>
                                <option value="Efecto de Estado">🧪 Estado Alterado</option>
                                <option value="Buff/Debuff">⚡ Potenciador</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-bold text-yellow-500 uppercase flex items-center gap-1">
                                <RiShieldLine /> Meta Def.
                            </label>
                            <select
                                value={formData.tipoDefensiva}
                                onChange={(e) => setFormData({ ...formData, tipoDefensiva: e.target.value as TipoHabilidadIA })}
                                className="w-full bg-[#111111] border border-white/10 p-2.5 rounded-xl text-xs font-medium text-white outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer transition-all"
                            >
                                <option value="Escudo">🛡️ Escudo</option>
                                <option value="Curación">🩹 Auto-Curación</option>
                                <option value="Buff/Debuff">❄️ Mitigar Daño</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* Input Para la Imagen */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL de la Imagen</label>
                    <div className="relative">
                        <RiImageAddLine className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" />
                        <input
                            type="text"
                            placeholder="https://nombre.jpn"
                            value={formData.img}
                            onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                            className="bg-white/5 border border-white/10 pl-10 p-3 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all italic w-full"
                        />
                    </div>
                </div>

                {/* Input para la Descripcion */}
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descripción</label>
                    <textarea
                        rows={2}
                        placeholder="Haz una pequeña descripcion de tu personaje..."
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
                    />
                </div>

                {/* Botón de Acción Dinámico */}
                <button
                    type="submit"
                    disabled={tieneEstadisticasIlegales}
                    className={`md:col-span-2 mt-4 font-black py-4 rounded-2xl transition-all uppercase italic tracking-tighter text-center select-none ${
                        tieneEstadisticasIlegales
                            ? "bg-red-950/40 border border-red-600/40 text-red-500 cursor-not-allowed opacity-70"
                            : "bg-yellow-600/10 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:bg-yellow-500 text-yellow-400 hover:text-black border border-yellow-500/30 cursor-pointer"
                    }`}
                >
                    {tieneEstadisticasIlegales ? "Límites Excedidos - No se puede crear" : "Registrar Carta"}
                </button>
            </form>
        </div>
    );
};

export default FormularioCarta;