import type { Carta } from '../assets/types/types';

interface AplicarUltiParams {
    tipoUlti: string;    
    nombreUlti: string;    
    atacante: Carta;
    defensor: Carta;
    vidaAtacante: number;
    vidaDefensor: number;
    setVidaAtacante: React.Dispatch<React.SetStateAction<number>>;
    setVidaDefensor: React.Dispatch<React.SetStateAction<number>>;
    setLogs: React.Dispatch<React.SetStateAction<string[]>>;
    setGanador: React.Dispatch<React.SetStateAction<Carta | null>>;
}

export const aplicarEfectoUlti = ({
    tipoUlti,
    nombreUlti,
    atacante,
    setVidaAtacante,
    vidaDefensor,
    setVidaDefensor,
    setLogs,
    setGanador
}: AplicarUltiParams): boolean => {
    const metaUlti = tipoUlti?.toLowerCase() || 'daño';
    const nombreHabilidad = nombreUlti || 'Habilidad Suprema';

    if (metaUlti === 'curacion' || metaUlti === 'curación') {
        const saludRecuperada = Math.floor(atacante.vida * 0.35);
        setVidaAtacante((v) => Math.min(atacante.vida, v + saludRecuperada));
        setLogs((prev) => [...prev, `✨ ¡${atacante.name} activa su Ulti [${nombreHabilidad}] y recupera ${saludRecuperada.toLocaleString()} HP!`]);
        return false; 
    } 
    
    if (metaUlti === 'daño' || metaUlti === 'destruccion' || metaUlti === 'daño especial' || metaUlti === 'destrucción') {
        const danoEspecial = Math.floor(atacante.ataque * 1.8);
        const nuevaVida = Math.max(0, vidaDefensor - danoEspecial);
        setVidaDefensor(nuevaVida);
        
        setLogs((prev) => [...prev, `🔥 ¡${atacante.name} desata su ULTI [${nombreHabilidad}] e inflige ${danoEspecial.toLocaleString()} de daño absoluto!`]);

        if (nuevaVida <= 0) {
            setGanador(atacante);
            setLogs((prev) => [...prev, `🏆 ¡${atacante.name.toUpperCase()} HA DESTRUIDO A SU RIVAL CON [${nombreHabilidad.toUpperCase()}]!`]);
            return true; 
        }
        return false;
    }

    // Caso por defecto si no coincide el tipo
    setLogs((prev) => [...prev, `⚡ ${atacante.name} usó [${nombreHabilidad}], pero el tipo de efecto no está configurado.`]);
    return false;
};