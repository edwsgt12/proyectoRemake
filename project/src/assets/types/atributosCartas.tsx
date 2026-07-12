import type { Carta } from './types';

// ==========================================
// 1. DEFINICIÓN DE TIPOS OFICIALES
// ==========================================
export type TipoHabilidadIA = 'Daño' | 'Curación' | 'Efecto de Estado' | 'Escudo' | 'Buff/Debuff';

export type GrupoCarta = 'Cónclave Arcano' | 'Sindicato Cyberpunk' | 'Orden del Filo' | 'Sombras del Yermo' | 'Fuerzas Primordiales';

export type TipoCarta = 
  | 'Hechicero' | 'Piromante' | 'Cíborg Ígneo' | 'Ceniza Volcánica' | 'Vanguardia Forjada' 
  | 'Tecno-Alquimista' | 'Escoria de Neon' | 'Núcleo Fugitivo' | 'Hacker de Plasma' | 'Chatarrero del Yermo' 
  | 'Guerrero de la Luz' | 'Caballero de la Tormenta' | 'Arquero Fantasma' | 'Asesino de Sombras' | 'Mago del Tiempo' 
  | 'Druida de la Naturaleza' | 'Bárbaro del Norte' | 'Monje del Viento' | 'Nigromante Oscuro' | 'Invocador de Espíritus' 
  | 'Alquimista Arcano' | 'Cazador de Bestias' | 'Samurái Errante' | 'Pirata del Abismo' | 'Explorador Estelar' 
  | 'Señor de los Elementos' | 'Bandido anti magia';

// ==========================================
// 2. MAPAS Y DICCIONARIOS DE FACCIONES
// ==========================================
export const MAPA_TIPO_A_GRUPO: Record<TipoCarta, GrupoCarta> = {
  // 1. Cónclave Arcano
  'Hechicero': 'Cónclave Arcano', 'Piromante': 'Cónclave Arcano', 'Mago del Tiempo': 'Cónclave Arcano',
  'Druida de la Naturaleza': 'Cónclave Arcano', 'Nigromante Oscuro': 'Cónclave Arcano', 
  'Invocador de Espíritus': 'Cónclave Arcano', 'Alquimista Arcano': 'Cónclave Arcano', 'Señor de los Elementos': 'Cónclave Arcano',
  
  // 2. Sindicato Cyberpunk
  'Cíborg Ígneo': 'Sindicato Cyberpunk', 'Tecno-Alquimista': 'Sindicato Cyberpunk', 'Escoria de Neon': 'Sindicato Cyberpunk',
  'Núcleo Fugitivo': 'Sindicato Cyberpunk', 'Hacker de Plasma': 'Sindicato Cyberpunk', 'Chatarrero del Yermo': 'Sindicato Cyberpunk', 
  'Explorador Estelar': 'Sindicato Cyberpunk',
  
  // 3. Orden del Filo
  'Vanguardia Forjada': 'Orden del Filo', 'Caballero de la Tormenta': 'Orden del Filo', 'Bárbaro del Norte': 'Orden del Filo',
  'Monje del Viento': 'Orden del Filo', 'Samurái Errante': 'Orden del Filo',
  
  // 4. Sombras del Yermo
  'Arquero Fantasma': 'Sombras del Yermo', 'Asesino de Sombras': 'Sombras del Yermo', 'Cazador de Bestias': 'Sombras del Yermo',
  'Pirata del Abismo': 'Sombras del Yermo', 'Bandido anti magia': 'Sombras del Yermo',
  
  // 5. Fuerzas Primordiales
  'Ceniza Volcánica': 'Fuerzas Primordiales', 'Guerrero de la Luz': 'Fuerzas Primordiales'
};

// Array auxiliar dinámico para renderizar selects en tus formularios
export const OPCIONES_TIPO_CARTA: TipoCarta[] = Object.keys(MAPA_TIPO_A_GRUPO) as TipoCarta[];

// ==========================================
// 3. SISTEMA DE BALANCE Y ESCALADO DE NIVELES
// ==========================================
const TASAS_CRECIMIENTO: Record<GrupoCarta, { atk: number; def: number; hp: number }> = {
  'Cónclave Arcano':       { atk: 180, def: 60,  hp: 1600 },
  'Sindicato Cyberpunk':   { atk: 100, def: 180, hp: 1200 },
  'Orden del Filo':        { atk: 120, def: 120, hp: 1600 },
  'Sombras del Yermo':     { atk: 220, def: 60,  hp: 1200 },
  'Fuerzas Primordiales':  { atk: 140, def: 100, hp: 1600 }
};

/**
 * Calcula las estadísticas reales de una carta basadas en su rango/nivel.
 * Asume que las propiedades nativas del objeto corresponden al Nivel 1.
 */
export const calcularStatsPorNivel = (carta: Carta, nivelActual: number): Carta => {
  const nivelBase = carta.nivel || 1;
  
  if (nivelActual === nivelBase) return carta;

  const nivelesAumentados = nivelActual - nivelBase;
  const tasa = TASAS_CRECIMIENTO[carta.grupo];

  const atkAdicional = tasa ? tasa.atk * nivelesAumentados : 0;
  const defAdicional = tasa ? tasa.def * nivelesAumentados : 0;
  const hpAdicional = tasa ? tasa.hp * nivelesAumentados : 0;

  return {
    ...carta,
    nivel: nivelActual,
    ataque: carta.ataque + atkAdicional,
    defensa: carta.defensa + defAdicional,
    vida: carta.vida + hpAdicional
  };
};