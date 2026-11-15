import { IBuzon } from './IBuzon';
import { TipoBandeja } from '../bandejas/TipoBandeja';
import { Bandeja } from '../bandejas/Bandeja';
import { Correo } from '../correos/Correo';
import { ICorreoConsulta } from '../correos/ICorreoConsulta';

// Un buzón agrupa las 4 bandejas de una sola dirección (su "casilla" completa).
export class Buzon implements IBuzon {
    private readonly _bandejas: Record<TipoBandeja, Bandeja> = Object.values(TipoBandeja).reduce(
        (acumulado, tipo) => ({ ...acumulado, [tipo]: new Bandeja(tipo) }),
        {} as Record<TipoBandeja, Bandeja>
    );

    agregar(correo: Correo, tipo: TipoBandeja): boolean {
        return this._bandejas[tipo].agregar(correo);
    }

    quitar(correo: Correo, tipo: TipoBandeja): boolean {
        return this._bandejas[tipo].quitar(correo);
    }

    obtenerCorreos(tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta> {
        return this._bandejas[tipo].obtenerCorreos();
    }
}
