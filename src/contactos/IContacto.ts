import type { IContactoConsulta } from "./IContactoConsulta"

export interface IContacto extends IContactoConsulta {

    setNombreCompleto(nombreCompleto: string): boolean
    
}