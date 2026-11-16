import { IFiltro } from './IFiltro';
import { Filtro } from './Filtro';
import { ICorreoConsulta } from '../correos/ICorreoConsulta';

// Fábrica de filtros: no guarda estado, solo arma objetos IFiltro.
// Los filtros compuestos (todos/alguno/no) permiten combinar criterios
// sin que el código que consulta tenga que escribir ningún if.
export class Filtros {
    static favorito(): IFiltro {
        return new Filtro('favorito', (correo) => correo.esFavorito());
    }

    static noLeido(): IFiltro {
        return new Filtro('no leído', (correo) => !correo.estaLeido());
    }

    static conTexto(texto: string): IFiltro {
        const buscado = texto.toLowerCase();

        return new Filtro(
            `con texto "${texto}"`,
            (correo) =>
                buscado.length > 0 &&
                [
                    correo.getAsunto(),
                    correo.getCuerpo(),
                    correo.getRemitente().getNombreCompleto(),
                    correo.getRemitente().getDireccion(),
                ].some((campo) => campo.toLowerCase().includes(buscado))
        );
    }

    static personalizado(criterio: (correo: ICorreoConsulta) => boolean): IFiltro {
        return new Filtro('personalizado', criterio);
    }

    static conNombre(nombre: string, filtro: IFiltro): IFiltro {
        return new Filtro(nombre, (correo) => filtro.cumple(correo));
    }

    static todos(filtros: ReadonlyArray<IFiltro>): IFiltro {
        return new Filtro('todos', (correo) => filtros.every((filtro) => filtro.cumple(correo)));
    }

    static alguno(filtros: ReadonlyArray<IFiltro>): IFiltro {
        return new Filtro('alguno', (correo) => filtros.some((filtro) => filtro.cumple(correo)));
    }

    static no(filtro: IFiltro): IFiltro {
        return new Filtro(`no ${filtro.getNombre()}`, (correo) => !filtro.cumple(correo));
    }
}