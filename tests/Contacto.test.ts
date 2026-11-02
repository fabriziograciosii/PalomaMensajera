import { describe, test, expect} from "vitest"
import { Contacto } from "../src/contactos/Contacto"
import type { IContacto } from "../src/contactos/IContacto"
import type { IContactoConsulta } from "../src/contactos/IContactoConsulta"

describe("Contacto", () => {
    test("guarda el nombre y la direccion de correo", () =>{
        const contacto = new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar")

        expect(contacto.getNombreCompleto()).toBe("José Fernandez")

        expect(contacto.getDireccion()).toBe("fernandezjose_cen@ucp.edu.ar")

    })
})

describe("comparar direcciones", () =>{
    test("no distingue mayusculas de minusculas", () =>{
        const contacto = new Contacto("José Fernandez","fernandezjose_cen@ucp.edu.ar" )

        expect(contacto.tieneDireccion("fernandezjose_cen@ucp.edu.ar")).toBe(true)

    })

    test("tiene direccion es falso con otra dirección", () => {
        const contacto = new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar")

        expect(contacto.tieneDireccion("cremona@hotmail.com")).toBe(false)

    })
})

describe("validez de un contacto", () => {
    test("un contacto con datos correctos es válido", () => {
        expect(new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar").esValido()).toBe(true)

    })
})

describe("nombre invalido", () => {
    test("un nombre vacío no es valido", () =>{

        expect(new Contacto("", "fernandezjose_cen@ucp.com.ar").esValido()).toBe(false)

    })

      test("un nombre con solo espacios no es válido", () => {
        expect(new Contacto("   ", "josefernandez_cen@ucp.edu.ar").esValido()).toBe(false)
    })

})

describe("dirección inválida", () => {
    test("una dirección vacía no es válida", () => {
        expect(new Contacto("José", "").esValido()).toBe(false)
    })

    test("una dirección sin arroba no es válida", () => {
        expect(new Contacto("José", "fernandezjose_cenucp.edu.ar").esValido()).toBe(false)
    
    })

    test("una dirección con dos arrobas no es válida", () => {
        expect(new Contacto("José", "fernandezjose_cen@@ucp.edu.ar").esValido()).toBe(false)
        expect(new Contacto("José", "f@ernandezjose_cen@ucp.edu.ar").esValido()).toBe(false)

    
    })

    test("una dirección sin usuario antes de la arroba no es válida", () => {
        expect(new Contacto("José", "@ucp.edu.ar").esValido()).toBe(false)
    })

    test("una dirección sin dominio después de la arroba no es válida", () => {
        expect(new Contacto("José", "fernandezjose_cen@").esValido()).toBe(false)
    })

    test("un dominio sin punto no es válido", () => {
        expect(new Contacto("José", "fernandezjose_cen@ucp").esValido()).toBe(false)
    })

    test("un dominio que empieza con punto no es válido", () => {
        expect(new Contacto("José", "ferandnezjose@.ucp.edu.ar").esValido()).toBe(false)
    })

    test("un dominio que termina con punto no es válido", () => {
        expect(new Contacto("José", "fernandezjose_cen@ucp.edu.ar.").esValido()).toBe(false)
    })

    test("un dominio con dos puntos seguidos no es válido", () => {
        expect(new Contacto("José", "fernandezjose_cen@ucp..edu.ar").esValido()).toBe(false)
    })

    test("una dirección con espacios no es válida", () => {
        expect(new Contacto("José", "fernandez jose_cen@ucp.edu.ar").esValido()).toBe(false)
    })
})

describe("cambiar el nombre", () => {
    test("setNombreCompleto cambia el nombre si es valido", () => {
        const contacto = new Contacto("José", "fernandezjose_cen@ucp.edu.ar")

        expect(contacto.setNombreCompleto("José Fernandez")).toBe(true)
        expect(contacto.getNombreCompleto()).toBe("José Fernandez")
    })

    test("setNombreCompleto con un nombre vacío devuelve false y conserva el anterior", () => {
        const contacto = new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar")

        expect(contacto.setNombreCompleto("")).toBe(false)
        expect(contacto.getNombreCompleto()).toBe("José Fernandez")
    })

    test("setNombreCompleto con solo espacios devuelve false y conserva el anterior", () => {
        const contacto = new Contacto("José Fernandez", "ferandezjose_cen@ucp.edu.ar")

        expect(contacto.setNombreCompleto("   ")).toBe(false)
        expect(contacto.getNombreCompleto()).toBe("José Fernandez")
    })

    test("cambiar el nombre no cambia la dirección", () => {
        const contacto = new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar")

        contacto.setNombreCompleto("José Fernandez")

        expect(contacto.getDireccion()).toBe("fernandezjose_cen@ucp.edu.ar")
    })
})

describe("uso a través de las interfaces", () => {

    test("un contacto se puede usar como IContacto", () => {
        const contacto: IContacto = new Contacto("Ana Pérez", "ana@ucp.edu.ar")

        expect(contacto.setNombreCompleto("José Fernandez")).toBe(true)
        expect(contacto.getNombreCompleto()).toBe("José Fernandez")
    })

    test("un contacto se puede usar como IContactoConsulta, de solo lectura", () => {
        const vista: IContactoConsulta = new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar")

        expect(vista.getNombreCompleto()).toBe("José Fernandez")

        expect(vista.getDireccion()).toBe("fernandezjose_cen@ucp.edu.ar")
        
        expect(vista.esValido()).toBe(true)
    })
})
