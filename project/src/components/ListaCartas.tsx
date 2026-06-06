import type { Carta } from "../assets/types/types";
import Cartainicial from "./CartaInicial";
import { useState } from "react";
import Modal from "./Modal"; 
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router";

const API_URL = import.meta.env.VITE_CARTAS;

// ⚔️ Definimos la interfaz completa de Props para que TypeScript no tire error en Home.tsx
interface ListaCartasProps {
  cartas: Carta[];
  setCartas: React.Dispatch<React.SetStateAction<Carta[]>>;
  fetchCartas: () => Promise<void>;
  cartasSeleccionadas: Carta[]; // 👈 Agregado
  seleccionarCartaParaBatalla: (carta: Carta) => void; // 👈 Agregado
}

const ListaCartas = ({
  cartas,
  fetchCartas,
  cartasSeleccionadas, 
  seleccionarCartaParaBatalla // 👈 Desestructurado aquí
}: ListaCartasProps) => {
    
  const [busqueda, setBusqueda] = useState('')
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  const abrirModal = (carta: Carta) => {
    console.log("Aqui ")  
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
      console.error("Error adding task", e);
    }
  };

  return (
    <div className="px-25">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-center mb-10 text-yellow-400">
          CARTAS DE PERSONAJES
        </h1>

        <div className="flex items-center gap-x-4">    
          <Link to={"/crearCarta"}>
            <button 
              className="rounded-lg bg-yellow-500 text-black text-2x font-bold w-10 h-10 flex items-center justify-center shadow-2xl hover:scale-130 transition-transform cursor-pointer relative overflow-hidden"
            > 
              <FaPlus/> 
            </button>
          </Link>
          
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar personaje..."
            className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap justify-between gap-8">
        {cartas
          .filter((carta) => carta.name.toLowerCase().includes(busqueda.toLowerCase()))
          .map((carta) => (
            <Cartainicial
              key={carta.id}
              carta={carta}
              onClick={() => {
                abrirModal(carta)
              }}
              onDelete={BorrarCarta}
            />
          ))}
      </div>

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