import { describe, test, expect } from "vitest"

import { Agenda } from "../src/contactos/Agenda"

import { Contacto } from "../src/contactos/Contacto"

import type { IAgenda } from "../src/contactos/IAgenda"

import { Correo } from "../src/correos/Correo"

describe("estado inicial", () => {

    test("una agenda nueva está vacía", () => {
        const agenda = new Agenda()

        expect(agenda.getCantidad()).toBe(0)

        expect(agenda.obtenerContactos().length).toBe(0)
    })
})

describe("agregar y consultar", () => {

    test("agregar un contacto válido lo guarda en la agenda", () => {

        const agenda = new Agenda()

        const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar")

        expect(agenda.agregar(ana)).toBe(true)
        expect(agenda.getCantidad()).toBe(1)
        expect(agenda.obtenerContactos()[0]).toBe(ana)
    })

    test("se pueden agregar varios contactos", () => {
        const agenda = new Agenda()

        agenda.agregar(new Contacto("Ana Pérez", "ana@ucp.edu.ar"))
        agenda.agregar(new Contacto("Luis Gómez", "luis@gmail.com"))

        expect(agenda.getCantidad()).toBe(2)
    })

    test("un contacto inválido no se agrega", () => {
        const agenda = new Agenda()

        expect(agenda.agregar(new Contacto("Ana", "sin-arroba"))).toBe(false)
        expect(agenda.getCantidad()).toBe(0)
    })

    test("no se puede agregar otro contacto con la misma dirección", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Ana Pérez", "ana@ucp.edu.ar"))

        expect(agenda.agregar(new Contacto("Otra Ana", "ana@ucp.edu.ar"))).toBe(false)
        expect(agenda.getCantidad()).toBe(1)
    })

    test("la dirección repetida se detecta sin distinguir mayúsculas", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Ana Pérez", "ana@ucp.edu.ar"))

        expect(agenda.agregar(new Contacto("Otra Ana", "ANA@UCP.EDU.AR"))).toBe(false)
    })

    test("consultar devuelve el contacto que tiene esa dirección", () => {
        const agenda = new Agenda()
        const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar")
        agenda.agregar(ana)

        expect(agenda.consultar("ana@ucp.edu.ar")).toBe(ana)
    })

    test("consultar una dirección que no existe devuelve undefined", () => {
        const agenda = new Agenda()

        expect(agenda.consultar("nadie@ucp.edu.ar")).toBe(undefined)
    })
})

describe("proteccion del estado interno", () => {
    test("obtenerContactos devuelve una copia, no la lista interna", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Ana Pérez", "ana@ucp.edu.ar"))

        const primera = agenda.obtenerContactos()
        const segunda = agenda.obtenerContactos()

        expect(primera === segunda).toBe(false)
        expect(primera.length).toBe(segunda.length)
    })
})

describe("modificar", () => {
    test("modificar cambia el nombre del contacto que tiene esa dirección", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar"))

        expect(agenda.modificar("fernandezjose_cen@ucp.edu.ar", "José Luis Fernandez")).toBe(true)
        expect(agenda.consultar("fernandezjose_cen@ucp.edu.ar")?.getNombreCompleto()).toBe("José Luis Fernandez")
    })

    test("modificar encuentra el contacto sin distinguir mayúsculas", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar"))

        expect(agenda.modificar("FERNANDEZJOSE_CEN@UCP.EDU.AR", "José Luis Fernandez")).toBe(true)
    })

    test("modificar un contacto que no existe devuelve false", () => {
        const agenda = new Agenda()

        expect(agenda.modificar("nadie@ucp.edu.ar", "Nadie")).toBe(false)
    })

    test("modificar con un nombre inválido devuelve false y no cambia nada", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar"))

        expect(agenda.modificar("fernandezjose_cen@ucp.edu.ar", "  ")).toBe(false)
        expect(agenda.consultar("fernandezjose_cen@ucp.edu.ar")?.getNombreCompleto()).toBe("José Fernandez")
    })

    test("modificar no cambia la cantidad de contactos", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar"))

        agenda.modificar("fernandezjose_cen@ucp.edu.ar", "José Luis Fernandez")

        expect(agenda.getCantidad()).toBe(1)
    })
})

describe("eliminar", () => {
    test("eliminar saca el contacto de la agenda", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar"))
        agenda.agregar(new Contacto("Ana Pérez", "ana@ucp.edu.ar"))

        expect(agenda.eliminar("fernandezjose_cen@ucp.edu.ar")).toBe(true)
        expect(agenda.getCantidad()).toBe(1)


        expect(agenda.consultar("fernandezjose_cen@ucp.edu.ar")).toBe(undefined)
        expect(agenda.consultar("ana@ucp.edu.ar")).not.toBe(undefined)
    })

    test("eliminar un contacto que no existe devuelve false", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar"))

        expect(agenda.eliminar("nadie@ucp.edu.ar")).toBe(false)
        expect(agenda.getCantidad()).toBe(1)
    })

    test("después de eliminar se puede volver a agregar la misma dirección", () => {
        const agenda = new Agenda()

        agenda.agregar(new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar"))

        agenda.eliminar("fernandezjose_cen@ucp.edu.ar")

        expect(agenda.agregar(new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar"))).toBe(true)
    })
})

describe("uso a través de IAgenda", () => {
    test("una agenda se puede usar como IAgenda", () => {
        const agenda: IAgenda = new Agenda()

        expect(agenda.agregar(new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar"))).toBe(true)

        expect(agenda.getCantidad()).toBe(1)

        expect(agenda.obtenerContactos().length).toBe(1)
    })

    describe("eliminar y correos historicos", () => {

    test("eliminar un contacto de la agenda no borra los correos historicos que lo referencian", () => {
        const agenda = new Agenda()

        const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar")
        const luis = new Contacto("Luis Gómez", "luis@ucp.edu.ar")

        agenda.agregar(ana)
        agenda.agregar(luis)

        const correo = new Correo(1, "Examen", "Trae tu DNI", ana, [luis])

        agenda.eliminar("ana@ucp.edu.ar")

        expect(agenda.consultar("ana@ucp.edu.ar")).toBeUndefined()
        expect(correo.getRemitente().getDireccion()).toBe("ana@ucp.edu.ar")
        expect(correo.getDestinatarios()[0].getDireccion()).toBe("luis@ucp.edu.ar")
    })
})
})