import { describe, test, expect } from "vitest"
import { Agenda } from "../src/contactos/Agenda"
import { Contacto } from "../src/contactos/Contacto"
import { Correo } from "../src/correos/Correo"
import type { ICorreoConsulta } from "../src/correos/ICorreoConsulta"
import type { ICorreo } from "../src/correos/ICorreo"

const ignacio = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar")
const fabrizio = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar")
const gonzalo = new Contacto("Gonzalo Rodríguez", "gonzalo@ucp.edu.ar")

describe("creación de un correo", () => {
    test("guarda el id, el asunto, el cuerpo, el remitente y los destinatarios", () => {
        const correo = new Correo(1, "Examen final", "Se toma el lunes", ignacio, [fabrizio])

        expect(correo.getId()).toBe(1)
        expect(correo.getAsunto()).toBe("Examen final")
        expect(correo.getCuerpo()).toBe("Se toma el lunes")
        expect(correo.getRemitente()).toBe(ignacio)
        expect(correo.getDestinatarios().length).toBe(1)
        expect(correo.getDestinatarios()[0]).toBe(fabrizio)
    })

    test("un correo se puede usar a través de ICorreoConsulta", () => {
        const consulta: ICorreoConsulta = new Correo(1, "Hola", "Texto", ignacio, [fabrizio])

        expect(consulta.getId()).toBe(1)
        expect(consulta.getAsunto()).toBe("Hola")
        expect(consulta.getCuerpo()).toBe("Texto")
        expect(consulta.getRemitente()).toBe(ignacio)
        expect(consulta.estaLeido()).toBe(false)
        expect(consulta.esFavorito()).toBe(false)
    })

    test("un correo recién creado no está leído", () => {
        expect(new Correo(1, "Hola", "Texto", ignacio, [fabrizio]).estaLeido()).toBe(false)
    })

    test("un correo recién creado no es favorito", () => {
        expect(new Correo(1, "Hola", "Texto", ignacio, [fabrizio]).esFavorito()).toBe(false)
    })

    test("un correo puede tener varios destinatarios", () => {
        const correo = new Correo(1, "Reunión", "Texto", ignacio, [fabrizio, gonzalo])

        expect(correo.getDestinatarios().length).toBe(2)
        expect(correo.getDestinatarios()[1]).toBe(gonzalo)
    })

    test("se pueden crear varios correos con distintos remitentes y destinatarios", () => {
        const primero = new Correo(1, "Primero", "A", ignacio, [fabrizio])
        const segundo = new Correo(2, "Segundo", "B", fabrizio, [ignacio, gonzalo])

        expect(primero.getRemitente()).toBe(ignacio)
        expect(segundo.getRemitente()).toBe(fabrizio)
        expect(primero.getDestinatarios().length).toBe(1)
        expect(segundo.getDestinatarios().length).toBe(2)
    })

    test("cada correo conserva su propia identidad", () => {
        const primero = new Correo(1, "Hola", "Texto", ignacio, [fabrizio])
        const segundo = new Correo(2, "Hola", "Texto", ignacio, [fabrizio])

        expect(primero.getId()).not.toBe(segundo.getId())
    })
})

describe("proteccion de los destinatarios", () => {
    test("modificar la lista original no cambia los destinatarios del correo", () => {
        const lista = [fabrizio]
        const correo = new Correo(1, "Hola", "Texto", ignacio, lista)

        lista.push(gonzalo)

        expect(correo.getDestinatarios().length).toBe(1)
    })

    test("getDestinatarios devuelve una copia, no la lista interna", () => {
        const correo = new Correo(1, "Hola", "Texto", ignacio, [fabrizio])

        const primera = correo.getDestinatarios()
        const segunda = correo.getDestinatarios()

        expect(primera === segunda).toBe(false)
        expect(primera.length).toBe(segunda.length)
    })
})

