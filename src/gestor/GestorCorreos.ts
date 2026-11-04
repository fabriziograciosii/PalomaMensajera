import { IGestorCorreos, CambiosBorrador } from './IGestorCorreos';
import { TipoBandeja } from '../bandejas/TipoBandeja';
import { Bandeja } from '../bandejas/Bandeja';
import { ICorreoConsulta } from '../correos/ICorreoConsulta';
import { Correo } from '../correos/Correo';
import { IContactoConsulta } from '../contactos/IContactoConsulta';

export class GestorCorreos implements IGestorCorreos {
    private readonly _bandejas: Record<TipoBandeja, Bandeja> = Object.values(TipoBandeja).reduce(
        (acumulado, tipo) => ({ ...acumulado, [tipo]: new Bandeja(tipo) }),
        {} as Record<TipoBandeja, Bandeja>
    );

    private readonly _correosPorId: Map<number, Correo> = new Map();
    private readonly _ubicacionActual: Map<number, TipoBandeja> = new Map();
    private readonly _bandejaOrigenAntesDeEliminar: Map<number, TipoBandeja> = new Map();
    private _siguienteId: number = 1;

    crearBorrador(
        remitente: IContactoConsulta,
        asunto: string = '',
        cuerpo: string = '',
        destinatarios: ReadonlyArray<IContactoConsulta> = []
    ): ICorreoConsulta {
        const correo = new Correo(this.generarId(), asunto, cuerpo, remitente, [...destinatarios]);
        this.registrarCorreo(correo, TipoBandeja.BORRADORES);

        return correo;
    }

    recibirCorreo(
        remitente: IContactoConsulta,
        asunto: string,
        cuerpo: string,
        destinatarios: ReadonlyArray<IContactoConsulta>
    ): ICorreoConsulta | undefined {
        const correo = new Correo(this.generarId(), asunto, cuerpo, remitente, [...destinatarios]);
        const puedeRecibirse = correo.esValido();

        puedeRecibirse ? this.registrarCorreo(correo, TipoBandeja.ENTRADA) : null;

        return puedeRecibirse ? correo : undefined;
    }

    editarBorrador(id: number, cambios: CambiosBorrador): boolean {
        const esBorrador = this._ubicacionActual.get(id) === TipoBandeja.BORRADORES;
        const correo = esBorrador ? this._correosPorId.get(id) : undefined;

        cambios.asunto !== undefined && correo !== undefined ? correo.setAsunto(cambios.asunto) : null;
        cambios.cuerpo !== undefined && correo !== undefined ? correo.setCuerpo(cambios.cuerpo) : null;
        cambios.destinatarios !== undefined && correo !== undefined
            ? correo.setDestinatarios([...cambios.destinatarios])
            : null;

        return correo !== undefined;
    }

    enviarBorrador(id: number): boolean {
        const esBorrador = this._ubicacionActual.get(id) === TipoBandeja.BORRADORES;
        const correo = esBorrador ? this._correosPorId.get(id) : undefined;
        const puedeEnviarse = correo !== undefined && correo.esValido();

        puedeEnviarse ? this.moverCorreo(id, TipoBandeja.ENVIADOS) : null;

        return puedeEnviarse;
    }

    eliminarCorreo(id: number): boolean {
        const origen = this._ubicacionActual.get(id);
        const puedeEliminarse = origen !== undefined && origen !== TipoBandeja.ELIMINADOS;

        puedeEliminarse ? this._bandejaOrigenAntesDeEliminar.set(id, origen as TipoBandeja) : null;
        puedeEliminarse ? this.moverCorreo(id, TipoBandeja.ELIMINADOS) : null;

        return puedeEliminarse;
    }

    restaurarCorreo(id: number): boolean {
        const puedeRestaurarse = this._ubicacionActual.get(id) === TipoBandeja.ELIMINADOS;
        const origen = this._bandejaOrigenAntesDeEliminar.get(id) ?? TipoBandeja.ENTRADA;

        puedeRestaurarse ? this._bandejaOrigenAntesDeEliminar.delete(id) : null;
        puedeRestaurarse ? this.moverCorreo(id, origen) : null;

        return puedeRestaurarse;
    }

    marcarLeido(id: number): boolean {
        const correo = this._correosPorId.get(id);

        correo !== undefined ? correo.marcarLeido() : null;

        return correo !== undefined;
    }

    marcarNoLeido(id: number): boolean {
        const correo = this._correosPorId.get(id);

        correo !== undefined ? correo.marcarNoLeido() : null;

        return correo !== undefined;
    }

    consultarBandeja(tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta> {
        return this._bandejas[tipo].obtenerCorreos();
    }

    private registrarCorreo(correo: Correo, destino: TipoBandeja): void {
        this._correosPorId.set(correo.getId(), correo);
        this._bandejas[destino].agregar(correo);
        this._ubicacionActual.set(correo.getId(), destino);
    }

    private moverCorreo(id: number, destino: TipoBandeja): void {
        const correo = this._correosPorId.get(id) as Correo;
        const origen = this._ubicacionActual.get(id) as TipoBandeja;

        this._bandejas[origen].quitar(correo);
        this._bandejas[destino].agregar(correo);
        this._ubicacionActual.set(id, destino);
    }

    private generarId(): number {
        const id = this._siguienteId;
        this._siguienteId += 1;

        return id;
    }
}