import type { IContactoConsulta } from "../contactos/IContactoConsulta"
import type { ICorreoConsulta } from "./ICorreoConsulta"

export interface ICorreo extends ICorreoConsulta {
    setAsunto(asunto: string): void
    setCuerpo(cuerpo: string): void
    setDestinatarios(destinatarios: IContactoConsulta[]): boolean
}