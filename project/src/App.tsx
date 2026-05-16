import { useState, useEffect } from 'react'
import './App.css'
import type { Carta, IApiCard } from './assets/types/types'
import FormularioCarta from './components/crearCarta'
import EditarCarta from './components/actualizarCarta'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import { toApiCardMaper, toCardApiMaper } from './assets/types/types'
import SeleccionarCartas from './components/SeleccionarCarta'

const API_URL = import.meta.env.VITE_CARTAS;

function App() {
  const [cartas, setCartas] = useState<Carta[]>([])
  const [loading, setLoading] = useState(false);

  const fetchCartas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/card`, {
        headers: {
          usersecretpasskey: "Edwa735923IA"
        }
      });
      const data = await res.json() as { data: IApiCard[] };
      
      const CartaFromApi: IApiCard[] = data.data;
      const CartasMaper: Carta[] = CartaFromApi.map(toCardApiMaper);
      setCartas(CartasMaper);

    } catch (e) {
      console.error("Error fetching cartas", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartas();
  }, []);

  const addCarta = async (carta: Carta) => {
    try {
      await fetch(`${API_URL}/card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usersecretpasskey: "Edwa735923IA"
        },
        body: JSON.stringify(toApiCardMaper(carta)),
      });
      fetchCartas();
    } catch (e) {
      console.error("Error adding card", e);
    }
  };

  const updateCarta = async (carta: Carta) => {
    try {
      const response = await fetch(`${API_URL}/card/${carta.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          usersecretpasskey: "Edwa735923IA"
        },
        body: JSON.stringify(toApiCardMaper(carta)),
      });

      if (response.ok) {
        await fetchCartas(); // Refrescamos la lista global
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      console.error("Error updating card", e);
      return { success: false };
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-800 to-black py-8 px-20'>
      <Routes>
        <Route 
          path='/' 
          element={<Home cartas={cartas} setCartas={setCartas} fetchCartas={fetchCartas} />} 
        />
        
        <Route 
          path='/crearCarta' 
          element={<FormularioCarta onCrear={addCarta} cantidadCartas={cartas.length} />} 
        />
        
        <Route 
          path='/editar/:id' 
          element={<EditarCarta cartas={cartas} onGuardar={updateCarta} loading={loading} />} 
        />

        <Route
        path='/seleccionar-cartas'
        element={<SeleccionarCartas mazo={cartas} loading={loading} />}
        />
      </Routes>
    </div>
  )
}

export default App