import { IFiltro } from './IFiltro';
import { ICorreoConsulta } from '../correos/ICorreoConsulta';

export class Filtros {
    static favorito(): IFiltro {
        return { cumple: (correo) => correo.esFavorito() };
    }

    static noLeido(): IFiltro {
        return { cumple: (correo) => !correo.estaLeido() };
    }

    static conTexto(texto: string): IFiltro {
        const buscado = texto.toLowerCase();

        return {
            cumple: (correo) =>
                buscado.length > 0 &&
                [
                    correo.getAsunto(),
                    
                    correo.getCuerpo(),
                    
                    correo.getRemitente().getNombreCompleto(),
                    
                    correo.getRemitente().getDireccion(),
                ].some((campo) => campo.toLowerCase().includes(buscado)),
        };
    }

    static personalizado(criterio: (correo: ICorreoConsulta) => boolean): IFiltro {
        return { cumple: criterio };
    }


    static todos(filtros: ReadonlyArray<IFiltro>): IFiltro {
        return { cumple: (correo) => filtros.every((filtro) => filtro.cumple(correo)) };
    }


    static alguno(filtros: ReadonlyArray<IFiltro>): IFiltro {
        return { cumple: (correo) => filtros.some((filtro) => filtro.cumple(correo)) };
    }


    static no(filtro: IFiltro): IFiltro {
        return { cumple: (correo) => !filtro.cumple(correo) };
    }


    
}