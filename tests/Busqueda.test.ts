import { describe, test, expect } from 'vitest';
import { GestorCorreos } from '../src/gestor/GestorCorreos';
import { Contacto } from '../src/contactos/Contacto';

// RF-04: buscarCorreos busca SOLO en la bandeja de Entrada (correos recibidos),
// no en Enviados ni Borradores, y compara contra asunto, cuerpo, remitente
// (nombre y dirección) y cada destinatario (nombre y dirección).
describe('GestorCorreos - Búsqueda (RF-04)', () => {
    const fabrizio = new Contacto('Fabrizio Graciosi', 'fabrizio@ucp.edu.ar');
    const ignacio = new Contacto('Ignacio Cremona', 'ignacio@ucp.edu.ar');
    const gonzalo = new Contacto('Gonzalo Rodriguez', 'gonzalo@ucp.edu.ar');

    test('encuentra un correo recibido por coincidencia en el asunto', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(ignacio, 'Entrega del TP Final', 'Recuerden subirlo a tiempo', [fabrizio]);

        const resultado = gestor.buscarCorreos(fabrizio, 'entrega');

        expect(resultado.length).toBe(1);
        expect(resultado[0].getAsunto()).toBe('Entrega del TP Final');
    });

    test('encuentra un correo recibido por coincidencia en el cuerpo', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(ignacio, 'Aviso', 'El parcial se traslada al viernes', [fabrizio]);

        const resultado = gestor.buscarCorreos(fabrizio, 'parcial');

        expect(resultado.length).toBe(1);
    });

    test('encuentra un correo recibido por coincidencia en el remitente (nombre o dirección)', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(ignacio, 'Aviso', 'Hola', [fabrizio]);

        expect(gestor.buscarCorreos(fabrizio, 'cremona').length).toBe(1);
        expect(gestor.buscarCorreos(fabrizio, 'ignacio@ucp').length).toBe(1);
    });

    test('encuentra un correo recibido por coincidencia en un destinatario (nombre o dirección)', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(ignacio, 'Reunión de grupo', 'Coordinar el TP', [fabrizio, gonzalo]);

        const porNombreDestinatario = gestor.buscarCorreos(fabrizio, 'gonzalo rodriguez');
        const porDireccionDestinatario = gestor.buscarCorreos(fabrizio, 'gonzalo@ucp');

        expect(porNombreDestinatario.length).toBe(1);
        expect(porDireccionDestinatario.length).toBe(1);
    });

    test('la búsqueda no es sensible a mayúsculas/minúsculas', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(ignacio, 'EXAMEN FINAL', 'Hola', [fabrizio]);

        expect(gestor.buscarCorreos(fabrizio, 'examen final').length).toBe(1);
    });

    test('un texto vacío no devuelve ningún correo', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(ignacio, 'Aviso', 'Hola', [fabrizio]);

        expect(gestor.buscarCorreos(fabrizio, '').length).toBe(0);
    });

    test('no busca en correos de Enviados ni de Borradores', () => {
        const gestor = new GestorCorreos();
        gestor.crearBorrador(fabrizio, 'Borrador con Entrega', 'Hola');
        gestor.enviarCorreo(fabrizio, 'Enviado con Entrega', 'Hola', [ignacio]);

        const resultado = gestor.buscarCorreos(fabrizio, 'entrega');

        expect(resultado.length).toBe(0);
    });

    test('devuelve varios correos recibidos si todos cumplen', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(ignacio, 'Examen de Programación', 'Hola', [fabrizio]);
        gestor.recibirCorreo(gonzalo, 'Examen de Base de Datos', 'Hola', [fabrizio]);
        gestor.recibirCorreo(ignacio, 'Aviso general', 'Sin relación', [fabrizio]);

        const resultado = gestor.buscarCorreos(fabrizio, 'examen');

        expect(resultado.length).toBe(2);
    });

    test('no encuentra correos de otro propietario', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(ignacio, 'Entrega del TP', 'Hola', [gonzalo]);

        expect(gestor.buscarCorreos(fabrizio, 'entrega').length).toBe(0);
    });
});