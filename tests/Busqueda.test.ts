import { describe, test, expect } from 'vitest';
import { GestorCorreos } from '../src/gestor/GestorCorreos';
import { Contacto } from '../src/contactos/Contacto';

describe('GestorCorreos - Búsqueda (RF-04)', () => {
    const remitente = new Contacto('Ignacio Cremona', 'ignacio@ucp.edu.ar');
    const destinatario = new Contacto('Fabrizio Graciosi', 'fabrizio@ucp.edu.ar');

    test('encuentra un correo por coincidencia parcial en el asunto', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.enviarCorreo(remitente, 'Reunión de parciales', 'Hola', [destinatario])!;

        const resultado = gestor.buscarCorreos(remitente, 'parcial');

        expect(resultado.map((c) => c.getId())).toContain(correo.getId());
    });

    test('encuentra un correo por coincidencia parcial en el cuerpo', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.enviarCorreo(remitente, 'Aviso', 'Traer el DNI el lunes', [destinatario])!;

        const resultado = gestor.buscarCorreos(remitente, 'lunes');

        expect(resultado.map((c) => c.getId())).toContain(correo.getId());
    });

        test('encuentra un correo por el nombre del remitente', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario])!;

        const resultado = gestor.buscarCorreos(destinatario, 'Cremona');

        expect(resultado.map((c) => c.getId())).toContain(correo.getId());
    });

    test('encuentra un correo por la dirección del remitente', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario])!;

        const resultado = gestor.buscarCorreos(destinatario, 'ignacio@ucp');

        expect(resultado.map((c) => c.getId())).toContain(correo.getId());
    });

    test('la búsqueda no distingue mayúsculas', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.enviarCorreo(remitente, 'Examen Final', 'Hola', [destinatario])!;

        const resultado = gestor.buscarCorreos(remitente, 'examen final');

        expect(resultado.map((c) => c.getId())).toContain(correo.getId());
    });
});