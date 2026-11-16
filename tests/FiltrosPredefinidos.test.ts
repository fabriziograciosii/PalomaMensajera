import { describe, test, expect } from 'vitest';
import { FiltrosPredefinidos } from '../src/filtros/FiltrosPredefinidos';
import { Filtros } from '../src/filtros/Filtros';
import { Correo } from '../src/correos/Correo';
import { Contacto } from '../src/contactos/Contacto';

describe('FiltrosPredefinidos (RF-05)', () => {
    const profesora = new Contacto('Ana Profesora', 'ana@ucp.edu.ar');
    const amigo = new Contacto('Jere Gomez', 'jere@gmail.com');
    const yo = new Contacto('Gonzalo Rodriguez', 'gonzalo@ucp.edu.ar');

    test('Correos de la UCP: remitente del dominio @ucp.edu.ar', () => {
        const filtro = FiltrosPredefinidos.correosDeLaUCP();

        expect(filtro.getNombre()).toBe('Correos de la UCP');
        expect(filtro.cumple(new Correo(1, 'Aviso', 'Hola', profesora, [yo]))).toBe(true);
        expect(filtro.cumple(new Correo(2, 'Aviso', 'Hola', amigo, [yo]))).toBe(false);
    });

    test('Correos académicos importantes: dominio UCP y asunto con Examen', () => {
        const filtro = FiltrosPredefinidos.academicosImportantes();

        expect(filtro.getNombre()).toBe('Correos académicos importantes');
        expect(filtro.cumple(new Correo(1, 'Examen final', 'Hola', profesora, [yo]))).toBe(true);
        expect(filtro.cumple(new Correo(2, 'Aviso', 'Hola', profesora, [yo]))).toBe(false);
        expect(filtro.cumple(new Correo(3, 'Examen final', 'Hola', amigo, [yo]))).toBe(false);
    });

    test('Pendientes de revisión: no leído y cuerpo con Entrega', () => {
        const filtro = FiltrosPredefinidos.pendientesDeRevision();
        const pendiente = new Correo(1, 'Aviso', 'Fecha de entrega', profesora, [yo]);
        const sinEntrega = new Correo(2, 'Aviso', 'Hola', profesora, [yo]);

        expect(filtro.getNombre()).toBe('Pendientes de revisión');
        expect(filtro.cumple(pendiente)).toBe(true);
        expect(filtro.cumple(sinEntrega)).toBe(false);
        pendiente.marcarLeido();
        expect(filtro.cumple(pendiente)).toBe(false);
    });

    test('Correos personales prioritarios: favorito y enviado por el contacto', () => {
        const filtro = FiltrosPredefinidos.personalesPrioritarios(amigo);
        const deAmigo = new Correo(1, 'Aviso', 'Hola', amigo, [yo]);
        const deProfe = new Correo(2, 'Aviso', 'Hola', profesora, [yo]);

        expect(filtro.getNombre()).toBe('Correos personales prioritarios');
        expect(filtro.cumple(deAmigo)).toBe(false);
        deAmigo.marcarFavorito();
        deProfe.marcarFavorito();
        expect(filtro.cumple(deAmigo)).toBe(true);
        expect(filtro.cumple(deProfe)).toBe(false);
    });

    test('Correos para seguimiento: Proyecto o Reunión en el asunto, sin leídos', () => {
        const filtro = FiltrosPredefinidos.paraSeguimiento();
        const proyecto = new Correo(1, 'Proyecto final', 'Hola', profesora, [yo]);
        const reunion = new Correo(2, 'Reunión del lunes', 'Hola', profesora, [yo]);
        const otro = new Correo(3, 'Aviso', 'Hola', profesora, [yo]);

        expect(filtro.getNombre()).toBe('Correos para seguimiento');
        expect(filtro.cumple(proyecto)).toBe(true);
        expect(filtro.cumple(reunion)).toBe(true);
        expect(filtro.cumple(otro)).toBe(false);
        proyecto.marcarLeido();
        expect(filtro.cumple(proyecto)).toBe(false);
    });

    test('un filtro predefinido se puede reutilizar para construir uno nuevo', () => {
        const filtro = Filtros.todos([FiltrosPredefinidos.correosDeLaUCP(), Filtros.favorito()]);
        const correo = new Correo(1, 'Aviso', 'Hola', profesora, [yo]);

        expect(filtro.cumple(correo)).toBe(false);
        correo.marcarFavorito();
        expect(filtro.cumple(correo)).toBe(true);
    });
});