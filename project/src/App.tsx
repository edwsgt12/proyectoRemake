import { useState, useEffect } from 'react'
import './App.css'
import type { Carta, IApiCard } from './assets/types/types'
import FormularioCarta from './components/crearCarta'
import EditarCarta from './components/actualizarCarta'
import { Route, Routes, useNavigate, useLocation } from 'react-router' // 👈 Agregamos useLocation
import Home from './pages/Home'
import CampoBatalla from './pages/CampoBatalla'
import { toApiCardMaper, toCardApiMaper } from './assets/types/types'
import SeleccionarCartas from './components/SeleccionarCarta'
import GenerarCartaIA from './components/generarCarta'

const API_URL = import.meta.env.VITE_CARTAS;

function App() {
  const [cartas, setCartas] = useState<Carta[]>([])
  const [loading, setLoading] = useState(false);
  
  const [cartasSeleccionadas, setCartasSeleccionadas] = useState<Carta[]>([]);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Inicializamos el hook para saber la ruta actual

  const seleccionarCartaParaBatalla = (carta: Carta) => {
    setCartasSeleccionadas((prev) => {
      if (prev.some((c) => c.id === carta.id)) {
        return prev.filter((c) => c.id !== carta.id);
      }
      if (prev.length >= 2) {
        alert("Ya has seleccionado 2 cartas para combatir.");
        return prev;
      }
      return [...prev, carta];
    });
  };

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
        await fetchCartas();
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      console.error("Error updating card", e);
      return { success: false };
    }
  };

  // ⚔️ Evaluamos si hay 2 cartas elegidas Y NO estamos en el campo de batalla
  const mostrarBotónBatalla = cartasSeleccionadas.length === 2 && location.pathname !== '/campo-batalla';

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-800 to-black py-8 px-20 relative'>
      
      {/* ⚔️ El botón flotante ahora se oculta de forma inteligente */}
      {mostrarBotónBatalla && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={() => navigate('/campo-batalla')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-8 py-4 rounded-full shadow-2xl transition duration-300 transform hover:scale-105 animate-bounce uppercase tracking-wider border-2 border-yellow-500 cursor-pointer"
          >
            ⚔️ Iniciar Batalla ⚔️
          </button>
        </div>
      )}

      <Routes>
        <Route 
          path='/' 
          element={
            <Home 
              cartas={cartas} 
              setCartas={setCartas} 
              fetchCartas={fetchCartas} 
              cartasSeleccionadas={cartasSeleccionadas}
              seleccionarCartaParaBatalla={seleccionarCartaParaBatalla}
            />
          } 
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
          path='/generar-carta-ia' 
          element={<GenerarCartaIA />} 
        />  

        <Route
          path='/seleccionar-cartas'
          element={<SeleccionarCartas mazo={cartas} loading={loading} />}
        />

        <Route 
          path='/campo-batalla'
          element={
            <CampoBatalla 
              cartas={cartasSeleccionadas} 
              setCartasSeleccionadas={setCartasSeleccionadas} 
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App