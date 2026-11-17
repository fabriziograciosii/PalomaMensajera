import { IFiltro } from './IFiltro';
import { ICorreoConsulta } from '../correos/ICorreoConsulta';

// Un filtro es un nombre + una condición (un predicado).
// No guarda correos: solo evalúa, en el momento de la consulta, los que le pasen.
// RF-05: Filtros dinámicos. Patrón Strategy: la condición es intercambiable
export class Filtro implements IFiltro {
    private readonly _nombre: string;
    private readonly _condicion: (correo: ICorreoConsulta) => boolean;

    constructor(nombre: string, condicion: (correo: ICorreoConsulta) => boolean) {
        this._nombre = nombre;
        this._condicion = condicion;
    }

    getNombre(): string {
        return this._nombre;
    }

    cumple(correo: ICorreoConsulta): boolean {
        return this._condicion(correo);  // POLIMORFISMO: mismo método, comportamiento distinto según la condición guardada
    }
}