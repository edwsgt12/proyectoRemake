import { useState } from "react";
import CartaInicial from "./CartaInicial";
import type { Carta } from "../assets/types/types";
import { cartasDefault } from "./cartas";

function CartaBorrar() {
  const [cartas, setCartas] = useState<Carta[]>(cartasDefault);
  
  const BorrarCarta = (id: number) => {
    setCartas(prevCartas => prevCartas.filter(c => c.id !== id));
    
  };
  
  return (
    <div>
      {cartas.map(carta => (
        <CartaInicial
          key={carta.id}
          {...carta}
          onClick={() => console.log('Carta clickeada:', carta.id)}
          onDelete={BorrarCarta} 
        />
      ))}
    </div>
  );
}

export default CartaBorrar;