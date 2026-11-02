import { TipoBandeja } from './TipoBandeja';
import { ICorreoConsulta } from '../correos/ICorreoConsulta';
import { Correo } from '../correos/Correo';

// Una bandeja no almacena duplicados ni reordena: solo agrupa correos bajo un mismo tipo.
export interface IBandeja {
    getTipo(): TipoBandeja;
    agregar(correo: Correo): boolean;
    quitar(correo: Correo): boolean;
    contiene(idCorreo: number): boolean;
    obtenerCorreos(): ReadonlyArray<ICorreoConsulta>;
}
