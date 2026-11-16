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

        test('un texto vacío no devuelve ningún correo', () => {
        const gestor = new GestorCorreos();
        gestor.enviarCorreo(remitente, 'Aviso', 'Hola', [destinatario]);

        expect(gestor.buscarCorreos(remitente, '')).toEqual([]);
    });

    test('un texto que no coincide con nada devuelve vacío', () => {
        const gestor = new GestorCorreos();
        gestor.enviarCorreo(remitente, 'Aviso', 'Hola', [destinatario]);

        expect(gestor.buscarCorreos(remitente, 'xyzxyz')).toEqual([]);
    });

    test('busca en Entrada, Enviados y Borradores', () => {
        const gestor = new GestorCorreos();
        const recibido = gestor.recibirCorreo(remitente, 'Novedad entrada', 'Hola', [destinatario])!;
        const enviado = gestor.enviarCorreo(remitente, 'Novedad enviada', 'Hola', [destinatario])!;
        const borrador = gestor.crearBorrador(remitente, 'Novedad borrador', 'Hola', [destinatario]);

        expect(gestor.buscarCorreos(destinatario, 'Novedad').map((c) => c.getId())).toContain(recibido.getId());
        expect(gestor.buscarCorreos(remitente, 'Novedad').map((c) => c.getId())).toContain(enviado.getId());
        expect(gestor.buscarCorreos(remitente, 'Novedad').map((c) => c.getId())).toContain(borrador.getId());
    });

    test('no busca en Eliminados', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.enviarCorreo(remitente, 'Aviso importante', 'Hola', [destinatario])!;
        gestor.eliminarCorreo(correo.getId());

        expect(gestor.buscarCorreos(remitente, 'importante')).toEqual([]);
    });

    test('solo trae resultados del buzón del propietario consultado', () => {
        const gestor = new GestorCorreos();
        gestor.enviarCorreo(remitente, 'Aviso compartido', 'Hola', [destinatario]);

        const resultadoRemitente = gestor.buscarCorreos(remitente, 'compartido');
        const resultadoDestinatario = gestor.buscarCorreos(destinatario, 'compartido');

        expect(resultadoRemitente.length).toBe(1);
        expect(resultadoDestinatario.length).toBe(1);
        expect(resultadoRemitente[0].getId()).not.toBe(resultadoDestinatario[0].getId());
    });
});