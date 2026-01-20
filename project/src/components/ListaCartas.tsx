import type { Carta } from "../assets/types/types";
import Cartainicial from "./CartaInicial";
import { useState } from "react";
import Modal from "./Modal"; 

const ListaCartas =({cartas}: {cartas: Carta[]}) => {
    
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
    <div className="">
      <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold text-center mb-10 text-yellow-400">
        CARTAS DE PERSONAJES
      </h1>
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar personaje..."
        className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      </div>
      
      <div className="flex flex-wrap justify-center gap-8">
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