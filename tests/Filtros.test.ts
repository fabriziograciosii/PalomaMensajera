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

describe("Filtros todos, alguno, no, personalizado)", () => {
    const remitente = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar");
    const destinatario = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar");

    test("personalizado() aplica el criterio recibido", () => {
        const correo = new Correo(1, "Aviso", "Hola", remitente, [destinatario]);
        const filtro = Filtros.personalizado((c) => c.getAsunto() === "Aviso");

        expect(filtro.cumple(correo)).toBe(true);
    });

    test("todos() combina filtros con Y lógico", () => {
        const correo = new Correo(1, "Aviso", "Hola", remitente, [destinatario]);


        correo.marcarFavorito();
        const filtro = Filtros.todos([Filtros.favorito(), Filtros.noLeido()]);


        expect(filtro.cumple(correo)).toBe(true);


        correo.marcarLeido();

        expect(filtro.cumple(correo)).toBe(false);

    });

    test("alguno() combina filtros con O lógico", () => {
        const correo = new Correo(1, "Aviso", "Hola", remitente, [destinatario]);


        correo.marcarLeido();
        const filtro = Filtros.alguno([Filtros.favorito(), Filtros.noLeido()]);


        expect(filtro.cumple(correo)).toBe(false);

        correo.marcarFavorito();

        expect(filtro.cumple(correo)).toBe(true);

    });

    test("no() invierte el resultado de un filtro", () => {

        const correo = new Correo(1, "Aviso", "Hola", remitente, [destinatario]);

        const filtro = Filtros.no(Filtros.favorito());


        expect(filtro.cumple(correo)).toBe(true);

        correo.marcarFavorito();

        expect(filtro.cumple(correo)).toBe(false);

    });

    
});
describe('Filtros - nombres y conNombre', () => {
    test('los filtros básicos tienen un nombre', () => {
        expect(Filtros.favorito().getNombre()).toBe('favorito');
        expect(Filtros.noLeido().getNombre()).toBe('no leído');
        expect(Filtros.conTexto('examen').getNombre()).toBe('con texto "examen"');
    });

    test('los combinadores tienen un nombre', () => {
        expect(Filtros.todos([Filtros.favorito()]).getNombre()).toBe('todos');
        expect(Filtros.alguno([Filtros.favorito()]).getNombre()).toBe('alguno');
        expect(Filtros.no(Filtros.favorito()).getNombre()).toBe('no favorito');
    });

    test('conNombre() cambia el nombre pero mantiene la condición', () => {
        const remitente = new Contacto('Ignacio Cremona', 'ignacio@ucp.edu.ar');
        const destinatario = new Contacto('Fabrizio Graciosi', 'fabrizio@ucp.edu.ar');
        const correo = new Correo(1, 'Aviso', 'Hola', remitente, [destinatario]);
        const filtro = Filtros.conNombre('Sin leer', Filtros.noLeido());

        expect(filtro.getNombre()).toBe('Sin leer');
        expect(filtro.cumple(correo)).toBe(true);
        correo.marcarLeido();
        expect(filtro.cumple(correo)).toBe(false);
    });
});
describe('Filtros - conTexto en los destinatarios', () => {
    const remitente = new Contacto('Ignacio Cremona', 'ignacio@ucp.edu.ar');
    const primero = new Contacto('Fabrizio Graciosi', 'fabrizio@ucp.edu.ar');
    const segundo = new Contacto('Jere Gomez', 'jere@gmail.com');

    test('encuentra coincidencias en el nombre de un destinatario', () => {
        const correo = new Correo(1, 'Aviso', 'Hola', remitente, [primero, segundo]);

        expect(Filtros.conTexto('graciosi').cumple(correo)).toBe(true);
    });

    test('encuentra coincidencias en la dirección de cualquier destinatario', () => {
        const correo = new Correo(1, 'Aviso', 'Hola', remitente, [primero, segundo]);

        expect(Filtros.conTexto('JERE@gmail').cumple(correo)).toBe(true);
    });
});
describe('Filtros - bloques para armar filtros', () => {
    const ucp = new Contacto('Ana Profesora', 'ana@ucp.edu.ar');
    const otro = new Contacto('Jere Gomez', 'jere@gmail.com');
    const destinatario = new Contacto('Fabrizio Graciosi', 'fabrizio@ucp.edu.ar');

    test('asuntoContiene() mira solo el asunto y no distingue mayúsculas', () => {
        const enAsunto = new Correo(1, 'Examen final', 'Hola', ucp, [destinatario]);
        const enCuerpo = new Correo(2, 'Aviso', 'Examen final', ucp, [destinatario]);

        expect(Filtros.asuntoContiene('examen').cumple(enAsunto)).toBe(true);
        expect(Filtros.asuntoContiene('examen').cumple(enCuerpo)).toBe(false);
    });

    test('cuerpoContiene() mira solo el cuerpo y no distingue mayúsculas', () => {
        const enCuerpo = new Correo(1, 'Aviso', 'Fecha de ENTREGA', ucp, [destinatario]);
        const enAsunto = new Correo(2, 'Entrega', 'Hola', ucp, [destinatario]);

        expect(Filtros.cuerpoContiene('entrega').cumple(enCuerpo)).toBe(true);
        expect(Filtros.cuerpoContiene('entrega').cumple(enAsunto)).toBe(false);
    });

    test('remitenteDelDominio() compara el final de la dirección del remitente', () => {
        const deUcp = new Correo(1, 'Aviso', 'Hola', ucp, [destinatario]);
        const deOtro = new Correo(2, 'Aviso', 'Hola', otro, [destinatario]);

        expect(Filtros.remitenteDelDominio('@UCP.edu.ar').cumple(deUcp)).toBe(true);
        expect(Filtros.remitenteDelDominio('@ucp.edu.ar').cumple(deOtro)).toBe(false);
    });

    test('remitenteEs() cumple solo con el contacto indicado', () => {
        const deUcp = new Correo(1, 'Aviso', 'Hola', ucp, [destinatario]);
        const deOtro = new Correo(2, 'Aviso', 'Hola', otro, [destinatario]);

        expect(Filtros.remitenteEs(otro).cumple(deOtro)).toBe(true);
        expect(Filtros.remitenteEs(otro).cumple(deUcp)).toBe(false);
    });
});