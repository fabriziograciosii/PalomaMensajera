import { describe, test, expect } from "vitest"
import { Contacto } from "../src/contactos/Contacto"
import type { IContacto } from "../src/contactos/IContacto"
import type { IContactoConsulta } from "../src/contactos/IContactoConsulta"

describe("Contacto", () => {
    test("guarda el nombre y la direccion de correo", () => {
        const contacto = new Contacto("Ignacio Cremona", "ignaciocremona@ucp.edu.ar")

        expect(contacto.getNombreCompleto()).toBe("Ignacio Cremona")

        expect(contacto.getDireccion()).toBe("ignaciocremona@ucp.edu.ar")
    })
})

describe("comparar direcciones", () => {
    test("no distingue mayusculas de minusculas", () => {
        const contacto = new Contacto("Ignacio Cremona", "ignaciocremona@ucp.edu.ar")

        expect(contacto.tieneDireccion("IGNACIOCREMONA@ucp.edu.ar")).toBe(true)
    })

    test("tiene direccion es falso con otra dirección", () => {
        const contacto = new Contacto("Ignacio Cremona", "ignaciocremona@ucp.edu.ar")

        expect(contacto.tieneDireccion("fabriziograciosi@hotmail.com")).toBe(false)
    })
})

describe("validez de un contacto", () => {
    test("un contacto con datos correctos es válido", () => {
        expect(new Contacto("Fabrizio Graciosi", "fabriziograciosi@ucp.edu.ar").esValido()).toBe(true)
    })
})

describe("nombre invalido", () => {
    test("un nombre vacío no es valido", () => {
        expect(new Contacto("", "gonzalorodriguez@ucp.edu.ar").esValido()).toBe(false)
    })

    test("un nombre con solo espacios no es válido", () => {
        expect(new Contacto("   ", "gonzalorodriguez@ucp.edu.ar").esValido()).toBe(false)
    })
})

describe("dirección inválida", () => {
    test("una dirección vacía no es válida", () => {
        expect(new Contacto("Gonzalo", "").esValido()).toBe(false)
    })

    test("una dirección sin arroba no es válida", () => {
        expect(new Contacto("Gonzalo", "gonzalorodriguezucp.edu.ar").esValido()).toBe(false)
    })

    test("una dirección con dos arrobas no es válida", () => {
        expect(new Contacto("Gonzalo", "gonzalorodriguez@@ucp.edu.ar").esValido()).toBe(false)
        expect(new Contacto("Gonzalo", "g@onzalorodriguez@ucp.edu.ar").esValido()).toBe(false)
    })

    test("una dirección sin usuario antes de la arroba no es válida", () => {
        expect(new Contacto("Gonzalo", "@ucp.edu.ar").esValido()).toBe(false)
    })

    test("una dirección sin dominio después de la arroba no es válida", () => {
        expect(new Contacto("Gonzalo", "gonzalorodriguez@").esValido()).toBe(false)
    })

    test("un dominio sin punto no es válido", () => {
        expect(new Contacto("Gonzalo", "gonzalorodriguez@ucp").esValido()).toBe(false)
    })

    test("un dominio que empieza con punto no es válido", () => {
        expect(new Contacto("Gonzalo", "gonzalorodriguez@.ucp.edu.ar").esValido()).toBe(false)
    })

    test("un dominio que termina con punto no es válido", () => {
        expect(new Contacto("Gonzalo", "gonzalorodriguez@ucp.edu.ar.").esValido()).toBe(false)
    })

    test("un dominio con dos puntos seguidos no es válido", () => {
        expect(new Contacto("Gonzalo", "gonzalorodriguez@ucp..edu.ar").esValido()).toBe(false)
    })

    test("una dirección con espacios no es válida", () => {
        expect(new Contacto("Gonzalo", "gonzalo rodriguez@ucp.edu.ar").esValido()).toBe(false)
    })
})

describe("cambiar el nombre", () => {
    test("setNombreCompleto cambia el nombre si es valido", () => {
        const contacto = new Contacto("Jere", "jeremorales@ucp.edu.ar")

        expect(contacto.setNombreCompleto("Jere Morales")).toBe(true)
        expect(contacto.getNombreCompleto()).toBe("Jere Morales")
    })

    test("setNombreCompleto con un nombre vacío devuelve false y conserva el anterior", () => {
        const contacto = new Contacto("Jere Morales", "jeremorales@ucp.edu.ar")

        expect(contacto.setNombreCompleto("")).toBe(false)
        expect(contacto.getNombreCompleto()).toBe("Jere Morales")
    })

    test("setNombreCompleto con solo espacios devuelve false y conserva el anterior", () => {
        const contacto = new Contacto("Jere Morales", "jeremorales@ucp.edu.ar")

        expect(contacto.setNombreCompleto("   ")).toBe(false)
        expect(contacto.getNombreCompleto()).toBe("Jere Morales")
    })

    test("cambiar el nombre no cambia la dirección", () => {
        const contacto = new Contacto("Jere Morales", "jeremorales@ucp.edu.ar")

        contacto.setNombreCompleto("Jeremías Morales")

        expect(contacto.getDireccion()).toBe("jeremorales@ucp.edu.ar")
    })
})

describe("uso a través de las interfaces", () => {
    test("un contacto se puede usar como IContacto", () => {
        const contacto: IContacto = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar")

        expect(contacto.setNombreCompleto("Fabrizio Graciosi")).toBe(true)
        expect(contacto.getNombreCompleto()).toBe("Fabrizio Graciosi")
    })

    test("un contacto se puede usar como IContactoConsulta, de solo lectura", () => {
        const vista: IContactoConsulta = new Contacto("Gonzalo Rodríguez", "gonzalo@ucp.edu.ar")

        expect(vista.getNombreCompleto()).toBe("Gonzalo Rodríguez")

        expect(vista.getDireccion()).toBe("gonzalo@ucp.edu.ar")

        expect(vista.esValido()).toBe(true)
    })
})