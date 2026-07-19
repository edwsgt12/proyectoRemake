import { useState } from "react";
import { RiImageAddLine, RiMagicLine, RiFlashlightLine, RiShieldLine, RiTeamLine } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router";

// Importamos los tipos y diccionarios desde el archivo centralizado
import type { Carta } from "../assets/types/types";
import { 
    MAPA_TIPO_A_GRUPO, 
    type TipoCarta, 
    type TipoHabilidadIA,
    type GrupoCarta
} from "../assets/types/atributosCartas";

interface FormularioCartaProps {
    onCrear: (carta: Carta) => void;
    cantidadCartas: number;
}

interface UltiAtaque {
    id: string;
    nombre: string;
    descripcion: string;
    mecanica: string;
}

// === TU DICCIONARIO REAL DE ULTIS ===
export const DICCIONARIO_ULTIS_POR_FAMILIA: Record<GrupoCarta, UltiAtaque[]> = {
  "Cónclave Arcano": [
    { id: "tormenta_mana", nombre: "Tormenta de Maná", descripcion: "Daño masivo del 300%, pero reduce tu defensa un 20% el próximo turno.", mecanica: "EXPLOSIVO_RIESGO" },
    { id: "sentencia_nova", nombre: "Sentencia de Nova", descripcion: "Daño del 150% que se duplica si al rival le queda menos del 25% de vida.", mecanica: "EJECUCON" }
  ],
  "Sindicato Cyberpunk": [
    { id: "pulso_emp", nombre: "Pulso Electromagnético", descripcion: "Daño del 200% que ignora por completo los escudos del oponente.", mecanica: "PERFORANTE" },
    { id: "inyeccion_malware", nombre: "Inyección de Malware", descripcion: "Daño inicial del 120% que se duplica en cada turno del rival.", mecanica: "DOT_CRECIENTE" }
  ],
  "Orden del Filo": [
    { id: "corte_rompearmaz", nombre: "Corte Rompe-Armaduras", descripcion: "Daño del 210% y reduce la defensa del rival un 40% permanente.", mecanica: "DEBUFF_DEFENSA" },
    { id: "danza_hojas", nombre: "Danza de las Hojas", descripcion: "Lanza 3 golpes rápidos del 80% con probabilidad crítica individual.", mecanica: "MULTIGOLPE" }
  ],
  "Sombras del Yermo": [
    { id: "emboscada_toxica", nombre: "Emboscada Tóxica", descripcion: "Daño del 160% y aplica veneno que quita 8% de vida actual por 3 turnos.", mecanica: "VENENO" },
    { id: "disparo_conmocion", nombre: "Disparo de Conmoción", descripcion: "Daño del 180% con 30% de probabilidad de aturdir al oponente.", mecanica: "CONTROL_ATURDIR" }
  ],
  "Fuerzas Primordiales": [
    { id: "furia_tierra", nombre: "Furia de la Tierra", descripcion: "Daño equivalente al 100% de tu ataque más el 10% de tu Vida Máxima.", mecanica: "ESCALADO_VIDA" },
    { id: "golpe_espinas", nombre: "Golpe de Espinas", descripcion: "Daño del 185% que aumenta un 40% extra si tienes un escudo activo.", mecanica: "SI_TIENE_ESCUDO" }
  ]
};

const FAMILIAS_UNICAS = Array.from(new Set(Object.values(MAPA_TIPO_A_GRUPO))) as GrupoCarta[];

const MAPA_GRUPO_A_TIPOS = Object.entries(MAPA_TIPO_A_GRUPO).reduce((acc, [tipo, grupo]) => {
  if (!acc[grupo]) acc[grupo] = [];
  acc[grupo].push(tipo as TipoCarta);
  return acc;
}, {} as Record<string, TipoCarta[]>);

const LIMITES_POR_FAMILIA: Record<GrupoCarta, { maxAtaque: number; maxDefensa: number; maxVida: number }> = {
    "Cónclave Arcano":      { maxAtaque: 4000, maxDefensa: 1500, maxVida: 18000 },
    "Sindicato Cyberpunk":  { maxAtaque: 3500, maxDefensa: 2500, maxVida: 22000 },
    "Orden del Filo":       { maxAtaque: 3200, maxDefensa: 3500, maxVida: 28000 },
    "Sombras del Yermo":    { maxAtaque: 4500, maxDefensa: 1200, maxVida: 15000 },
    "Fuerzas Primordiales": { maxAtaque: 2000, maxDefensa: 4500, maxVida: 35000 },
};

const LIMITE_DEFECTO = { maxAtaque: 3000, maxDefensa: 3000, maxVida: 25000 };

