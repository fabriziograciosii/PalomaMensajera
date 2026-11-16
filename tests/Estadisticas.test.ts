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

describe("GestorCorreos - Estadísticas (RF-10), desglose y actualización", () => {
    const remitente = new Contacto("Ignacio Cremona", "ignacio@ucp.edu.ar");
    const destinatario = new Contacto("Fabrizio Graciosi", "fabrizio@ucp.edu.ar");

    test("discrimina leídos, no leídos y favoritos sin incluir Eliminados", () => {
        
        const gestor = new GestorCorreos();
        
        const recibido1 = gestor.recibirCorreo(remitente, "Uno", "Hola", [destinatario])!;
        
        const recibido2 = gestor.recibirCorreo(remitente, "Dos", "Hola", [destinatario])!;
        
        const recibido3 = gestor.recibirCorreo(remitente, "Tres", "Hola", [destinatario])!;

        
        gestor.marcarLeido(recibido1.getId());
        
        
        gestor.marcarFavorito(recibido2.getId());
        
        gestor.marcarFavorito(recibido3.getId());
        gestor.eliminarCorreo(recibido3.getId());

        const estadisticas = gestor.estadisticas(destinatario);

        
        expect(estadisticas.total).toBe(2);
        
        expect(estadisticas.leidos).toBe(1);
        
        expect(estadisticas.noLeidos).toBe(1);
        
        expect(estadisticas.favoritos).toBe(1);
    
    });

    test("porBandeja devuelve la cantidad exacta de cada bandeja", () => {
        
        const gestor = new GestorCorreos();
        
        gestor.recibirCorreo(remitente, "Recibido", "Hola", [destinatario]);
        
        gestor.enviarCorreo(destinatario, "Enviado", "Hola", [remitente]);
        
        gestor.crearBorrador(destinatario, "Borrador", "Hola", [remitente]);
        const aEliminar = gestor.recibirCorreo(remitente, "Borrar", "Hola", [destinatario])!;
        
        gestor.eliminarCorreo(aEliminar.getId());

        const estadisticas = gestor.estadisticas(destinatario);

        expect(estadisticas.porBandeja[TipoBandeja.ENTRADA]).toBe(1);
        expect(estadisticas.porBandeja[TipoBandeja.ENVIADOS]).toBe(1);
        
        
        expect(estadisticas.porBandeja[TipoBandeja.BORRADORES]).toBe(1);
        expect(estadisticas.porBandeja[TipoBandeja.ELIMINADOS]).toBe(1);
    });

    test("las estadísticas se actualizan al leer, marcar favorito y restaurar", () => {
        
        const gestor = new GestorCorreos();
        
        const correo = gestor.recibirCorreo(remitente, "Aviso", "Hola", [destinatario])!;

        gestor.marcarLeido(correo.getId());
        
        
        gestor.marcarFavorito(correo.getId());
        gestor.eliminarCorreo(correo.getId());
        
        expect(gestor.estadisticas(destinatario).total).toBe(0);

        gestor.restaurarCorreo(correo.getId());
        const estadisticas = gestor.estadisticas(destinatario);

        expect(estadisticas.total).toBe(1);
        expect(estadisticas.leidos).toBe(1);
        
        expect(estadisticas.favoritos).toBe(1);
    
    });


});