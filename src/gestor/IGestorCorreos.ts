import { TipoBandeja } from "../bandejas/TipoBandeja"
import { ICorreoConsulta } from "../correos/ICorreoConsulta"
import { IContactoConsulta } from "../contactos/IContactoConsulta"

export interface CambiosBorrador {
    asunto?: string;
    cuerpo?: string;
    destinatarios?: ReadonlyArray<IContactoConsulta>;
}

// Coordinador central: es el único punto de entrada para crear, mover y consultar correos.
// Nunca entrega un Correo mutable hacia afuera, solo su vista de consulta (ICorreoConsulta).
// Ninguna operación lanza errores: devuelve boolean (o undefined) para indicar si se pudo hacer.

export interface IGestorCorreos {
    crearBorrador(
        remitente: IContactoConsulta,
        asunto?: string,
        cuerpo?: string,
        destinatarios?: ReadonlyArray<IContactoConsulta>
    ): ICorreoConsulta;
        recibirCorreo(
        remitente: IContactoConsulta,
        asunto: string,
        cuerpo: string,
        destinatarios: ReadonlyArray<IContactoConsulta>
    ): ICorreoConsulta | undefined;
    editarBorrador(id: number, cambios: CambiosBorrador): boolean;
    enviarBorrador(id: number): boolean;
    eliminarCorreo(id: number): boolean;
    restaurarCorreo(id: number): boolean;
    consultarBandeja(tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta>;
    marcarLeido(id: number): boolean;
    marcarNoLeido(id: number): boolean;
}