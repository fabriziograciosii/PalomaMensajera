import { describe, test, expect } from 'vitest';
import { Filtros } from '../src/filtros/Filtros';
import { Correo } from '../src/correos/Correo';
import { Contacto } from '../src/contactos/Contacto';

describe("Filtros básicos para favoritos, no leido)", () => {
    const remitente = new Contacto('Ignacio Cremona', 'ignacio@ucp.edu.ar');
    
    const destinatario = new Contacto('Fabrizio Graciosi', 'fabrizio@ucp.edu.ar');

    
    test("favorito() cumple solo con correos marcados favoritos", () => {
        
        const correo = new Correo(1, 'Aviso', 'Hola', remitente, [destinatario]);
        
        const filtro = Filtros.favorito();

        
        expect(filtro.cumple(correo)).toBe(false);
        
        correo.marcarFavorito();
       
        expect(filtro.cumple(correo)).toBe(true);


    });

    test("noLeido() cumple solo con correos no leídos", () => {
        
        const correo = new Correo(1, 'Aviso', 'Hola', remitente, [destinatario]);
        
        const filtro = Filtros.noLeido();

        expect(filtro.cumple(correo)).toBe(true);

        correo.marcarLeido();

        expect(filtro.cumple(correo)).toBe(false);


    });


});
