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

    consultarConFiltro(propietario: IContactoConsulta, tipo: TipoBandeja, filtro: IFiltro): ReadonlyArray<ICorreoConsulta>;
    registrarFiltro(filtro: IFiltro): boolean;
    obtenerFiltro(nombre: string): IFiltro | undefined;
    listarFiltros(): ReadonlyArray<IFiltro>;
    aplicarFiltro(nombre: string, propietario: IContactoConsulta, tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta>;
    consultarFavoritosConFiltro(propietario: IContactoConsulta, filtro: IFiltro): ReadonlyArray<ICorreoConsulta>;
    obtenerAsuntos(propietario: IContactoConsulta, tipo: TipoBandeja): ReadonlyArray<string>;
    obtenerCorreosQueCumplan(
        propietario: IContactoConsulta,
        tipo: TipoBandeja,
        condicion: (correo: ICorreoConsulta) => boolean
    ): ReadonlyArray<ICorreoConsulta>;

   
    buscarCorreos(propietario: IContactoConsulta, texto: string): ReadonlyArray<ICorreoConsulta>;

    estadisticas(propietario: IContactoConsulta): Estadisticas;
}