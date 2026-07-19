import type { TipoCarta, GrupoCarta, TipoHabilidadIA, UltiAtaque } from './atributosCartas';

export interface Habilidad {
    nombre: string;
    efecto: 'ataque_especial' | 'escudo' | 'curacion';
    valor: number; // Porcentaje o daño fijo
}


export interface Carta {
    id: number;
    name: string;
    ataque: number;
    defensa: number;
    nivel: number;
    img: string;
    descripcion: string;
    vida: number;
    grupo: GrupoCarta;
    tipo: TipoCarta;          
    tipoUlti: TipoHabilidadIA;     
    tipoDefensiva: TipoHabilidadIA;
    
    // Almacena la estructura teórica/identificador de la Ulti única elegida
    ultiSeleccionada?: UltiAtaque;

    habilidad?: Habilidad;          
    habilidadOfensiva?: Habilidad;  
    habilidadDefensiva?: Habilidad; 
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
        grupo?: GrupoCarta;
        tipo: TipoCarta;
        nivel: number;
        tipoUlti: TipoHabilidadIA;
        tipoDefensiva: TipoHabilidadIA;
        ultiSeleccionada?: UltiAtaque; // Persistencia de la ulti en base de datos
        habilidad?: Habilidad;          
        habilidadOfensiva?: Habilidad; 
        habilidadDefensiva?: Habilidad; 
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
            grupo: carta.grupo,
            tipo: carta.tipo,
            nivel: carta.nivel,
            tipoUlti: carta.tipoUlti,
            tipoDefensiva: carta.tipoDefensiva,
            ultiSeleccionada: carta.ultiSeleccionada, // Mapea la ulti hacia el payload
            habilidad: carta.habilidad, 
            habilidadOfensiva: carta.habilidadOfensiva,
            habilidadDefensiva: carta.habilidadDefensiva
        }
    };
};

export const toCardApiMaper = (apicard: IApiCard): Carta => {
    const habilidadPorDefecto: Habilidad = apicard.attack > apicard.defense 
        ? { nombre: "Impacto Crítico", efecto: "ataque_especial", valor: 1.5 }
        : { nombre: "Barrera Absoluta", efecto: "escudo", valor: 2 }; 

    const habBase = apicard.attributes?.habilidad || habilidadPorDefecto;

    const ofenPorDefecto: Habilidad = { nombre: "Ráfaga Ígnea", efecto: "ataque_especial", valor: 1.5 };
    const defPorDefecto: Habilidad = apicard.defense >= apicard.attack / 2
        ? { nombre: "Muralla de Energía", efecto: "escudo", valor: 2 }
        : { nombre: "Inyección de Vida", efecto: "curacion", valor: 25 };

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
        nivel: apicard.attributes?.nivel || 1,
        grupo: apicard.attributes?.grupo || 'Cónclave Arcano', 
        tipo: apicard.attributes?.tipo || 'Hechicero',
        tipoUlti: apicard.attributes?.tipoUlti || 'Daño',
        tipoDefensiva: apicard.attributes?.tipoDefensiva || 'Escudo',
        
        // Recupera la ulti de los atributos guardados en la API
        ultiSeleccionada: apicard.attributes?.ultiSeleccionada,

        habilidad: habBase, 
        habilidadOfensiva: ofensivaFinal,
        habilidadDefensiva: defensivaFinal
    };
};

export interface EditarCartaProps {
    onGuardar: (carta: Carta) => Promise<{ success: boolean; error?: any }>;
    loading?: boolean;
    cartas: Carta[];
}