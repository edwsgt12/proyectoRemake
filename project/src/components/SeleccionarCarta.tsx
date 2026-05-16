import { useState } from "react";
import Cartainicial from "./CartaInicial"; 
import type { Carta } from "../assets/types/types";
import { Link } from "react-router";

type Props = {
    mazo: Carta[];
    loading: boolean;
}

function SeleccionarCartas({ mazo, loading }: Props) {
    const [cartaSeleccionada1, setCartaSeleccionada1] = useState<Carta | null>(null);
    const [cartaSeleccionada2, setCartaSeleccionada2] = useState<Carta | null>(null);
    const [listoBatalla, setListoBatalla] = useState<boolean>(false);

    const handleSeleccionarCarta = (carta: Carta) => {
        const isSelected1 = cartaSeleccionada1?.id === carta.id;
        const isSelected2 = cartaSeleccionada2?.id === carta.id;

        if (isSelected1) {
            setCartaSeleccionada1(null);
            setListoBatalla(false);
            return;
        }

        if (isSelected2) {
            setCartaSeleccionada2(null);
            setListoBatalla(false);
            return;
        }

        if (!cartaSeleccionada1) {
            setCartaSeleccionada1(carta);
            if (cartaSeleccionada2) setListoBatalla(true);
        } else if (!cartaSeleccionada2) {
            setCartaSeleccionada2(carta);
            setListoBatalla(true);
        }
    };

    return (
        <>
            {loading && <p>Cargando mazo...</p>}

            {!loading && mazo && (
                <div className="contenedor-mazo"> 
                    {mazo.map((carta) => { 
                        return (
                            <div 
                                onClick={() => handleSeleccionarCarta(carta)}
                                key={carta.id}
                            >
                                <Cartainicial
                                    carta={carta}
                                    color={carta.attributes.color}
                                    ancho={260}
                                    alto={360}
                                    selecciona={
                                        cartaSeleccionada1?.id === carta.id || cartaSeleccionada2?.id === carta.id    
                                    }
                                    selectionMode={true}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            <Link
            to={`/campo-de-batalla/${cartaSeleccionada1?.id}/${cartaSeleccionada2?.id}`}>
                <CustomBtn
                extraStyle='rounded-full'
                accion={() => {}}
                disable={listoBatalla}
                >
                    <TbSwords size={28} />
                </CustomBtn>
            </Link>
        </>
    );
}

export default SeleccionarCartas;