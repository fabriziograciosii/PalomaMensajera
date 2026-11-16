import { IFiltro } from './IFiltro';
import { Filtros } from './Filtros';
import { IContactoConsulta } from '../contactos/IContactoConsulta';

// Los filtros de ejemplo de RF-05, armados reutilizando los bloques de Filtros.
// "Correos de la UCP" se reutiliza para construir "Correos académicos importantes".
export class FiltrosPredefinidos {
    static correosDeLaUCP(): IFiltro {
        return Filtros.conNombre('Correos de la UCP', Filtros.remitenteDelDominio('@ucp.edu.ar'));
    }

    static academicosImportantes(): IFiltro {
        return Filtros.conNombre(
            'Correos académicos importantes',
            Filtros.todos([FiltrosPredefinidos.correosDeLaUCP(), Filtros.asuntoContiene('Examen')])
        );
    }

    static pendientesDeRevision(): IFiltro {
        return Filtros.conNombre(
            'Pendientes de revisión',
            Filtros.todos([Filtros.noLeido(), Filtros.cuerpoContiene('Entrega')])
        );
    }

    static personalesPrioritarios(contacto: IContactoConsulta): IFiltro {
        return Filtros.conNombre(
            'Correos personales prioritarios',
            Filtros.todos([Filtros.favorito(), Filtros.remitenteEs(contacto)])
        );
    }

    static paraSeguimiento(): IFiltro {
        return Filtros.conNombre(
            'Correos para seguimiento',
            Filtros.todos([
                Filtros.alguno([Filtros.asuntoContiene('Proyecto'), Filtros.asuntoContiene('Reunión')]),
                Filtros.noLeido(),
            ])
        );
    }
}