import { useState } from 'react'
import './App.css'
import CartaInicial from './components/CartaInicial'

function App() {
  return (

  <>
  <CartaInicial
  id={1}
  name= "messi"
  ataque={9000}
  defensa={9000}
  img= "https://s.france24.com/media/display/451ed2b8-eed6-11ea-afdd-005056bf87d6/w:1280/p:16x9/messi-1805.jpg"
  />
  </>
  )
}
export default App
