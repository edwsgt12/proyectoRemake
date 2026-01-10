import type { Carta } from "../assets/types/types";

function CartaInicial({
    id,
    name,
    ataque,
    defensa,
    img,
}:Carta){
    return (
        <>
        <h2> 
            (#{id}) 
        </h2>
        <h3>
            {name}
        </h3>
        <h3>
            {ataque}
        </h3>
        <h3>
            {defensa}
        </h3>
        <img src={img} alt="" />
        </>
    )
}
export default CartaInicial;