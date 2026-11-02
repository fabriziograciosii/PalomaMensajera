import { describe, test, expect} from "vitest"
import { Contacto} from "../src/contactos/Contacto"

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