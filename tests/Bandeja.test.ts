import { describe, test, expect } from 'vitest';
import { Bandeja } from '../src/bandejas/Bandeja';
import { TipoBandeja } from '../src/bandejas/TipoBandeja';
import { Correo } from '../src/correos/Correo';
import { Contacto } from '../src/contactos/Contacto';

describe('Entidad Bandeja (RF-06)', () => {
    const remitente = new Contacto('Ana Pérez', 'ana@ucp.edu.ar');
    const destinatario = new Contacto('Luis Gómez', 'luis@ucp.edu.ar');

    test('Se crea vacía, con el tipo indicado', () => {
        const bandeja = new Bandeja(TipoBandeja.ENTRADA);

        expect(bandeja.getTipo()).toBe(TipoBandeja.ENTRADA);
        expect(bandeja.obtenerCorreos()).toEqual([]);
    });

    test('Permite agregar un correo y consultarlo después', () => {
        const bandeja = new Bandeja(TipoBandeja.ENTRADA);
        const correo = new Correo(1, remitente, 'Asunto', 'Cuerpo', [destinatario]);

        const agregado = bandeja.agregar(correo);

        expect(agregado).toBe(true);
        expect(bandeja.contiene(1)).toBe(true);
        expect(bandeja.obtenerCorreos().length).toBe(1);
    });

    test('Rechaza agregar dos veces el mismo correo (evita duplicados)', () => {
        const bandeja = new Bandeja(TipoBandeja.ENTRADA);
        const correo = new Correo(1, remitente, 'Asunto', 'Cuerpo', [destinatario]);
        bandeja.agregar(correo);

        const agregadoDeNuevo = bandeja.agregar(correo);

        expect(agregadoDeNuevo).toBe(false);
        expect(bandeja.obtenerCorreos().length).toBe(1);
    });

    test('Permite quitar un correo que está en la bandeja', () => {
        const bandeja = new Bandeja(TipoBandeja.ENTRADA);
        const correo = new Correo(1, remitente, 'Asunto', 'Cuerpo', [destinatario]);
        bandeja.agregar(correo);

        const quitado = bandeja.quitar(correo);

        expect(quitado).toBe(true);
        expect(bandeja.contiene(1)).toBe(false);
    });

    test('Quitar un correo que no está en la bandeja devuelve false', () => {
        const bandeja = new Bandeja(TipoBandeja.ENTRADA);
        const correo = new Correo(1, remitente, 'Asunto', 'Cuerpo', [destinatario]);

        expect(bandeja.quitar(correo)).toBe(false);
    });
});
