import { TipoBandeja } from '../bandejas/TipoBandeja';
import { Correo } from '../correos/Correo';
import { IBuzonConsulta } from './IBuzonConsulta';


export interface IBuzon extends IBuzonConsulta {
    agregar(correo: Correo, tipo: TipoBandeja): boolean;
    quitar(correo: Correo, tipo: TipoBandeja): boolean;
}