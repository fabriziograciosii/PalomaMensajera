import { ICorreoConsulta } from '../correos/ICorreoConsulta';

// Un filtro tiene un nombre identificador y una condición: recibe la vista de
// solo lectura del correo y dice si cumple o no. No muta nada, no sabe de bandejas ni de buzones.
export interface IFiltro {
    getNombre(): string;
    cumple(correo: ICorreoConsulta): boolean;
}