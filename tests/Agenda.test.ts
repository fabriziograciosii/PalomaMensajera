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
        const ignacio = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar")

        expect(agenda.agregar(ignacio)).toBe(true)
        expect(agenda.getCantidad()).toBe(1)
        expect(agenda.obtenerContactos()[0]).toBe(ignacio)
    })

    test("se pueden agregar varios contactos", () => {
        const agenda = new Agenda()

        agenda.agregar(new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar"))
        agenda.agregar(new Contacto("Fabrizio Graciosi", "fabrizio@gmail.com"))

        expect(agenda.getCantidad()).toBe(2)
    })

    test("un contacto inválido no se agrega", () => {
        const agenda = new Agenda()

        expect(agenda.agregar(new Contacto("Ignacio", "sin-arroba"))).toBe(false)
        expect(agenda.getCantidad()).toBe(0)
    })

    test("no se puede agregar otro contacto con la misma dirección", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar"))

        expect(agenda.agregar(new Contacto("Otro Ignacio", "ignacio@ucp.edu.ar"))).toBe(false)
        expect(agenda.getCantidad()).toBe(1)
    })

    test("la dirección repetida se detecta sin distinguir mayúsculas", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar"))

        expect(agenda.agregar(new Contacto("Otro Ignacio", "IGNACIO@UCP.EDU.AR"))).toBe(false)
    })

    test("consultar devuelve el contacto que tiene esa dirección", () => {
        const agenda = new Agenda()
        const ignacio = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar")
        agenda.agregar(ignacio)

        expect(agenda.consultar("ignacio@ucp.edu.ar")).toBe(ignacio)
    })

    test("consultar una dirección que no existe devuelve undefined", () => {
        const agenda = new Agenda()

        expect(agenda.consultar("nadie@ucp.edu.ar")).toBe(undefined)
    })
})

describe("proteccion del estado interno", () => {
    test("obtenerContactos devuelve una copia, no la lista interna", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar"))

        const primera = agenda.obtenerContactos()
        const segunda = agenda.obtenerContactos()

        expect(primera === segunda).toBe(false)
        expect(primera.length).toBe(segunda.length)
    })
})

describe("modificar", () => {
    test("modificar cambia el nombre del contacto que tiene esa dirección", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Gonzalo Rodríguez", "gonzalo@ucp.edu.ar"))

        expect(agenda.modificar("gonzalo@ucp.edu.ar", "Gonzalo Agustín Rodríguez")).toBe(true)
        expect(agenda.consultar("gonzalo@ucp.edu.ar")?.getNombreCompleto()).toBe("Gonzalo Agustín Rodríguez")
    })

    test("modificar encuentra el contacto sin distinguir mayúsculas", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Gonzalo Rodríguez", "gonzalo@ucp.edu.ar"))

        expect(agenda.modificar("GONZALO@UCP.EDU.AR", "Gonzalo Agustín Rodríguez")).toBe(true)
    })

    test("modificar un contacto que no existe devuelve false", () => {
        const agenda = new Agenda()

        expect(agenda.modificar("nadie@ucp.edu.ar", "Nadie")).toBe(false)
    })

    test("modificar con un nombre inválido devuelve false y no cambia nada", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Gonzalo Rodríguez", "gonzalo@ucp.edu.ar"))

        expect(agenda.modificar("gonzalo@ucp.edu.ar", "  ")).toBe(false)
        expect(agenda.consultar("gonzalo@ucp.edu.ar")?.getNombreCompleto()).toBe("Gonzalo Rodríguez")
    })

    test("modificar no cambia la cantidad de contactos", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Gonzalo Rodríguez", "gonzalo@ucp.edu.ar"))

        agenda.modificar("gonzalo@ucp.edu.ar", "Gonzalo Agustín Rodríguez")

        expect(agenda.getCantidad()).toBe(1)
    })
})

describe("eliminar", () => {
    test("eliminar saca el contacto de la agenda", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Jere Morales", "jere@ucp.edu.ar"))
        agenda.agregar(new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar"))

        expect(agenda.eliminar("jere@ucp.edu.ar")).toBe(true)
        expect(agenda.getCantidad()).toBe(1)

        expect(agenda.consultar("jere@ucp.edu.ar")).toBe(undefined)
        expect(agenda.consultar("ignacio@ucp.edu.ar")).not.toBe(undefined)
    })

    test("eliminar un contacto que no existe devuelve false", () => {
        const agenda = new Agenda()
        agenda.agregar(new Contacto("Jere Morales", "jere@ucp.edu.ar"))

        expect(agenda.eliminar("nadie@ucp.edu.ar")).toBe(false)
        expect(agenda.getCantidad()).toBe(1)
    })

    test("después de eliminar se puede volver a agregar la misma dirección", () => {
        const agenda = new Agenda()

        agenda.agregar(new Contacto("Jere Morales", "jere@ucp.edu.ar"))

        agenda.eliminar("jere@ucp.edu.ar")

        expect(agenda.agregar(new Contacto("Jere Morales", "jere@ucp.edu.ar"))).toBe(true)
    })
})

describe("uso a través de IAgenda", () => {
    test("una agenda se puede usar como IAgenda", () => {
        const agenda: IAgenda = new Agenda()

        expect(agenda.agregar(new Contacto("Jere Morales", "jere@ucp.edu.ar"))).toBe(true)
        expect(agenda.getCantidad()).toBe(1)
        expect(agenda.obtenerContactos().length).toBe(1)
    })

    describe("eliminar y correos historicos", () => {
        test("eliminar un contacto de la agenda no borra los correos historicos que lo referencian", () => {
            const agenda = new Agenda()

            const ignacio = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar")
            const fabrizio = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar")

            agenda.agregar(ignacio)
            agenda.agregar(fabrizio)

            const correo = new Correo(1, "Examen", "Trae tu DNI", ignacio, [fabrizio])

            agenda.eliminar("ignacio@ucp.edu.ar")

            expect(agenda.consultar("ignacio@ucp.edu.ar")).toBeUndefined()
            expect(correo.getRemitente().getDireccion()).toBe("ignacio@ucp.edu.ar")
            expect(correo.getDestinatarios()[0].getDireccion()).toBe("fabrizio@ucp.edu.ar")
        })
    })
})