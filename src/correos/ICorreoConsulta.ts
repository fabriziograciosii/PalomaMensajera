import type { IContactoConsulta } from "../contactos/IContactoConsulta"

export interface ICorreoConsulta {
    getId(): number
    getAsunto(): string

    getCuerpo(): string

    getRemitente(): IContactoConsulta

    getDestinatarios(): ReadonlyArray<IContactoConsulta>
    estaLeido(): boolean

    esFavorito(): boolean

    esBorradorValido(): boolean
    
    esValido(): boolean

}