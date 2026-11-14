import { TipoBandeja } from '../bandejas/TipoBandeja';
import { ICorreoConsulta } from '../correos/ICorreoConsulta';


export interface IBuzonConsulta {
    obtenerCorreos(tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta>;
}