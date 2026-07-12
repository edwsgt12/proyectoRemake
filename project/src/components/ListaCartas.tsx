import { useState } from "react";
import { RiRobotLine, RiMagicLine, RiShieldLine, RiSwordLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router";
import type { Carta } from "../assets/types/types";
import Cartainicial from "./CartaInicial";
import Modal from "./Modal"; 

const API_URL = import.meta.env.VITE_CARTAS;

interface ListaCartasProps {
  cartas: Carta[];
  setCartas: React.Dispatch<React.SetStateAction<Carta[]>>;
  fetchCartas: () => Promise<void>;
  cartasSeleccionadas: Carta[]; 
  seleccionarCartaParaBatalla: (carta: Carta) => void; 
}

const ListaCartas = ({
  cartas,
  fetchCartas,
  cartasSeleccionadas, 
  seleccionarCartaParaBatalla 
}: ListaCartasProps) => {
    
  const [busqueda, setBusqueda] = useState('')
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  const abrirModal = (carta: Carta) => {
    setCartaSeleccionada(carta)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setCartaSeleccionada(null)
  }

  const BorrarCarta = async (id: number) => {
    try {
      await fetch(`${API_URL}/card/${id}`, {
        method: "DELETE",
        headers: { 
          usersecretpasskey: "Edwa735923IA"
        }
      });
      fetchCartas();
    } catch (e) {
      console.error("Error deleting card", e);
    }
  };

  return (
    <div className="px-6 md:px-25 py-8 bg-[#050505] min-h-screen text-gray-200 font-sans">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
          <span className="w-8 h-[2px] bg-yellow-400"></span>
          Cartas de <span className="text-yellow-400">Personajes</span>
        </h1>

        <div className="flex items-center gap-x-4 w-full md:w-auto justify-end">    
          {/* Botón Creador Manual */}
          <Link to={"/crearCarta"} title="Crear carta manualmente">
            <button 
              className="rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black w-11 h-11 flex items-center justify-center shadow-lg shadow-yellow-500/10 hover:scale-110 transition-all cursor-pointer border border-yellow-400/20"
            > 
              <FaPlus className="text-sm"/> 
            </button>
          </Link>
          
          {/* Botón Generador IA - ¡Ahora Naranja y con Robotcito! 🤖 */}
          <Link to={"/generar-carta-ia"} title="Generar carta con IA">
            <button 
              className="rounded-xl bg-amber-600 hover:bg-amber-500 text-[#0a0a0a] w-11 h-11 flex items-center justify-center shadow-lg shadow-amber-500/20 hover:scale-110 transition-all cursor-pointer border border-amber-500/30"
            > 
              <RiRobotLine className="text-xl font-bold"/> 
            </button>
          </Link>
          
          {/* Barra de Búsqueda */}
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar guerrero o tipo..."
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all min-w-[200px]"
          />
        </div>
      </div>
      
      {/* Grid de Renderizado de Cartas */}
      <div className="flex flex-wrap justify-center md:justify-start gap-8">
        {cartas
          .filter((carta) => 
            carta.name.toLowerCase().includes(busqueda.toLowerCase()) ||
            (carta.tipo && carta.tipo.toLowerCase().includes(busqueda.toLowerCase()))
          )
          .map((carta) => (
            <Cartainicial
              key={carta.id}
              carta={carta}
              onClick={() => abrirModal(carta)}
              onDelete={BorrarCarta}
            />
          ))}
      </div>

      {/* Control del Modal Detallado */}
      {modalAbierto && cartaSeleccionada && (
        <Modal
          carta={cartaSeleccionada}
          onClose={cerrarModal}
          seleccionarCartaParaBatalla={seleccionarCartaParaBatalla} 
          estaSeleccionada={cartasSeleccionadas.some((c) => c.id === cartaSeleccionada.id)} 
        />
      )}
    </div>
  )
}

export default ListaCartas;