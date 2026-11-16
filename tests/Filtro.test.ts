import { describe, test, expect } from 'vitest';
import { Filtro } from '../src/filtros/Filtro';
import { Correo } from '../src/correos/Correo';
import { Contacto } from '../src/contactos/Contacto';

describe("Filtro - nombre y condición", () => {
    const remitente = new Contacto('Ignacio Cremona', 'ignacio@ucp.edu.ar');
    const destinatario = new Contacto('Fabrizio Graciosi', 'fabrizio@ucp.edu.ar');

    test("guarda su nombre identificador", () => {
        const filtro = new Filtro('Urgentes', (correo) => correo.getAsunto().includes('Urgente'));

        expect(filtro.getNombre()).toBe('Urgentes');
    });

    test("cumple() evalúa la condición que recibió", () => {
        const filtro = new Filtro('Urgentes', (correo) => correo.getAsunto().includes('Urgente'));
        const urgente = new Correo(1, 'Urgente: parcial', 'Hola', remitente, [destinatario]);
        const comun = new Correo(2, 'Aviso', 'Hola', remitente, [destinatario]);

        expect(filtro.cumple(urgente)).toBe(true);
        expect(filtro.cumple(comun)).toBe(false);
    });

    test("evaluar un correo no lo modifica", () => {
        const filtro = new Filtro('Urgentes', (correo) => correo.getAsunto().includes('Urgente'));
        const correo = new Correo(1, 'Urgente: parcial', 'Hola', remitente, [destinatario]);

        filtro.cumple(correo);

        expect(correo.estaLeido()).toBe(false);
        expect(correo.esFavorito()).toBe(false);
        expect(correo.getAsunto()).toBe('Urgente: parcial');
    });
});