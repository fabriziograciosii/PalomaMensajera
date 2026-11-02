import { describe, test, expect } from 'vitest';
import { GestorCorreos } from '../src/gestor/GestorCorreos';
import { TipoBandeja } from '../src/bandejas/TipoBandeja';
import { Contacto } from '../src/contactos/Contacto';

describe('GestorCorreos - Borradores (RF-07)', () => {
    const remitente = new Contacto('Ana Pérez', 'ana@ucp.edu.ar');
    const destinatario = new Contacto('Luis Gómez', 'luis@ucp.edu.ar');

    test('Crear un borrador lo registra en la bandeja de Borradores', () => {
        const gestor = new GestorCorreos();

        const borrador = gestor.crearBorrador(remitente, 'Examen', 'Trae tu DNI', [destinatario]);

        expect(gestor.consultarBandeja(TipoBandeja.BORRADORES).map((c) => c.getId())).toContain(borrador.getId());
    });

    test('Un borrador puede crearse incompleto, sin todos los datos obligatorios', () => {
        const gestor = new GestorCorreos();

        const borrador = gestor.crearBorrador(remitente);

        expect(borrador.getAsunto()).toBe('');
        expect(gestor.consultarBandeja(TipoBandeja.BORRADORES).length).toBe(1);
    });

    test('Editar un borrador conserva los cambios y devuelve true', () => {
        const gestor = new GestorCorreos();
        const borrador = gestor.crearBorrador(remitente);

        const editado = gestor.editarBorrador(borrador.getId(), { asunto: 'Examen final', destinatarios: [destinatario] });

        expect(editado).toBe(true);
        const actualizado = gestor.consultarBandeja(TipoBandeja.BORRADORES)[0];
        expect(actualizado.getAsunto()).toBe('Examen final');
        expect(actualizado.getDestinatarios().length).toBe(1);
    });

    test('No se puede editar un correo que no está en Borradores', () => {
        const gestor = new GestorCorreos();
        const recibido = gestor.recibirCorreo(remitente, 'Asunto', 'Cuerpo', [destinatario]);

        expect(gestor.editarBorrador(recibido!.getId(), { asunto: 'Otro' })).toBe(false);
    });

        test('Enviar un borrador válido lo traslada a la Bandeja de Enviados', () => {
        const gestor = new GestorCorreos();
        const borrador = gestor.crearBorrador(remitente, 'Examen', 'Trae tu DNI', [destinatario]);

        const enviado = gestor.enviarBorrador(borrador.getId());

        expect(enviado).toBe(true);
        expect(gestor.consultarBandeja(TipoBandeja.BORRADORES).length).toBe(0);
        expect(gestor.consultarBandeja(TipoBandeja.ENVIADOS).map((c) => c.getId())).toContain(borrador.getId());
    });

    test('Un borrador inválido no puede enviarse', () => {
        const gestor = new GestorCorreos();
        const borrador = gestor.crearBorrador(remitente); // sin asunto ni destinatarios

        const enviado = gestor.enviarBorrador(borrador.getId());

        expect(enviado).toBe(false);
        expect(gestor.consultarBandeja(TipoBandeja.BORRADORES).length).toBe(1);
    });
});

describe('GestorCorreos - Bandejas y clasificación (RF-06)', () => {
    const remitente = new Contacto('Ana Pérez', 'ana@ucp.edu.ar');
    const destinatario = new Contacto('Luis Gómez', 'luis@ucp.edu.ar');

    test('Un correo recibido queda en la Bandeja de Entrada', () => {
        const gestor = new GestorCorreos();

        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario]);

        expect(correo).not.toBeUndefined();
        expect(gestor.consultarBandeja(TipoBandeja.ENTRADA).map((c) => c.getId())).toContain(correo!.getId());
    });

    test('Un correo recibido sin asunto o sin destinatarios es rechazado', () => {
        const gestor = new GestorCorreos();

        expect(gestor.recibirCorreo(remitente, '', 'Hola', [destinatario])).toBeUndefined();
        expect(gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [])).toBeUndefined();
        expect(gestor.consultarBandeja(TipoBandeja.ENTRADA).length).toBe(0);
    });
});