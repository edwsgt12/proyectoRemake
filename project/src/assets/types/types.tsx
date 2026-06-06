export interface Habilidad {
    nombre: string;
    efecto: 'ataque_especial' | 'escudo' | 'curacion';
    valor: number; // Porcentaje o daño fijo (ej: 30 para curar 30% de vida, o 5000 para daño extra)
}

export interface Carta {
    id: number;
    name: string;
    ataque: number;
    defensa: number;
    img: string;
    descripcion: string;
    vida: number;
    tipo?: string;
    habilidad?: Habilidad;          // 👈 Tu propiedad original intacta
    habilidadOfensiva?: Habilidad; // 👈 Slot ofensivo añadido
    habilidadDefensiva?: Habilidad; // 👈 Slot defensivo añadido
    onClick?: () => void;
}

export interface IApiCard {
    "idCard": string;
    "name": string;
    "description": string;
    "attack": number;
    "defense": number;
    "lifePoints": number;
    "pictureUrl": string;
    "attributes": {
        tipo?: string;
        habilidad?: Habilidad;          // 👈 Tu propiedad original intacta
        habilidadOfensiva?: Habilidad; // 👈 Añadido
        habilidadDefensiva?: Habilidad; // 👈 Añadido
    };
    "userSecret": string;
    "createdAt": string;
    "updatedAt": null | string;
}

export const toApiCardMaper = (carta: Carta) => {
    return {
        name: carta.name,
        description: carta.descripcion,
        attack: Number(carta.ataque),
        defense: Number(carta.defensa),
        lifePoints: Number(carta.vida),
        pictureUrl: carta.img || "https://nombre.jpn",
        attributes: {
            tipo: carta.tipo,
            habilidad: carta.habilidad, 
            habilidadOfensiva: carta.habilidadOfensiva,
            habilidadDefensiva: carta.habilidadDefensiva
        }
    };
};

export const toCardApiMaper = (apicard: IApiCard): Carta => {
    // 1. Replicamos tu lógica original exacta para definir la habilidad base
    const habilidadPorDefecto: Habilidad = apicard.attack > apicard.defense 
        ? { nombre: "Impacto Crítico", efecto: "ataque_especial", valor: 1.5 }
        : { nombre: "Barrera Absoluta", efecto: "escudo", valor: 2 }; 

    const habBase = apicard.attributes?.habilidad || habilidadPorDefecto;

    // 2. Fallbacks inteligentes para rellenar las dos habilidades si no vienen explícitas
    const ofenPorDefecto: Habilidad = { nombre: "Ráfaga Ígnea", efecto: "ataque_especial", valor: 1.5 };
    const defPorDefecto: Habilidad = apicard.defense >= apicard.attack / 2
        ? { nombre: "Muralla de Energía", efecto: "escudo", valor: 2 }
        : { nombre: "Inyección de Vida", efecto: "curacion", valor: 25 };

    // 3. Distribución: si la base es ofensiva se asigna al slot de ataque, si no, al defensivo
    const ofensivaFinal = apicard.attributes?.habilidadOfensiva || (habBase.efecto === 'ataque_especial' ? habBase : ofenPorDefecto);
    const defensivaFinal = apicard.attributes?.habilidadDefensiva || (habBase.efecto !== 'ataque_especial' ? habBase : defPorDefecto);

    return {
        id: parseInt(apicard.idCard),
        name: apicard.name,
        descripcion: apicard.description,
        ataque: apicard.attack,
        defensa: apicard.defense,
        vida: apicard.lifePoints,
        img: apicard.pictureUrl || "https://nombre.jpn",
        tipo: apicard.attributes?.tipo,
        habilidad: habBase, // 👈 Sigue existiendo sin problemas
        habilidadOfensiva: ofensivaFinal,
        habilidadDefensiva: defensivaFinal
    };
};

export interface EditarCartaProps {
    onGuardar: (carta: Carta) => Promise<{ success: boolean; error?: any }>;
    loading?: boolean;
    cartas: Carta[];
}