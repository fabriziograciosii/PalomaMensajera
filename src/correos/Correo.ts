import type { IContactoConsulta } from "../contactos/IContactoConsulta"

export class Correo {

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


}