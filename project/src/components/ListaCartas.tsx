import type { Carta } from "../assets/types/types";
import Cartainicial from "./CartaInicial";
import { useState } from "react";
import Modal from "./Modal"; 
import { FaPlus } from "react-icons/fa";

const ListaCartas =({cartas, toggleMostrarFormulario}: {cartas: Carta[], toggleMostrarFormulario: () => void}) => {
    
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

  return (
    <div className="px-25">
      <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold text-center mb-10 text-yellow-400">
        CARTAS DE PERSONAJES
      </h1>

  <div className=" flex items-center gap-x-4">    

    <button onClick={toggleMostrarFormulario} 
    className="rounded-lg bg-yellow-500 text-black text-2x font-bold w-10 h-10 flex items-center justify-center shadow-2xl hover:scale-130 transition-transform cursor-pointer relative overflow-hidden"> <FaPlus/> </button>
    

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar personaje..."
        className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      /></div>
      
      </div>
      
      <div className="flex flex-wrap justify-between gap-8">
        {cartas.filter((carta) => carta.name.toLowerCase().includes(busqueda.toLowerCase())).map((carta) => (
          <Cartainicial
            key={carta.id}
            {...carta}
            onClick={() => abrirModal(carta)}
          />
        ))}
      </div>

      {modalAbierto && cartaSeleccionada && (
        <Modal
          carta={cartaSeleccionada}
          onClose={cerrarModal}
        />
      )}
    </div>
  )
}

export default ListaCartas;