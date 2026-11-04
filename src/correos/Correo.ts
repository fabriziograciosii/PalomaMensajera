import type { IContactoConsulta } from "../contactos/IContactoConsulta"
import type { ICorreo } from "./ICorreo"


export class Correo implements ICorreo {

    private readonly _id: number

    private _asunto: string

    private _cuerpo: string
    private readonly _remitente: IContactoConsulta

    private _destinatarios: IContactoConsulta[]
    private _leido: boolean

    private _favorito: boolean

    constructor(id: number, asunto: string, cuerpo: string, remitente: IContactoConsulta, destinatarios: IContactoConsulta[]) {
        this._id = id
        this._asunto = asunto

        this._cuerpo = cuerpo
        this._remitente = remitente

        this._destinatarios = [...destinatarios]
        this._leido = false

        this._favorito = false
    
    }

    
    getId(): number {

        return this._id
    }

    
    getAsunto(): string {

        return this._asunto
    }

    getCuerpo(): string {

        return this._cuerpo
    }

    getRemitente(): IContactoConsulta {
        return this._remitente
    
    }

    getDestinatarios(): ReadonlyArray<IContactoConsulta> {
        return [...this._destinatarios]
    
    }

    estaLeido(): boolean {
        return this._leido
    
    }

    esFavorito(): boolean {
        return this._favorito
    
    }

        esBorradorValido(): boolean {

        const idValido = this._id > 0 && this._id % 1 === 0

        const remitenteValido = this._remitente.esValido()
        const destinatariosValidos = this._destinatarios.every(destinatario => destinatario.esValido())

        return idValido && remitenteValido && destinatariosValidos
    }

    esValido(): boolean {

        const tieneAsunto = this._asunto.trim().length > 0

        const tieneDestinatarios = this._destinatarios.length > 0

        return this.esBorradorValido() && tieneAsunto && tieneDestinatarios
    }


        setAsunto(asunto: string): void {
        this._asunto = asunto
    }

    setCuerpo(cuerpo: string): void {
        this._cuerpo = cuerpo
    }

    setDestinatarios(destinatarios: IContactoConsulta[]): boolean {
        const validos = destinatarios.every(destinatario => destinatario.esValido())

        this._destinatarios = validos ? [...destinatarios] : this._destinatarios
        return validos
    }


    marcarLeido(): void {
        this._leido = true
    }

    marcarNoLeido(): void {
        this._leido = false
    }


}