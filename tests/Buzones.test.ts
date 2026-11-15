import { describe, test, expect } from "vitest"
import { GestorCorreos } from "../src/gestor/GestorCorreos"
import { TipoBandeja } from "../src/bandejas/TipoBandeja"
import { Contacto } from "../src/contactos/Contacto"

describe("Buzones - envío con copias independientes", () => {
    const ignacio = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar")
    const fabrizio = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar")
    const gonzalo = new Contacto("Gonzalo Rodríguez", "gonzalo@ucp.edu.ar")
    const jere = new Contacto("Jere Morales", "jere@ucp.edu.ar")

    test("Ignacio envía a Fabrizio, Gonzalo y Jere: queda una copia en los Enviados de Ignacio", () => {
        const gestor = new GestorCorreos()

        const copiaDeIgnacio = gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo, jere])

        const enviadosDeIgnacio = gestor.consultarBandeja(ignacio, TipoBandeja.ENVIADOS)
        expect(enviadosDeIgnacio.length).toBe(1)
        expect(enviadosDeIgnacio[0].getId()).toBe(copiaDeIgnacio!.getId())
        expect(enviadosDeIgnacio[0].getRemitente()).toBe(ignacio)
    })

    test("Ignacio envía a Fabrizio, Gonzalo y Jere: cada uno recibe una copia en su Entrada", () => {
        const gestor = new GestorCorreos()

        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo, jere])

        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA).length).toBe(1)
        expect(gestor.consultarBandeja(gonzalo, TipoBandeja.ENTRADA).length).toBe(1)
        expect(gestor.consultarBandeja(jere, TipoBandeja.ENTRADA).length).toBe(1)
    })

    test("Ignacio no recibe una copia en su propia Entrada", () => {
        const gestor = new GestorCorreos()

        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo, jere])

        expect(gestor.consultarBandeja(ignacio, TipoBandeja.ENTRADA).length).toBe(0)
    })

    test("Los destinatarios no tienen el correo en sus Enviados", () => {
        const gestor = new GestorCorreos()

        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo, jere])

        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENVIADOS).length).toBe(0)
        expect(gestor.consultarBandeja(gonzalo, TipoBandeja.ENVIADOS).length).toBe(0)
        expect(gestor.consultarBandeja(jere, TipoBandeja.ENVIADOS).length).toBe(0)
    })

    test("Las cuatro copias tienen ids distintos", () => {
        const gestor = new GestorCorreos()

        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo, jere])

        const idIgnacio = gestor.consultarBandeja(ignacio, TipoBandeja.ENVIADOS)[0].getId()
        const idFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0].getId()
        const idGonzalo = gestor.consultarBandeja(gonzalo, TipoBandeja.ENTRADA)[0].getId()
        const idJere = gestor.consultarBandeja(jere, TipoBandeja.ENTRADA)[0].getId()
        expect(idIgnacio).not.toBe(idFabrizio)
        expect(idIgnacio).not.toBe(idGonzalo)
        expect(idIgnacio).not.toBe(idJere)
        expect(idFabrizio).not.toBe(idGonzalo)
        expect(idFabrizio).not.toBe(idJere)
        expect(idGonzalo).not.toBe(idJere)
    })

    test("Las copias de los destinatarios conservan asunto, cuerpo y remitente", () => {
        const gestor = new GestorCorreos()

        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo])

        const copiaDeFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0]
        expect(copiaDeFabrizio.getAsunto()).toBe("Examen")
        expect(copiaDeFabrizio.getCuerpo()).toBe("Trae tu DNI")
        expect(copiaDeFabrizio.getRemitente()).toBe(ignacio)
    })
})

