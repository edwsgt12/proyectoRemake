import type { Carta } from "../assets/types/types"
import ListaCartas from "../components/ListaCartas"

   const Home = ({cartas, setCartas, fetchCartas}:{ cartas:Carta[], setCartas: React.Dispatch<React.SetStateAction<Carta[]>>, fetchCartas: () => Promise<void>})=> {
      
   return (

  <ListaCartas cartas={cartas} setCartas={setCartas} fetchCartas={fetchCartas} />
)
   }
   
   export default Home