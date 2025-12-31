import { useState } from 'react'
import './App.css'
import DiseñoCarta from './components/detallesCarta'

function App() {
  return (

  < DiseñoCarta
  nombre="Deku"
  numero={100}
  imagen=""
  tipo="Heroe"
  ataque={1000}
  defensa={2000}
  />
  )
}
export default App