describe("Buzones - estado independiente por copia", () => {
    const ignacio = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar")
    const fabrizio = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar")
    const gonzalo = new Contacto("Gonzalo Rodríguez", "gonzalo@ucp.edu.ar")

    test("Si Fabrizio marca como leído, la copia de Gonzalo y la de Ignacio siguen sin leer", () => {
        const gestor = new GestorCorreos()
        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo])
        const copiaDeFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0]

        gestor.marcarLeido(copiaDeFabrizio.getId())

        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0].estaLeido()).toBe(true)
        expect(gestor.consultarBandeja(gonzalo, TipoBandeja.ENTRADA)[0].estaLeido()).toBe(false)
        expect(gestor.consultarBandeja(ignacio, TipoBandeja.ENVIADOS)[0].estaLeido()).toBe(false)
    })

    test("Si Fabrizio marca como no leído, solo cambia su copia", () => {
        const gestor = new GestorCorreos()
        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo])
        const copiaDeFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0]
        const copiaDeGonzalo = gestor.consultarBandeja(gonzalo, TipoBandeja.ENTRADA)[0]
        gestor.marcarLeido(copiaDeFabrizio.getId())
        gestor.marcarLeido(copiaDeGonzalo.getId())

        gestor.marcarNoLeido(copiaDeFabrizio.getId())

        expect(copiaDeFabrizio.estaLeido()).toBe(false)
        expect(copiaDeGonzalo.estaLeido()).toBe(true)
    })

    test("Si Fabrizio marca como favorito, la copia de Gonzalo no es favorita", () => {
        const gestor = new GestorCorreos()
        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo])
        const copiaDeFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0]

        gestor.marcarFavorito(copiaDeFabrizio.getId())

        expect(copiaDeFabrizio.esFavorito()).toBe(true)
        expect(gestor.consultarBandeja(gonzalo, TipoBandeja.ENTRADA)[0].esFavorito()).toBe(false)
    })

    test("consultarNoLeidos del buzón de Fabrizio no incluye lo leído por él, pero el de Gonzalo sí", () => {
        const gestor = new GestorCorreos()
        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo])
        const copiaDeFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0]

        gestor.marcarLeido(copiaDeFabrizio.getId())

        expect(gestor.consultarNoLeidos(fabrizio, TipoBandeja.ENTRADA).length).toBe(0)
        expect(gestor.consultarNoLeidos(gonzalo, TipoBandeja.ENTRADA).length).toBe(1)
    })

    test("Si Fabrizio elimina su copia, la de Gonzalo sigue en su Entrada", () => {
        const gestor = new GestorCorreos()
        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo])
        const copiaDeFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0]

        gestor.eliminarCorreo(copiaDeFabrizio.getId())

        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA).length).toBe(0)
        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ELIMINADOS).length).toBe(1)
        expect(gestor.consultarBandeja(gonzalo, TipoBandeja.ENTRADA).length).toBe(1)
        expect(gestor.consultarBandeja(gonzalo, TipoBandeja.ELIMINADOS).length).toBe(0)
    })

    test("Si Fabrizio restaura su copia, vuelve a la Entrada de Fabrizio", () => {
        const gestor = new GestorCorreos()
        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo])
        const copiaDeFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0]
        gestor.eliminarCorreo(copiaDeFabrizio.getId())

        gestor.restaurarCorreo(copiaDeFabrizio.getId())

        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA).length).toBe(1)
        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ELIMINADOS).length).toBe(0)
    })
})

describe("Buzones - direcciones repetidas y buzones inexistentes", () => {
    const ignacio = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar")
    const fabrizio = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar")

    test("Si Fabrizio aparece dos veces entre los destinatarios, recibe una sola copia", () => {
        const gestor = new GestorCorreos()
        const fabrizioRepetido = new Contacto("Fabrizio G.", "FABRIZIO@ucp.edu.ar")

        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, fabrizioRepetido])

        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA).length).toBe(1)
    })

    test("Si Ignacio se envía un correo a sí mismo, tiene una copia en Enviados y otra en Entrada", () => {
        const gestor = new GestorCorreos()

        gestor.enviarCorreo(ignacio, "Recordatorio", "Comprar tinta", [ignacio])

        expect(gestor.consultarBandeja(ignacio, TipoBandeja.ENVIADOS).length).toBe(1)
        expect(gestor.consultarBandeja(ignacio, TipoBandeja.ENTRADA).length).toBe(1)
    })

    test("Consultar el buzón de alguien que nunca operó devuelve una lista vacía", () => {
        const gestor = new GestorCorreos()

        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA).length).toBe(0)
        expect(gestor.consultarNoLeidos(fabrizio, TipoBandeja.ENTRADA).length).toBe(0)
        expect(gestor.consultarFavoritos(fabrizio).length).toBe(0)
    })

    test("El buzón se identifica por dirección sin importar mayúsculas", () => {
        const gestor = new GestorCorreos()
        const fabrizioEnMayusculas = new Contacto("Fabrizio Graciosi", "FABRIZIO@ucp.edu.ar")

        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio])

        expect(gestor.consultarBandeja(fabrizioEnMayusculas, TipoBandeja.ENTRADA).length).toBe(1)
    })
})

