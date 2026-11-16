import { describe, test, expect } from 'vitest';
import { GestorCorreos } from '../src/gestor/GestorCorreos';
import { TipoBandeja } from '../src/bandejas/TipoBandeja';
import { Filtro } from '../src/filtros/Filtro';
import { Filtros } from '../src/filtros/Filtros';
import { FiltrosPredefinidos } from '../src/filtros/FiltrosPredefinidos';
import { Contacto } from '../src/contactos/Contacto';

describe('GestorCorreos - registro de filtros (RF-05)', () => {
    const profesora = new Contacto('Ana Profesora', 'ana@ucp.edu.ar');
    const yo = new Contacto('Gonzalo Rodriguez', 'gonzalo@ucp.edu.ar');

    test('registra un filtro y lo encuentra por su nombre', () => {
        const gestor = new GestorCorreos();
        const filtro = FiltrosPredefinidos.correosDeLaUCP();

        expect(gestor.registrarFiltro(filtro)).toBe(true);
        expect(gestor.obtenerFiltro('Correos de la UCP')).toBe(filtro);
        expect(gestor.listarFiltros().length).toBe(1);
    });

    test('obtenerFiltro() devuelve undefined si el nombre no existe', () => {
        const gestor = new GestorCorreos();

        expect(gestor.obtenerFiltro('No existe')).toBeUndefined();
    });

    test('permite registrar hasta cinco filtros y rechaza el sexto', () => {
        const gestor = new GestorCorreos();
        const nombres = ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco'];

        nombres.forEach((nombre) => expect(gestor.registrarFiltro(Filtros.conNombre(nombre, Filtros.favorito()))).toBe(true));

        expect(gestor.registrarFiltro(Filtros.conNombre('Seis', Filtros.favorito()))).toBe(false);
        expect(gestor.listarFiltros().length).toBe(5);
        expect(gestor.obtenerFiltro('Seis')).toBeUndefined();
    });

    test('rechaza un filtro con un nombre que ya está registrado', () => {
        const gestor = new GestorCorreos();
        gestor.registrarFiltro(Filtros.conNombre('Repetido', Filtros.favorito()));

        expect(gestor.registrarFiltro(Filtros.conNombre('Repetido', Filtros.noLeido()))).toBe(false);
        expect(gestor.listarFiltros().length).toBe(1);
    });

    test('aplicarFiltro() devuelve los correos de la bandeja que cumplen el filtro', () => {
        const gestor = new GestorCorreos();
        gestor.registrarFiltro(FiltrosPredefinidos.correosDeLaUCP());
        gestor.registrarFiltro(Filtros.conNombre('Favoritos', Filtros.favorito()));
        gestor.recibirCorreo(profesora, 'Examen', 'Hola', [yo]);
        gestor.recibirCorreo(new Contacto('Jere Gomez', 'jere@gmail.com'), 'Hola', 'Chau', [yo]);

        const deLaUcp = gestor.aplicarFiltro('Correos de la UCP', yo, TipoBandeja.ENTRADA);

        expect(deLaUcp.length).toBe(1);
        expect(deLaUcp[0].getAsunto()).toBe('Examen');
    });

    test('aplicarFiltro() con un nombre inexistente devuelve una lista vacía', () => {
        const gestor = new GestorCorreos();
        gestor.recibirCorreo(profesora, 'Examen', 'Hola', [yo]);

        expect(gestor.aplicarFiltro('No existe', yo, TipoBandeja.ENTRADA)).toEqual([]);
    });

    test('el mismo filtro se puede aplicar sobre distintas bandejas', () => {
        const gestor = new GestorCorreos();
        gestor.registrarFiltro(Filtros.conNombre('Con examen', Filtros.asuntoContiene('examen')));
        gestor.enviarCorreo(yo, 'Examen de prueba', 'Hola', [profesora]);

        expect(gestor.aplicarFiltro('Con examen', yo, TipoBandeja.ENVIADOS).length).toBe(1);
        expect(gestor.aplicarFiltro('Con examen', profesora, TipoBandeja.ENTRADA).length).toBe(1);
        expect(gestor.aplicarFiltro('Con examen', yo, TipoBandeja.ENTRADA).length).toBe(0);
    });

    test('los cambios en los correos se reflejan sin volver a registrar el filtro', () => {
        const gestor = new GestorCorreos();
        gestor.registrarFiltro(Filtros.conNombre('Sin leer', Filtros.noLeido()));
        const correo = gestor.recibirCorreo(profesora, 'Examen', 'Hola', [yo]);

        expect(gestor.aplicarFiltro('Sin leer', yo, TipoBandeja.ENTRADA).length).toBe(1);
        gestor.marcarLeido(correo!.getId());
        expect(gestor.aplicarFiltro('Sin leer', yo, TipoBandeja.ENTRADA).length).toBe(0);
        gestor.marcarNoLeido(correo!.getId());
        expect(gestor.aplicarFiltro('Sin leer', yo, TipoBandeja.ENTRADA).length).toBe(1);
    });

    test('aplicar un filtro no modifica los correos originales', () => {
        const gestor = new GestorCorreos();
        gestor.registrarFiltro(Filtros.conNombre('Sin leer', Filtros.noLeido()));
        gestor.recibirCorreo(profesora, 'Examen', 'Hola', [yo]);

        gestor.aplicarFiltro('Sin leer', yo, TipoBandeja.ENTRADA);
        const correo = gestor.consultarBandeja(yo, TipoBandeja.ENTRADA)[0];

        expect(correo.estaLeido()).toBe(false);
        expect(correo.esFavorito()).toBe(false);
        expect(gestor.consultarBandeja(yo, TipoBandeja.ENTRADA).length).toBe(1);
    });

    test('se puede registrar un filtro creado con la clase Filtro', () => {
        const gestor = new GestorCorreos();
        const filtro = new Filtro('Cortos', (correo) => correo.getAsunto().length < 6);
        gestor.recibirCorreo(profesora, 'Hola', 'Chau', [yo]);
        gestor.registrarFiltro(filtro);

        expect(gestor.aplicarFiltro('Cortos', yo, TipoBandeja.ENTRADA).length).toBe(1);
    });
});