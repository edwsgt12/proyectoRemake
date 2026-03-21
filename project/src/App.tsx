import { useState, useEffect } from 'react'
import './App.css'
import type { Carta, IApiCard } from './assets/types/types'
import FormularioCarta from './components/crearCarta'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import { cartasDefault } from './components/cartas'
import { toApiCardMaper, toCardApiMaper } from './assets/types/types'

const API_URL = import.meta.env.VITE_CARTAS;

function App() {
  const [cartas,setCartas] =useState< Carta[]>(cartasDefault)

  const onCrear =(carta:Carta)=>{
    setCartas([...cartas,carta])
  }

  const [loading, setLoading] = useState(false);

  const fetchCartas = async () => {
      setLoading(true);
        try {
            const res = await fetch(`${API_URL}/card`, { headers: {
              usersecretpasskey : "Edwa735923IA"
            }});
            console.log ("res", res);
            const data = await res.json() as {data:IApiCard[]};
            console.log(data);

            const CartaFromApi:IApiCard[] = data.data;
            const CartasMaper:Carta[] = CartaFromApi.map(toCardApiMaper);
            console.log(CartasMaper); 
            setCartas(CartasMaper);

        } catch (e) {
            console.error("Error fetching cartas", e);
        } finally {
            setLoading(false);
        }   
    };
        useEffect(() =>  {
        fetchCartas();
    }, []);

        const addCarta = async (carta:Carta) => {
        try {
            await fetch(`${API_URL}/card` , {
                method: "POST",
                headers: {"Content-Type": "application/json",
                usersecretpasskey : "Edwa735923IA"
                },
                body: JSON.stringify( toApiCardMaper(carta) ),
        });
            fetchCartas();
        } catch (e) {
            console.error("Error adding task", e);
        }
        };
  return (
<div className='min-h-screen bg-gradient-to-br from-gray-800 to-black py-8 px-20'>
      <Routes>
        <Route path='/' element={ <Home cartas={cartas} /> } />
        <Route path='/crearCarta' element={ <FormularioCarta onCrear={addCarta} cantidadCartas={cartas.length} /> } />
      </Routes>
</ div>
      )
}

export default App