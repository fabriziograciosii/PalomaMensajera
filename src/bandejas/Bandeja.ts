import { IBandeja } from "./IBandeja"
import { TipoBandeja } from "./TipoBandeja"
import { ICorreoConsulta } from "../correos/ICorreoConsulta"
import { Correo } from "../correos/Correo"

export class Bandeja implements IBandeja {
    private readonly _tipo: TipoBandeja;
    private _correos: Correo[] = [];

    constructor(tipo: TipoBandeja) {
        this._tipo = tipo; 
    }

    getTipo(): TipoBandeja {
        return this._tipo;
    }

    // Agrega el correo solo si todavía no está en la bandeja (evita duplicados).
    agregar(correo: Correo): boolean {
        const puedeAgregarse = !this.contiene(correo.getId());
        puedeAgregarse ? this._correos.push(correo) : null;

        return puedeAgregarse; 
    }

    quitar(correo: Correo): boolean {
        const cantidadPrevia = this._correos.length;
        this._correos = this._correos.filter((actual) => actual.getId() !== correo.getId());

        return this._correos.length < cantidadPrevia; 
    }

    contiene(idCorreo: number): boolean {
        return this._correos.some((correo) => correo.getId() === idCorreo); 
    }

    obtenerCorreos(): ReadonlyArray<ICorreoConsulta> {
        return [...this._correos];
    }
}