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

describe("Filtros  conTexto", () => {

    const remitente = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar");

    const destinatario = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar");

    test("encuentra coincidencias parciales en el asunto", () => {

        const correo = new Correo(1, "Reunión de parciales", "Hola", remitente, [destinatario]);

        expect(Filtros.conTexto("parcial").cumple(correo)).toBe(true);


    });

    test("encuentra coincidencias parciales en el cuerpo", () => {
        const correo = new Correo(1, "Aviso", "Traer el DNI el lunes", remitente, [destinatario]);


        expect(Filtros.conTexto("lunes").cumple(correo)).toBe(true);


    });

    test("encuentra coincidencias en el nombre del remitente", () => {

        const correo = new Correo(1, "Aviso", "Hola", remitente, [destinatario]);


        expect(Filtros.conTexto("Cremona").cumple(correo)).toBe(true);

    });

    test("encuentra coincidencias en la dirección del remitente", () => {

        const correo = new Correo(1, "Aviso", "Hola", remitente, [destinatario]);

        expect(Filtros.conTexto("ignacio@ucp").cumple(correo)).toBe(true);


    });

    test("no distingue mayúsculas", () => {

        const correo = new Correo(1, "Examen Final", "Hola", remitente, [destinatario]);

        expect(Filtros.conTexto("examen final").cumple(correo)).toBe(true);

    });

    test("texto vacío no cumple con ningún correo", () => {

        const correo = new Correo(1, "Aviso", "Hola", remitente, [destinatario]);


        expect(Filtros.conTexto("").cumple(correo)).toBe(false);


    });

    test("texto que no coincide no cumple", () => {

        const correo = new Correo(1, "Aviso", "Hola", remitente, [destinatario]);


        expect(Filtros.conTexto("xyzxyz").cumple(correo)).toBe(false);
    
    });


});