const FormularioCarta = ({ onCrear, cantidadCartas }: FormularioCartaProps) => {
    const familiaPorDefecto = FAMILIAS_UNICAS[0];
    const tiposPorDefecto = MAPA_GRUPO_A_TIPOS[familiaPorDefecto] || [];

    const estadoInicial = {
        name: "",
        ataque: 0,
        nivel: 1,
        defensa: 0,
        vida: 1000,
        img: "",
        descripcion: '',
        tipo: tiposPorDefecto[0] || "Hechicero" as TipoCarta,
        tipoUlti: "Daño" as TipoHabilidadIA,
        tipoDefensiva: "Escudo" as TipoHabilidadIA,
    };

    const [formData, setFormData] = useState(estadoInicial);
    const [familiaSeleccionada, setFamiliaSeleccionada] = useState<GrupoCarta>(familiaPorDefecto);
    
    // Guardamos el índice actual localmente para el selector
    const [indiceUlti, setIndiceUlti] = useState<number>(0);

    const limitesActuales = LIMITES_POR_FAMILIA[familiaSeleccionada] || LIMITE_DEFECTO;

    const excedeAtaque = formData.ataque > limitesActuales.maxAtaque;
    const excedeDefensa = formData.defensa > limitesActuales.maxDefensa;
    const excedeVida = formData.vida > limitesActuales.maxVida;
    const tieneEstadisticasIlegales = excedeAtaque || excedeDefensa || excedeVida;

    // Obtener las ultis dinámicamente de la familia seleccionada
    const ultisDisponibles = DICCIONARIO_ULTIS_POR_FAMILIA[familiaSeleccionada] || [];

    const handleFamiliaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nuevaFamilia = e.target.value as GrupoCarta;
        setFamiliaSeleccionada(nuevaFamilia);
        setIndiceUlti(0); // Regresa a la primera ulti de la nueva familia

        const tiposFiltrados = MAPA_GRUPO_A_TIPOS[nuevaFamilia] || [];
        setFormData(prev => ({
            ...prev,
            tipo: tiposFiltrados[0] || prev.tipo
        }));
    };

    const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nuevoTipo = e.target.value as TipoCarta;
        const nuevaFamiliaCorrespondiente = MAPA_TIPO_A_GRUPO[nuevoTipo] as GrupoCarta;

        setFormData(prev => ({ ...prev, tipo: nuevoTipo }));

        if (nuevaFamiliaCorrespondiente && nuevaFamiliaCorrespondiente !== familiaSeleccionada) {
            setFamiliaSeleccionada(nuevaFamiliaCorrespondiente);
            setIndiceUlti(0);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tieneEstadisticasIlegales) return;

        const grupoAsignado = (MAPA_TIPO_A_GRUPO[formData.tipo] || familiaSeleccionada) as GrupoCarta;
        const ultisDeFamiliaReal = DICCIONARIO_ULTIS_POR_FAMILIA[grupoAsignado] || ultisDisponibles;
        
        // Asignamos el objeto UltiAtaque completo correspondiente
        const ultiAsignada = ultisDeFamiliaReal[indiceUlti] || ultisDeFamiliaReal[0];

        onCrear({ 
            ...formData, 
            id: cantidadCartas + 1,
            grupo: grupoAsignado,
            nivel: 1,
            ultiSeleccionada: ultiAsignada // Pasa el objeto completo de tu diccionario
        } as Carta);
        
        setFormData(estadoInicial);
        setIndiceUlti(0);
        setFamiliaSeleccionada(familiaPorDefecto);
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

            {/* BARRA DE TOPES DINÁMICA POR FAMILIA */}
            <p className="text-center text-[10px] text-slate-400 mb-6 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50 uppercase tracking-wider">
                TOPES {familiaSeleccionada}: <span className="text-red-400 font-bold">⚔️ {limitesActuales.maxAtaque}</span> | <span className="text-blue-400 font-bold">🛡️ {limitesActuales.maxDefensa}</span> | <span className="text-green-400 font-bold">❤️ {limitesActuales.maxVida}</span>
            </p>

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

                {/* Selector de Familia / Facción */}
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
                            Máx: {limitesActuales.maxAtaque}
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
                            Máx: {limitesActuales.maxDefensa}
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
                            Máx: {limitesActuales.maxVida}
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

                {/* === CONFIGURACIÓN ATRIBUTOS INTERNOS === */}
                <div className="space-y-4 md:col-span-2 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-bold text-yellow-500 uppercase flex items-center gap-1">
                                <RiMagicLine /> Tipo
                            </label>
                            <select
                                value={formData.tipo}
                                onChange={handleTipoChange}
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

                {/* === DROP DOWN CON TUS DOS ULTIS REALES Y SUS DESCRIPCIONES === */}
                <div className="flex flex-col gap-2 md:col-span-2 bg-purple-950/10 border border-purple-500/20 p-4 rounded-xl">
                    <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                        💥 Habilidad Suprema de la Facción
                    </label>
                    <select
                        value={indiceUlti}
                        onChange={(e) => setIndiceUlti(Number(e.target.value))}
                        className="w-full bg-black/40 border border-purple-500/20 p-3 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all"
                    >
                        {ultisDisponibles.map((ulti, index) => (
                            <option key={ulti.id} value={index} className="bg-[#111]">
                                🔥 {ulti.nombre} — [{ulti.mecanica}]
                            </option>
                        ))}
                    </select>
                    {/* Bloque descriptivo de la Ulti seleccionada abajo del selector */}
                    {ultisDisponibles[indiceUlti] && (
                        <p className="mt-1.5 text-xs text-purple-300/80 px-1 italic">
                            {ultisDisponibles[indiceUlti].descripcion}
                        </p>
                    )}
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

                {/* Botón de Acción */}
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