describe("correos y agenda de contactos", () => {
    test("eliminar un contacto de la agenda no elimina ni cambia los correos que lo referencian", () => {
        const agenda = new Agenda()
        agenda.agregar(ignacio)
        agenda.agregar(fabrizio)
        const correo = new Correo(1, "Hola", "Texto", ignacio, [fabrizio])

        agenda.eliminar("ignacio@ucp.edu.ar")
        agenda.eliminar("fabrizio@ucp.edu.ar")

        expect(agenda.getCantidad()).toBe(0)
        expect(correo.getRemitente()).toBe(ignacio)
        expect(correo.getDestinatarios()[0]).toBe(fabrizio)
        expect(correo.getAsunto()).toBe("Hola")
    })
})

describe("validez de un correo completo", () => {
    test("un correo con todos los datos es válido", () => {
        expect(new Correo(1, "Hola", "Texto", ignacio, [fabrizio]).esValido()).toBe(true)
    })

    test("un correo con cuerpo vacío es válido", () => {
        expect(new Correo(1, "Hola", "", ignacio, [fabrizio]).esValido()).toBe(true)
    })

    test("un correo con asunto vacío no es válido", () => {
        expect(new Correo(1, "", "Texto", ignacio, [fabrizio]).esValido()).toBe(false)
    })

    test("un correo con asunto de solo espacios no es válido", () => {
        expect(new Correo(1, "   ", "Texto", ignacio, [fabrizio]).esValido()).toBe(false)
    })

    test("un correo sin destinatarios no es válido", () => {
        expect(new Correo(1, "Hola", "Texto", ignacio, []).esValido()).toBe(false)
    })

    test("un correo con un remitente inválido no es válido", () => {
        const invalido = new Contacto("Ignacio", "sin-arroba")

        expect(new Correo(1, "Hola", "Texto", invalido, [fabrizio]).esValido()).toBe(false)
    })

    test("un correo con un destinatario inválido no es válido", () => {
        const invalido = new Contacto("Jere", "sin-arroba")

        expect(new Correo(1, "Hola", "Texto", ignacio, [fabrizio, invalido]).esValido()).toBe(false)
    })
})

describe("validez del id", () => {
    test("un id igual a 0 no es válido", () => {
        expect(new Correo(0, "Hola", "Texto", ignacio, [fabrizio]).esValido()).toBe(false)
    })

    test("un id negativo no es válido", () => {
        expect(new Correo(-3, "Hola", "Texto", ignacio, [fabrizio]).esValido()).toBe(false)
    })

    test("un id decimal no es válido", () => {
        expect(new Correo(1.5, "Hola", "Texto", ignacio, [fabrizio]).esValido()).toBe(false)
    })

    test("un id que no es un número no es válido", () => {
        expect(new Correo(NaN, "Hola", "Texto", ignacio, [fabrizio]).esValido()).toBe(false)
    })
})

describe("validez como borrador", () => {
    test("un borrador sin asunto ni destinatarios es válido como borrador", () => {
        const borrador = new Correo(1, "", "", ignacio, [])

        expect(borrador.esBorradorValido()).toBe(true)
        expect(borrador.esValido()).toBe(false)
    })

    test("un borrador con id inválido no es válido como borrador", () => {
        expect(new Correo(0, "", "", ignacio, []).esBorradorValido()).toBe(false)
    })

    test("un borrador con un destinatario inválido no es válido como borrador", () => {
        const invalido = new Contacto("Jere", "sin-arroba")

        expect(new Correo(1, "", "", ignacio, [invalido]).esBorradorValido()).toBe(false)
    })

    test("un borrador con un remitente inválido no es válido como borrador", () => {
        const invalido = new Contacto("Ignacio", "sin-arroba")

        expect(new Correo(1, "", "", invalido, []).esBorradorValido()).toBe(false)
    })

    test("un correo completo también es válido como borrador", () => {
        expect(new Correo(1, "Hola", "Texto", ignacio, [fabrizio]).esBorradorValido()).toBe(true)
    })
})