describe("Buzones - borradores", () => {
    const ignacio = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar")
    const fabrizio = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar")
    const gonzalo = new Contacto("Gonzalo Rodríguez", "gonzalo@ucp.edu.ar")

    test("Un borrador queda solo en los Borradores de su remitente", () => {
        const gestor = new GestorCorreos()

        gestor.crearBorrador(ignacio, "Examen", "Trae tu DNI", [fabrizio])

        expect(gestor.consultarBandeja(ignacio, TipoBandeja.BORRADORES).length).toBe(1)
        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.BORRADORES).length).toBe(0)
        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA).length).toBe(0)
    })

    test("Enviar un borrador lo mueve a los Enviados de Ignacio conservando su id", () => {
        const gestor = new GestorCorreos()
        const borrador = gestor.crearBorrador(ignacio, "Examen", "Trae tu DNI", [fabrizio])

        gestor.enviarBorrador(borrador.getId())

        expect(gestor.consultarBandeja(ignacio, TipoBandeja.BORRADORES).length).toBe(0)
        expect(gestor.consultarBandeja(ignacio, TipoBandeja.ENVIADOS)[0].getId()).toBe(borrador.getId())
    })

    test("Enviar un borrador crea una copia en la Entrada de cada destinatario", () => {
        const gestor = new GestorCorreos()
        const borrador = gestor.crearBorrador(ignacio, "Examen", "Trae tu DNI", [fabrizio])
        gestor.editarBorrador(borrador.getId(), { destinatarios: [fabrizio, gonzalo] })

        gestor.enviarBorrador(borrador.getId())

        const copiaDeFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0]
        expect(copiaDeFabrizio.getId()).not.toBe(borrador.getId())
        expect(copiaDeFabrizio.getRemitente()).toBe(ignacio)
        expect(gestor.consultarBandeja(gonzalo, TipoBandeja.ENTRADA).length).toBe(1)
    })

    test("Un borrador inválido no se envía y nadie recibe copias", () => {
        const gestor = new GestorCorreos()
        const borrador = gestor.crearBorrador(ignacio, "", "Sin asunto", [fabrizio])

        const seEnvio = gestor.enviarBorrador(borrador.getId())

        expect(seEnvio).toBe(false)
        expect(gestor.consultarBandeja(ignacio, TipoBandeja.BORRADORES).length).toBe(1)
        expect(gestor.consultarBandeja(ignacio, TipoBandeja.ENVIADOS).length).toBe(0)
        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA).length).toBe(0)
    })

    test("Un envío inválido devuelve undefined y no deja copias en ningún buzón", () => {
        const gestor = new GestorCorreos()

        const resultado = gestor.enviarCorreo(ignacio, "", "Sin asunto", [fabrizio])

        expect(resultado).toBeUndefined()
        expect(gestor.consultarBandeja(ignacio, TipoBandeja.ENVIADOS).length).toBe(0)
        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA).length).toBe(0)
    })
})

describe("Buzones - correos recibidos y favoritos", () => {
    const externo = new Contacto("Banco Externo", "avisos@banco.com")
    const fabrizio = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar")
    const gonzalo = new Contacto("Gonzalo Rodríguez", "gonzalo@ucp.edu.ar")
    const ignacio = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar")

    test("Recibir un correo externo crea una copia por destinatario y ninguna para el remitente", () => {
        const gestor = new GestorCorreos()

        gestor.recibirCorreo(externo, "Aviso", "Tu resumen", [fabrizio, gonzalo])

        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA).length).toBe(1)
        expect(gestor.consultarBandeja(gonzalo, TipoBandeja.ENTRADA).length).toBe(1)
        expect(gestor.consultarBandeja(externo, TipoBandeja.ENTRADA).length).toBe(0)
        expect(gestor.consultarBandeja(externo, TipoBandeja.ENVIADOS).length).toBe(0)
    })

    test("Recibir un correo inválido devuelve undefined y no crea copias", () => {
        const gestor = new GestorCorreos()

        const resultado = gestor.recibirCorreo(externo, "", "Tu resumen", [fabrizio])

        expect(resultado).toBeUndefined()
        expect(gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA).length).toBe(0)
    })

    test("consultarFavoritos de un propietario solo devuelve los favoritos de su buzón", () => {
        const gestor = new GestorCorreos()
        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio, gonzalo])
        const copiaDeFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0]

        gestor.marcarFavorito(copiaDeFabrizio.getId())

        expect(gestor.consultarFavoritos(fabrizio).length).toBe(1)
        expect(gestor.consultarFavoritos(gonzalo).length).toBe(0)
        expect(gestor.consultarFavoritos(ignacio).length).toBe(0)
    })

    test("Un favorito eliminado no aparece en consultarFavoritos del propietario", () => {
        const gestor = new GestorCorreos()
        gestor.enviarCorreo(ignacio, "Examen", "Trae tu DNI", [fabrizio])
        const copiaDeFabrizio = gestor.consultarBandeja(fabrizio, TipoBandeja.ENTRADA)[0]
        gestor.marcarFavorito(copiaDeFabrizio.getId())

        gestor.eliminarCorreo(copiaDeFabrizio.getId())

        expect(gestor.consultarFavoritos(fabrizio).length).toBe(0)
    })
})