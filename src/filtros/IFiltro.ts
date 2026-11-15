import { ICorreoConsulta } from '../correos/ICorreoConsulta';



export interface IFiltro {
    cumple(correo: ICorreoConsulta): boolean;
}