import type { IAgenda } from "./IAgenda"

import type { IContacto } from "./IContacto"

import type { IContactoConsulta } from "./IContactoConsulta"

export class Agenda implements IAgenda {
    private _contactos: IContacto[]

    constructor() {
        this._contactos = []
    }

    obtenerContactos(): ReadonlyArray<IContactoConsulta> {
        return [...this._contactos]
    }

    getCantidad(): number {
        return this._contactos.length
    }

    consultar(direccion: string): IContactoConsulta | undefined {
        return this.buscar(direccion)
    }

    agregar(contacto: IContacto): boolean {
        const noRepetido = this.buscar(contacto.getDireccion()) === undefined
        const aceptado = contacto.esValido() && noRepetido

        this._contactos = aceptado ? [...this._contactos, contacto] : this._contactos
        return aceptado
    }

    modificar(direccion: string, nuevoNombre: string): boolean {
        const existente = this.buscar(direccion)

        return existente !== undefined && existente.setNombreCompleto(nuevoNombre)
    }

    eliminar(direccion: string): boolean {
        const existe = this.buscar(direccion) !== undefined

        this._contactos = this._contactos.filter(contacto => !contacto.tieneDireccion(direccion))
        return existe
    }

    private buscar(direccion: string): IContacto | undefined {
        return this._contactos.find(contacto => contacto.tieneDireccion(direccion))
    }
}