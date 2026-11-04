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

        test('Eliminar un correo lo traslada a Eliminados y lo saca de su bandeja original', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario])!;

        const eliminado = gestor.eliminarCorreo(correo.getId());

        expect(eliminado).toBe(true);
        expect(gestor.consultarBandeja(TipoBandeja.ENTRADA).length).toBe(0);
        expect(gestor.consultarBandeja(TipoBandeja.ELIMINADOS).map((c) => c.getId())).toContain(correo.getId());
    });

    test('Restaurar un correo eliminado lo devuelve a su bandeja de origen', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario])!;
        gestor.eliminarCorreo(correo.getId());

        const restaurado = gestor.restaurarCorreo(correo.getId());

        expect(restaurado).toBe(true);
        expect(gestor.consultarBandeja(TipoBandeja.ELIMINADOS).length).toBe(0);
        expect(gestor.consultarBandeja(TipoBandeja.ENTRADA).map((c) => c.getId())).toContain(correo.getId());
    });

    test('No se puede restaurar un correo que no está en Eliminados', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario])!;

        expect(gestor.restaurarCorreo(correo.getId())).toBe(false);
    });

    test('No se puede eliminar un correo que ya está en Eliminados', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario])!;
        gestor.eliminarCorreo(correo.getId());

        expect(gestor.eliminarCorreo(correo.getId())).toBe(false);
    });

        test('Un correo pertenece a una única bandeja a la vez: enviar lo saca de Borradores', () => {
        const gestor = new GestorCorreos();
        const borrador = gestor.crearBorrador(remitente, 'Examen', 'Trae tu DNI', [destinatario]);

        gestor.enviarBorrador(borrador.getId());

        const enTodasLasBandejas = Object.values(TipoBandeja)
            .map((tipo) => gestor.consultarBandeja(tipo).filter((c) => c.getId() === borrador.getId()).length)
            .reduce((total, cantidad) => total + cantidad, 0);

        expect(enTodasLasBandejas).toBe(1);
    });

    test('No se generan duplicados al mover un correo varias veces (eliminar y restaurar)', () => {
        const gestor = new GestorCorreos();
        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario])!;

        gestor.eliminarCorreo(correo.getId());
        gestor.restaurarCorreo(correo.getId());

        expect(gestor.consultarBandeja(TipoBandeja.ENTRADA).length).toBe(1);
    });

    test('Mover un correo que no existe devuelve false', () => {
        const gestor = new GestorCorreos();
        expect(gestor.eliminarCorreo(999)).toBe(false);
    });
});



describe('GestorCorreos, estado de lectura', () => {
    const remitente = new Contacto('Luis Rodriguez', 'luisrod@ucp.edu.ar');
    const destinatario = new Contacto('Luis Gómez', 'luis@ucp.edu.ar');

    test('marcar un correo como leído devuelve verdadero y lo deja leído', () => {
        
        const gestor = new GestorCorreos();
        
        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario])!;

        const resultado = gestor.marcarLeido(correo.getId());

        expect(resultado).toBe(true);
        
        expect(gestor.consultarBandeja(TipoBandeja.ENTRADA)[0].estaLeido()).toBe(true);
    });

    test('un correo leído se puede marcar nuevamente como no leído', () => {
        
        const gestor = new GestorCorreos();
        
        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario])!;

        gestor.marcarLeido(correo.getId());
        
        const resultado = gestor.marcarNoLeido(correo.getId());

        expect(resultado).toBe(true);
        
        expect(gestor.consultarBandeja(TipoBandeja.ENTRADA)[0].estaLeido()).toBe(false);
    });

    test('marcar leído un correo que no existe devuelve false', () => {
        
        const gestor = new GestorCorreos();

        expect(gestor.marcarLeido(999)).toBe(false);
       
        expect(gestor.marcarNoLeido(999)).toBe(false);
    });

    
    
    test('consultar no leidos devuelve solo los correos no leídos de la bandeja', () => {
        
        const gestor = new GestorCorreos();
        
        const primero = gestor.recibirCorreo(remitente, 'Uno', 'Hola', [destinatario])!;
        
        const segundo = gestor.recibirCorreo(remitente, 'Dos', 'Hola', [destinatario])!;

        gestor.marcarLeido(primero.getId());

        const noLeidos = gestor.consultarNoLeidos(TipoBandeja.ENTRADA);

        expect(noLeidos.length).toBe(1);
        expect(noLeidos[0].getId()).toBe(segundo.getId());
    });


    test('el cambio de estado se refleja inmediatamente en consultar no leídos', () => {
        const gestor = new GestorCorreos();

        const correo = gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario])!;

        gestor.marcarLeido(correo.getId());
        
        expect(gestor.consultarNoLeidos(TipoBandeja.ENTRADA).length).toBe(0);

        gestor.marcarNoLeido(correo.getId());
        
        expect(gestor.consultarNoLeidos(TipoBandeja.ENTRADA).length).toBe(1);
    });

    test('consultar no leídos solo mira la bandeja pedida', () => {
        
        const gestor = new GestorCorreos();

        gestor.recibirCorreo(remitente, 'Aviso', 'Hola', [destinatario]);
        
        gestor.crearBorrador(remitente, 'Borrador', 'Texto', [destinatario]);

        expect(gestor.consultarNoLeidos(TipoBandeja.ENTRADA).length).toBe(1);
        
        expect(gestor.consultarNoLeidos(TipoBandeja.BORRADORES).length).toBe(1);

        expect(gestor.consultarNoLeidos(TipoBandeja.ENVIADOS).length).toBe(0);
    
    });

});