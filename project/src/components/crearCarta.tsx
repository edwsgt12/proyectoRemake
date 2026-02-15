import { useState } from "react";
import {RiImageAddLine} from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import type { Carta } from "../assets/types/types";

const FormularioCarta = ({onCrear,toggleMostrarFormulario,cantidadCartas}: {onCrear: (carta: Carta) => void,toggleMostrarFormulario: () => void,cantidadCartas:number}) => {
    const [formData, setFormData] = useState<Carta>({
        ataque: 0,
        defensa: 0,
        descripcion: '',
        id:0,
        img:"",
        name:""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCrear({...formData, id: cantidadCartas+1});
        setFormData({
            name: "",
            id:0,
            ataque: 0,
            defensa: 0,
            descripcion: "",
            img: ""
        });
    };

    return (

        <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-xl p-8 rounded-x1 border border-grey shadow-2xl mb-12">
            <div className="flex items-center gap-3 mb-8">
                <FaTimes className="text-yellow-400 shadow-2xl hover:scale-130 transition-transform cursor-pointer relative overflow-hidden" 
                onClick={toggleMostrarFormulario}
                />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Crea <span className="text-yellow-400">Una</span> Nueva <span className="text-yellow-400">Carta</span>
                </h2>
        </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Input Para el Nombre */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre</label>
                <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all italic"
                />
            </div>

        {/* Input Para el ataque */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Poder</label>
                <input
                type = "number"
                required
                placeholder = "1000"
                value={formData.ataque}
                onChange={(e)=> setFormData({...formData, ataque: Number(e.target.value)})}
                className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                />
            </div>
        {/* Input Para la Defensa */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Defensa</label>
                <input
                type = "number"
                required
                placeholder = "1000"
                value={formData.defensa}
                onChange={(e)=> setFormData({...formData, defensa: Number(e.target.value)})}
                className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                />
            </div>

            {/* Input Para la Imagen */}
            <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL de la Imagen</label>
                <div className="relative">
                <RiImageAddLine className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" />
                <input
                type="text"
                placeholder="https://nombre.jpn"
                value={formData.img}
                onChange={(e) => setFormData({...formData, img: e.target.value})}
                className="bg-white/5 border border-white/10 pl-10 p-3 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all italic w-full"
                />
                </div>
            </div>  
        {/* Input para la Descripcion */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descripción</label>
          <textarea
            rows={2}
            placeholder="Haz una pequeña descripcion de tu personaje..."
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
          />
        </div>
        {/* Botón */}
        <button
          type="submit"
          className="md:col-span-2 mt-4 bg-black-600 hover:shadow-[0_0_15px_yellow] hover:bg-yellow-500 text-gray-500 font-black py-4 rounded-2xl transition-all uppercase italic tracking-tighter "
        >
          Registrar Carta
        </button>
            </form>
        </div>
    )

}

export default FormularioCarta;