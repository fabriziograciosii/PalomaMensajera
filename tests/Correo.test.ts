import { describe, test, expect } from "vitest"
import { Agenda } from "../src/contactos/Agenda"
import { Contacto } from "../src/contactos/Contacto"
import { Correo } from "../src/correos/Correo"
import type { ICorreoConsulta } from "../src/correos/ICorreoConsulta"
import type { ICorreo } from "../src/correos/ICorreo"


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

        test("un correo se puede usar a través de ICorreoConsulta", () => {
        const consulta: ICorreoConsulta = new Correo(1, "Hola", "Texto", ana, [jose])

        expect(consulta.getId()).toBe(1)
        expect(consulta.getAsunto()).toBe("Hola")
        expect(consulta.getCuerpo()).toBe("Texto")
        expect(consulta.getRemitente()).toBe(ana)
        expect(consulta.estaLeido()).toBe(false)
        expect(consulta.esFavorito()).toBe(false)
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

describe("validez de un correo completo", () => {
    test("un correo con todos los datos es válido", () => {

        expect(new Correo(1, "Hola", "Texto", ana, [jose]).esValido()).toBe(true)

    })

    test("un correo con cuerpo vacío es válido", () => {
        expect(new Correo(1, "Hola", "", ana, [jose]).esValido()).toBe(true)

    })

    test("un correo con asunto vacío no es válido", () => {

        expect(new Correo(1, "", "Texto", ana, [jose]).esValido()).toBe(false)

    })

    test("un correo con asunto de solo espacios no es válido", () => {

        expect(new Correo(1, "   ", "Texto", ana, [jose]).esValido()).toBe(false)
    })

    test("un correo sin destinatarios no es válido", () => {

        expect(new Correo(1, "Hola", "Texto", ana, []).esValido()).toBe(false)
    })

    test("un correo con un remitente inválido no es válido", () => {

        const invalido = new Contacto("Ana", "sin-arroba")

        expect(new Correo(1, "Hola", "Texto", invalido, [jose]).esValido()).toBe(false)
    })

    test("un correo con un destinatario inválido no es válido", () => {

        const invalido = new Contacto("Luis", "sin-arroba")

        expect(new Correo(1, "Hola", "Texto", ana, [jose, invalido]).esValido()).toBe(false)
    })
})

describe("validez del id", () => {
    test("un id igual a 0 no es válido", () => {

        expect(new Correo(0, "Hola", "Texto", ana, [jose]).esValido()).toBe(false)

    })

    test("un id negativo no es válido", () => {

        expect(new Correo(-3, "Hola", "Texto", ana, [jose]).esValido()).toBe(false)

    })

    test("un id decimal no es válido", () => {
        expect(new Correo(1.5, "Hola", "Texto", ana, [jose]).esValido()).toBe(false)

    })

    test("un id que no es un número no es válido", () => {


        expect(new Correo(NaN, "Hola", "Texto", ana, [jose]).esValido()).toBe(false)
    })
})

describe("validez como borrador", () => {
    test("un borrador sin asunto ni destinatarios es válido como borrador", () => {

        const borrador = new Correo(1, "", "", ana, [])

        expect(borrador.esBorradorValido()).toBe(true)

        expect(borrador.esValido()).toBe(false)
    })

    test("un borrador con id inválido no es válido como borrador", () => {

        expect(new Correo(0, "", "", ana, []).esBorradorValido()).toBe(false)
    })

    test("un borrador con un destinatario inválido no es válido como borrador", () => {

        const invalido = new Contacto("Luis", "sin-arroba")


        expect(new Correo(1, "", "", ana, [invalido]).esBorradorValido()).toBe(false)
    })

    test("un borrador con un remitente inválido no es válido como borrador", () => {

        const invalido = new Contacto("Ana", "sin-arroba")

        expect(new Correo(1, "", "", invalido, []).esBorradorValido()).toBe(false)
    })

    test("un correo completo también es válido como borrador", () => {

        expect(new Correo(1, "Hola", "Texto", ana, [jose]).esBorradorValido()).toBe(true)
    })


})

describe("modificar un correo", () => {

    test("setAsunto cambia el asunto", () => {

        const correo = new Correo(1, "Viejo", "Texto", ana, [jose])

        correo.setAsunto("Nuevo")

        expect(correo.getAsunto()).toBe("Nuevo")

    })

    test("setCuerpo cambia el cuerpo", () => {

        const correo = new Correo(1, "Hola", "Viejo", ana, [jose])

        correo.setCuerpo("Nuevo")

        expect(correo.getCuerpo()).toBe("Nuevo")
    })

    test("setDestinatarios cambia los destinatarios si todos son válidos", () => {

        const correo = new Correo(1, "Hola", "Texto", ana, [jose])

        expect(correo.setDestinatarios([jose, marta])).toBe(true)

        expect(correo.getDestinatarios().length).toBe(2)
    })

    test("setDestinatarios con un contacto inválido devuelve false y conserva los anteriores", () => {

        const correo = new Correo(1, "Hola", "Texto", ana, [jose])

        const invalido = new Contacto("Marta", "sin-arroba")

        expect(correo.setDestinatarios([marta, invalido])).toBe(false)
        expect(correo.getDestinatarios().length).toBe(1)

        expect(correo.getDestinatarios()[0]).toBe(jose)
    })

    test("modificar la lista que se pasó a setDestinatarios no cambia los destinatarios", () => {

        const correo = new Correo(1, "Hola", "Texto", ana, [jose])

        const lista = [marta]

        correo.setDestinatarios(lista)
        lista.push(jose)

        expect(correo.getDestinatarios().length).toBe(1)
    })

    test("los cambios no modifican el id ni el remitente", () => {

        const correo = new Correo(7, "Viejo", "Texto", ana, [jose])

        correo.setAsunto("Nuevo")
        correo.setCuerpo("Otro")

        correo.setDestinatarios([marta])

        expect(correo.getId()).toBe(7)

        expect(correo.getRemitente()).toBe(ana)
    })

    test("un borrador incompleto se puede completar hasta que sea válido para enviar", () => {

        const correo = new Correo(1, "", "", ana, [])

        expect(correo.esValido()).toBe(false)

        correo.setAsunto("Examen")
        correo.setDestinatarios([jose])

        expect(correo.esValido()).toBe(true)
    })

    test("un correo se puede usar a través de ICorreo", () => {
        const correo: ICorreo = new Correo(1, "Viejo", "Texto", ana, [jose])

        correo.setAsunto("Nuevo")

        expect(correo.getAsunto()).toBe("Nuevo")
    })

        test("marcarLeido cambia el estado a leído", () => {
       const correo = new Correo(1, "Hola", "Texto", ana, [jose])

        correo.marcarLeido()

        expect(correo.estaLeido()).toBe(true)
    })

    test("marcarNoLeido vuelve a dejar el correo como no leído", () => {
        const correo = new Correo(1, "Hola", "Texto", ana, [jose])

        correo.marcarLeido()
        correo.marcarNoLeido()

        expect(correo.estaLeido()).toBe(false)
    })

    test("el estado de lectura se mantiene al consultar el correo", () => {
        const correo = new Correo(1, "Hola", "Texto", ana, [jose])

        correo.marcarLeido()

        expect(correo.estaLeido()).toBe(true)
        expect(correo.estaLeido()).toBe(true)
    })
    
})