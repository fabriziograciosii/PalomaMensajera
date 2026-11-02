import { describe, test, expect } from "vitest"
import { Agenda } from "../src/contactos/Agenda"
import { Contacto } from "../src/contactos/Contacto"
import { Correo } from "../src/correos/Correo"

const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar")
const jose = new Contacto("José Fernandez", "fernandezjose_cen@ucp.edu.ar")
const marta = new Contacto("Marta Díaz", "marta@ucp.edu.ar")

describe("creación de un correo", () => {
    test("guarda el id, el asunto, el cuerpo, el remitente y los destinatarios", () => {
        const correo = new Correo(1, "Examen final", "Se toma el lunes", ana, [jose])

        expect(correo.getId()).toBe(1)
        expect(correo.getAsunto()).toBe("Examen final")
        expect(correo.getCuerpo()).toBe("Se toma el lunes")
        expect(correo.getRemitente()).toBe(ana)
        expect(correo.getDestinatarios().length).toBe(1)
        expect(correo.getDestinatarios()[0]).toBe(jose)
    })

    test("un correo recién creado no está leído", () => {
        expect(new Correo(1, "Hola", "Texto", ana, [jose]).estaLeido()).toBe(false)
    })

    test("un correo recién creado no es favorito", () => {
        expect(new Correo(1, "Hola", "Texto", ana, [jose]).esFavorito()).toBe(false)
    })

    test("un correo puede tener varios destinatarios", () => {
        const correo = new Correo(1, "Reunión", "Texto", ana, [jose, marta])

        expect(correo.getDestinatarios().length).toBe(2)
        expect(correo.getDestinatarios()[1]).toBe(marta)
    })

    test("se pueden crear varios correos con distintos remitentes y destinatarios", () => {
        const primero = new Correo(1, "Primero", "A", ana, [jose])
        const segundo = new Correo(2, "Segundo", "B", jose, [ana, marta])

        expect(primero.getRemitente()).toBe(ana)
        expect(segundo.getRemitente()).toBe(jose)
        expect(primero.getDestinatarios().length).toBe(1)
        expect(segundo.getDestinatarios().length).toBe(2)
    })

    test("cada correo conserva su propia identidad", () => {
        const primero = new Correo(1, "Hola", "Texto", ana, [jose])
        const segundo = new Correo(2, "Hola", "Texto", ana, [jose])

        expect(primero.getId()).not.toBe(segundo.getId())
    })
})

describe("proteccion de los destinatarios", () => {
    test("modificar la lista original no cambia los destinatarios del correo", () => {
        const lista = [jose]
        const correo = new Correo(1, "Hola", "Texto", ana, lista)

        lista.push(marta)

        expect(correo.getDestinatarios().length).toBe(1)
    })

    test("getDestinatarios devuelve una copia, no la lista interna", () => {
        const correo = new Correo(1, "Hola", "Texto", ana, [jose])

        const primera = correo.getDestinatarios()
        const segunda = correo.getDestinatarios()

        expect(primera === segunda).toBe(false)
        expect(primera.length).toBe(segunda.length)
    })
})

describe("correos y agenda de contactos", () => {
    test("eliminar un contacto de la agenda no elimina ni cambia los correos que lo referencian", () => {
        const agenda = new Agenda()
        agenda.agregar(ana)
        agenda.agregar(jose)
        const correo = new Correo(1, "Hola", "Texto", ana, [jose])

        agenda.eliminar("ana@ucp.edu.ar")
        agenda.eliminar("fernandezjose_cen@ucp.edu.ar")

        expect(agenda.getCantidad()).toBe(0)
        expect(correo.getRemitente()).toBe(ana)
        expect(correo.getDestinatarios()[0]).toBe(jose)
        expect(correo.getAsunto()).toBe("Hola")
    })
})