export class Contacto {
    private _nombreCompleto: string 
    private readonly _direccion: string 

    constructor(nombreCompleto: string, direccion: string) {

        this._nombreCompleto = nombreCompleto
        this._direccion = direccion 

    }

    getNombreCompleto(): string {
        return this._nombreCompleto

    }

    getDireccion(): string {
        return this._direccion

    }

    tieneDireccion(otraDireccion: string): boolean {
        return this._direccion.toLowerCase() ===otraDireccion.toLocaleLowerCase()
    }

}