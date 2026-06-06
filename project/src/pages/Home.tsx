import type { Carta } from "../assets/types/types"
import ListaCartas from "../components/ListaCartas"

interface HomeProps {
  cartas: Carta[];
  setCartas: React.Dispatch<React.SetStateAction<Carta[]>>;
  fetchCartas: () => Promise<void>;
  cartasSeleccionadas: Carta[]; 
  seleccionarCartaParaBatalla: (carta: Carta) => void; 
}

const Home = ({
  cartas,
  setCartas,
  fetchCartas,
  cartasSeleccionadas,
  seleccionarCartaParaBatalla
}: HomeProps) => {
  return (
    <ListaCartas 
      cartas={cartas} 
      setCartas={setCartas} 
      fetchCartas={fetchCartas} 
      cartasSeleccionadas={cartasSeleccionadas} 
      seleccionarCartaParaBatalla={seleccionarCartaParaBatalla} 
    />
  )
}

export default Home