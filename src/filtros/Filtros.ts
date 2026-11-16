import { IFiltro } from './IFiltro';
import { Filtro } from './Filtro';
import { ICorreoConsulta } from '../correos/ICorreoConsulta';
import { IContactoConsulta } from '../contactos/IContactoConsulta';


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
                Filtros.textosDelCorreo(correo).some((campo) => campo.toLowerCase().includes(buscado))
        );
    }

    static asuntoContiene(texto: string): IFiltro {
        return new Filtro(`asunto contiene "${texto}"`, (correo) =>
            correo.getAsunto().toLowerCase().includes(texto.toLowerCase())
        );
    }

    static cuerpoContiene(texto: string): IFiltro {
        return new Filtro(`cuerpo contiene "${texto}"`, (correo) =>
            correo.getCuerpo().toLowerCase().includes(texto.toLowerCase())
        );
    }

    static remitenteDelDominio(dominio: string): IFiltro {
        return new Filtro(`remitente del dominio ${dominio}`, (correo) =>
            correo.getRemitente().getDireccion().toLowerCase().endsWith(dominio.toLowerCase())
        );
    }

    static remitenteEs(contacto: IContactoConsulta): IFiltro {
        return new Filtro(`remitente es ${contacto.getDireccion()}`, (correo) =>
            correo.getRemitente().tieneDireccion(contacto.getDireccion())
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

    // Todos los textos donde puede aparecer lo que se busca (RF-04).
    private static textosDelCorreo(correo: ICorreoConsulta): ReadonlyArray<string> {
        const textosDestinatarios = correo
            .getDestinatarios()
            .flatMap((destinatario) => [destinatario.getNombreCompleto(), destinatario.getDireccion()]);

        return [
            correo.getAsunto(),
            correo.getCuerpo(),
            correo.getRemitente().getNombreCompleto(),
            correo.getRemitente().getDireccion(),
            ...textosDestinatarios,
        ];
    }
}