describe("modificar un correo", () => {
    test("setAsunto cambia el asunto", () => {
        const correo = new Correo(1, "Viejo", "Texto", ignacio, [fabrizio])

        correo.setAsunto("Nuevo")

        expect(correo.getAsunto()).toBe("Nuevo")
    })

    test("setCuerpo cambia el cuerpo", () => {
        const correo = new Correo(1, "Hola", "Viejo", ignacio, [fabrizio])

        correo.setCuerpo("Nuevo")

        expect(correo.getCuerpo()).toBe("Nuevo")
    })

    test("setDestinatarios cambia los destinatarios si todos son válidos", () => {
        const correo = new Correo(1, "Hola", "Texto", ignacio, [fabrizio])

        expect(correo.setDestinatarios([fabrizio, gonzalo])).toBe(true)
        expect(correo.getDestinatarios().length).toBe(2)
    })

    test("setDestinatarios con un contacto inválido devuelve false y conserva los anteriores", () => {
        const correo = new Correo(1, "Hola", "Texto", ignacio, [fabrizio])
        const invalido = new Contacto("Gonzalo", "sin-arroba")

        expect(correo.setDestinatarios([gonzalo, invalido])).toBe(false)
        expect(correo.getDestinatarios().length).toBe(1)
        expect(correo.getDestinatarios()[0]).toBe(fabrizio)
    })

    test("modificar la lista que se pasó a setDestinatarios no cambia los destinatarios", () => {
        const correo = new Correo(1, "Hola", "Texto", ignacio, [fabrizio])
        const lista = [gonzalo]

        correo.setDestinatarios(lista)
        lista.push(fabrizio)

        expect(correo.getDestinatarios().length).toBe(1)
    })

    test("los cambios no modifican el id ni el remitente", () => {
        const correo = new Correo(7, "Viejo", "Texto", ignacio, [fabrizio])

        correo.setAsunto("Nuevo")
        correo.setCuerpo("Otro")
        correo.setDestinatarios([gonzalo])

        expect(correo.getId()).toBe(7)
        expect(correo.getRemitente()).toBe(ignacio)
    })

    test("un borrador incompleto se puede completar hasta que sea válido para enviar", () => {
        const correo = new Correo(1, "", "", ignacio, [])

        expect(correo.esValido()).toBe(false)

        correo.setAsunto("Examen")
        correo.setDestinatarios([fabrizio])

        expect(correo.esValido()).toBe(true)
    })

    test("un correo se puede usar a través de ICorreo", () => {
        const correo: ICorreo = new Correo(1, "Viejo", "Texto", ignacio, [fabrizio])

        correo.setAsunto("Nuevo")

        expect(correo.getAsunto()).toBe("Nuevo")
    })

    test("marcarLeido cambia el estado a leído", () => {
        const correo = new Correo(1, "Hola", "Texto", ignacio, [fabrizio])

        correo.marcarLeido()

        expect(correo.estaLeido()).toBe(true)
    })

    test("marcarNoLeido vuelve a dejar el correo como no leído", () => {
        const correo = new Correo(1, "Hola", "Texto", ignacio, [fabrizio])

        correo.marcarLeido()
        correo.marcarNoLeido()

        expect(correo.estaLeido()).toBe(false)
    })

    test("el estado de lectura se mantiene al consultar el correo", () => {
        const correo = new Correo(1, "Hola", "Texto", ignacio, [fabrizio])

        correo.marcarLeido()

        expect(correo.estaLeido()).toBe(true)
        expect(correo.estaLeido()).toBe(true)
    })

    test("marcar favorito cambia el estado a favorito", () => {
        const correo = new Correo(1, "hola", "texto", ignacio, [fabrizio])

        correo.marcarFavorito()

        expect(correo.esFavorito()).toBe(true)
    })

    test("marcar favorito no cambia el estado de lectura", () => {
        const correo = new Correo(1, "hola", "texto", ignacio, [fabrizio])

        correo.marcarFavorito()

        expect(correo.estaLeido()).toBe(false)
    })
})