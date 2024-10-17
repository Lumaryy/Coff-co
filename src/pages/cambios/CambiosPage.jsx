import React, { useState } from 'react'
import Header from '../../components/molecules/layout/Header';
import Navbar from '../../components/molecules/Navbar/Navbar';
import Footer from '../../components/molecules/Footer/Footer';
import CambiosPlantilla from '../../components/plantillas/cambios/CambiosPlantilla';

const CambiosPage = () => {
    const [menuAbierto, setMenuAbierto] = useState(true);

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    return (
        <div className="h-screen flex flex-col overflow-x-hidden">
            <Header contenido={"Coffco"} />
            <div className="flex flex-grow">
                <div
                    className={`transition-all duration-300 ease-in-out`}>
                    <Navbar menuAbierto={menuAbierto} toggleMenu={toggleMenu}/>
                </div>
                <div className="w-full overflow-auto">
                    <CambiosPlantilla/>
                </div>
            </div>
            <div className="mt-auto w-screen">
                <Footer />
            </div>
        </div>
    );
}

export default CambiosPage