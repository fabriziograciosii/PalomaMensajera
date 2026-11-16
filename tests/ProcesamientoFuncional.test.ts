import { describe, test, expect } from 'vitest';
import { GestorCorreos } from '../src/gestor/GestorCorreos';
import { TipoBandeja } from '../src/bandejas/TipoBandeja';
import { Filtros } from '../src/filtros/Filtros';
import { Contacto } from '../src/contactos/Contacto';

describe('GestorCorreos - procesamiento funcional (RF-10)', () => {
    const profesora = new Contacto('Ana Profesora', 'ana@ucp.edu.ar');
    const yo = new Contacto('Gonzalo Rodriguez', 'gonzalo@ucp.edu.ar');

    test('obtenerAsuntos() devuelve los asuntos de la bandeja en orden', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(profesora, 'Examen', 'Hola', [yo]);
        gestor.recibirCorreo(profesora, 'Entrega', 'Hola', [yo]);

        expect(gestor.obtenerAsuntos(yo, TipoBandeja.ENTRADA)).toEqual(['Examen', 'Entrega']);
    });

    test('obtenerAsuntos() de una bandeja vacía devuelve una lista vacía', () => {
        const gestor = new GestorCorreos();

        expect(gestor.obtenerAsuntos(yo, TipoBandeja.ENTRADA)).toEqual([]);
    });

    test('obtenerCorreosQueCumplan() filtra con la condición recibida', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(profesora, 'Examen', 'Hola', [yo]);
        gestor.recibirCorreo(profesora, 'Entrega', 'Hola', [yo]);

        const resultado = gestor.obtenerCorreosQueCumplan(yo, TipoBandeja.ENTRADA, (correo) => correo.getAsunto() === 'Examen');

        expect(resultado.map((correo) => correo.getAsunto())).toEqual(['Examen']);
    });

    test('obtenerCorreosQueCumplan() sin coincidencias devuelve una lista vacía y no modifica la bandeja', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(profesora, 'Examen', 'Hola', [yo]);

        const resultado = gestor.obtenerCorreosQueCumplan(yo, TipoBandeja.ENTRADA, () => false);

        expect(resultado).toEqual([]);
        expect(gestor.consultarBandeja(yo, TipoBandeja.ENTRADA).length).toBe(1);
    });
});

describe('GestorCorreos - favoritos con filtro (RF-09)', () => {
    const profesora = new Contacto('Ana Profesora', 'ana@ucp.edu.ar');
    const amigo = new Contacto('Jere Gomez', 'jere@gmail.com');
    const yo = new Contacto('Gonzalo Rodriguez', 'gonzalo@ucp.edu.ar');

    test('consultarFavoritosConFiltro() combina favoritos con un filtro', () => {
        const gestor = new GestorCorreos();
        const deProfe = gestor.recibirCorreo(profesora, 'Examen', 'Hola', [yo]);
        const deAmigo = gestor.recibirCorreo(amigo, 'Asado', 'Hola', [yo]);
        gestor.recibirCorreo(profesora, 'Entrega', 'Hola', [yo]);
        gestor.marcarFavorito(deProfe!.getId());
        gestor.marcarFavorito(deAmigo!.getId());

        const resultado = gestor.consultarFavoritosConFiltro(yo, Filtros.remitenteDelDominio('@ucp.edu.ar'));

        expect(resultado.map((correo) => correo.getAsunto())).toEqual(['Examen']);
    });
});