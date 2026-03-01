import type { Carta } from "../assets/types/types"
import ListaCartas from "../components/ListaCartas"

   const Home = ({cartas}:{ cartas:Carta[]})=> { return (

  <ListaCartas cartas={cartas} />
)
   }
   
   export default Home