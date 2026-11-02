import type { IContacto } from "./IContacto"



export class Contacto implements IContacto {
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
        return this._direccion.toLowerCase() === otraDireccion.toLocaleLowerCase()
    }

        esValido(): boolean {
        const nombreValido = this._nombreCompleto.trim().length > 0

        return nombreValido && this.tieneFormatoDeCorreo()
    }

    private tieneFormatoDeCorreo(): boolean {
        
        const partes = this._direccion.split("@")
        const unaSolaArroba = partes.length === 2


        const usuario = partes[0]
        const dominio = unaSolaArroba ? partes[1] : ""

        const usuarioValido = usuario.length > 0

        const dominioConPunto = dominio.includes(".")

        const puntosBienUbicados = !dominio.startsWith(".") && !dominio.endsWith(".") && !dominio.includes("..")
        const sinEspacios = !this._direccion.includes(" ")

        return unaSolaArroba && usuarioValido && dominioConPunto && puntosBienUbicados && sinEspacios
    }


    setNombreCompleto(nombreCompleto: string): boolean {
        const valido = nombreCompleto.trim().length > 0

        this._nombreCompleto = valido ? nombreCompleto : this._nombreCompleto
        return valido
    }


    
}