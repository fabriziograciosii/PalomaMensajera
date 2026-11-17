import { IGestorCorreos, CambiosBorrador, Estadisticas } from "./IGestorCorreos";
import { TipoBandeja } from '../bandejas/TipoBandeja';
import { Buzon } from '../buzones/Buzon';
import { ICorreoConsulta } from '../correos/ICorreoConsulta';
import { Correo } from '../correos/Correo';
import { IContactoConsulta } from '../contactos/IContactoConsulta';
import { IFiltro } from "../filtros/IFiltro";
import { Filtros } from "../filtros/Filtros";

interface Ubicacion {
    direccion: string;
    tipo: TipoBandeja;
}

export class GestorCorreos implements IGestorCorreos {
    private static readonly MAX_FILTROS = 5;

    private readonly _buzones: Map<string, Buzon> = new Map();
    private readonly _filtros: IFiltro[] = [];
    private readonly _correosPorId: Map<number, Correo> = new Map();
    private readonly _ubicacionActual: Map<number, Ubicacion> = new Map();
    private readonly _bandejaOrigenAntesDeEliminar: Map<number, TipoBandeja> = new Map();
    private _siguienteId: number = 1;

    crearBorrador(
        remitente: IContactoConsulta,
        asunto: string = '',
        cuerpo: string = '',
        destinatarios: ReadonlyArray<IContactoConsulta> = []
    ): ICorreoConsulta {
        const correo = new Correo(this.generarId(), asunto, cuerpo, remitente, [...destinatarios]);
        this.registrarCorreo(correo, remitente.getDireccion(), TipoBandeja.BORRADORES);

        return correo;
    }

    recibirCorreo(
        remitente: IContactoConsulta,
        asunto: string,
        cuerpo: string,
        destinatarios: ReadonlyArray<IContactoConsulta>
    ): ICorreoConsulta | undefined {
        const destinatariosUnicos = this.destinatariosUnicos(destinatarios);
        const prototipo = new Correo(this.generarId(), asunto, cuerpo, remitente, [...destinatariosUnicos]);
        const puedeRecibirse = prototipo.esValido();

        const copiaPrincipal: Correo | undefined = puedeRecibirse
            ? destinatariosUnicos.reduce<Correo | undefined>((primeraCopia, destinatario) => {
                  const copia = primeraCopia === undefined ? prototipo : (prototipo.clonar(this.generarId()) as Correo);
                  this.registrarCorreo(copia, destinatario.getDireccion(), TipoBandeja.ENTRADA);

                  return primeraCopia ?? copia;
              }, undefined)
            : undefined;

        return puedeRecibirse ? copiaPrincipal : undefined;
    }

    editarBorrador(id: number, cambios: CambiosBorrador): boolean {
        const ubicacion = this._ubicacionActual.get(id);
        const esBorrador = ubicacion?.tipo === TipoBandeja.BORRADORES;
        const correo = esBorrador ? this._correosPorId.get(id) : undefined;

        cambios.asunto !== undefined && correo !== undefined ? correo.setAsunto(cambios.asunto) : null;
        cambios.cuerpo !== undefined && correo !== undefined ? correo.setCuerpo(cambios.cuerpo) : null;
        cambios.destinatarios !== undefined && correo !== undefined
            ? correo.setDestinatarios([...cambios.destinatarios])
            : null;

        return correo !== undefined;
    }

    enviarBorrador(id: number): boolean {
        const ubicacion = this._ubicacionActual.get(id);
        const esBorrador = ubicacion?.tipo === TipoBandeja.BORRADORES;
        const correo = esBorrador ? this._correosPorId.get(id) : undefined;
        const puedeEnviarse = correo !== undefined && correo.esValido();

        puedeEnviarse ? this.moverCorreo(id, TipoBandeja.ENVIADOS) : null;
        puedeEnviarse
            ? this.destinatariosUnicos(correo!.getDestinatarios()).forEach((destinatario) =>
                  this.registrarCorreo(correo!.clonar(this.generarId()) as Correo, destinatario.getDireccion(), TipoBandeja.ENTRADA)
              )
            : null;

        return puedeEnviarse;
    }

