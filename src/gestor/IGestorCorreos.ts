import { TipoBandeja } from "../bandejas/TipoBandeja"
import { ICorreoConsulta } from "../correos/ICorreoConsulta"
import { IContactoConsulta } from "../contactos/IContactoConsulta"
import { IFiltro } from "../filtros/IFiltro"


export interface CambiosBorrador {
    asunto?: string;
    
    cuerpo?: string;
    destinatarios?: ReadonlyArray<IContactoConsulta>;

}

export interface Estadisticas {

    total: number;
    
    leidos: number;
    noLeidos: number;
    favoritos: number;
    porBandeja: Record<TipoBandeja, number>;
}



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
    marcarLeido(id: number): boolean;
    marcarNoLeido(id: number): boolean;
    enviarCorreo( remitente: IContactoConsulta, asunto: string, cuerpo: string, destinatarios: ReadonlyArray<IContactoConsulta>): ICorreoConsulta | undefined

    marcarFavorito(id:number): boolean
    desmarcarFavorito(id:number): boolean

    consultarBandeja(propietario: IContactoConsulta, tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta>;
    consultarNoLeidos(propietario: IContactoConsulta, tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta>;
    consultarFavoritos(propietario: IContactoConsulta): ReadonlyArray<ICorreoConsulta>
<<<<<<< HEAD

    consultarConFiltro(propietario: IContactoConsulta, tipo: TipoBandeja, filtro: IFiltro): ReadonlyArray<ICorreoConsulta>;

    estadisticas(propietario: IContactoConsulta): Estadisticas;

}
=======
        consultarBandeja(propietario: IContactoConsulta, tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta>;
    consultarNoLeidos(propietario: IContactoConsulta, tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta>;
    consultarFavoritos(propietario: IContactoConsulta): ReadonlyArray<ICorreoConsulta>

    // RF-04: busca SOLO en la bandeja de Entrada, comparando asunto, cuerpo,
    // remitente (nombre y dirección) y cada destinatario (nombre y dirección).
    buscarCorreos(propietario: IContactoConsulta, texto: string): ReadonlyArray<ICorreoConsulta>;
}
>>>>>>> origin/main
