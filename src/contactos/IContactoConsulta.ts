export interface IContactoConsulta {

    getNombreCompleto(): string 
    getDireccion(): string 
    tieneDireccion(otraDireccion: string): boolean
    esValido(): boolean
    
}