    // RF-07: eliminación lógica + restauración al origen
    eliminarCorreo(id: number): boolean {
        const ubicacion = this._ubicacionActual.get(id);
        const puedeEliminarse = ubicacion !== undefined && ubicacion.tipo !== TipoBandeja.ELIMINADOS;

        puedeEliminarse ? this._bandejaOrigenAntesDeEliminar.set(id, ubicacion!.tipo) : null;
        puedeEliminarse ? this.moverCorreo(id, TipoBandeja.ELIMINADOS) : null;

        return puedeEliminarse;
    }

    restaurarCorreo(id: number): boolean {
        const ubicacion = this._ubicacionActual.get(id);
        const puedeRestaurarse = ubicacion !== undefined && ubicacion.tipo === TipoBandeja.ELIMINADOS;
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

    consultarNoLeidos(propietario: IContactoConsulta, tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta> {
    return this.consultarConFiltro(propietario, tipo, Filtros.noLeido());
    
    }

    enviarCorreo( // RF-02: Envío de correo
        remitente: IContactoConsulta,
        asunto: string,
        cuerpo: string,
        destinatarios: ReadonlyArray<IContactoConsulta>
    ): ICorreoConsulta | undefined {
        // remitente: IContactoConsulta -> Sustitución de Liskov (L): acepta cualquier implementación
        const destinatariosUnicos = this.destinatariosUnicos(destinatarios);
        const copiaRemitente = new Correo(this.generarId(), asunto, cuerpo, remitente, [...destinatariosUnicos]);
        const puedeEnviarse = copiaRemitente.esValido();

        puedeEnviarse ? this.registrarCorreo(copiaRemitente, remitente.getDireccion(), TipoBandeja.ENVIADOS) : null;
        puedeEnviarse
            ? destinatariosUnicos.forEach((destinatario) =>
                  this.registrarCorreo(copiaRemitente.clonar(this.generarId()) as Correo, destinatario.getDireccion(), TipoBandeja.ENTRADA)
              )
            : null;

        return puedeEnviarse ? copiaRemitente : undefined;
    }

    marcarFavorito(id: number): boolean {
        const correo = this._correosPorId.get(id);

        correo !== undefined ? correo.marcarFavorito() : null;

        return correo !== undefined;
    }

    desmarcarFavorito(id: number): boolean {
        const correo = this._correosPorId.get(id);

        correo !== undefined ? correo.desmarcarFavorito() : null;

        return correo !== undefined;
    }
    // RF-09: favoritos — ejemplo de POLIMORFISMO en tu propio código
    consultarFavoritos(propietario: IContactoConsulta): ReadonlyArray<ICorreoConsulta> {
    return Object.values(TipoBandeja)
        .filter((tipo) => tipo !== TipoBandeja.ELIMINADOS)
        .flatMap((tipo) => this.consultarConFiltro(propietario, tipo, Filtros.favorito()));
    } // consultarConFiltro llama filtro.cumple(correo) sin saber qué IFiltro es -> polimorfismo

    consultarBandeja(propietario: IContactoConsulta, tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta> {
        const buzon = this._buzones.get(this.normalizar(propietario));

        return buzon?.obtenerCorreos(tipo) ?? [];
    }

    registrarFiltro(filtro: IFiltro): boolean {
        const hayLugar = this._filtros.length < GestorCorreos.MAX_FILTROS;
        const nombreLibre = this.obtenerFiltro(filtro.getNombre()) === undefined;
        const puedeRegistrarse = hayLugar && nombreLibre;

        puedeRegistrarse ? this._filtros.push(filtro) : null;

        return puedeRegistrarse;
    }

    obtenerFiltro(nombre: string): IFiltro | undefined {
        return this._filtros.find((filtro) => filtro.getNombre() === nombre);
    }

    listarFiltros(): ReadonlyArray<IFiltro> {
        return [...this._filtros];
    }

    aplicarFiltro(nombre: string, propietario: IContactoConsulta, tipo: TipoBandeja): ReadonlyArray<ICorreoConsulta> {
        const filtro = this.obtenerFiltro(nombre);

        return filtro === undefined ? [] : this.consultarConFiltro(propietario, tipo, filtro);
    }

    consultarFavoritosConFiltro(propietario: IContactoConsulta, filtro: IFiltro): ReadonlyArray<ICorreoConsulta> {
        return this.consultarFavoritos(propietario).filter((correo) => filtro.cumple(correo));
    }

    obtenerAsuntos(propietario: IContactoConsulta, tipo: TipoBandeja): ReadonlyArray<string> {
        return this.consultarBandeja(propietario, tipo).map((correo) => correo.getAsunto());
    }

    obtenerCorreosQueCumplan(
        propietario: IContactoConsulta,
        tipo: TipoBandeja,
        condicion: (correo: ICorreoConsulta) => boolean
    ): ReadonlyArray<ICorreoConsulta> {
        return this.consultarBandeja(propietario, tipo).filter(condicion);
    }
        // RF-04: búsqueda (solo lectura: ICorreoConsulta/IContactoConsulta -> segregación de interfaces)
        buscarCorreos(propietario: IContactoConsulta, texto: string): ReadonlyArray<ICorreoConsulta> {
        const buscado = texto.toLowerCase();

        return buscado.length === 0
            ? []
            : this.consultarBandeja(propietario, TipoBandeja.ENTRADA).filter((correo) =>
                  this.coincideConTexto(correo, buscado)
              );
    }

    private coincideConTexto(correo: ICorreoConsulta, buscado: string): boolean {
        const camposDelRemitente = [correo.getRemitente().getNombreCompleto(), correo.getRemitente().getDireccion()];
        const camposDeDestinatarios = correo
            .getDestinatarios()
            .flatMap((destinatario) => [destinatario.getNombreCompleto(), destinatario.getDireccion()]);

        return [correo.getAsunto(), correo.getCuerpo(), ...camposDelRemitente, ...camposDeDestinatarios].some((campo) =>
            campo.toLowerCase().includes(buscado)
        );
    }

    private destinatariosUnicos(destinatarios: ReadonlyArray<IContactoConsulta>): ReadonlyArray<IContactoConsulta> {
        return destinatarios.filter(
            (contacto, indice, lista) => lista.findIndex((otro) => otro.tieneDireccion(contacto.getDireccion())) === indice
        );
    }

    private normalizar(propietario: IContactoConsulta): string {
        return propietario.getDireccion().toLowerCase();
    }

    private registrarCorreo(correo: Correo, direccion: string, destino: TipoBandeja): void {
        const clave = direccion.toLowerCase();
        const buzon = this._buzones.get(clave) ?? this.crearBuzon(clave);

        this._correosPorId.set(correo.getId(), correo);
        buzon.agregar(correo, destino);
        this._ubicacionActual.set(correo.getId(), { direccion: clave, tipo: destino });
    }
    // DEBILIDAD reconocida (D floja): crea objetos concretos directamente
    private crearBuzon(clave: string): Buzon {
        const buzon = new Buzon();
        this._buzones.set(clave, buzon);

        return buzon;
    }

    private moverCorreo(id: number, destino: TipoBandeja): void {
        const correo = this._correosPorId.get(id) as Correo;
        const ubicacion = this._ubicacionActual.get(id) as Ubicacion;
        const buzon = this._buzones.get(ubicacion.direccion) as Buzon;

        buzon.quitar(correo, ubicacion.tipo);
        buzon.agregar(correo, destino);
        this._ubicacionActual.set(id, { direccion: ubicacion.direccion, tipo: destino });
    }

    private generarId(): number {
        const id = this._siguienteId;
        this._siguienteId += 1;

        return id;
    }

    consultarConFiltro(propietario: IContactoConsulta, tipo: TipoBandeja, filtro: IFiltro): ReadonlyArray<ICorreoConsulta> {
    return this.consultarBandeja(propietario, tipo).filter((correo) => filtro.cumple(correo));
    }

    estadisticas(propietario: IContactoConsulta): Estadisticas {
    const porBandeja = Object.values(TipoBandeja).reduce(
        (acumulado, tipo) => ({ ...acumulado, [tipo]: this.consultarBandeja(propietario, tipo).length }),
        {} as Record<TipoBandeja, number>
    );

    const sinEliminados = Object.values(TipoBandeja)
        .filter((tipo) => tipo !== TipoBandeja.ELIMINADOS)
        .flatMap((tipo) => this.consultarBandeja(propietario, tipo));

    return {
        total: sinEliminados.length,
        leidos: sinEliminados.filter((correo) => correo.estaLeido()).length,
        noLeidos: sinEliminados.filter((correo) => !correo.estaLeido()).length,
        favoritos: sinEliminados.filter((correo) => correo.esFavorito()).length,
        porBandeja,
    };
}
}
