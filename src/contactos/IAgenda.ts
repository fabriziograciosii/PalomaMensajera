import type { IContacto} from "./IContacto"
import type { IContactoConsulta } from "./IContactoConsulta"

export interface IAgenda {

    agregar(contacto: IContacto): boolean
    consultar(direccion: string): IContactoConsulta | undefined 
    modificar(direccion: string, nuevoNombre: string): boolean
    obtenerContactos(): Readonly<IContactoConsulta>
    getCantidad(): number
    
}