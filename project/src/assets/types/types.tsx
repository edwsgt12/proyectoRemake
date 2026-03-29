export interface Carta {
id: number;
name: string;
ataque: number;
defensa: number;
img: string;
descripcion: string;
vida: number;
tipo?: string;
onClick?: () => void;
};

export interface IApiCard {
"idCard": string,
"name": string,
"description": string,
"attack": number,
"defense": number,
"lifePoints": number,
"pictureUrl": string,
"attributes": {tipo?:string;},
"userSecret": string,
"createdAt": "2023-01-01T00:00:00.000Z",
"updatedAt": null | string;
}

export const toApiCardMaper = (carta:Carta) => {
    return {
        name:carta.name,
        description: carta.descripcion,
        attack: Number(carta.ataque),
        defense:Number(carta.defensa),
        lifePoints:Number(carta.vida),
        pictureUrl:carta.img || "https://nombre.jpn",
        attributes: {tipo:carta.tipo}
    }
}

export const toCardApiMaper = (apicard:IApiCard):Carta => ({
        id:parseInt(apicard.idCard),
        name:apicard.name,
        descripcion: apicard.description,
        ataque: apicard.attack,
        defensa:apicard.defense,
        vida:apicard.lifePoints,
        img:apicard.pictureUrl || "https://nombre.jpn",
        tipo: apicard.attributes?.tipo
})

export interface EditarCartaProps {
    onGuardar: (carta: Carta)=> Promise<{success:boolean;error?:any}>;
    loading?:boolean;
    cartas: Carta[]
}
