import { useState } from 'react'
import './App.css'
import Cartainicial from './components/CartaInicial'
import Modal from './components/modal'
import type { Carta } from './assets/types/types'

const cartas: Carta[] = [
  {
    id: 1,
    name: "Deku",
    ataque: 9000,
    defensa: 9000,
    img: "https://cdn-images.dzcdn.net/images/cover/4cd75715723dddfd2afea089828def48/0x1900-000000-80-0-0.jpg",
    descripcion: "Izuku Midoriya, conocido como Deku, es el ejemplo perfecto de que el heroísmo nace del corazón y no de los privilegios. Aunque nació sin poderes, su determinación y su voluntad de ayudar a los demás lo convirtieron en el sucesor del héroe más grande. Es un joven analítico, valiente y con una bondad que no conoce límites."
  },
  {
    id: 2,
    name: "Thorffin",
    ataque: 8800,
    defensa: 8700,
    img: "https://wallpapers4screen.com/Uploads/8-3-2025/68757/thumb2-thorfinn-4k-knives-torufin-vinland-saga.jpg",
    descripcion: "Thorfinn es un joven cuya vida fue forjada por el frío y el acero. Tras la pérdida de su padre, se convirtió en un guerrero implacable, impulsado únicamente por el deseo de venganza. Con sus dagas dobles y una mirada llena de ira, representa la lucha feroz de quien no tiene nada que perder, pero que aún guarda en el fondo el eco de una paz perdida."
  },
  {
    id: 3,
    name: "Asta",
    ataque: 8500,
    defensa: 8200,
    img: "https://i.pinimg.com/736x/ab/d5/cc/abd5ccb9c69f868f3d79749ed31d1ebe.jpg",
    descripcion: "Asta es la prueba de que el destino no está escrito. En un mundo donde la magia lo es todo, él nació sin una gota de poder, pero convirtió esa carencia en su mayor arma. A base de un esfuerzo físico sobrehumano y una voluntad inquebrantable, obtuvo el poder de la Antimagia, demostrando que no importa de dónde vengas, sino qué tan fuerte estés dispuesto a luchar por tus sueños."
  },
  {
    id: 4,
    name: "Obito",
    ataque: 8700,
    defensa: 8400,
    img: "https://cdn-images.dzcdn.net/images/cover/b0d66624e4344ffcb5f7465f9ffd3293/0x1900-000000-80-0-0.jpg",
    descripcion: "Obito Uchiha, guiado por el odio de que su compañero de vida terminó con la vida de la persona mas amada para el, un vengador que oculta su identidad bajo máscaras, utiliza nombres ajenos y toma venganza a mano propia, con un poder inhumano"
  },
  {
    id: 5,
    name: "Killua",
    ataque: 9500,
    defensa: 9200,
    img: "https://preview.redd.it/sbr2c5t042161.png?width=1200&format=png&auto=webp&s=a5f30133d16b8df1ff5804b8118b371e91d29b0e",
    descripcion: "Transmutador de electricidad. Su técnica Godspeed le permite moverse a la velocidad del rayo y reaccionar de forma automática ante cualquier ataque enemigo."
  },
  {
    id: 6,
    name: "Obanai",
    ataque: 8900,
    defensa: 8800,
    img: "https://wallpapers4screen.com/Uploads/23-3-2025/70406/thumb2-obanai-iguro-4k-heterochromia-kimetsu-no-yaiba-sword.jpg",
    descripcion: "Maestro de la Respiración de la Serpiente. Utiliza una espada flamberge (ondulada) que serpentea y cambia de dirección de forma impredecible. Su estilo se basa en la flexibilidad extrema y ataques que se deslizan por aberturas imposibles. Cuenta con la ayuda de su serpiente, Kaburamaru, que actúa como sus ojos para predecir movimientos enemigos con precisión quirúrgica."
  },
  {
    id: 7,
    name: "Gojo",
    ataque: 9100,
    defensa: 8500,
    img: "https://www.pictorem.com/uploads/collection/C/CT6MGA1OBR/900_Tokyo-Revengers_pt2.jpg",
    descripcion: "Poseedor del Ilimitado y los Seis Ojos. Su habilidad pasiva, el Infinito, impide que cualquier ataque lo toque físicamente. Utiliza técnicas espaciales: Azul (atracción), Rojo (repulsión) y Púrpura (borrado de materia). Su expansión de dominio, Vacío Infinito, sobrecarga la mente del enemigo con información infinita, dejándolo totalmente paralizado."
  },
  {
    id: 8,
    name: "Levi Ackerman",
    ataque: 9200,
    defensa: 8000,
    img: "https://neuro-class.com/wp-content/uploads/2025/02/image-52-1024x691.png",
    descripcion: "El soldado más fuerte de la humanidad. Especialista en equipamiento de maniobras tridimensionales. Limpieza extrema incluída."
  },
  {
    id: 9,
    name: "Hisoka",
    ataque: 9500,
    defensa: 9200,
    img: "https://i.pinimg.com/736x/13/8d/44/138d44429525d7822f700f87862d345a.jpg",
    descripcion: "Especialista en Transmutación. Su habilidad principal es la Goma Bungee, que otorga a su aura las propiedades del caucho y del chicle para pegar, atraer o rebotar objetos y enemigos. También utiliza la Textura Engañosa para alterar la apariencia de superficies planas. En combate, destaca por su agilidad táctica y el uso de cartas de póker reforzadas con aura como proyectiles letales."
  },
  {
    id: 10,
    name: "Gust",
    ataque: 8900,
    defensa: 8800,
    img: "https://buffetcritico.wordpress.com/wp-content/uploads/2015/09/prototype_guts.png",
    descripcion: "Combatiente de fuerza sobrehumana especializado en el uso de la Matadragones, una espada colosal capaz de cortar entidades físicas y espirituales. Utiliza la Armadura de Berserker, que elimina los límites de dolor y miedo, forzando su cuerpo más allá del límite humano. Su arsenal incluye un brazo protésico con un cañón oculto, una ballesta de repetición y diversas bombas de pólvora."
  },
  {
    id: 11,
    name: "Yami Sukehiro",
    ataque: 9100,
    defensa: 8500,
    img: "https://posterwa.com/cdn/shop/files/BLACKC12.jpg?v=1686076906",
    descripcion: "Maestro de la Magia de Oscuridad. Utiliza su magia para encantar su katana, permitiéndole absorber ataques enemigos y realizar cortes dimensionales que atraviesan el espacio. Se especializa en el combate físico reforzado con Ki, una técnica sensorial que le permite leer y reaccionar a los movimientos enemigos instantáneamente. Su ataque definitivo, el Corte Dimensional, es capaz de cortar literalmente cualquier cosa, incluyendo dimensiones."
  },
  {
    id: 12,
    name: "Sukuna",
    ataque: 9200,
    defensa: 8000,
    img: "https://i.pinimg.com/736x/9a/0a/65/9a0a6522048025ed021d6d14c3cd2707.jpg",
    descripcion: "Maestro del Santuario. Su técnica se basa en ataques de corte invisibles: Desmantelar (para objetos inanimados) y Cleave (que se ajusta a la resistencia del enemigo). Posee la técnica de fuego Fuga y una capacidad de curación casi instantánea mediante la Técnica de Maldición Inversa. Su Expansión de Dominio, Relicario Malévolo, es única por no tener barreras, permitiéndole rebanar todo en un radio de hasta 200 metros.."
  }
]

function App() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-yellow-400">
        CARTAS DE PERSONAJES
      </h1>
      
      <div className="flex flex-wrap justify-center gap-8">
        {cartas.map((carta) => (
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

export default App