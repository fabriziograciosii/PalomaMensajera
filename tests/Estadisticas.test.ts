import { describe, test, expect } from "vitest";
import { GestorCorreos } from "../src/gestor/GestorCorreos";
import { Contacto } from "../src/contactos/Contacto";
import { TipoBandeja } from "../src/bandejas/TipoBandeja";

describe("GestorCorreos  estadísticas RF-10 totales", () => {
    
    const remitente = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar");
    
    const destinatario = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar");

    test("un buzón vacío tiene todas las estadísticas en cero", () => {
        
        const gestor = new GestorCorreos();
        
        const estadisticas = gestor.estadisticas(remitente);

        
        expect(estadisticas.total).toBe(0);
        
        expect(estadisticas.leidos).toBe(0);
        
        expect(estadisticas.noLeidos).toBe(0);
        
        expect(estadisticas.favoritos).toBe(0);
    
    });

    test("total cuenta los correos de Entrada, Enviados y Borradores", () => {
        
        const gestor = new GestorCorreos();
        
        gestor.recibirCorreo(remitente, "Uno", "Hola", [destinatario]);
        
        gestor.enviarCorreo(destinatario, "Dos", "Hola", [remitente]);
        gestor.crearBorrador(destinatario, "Tres", "Hola", [remitente]);

        expect(gestor.estadisticas(destinatario).total).toBe(3);
    
    });

    
    test("total excluye los correos Eliminados", () => {
        
        const gestor = new GestorCorreos();
        
        const correo = gestor.enviarCorreo(remitente, "Aviso", "Hola", [destinatario])!;
        
        gestor.eliminarCorreo(correo.getId());

        expect(gestor.estadisticas(remitente).total).toBe(0);
    
    });

    test("las estadísticas de un buzón no afectan a las de otro", () => {
        
        const gestor = new GestorCorreos();
        
        gestor.enviarCorreo(remitente, "Aviso", "Hola", [destinatario]);

        
        expect(gestor.estadisticas(remitente).total).toBe(1);
        
        expect(gestor.estadisticas(destinatario).total).toBe(1);
    
    });


});