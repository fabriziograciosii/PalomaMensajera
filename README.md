# Paloma Mensajera

Proyecto correspondiente a la **Actividad de Evaluación 4 (AE4)**: un Gestor de Correos Electrónicos con Filtros Dinámicos.

El objetivo del proyecto es desarrollar el gestor aplicando **Programación Orientada a Objetos (POO)** y, en etapas posteriores, **Programación Funcional**, utilizando TypeScript.

Este repositorio se entrega en 3 sprints semanales (ver [`docs/bitacora.md`](docs/bitacora.md) para el seguimiento semanal). Este es el estado al cierre del **Sprint 1**.

## Requerimientos funcionales de este sprint

- **RF-01:** Creación de correos electrónicos.
- **RF-03:** Gestión de contactos (agenda).
- **RF-06:** Gestión de bandejas y clasificación (Entrada, Enviados, Borradores, Eliminados).
- **RF-07:** Gestión de borradores.

## Decisiones de diseño

- **Sin `if` ni `switch`:** toda condición se resuelve con el operador ternario, `??`, `?.` o combinaciones booleanas. Para elegir una bandeja según su tipo se usa un `Record<TipoBandeja, Bandeja>` armado con `reduce`, en vez de un `switch`.
- **Interfaces segregadas (ISP):** cada entidad separa su contrato de **consulta** (`IContactoConsulta`, `ICorreoConsulta`) de su contrato **completo** (`IContacto`, `ICorreo`). Hacia afuera (por ejemplo, al consultar una bandeja) solo se expone la vista de consulta, de solo lectura.
- **Encapsulamiento:** `getDestinatarios()` y `obtenerCorreos()` siempre devuelven una copia del arreglo interno, nunca la referencia real, para que nadie pueda modificar el estado de un correo o una bandeja desde afuera.
- **`GestorCorreos` como coordinador único:** es el único punto de entrada para crear, mover, editar y consultar correos. Garantiza que cada correo pertenezca a una única bandeja a la vez.
- **Sin excepciones para reglas de negocio:** ninguna operación lanza errores. Cada una valida su propia condición y devuelve `boolean` (o `undefined` cuando no corresponde crear algo), igual que `esValido()` en `Correo` y `Contacto`. Quien llama decide qué hacer si la operación no se pudo completar.
- **Doble encapsulamiento (getters y setters):** todos los atributos de las entidades (`Contacto`, `Correo`, `Bandeja`) son `private`, con el nombre precedido por `_` (por ejemplo `_asunto`, `_nombreCompleto`), y solo se acceden desde afuera a través de métodos públicos `getX()`/`setX()`. Los setters que lo requieren (`setNombreCompleto`) validan antes de aplicar el cambio y devuelven `boolean`. Los atributos que identifican a una entidad (`_id`, `_remitente`) son `readonly` y solo tienen getter, porque no deben poder cambiar después de creados.

## Requisitos

Para ejecutar el proyecto es necesario tener instalado:

- Node.js
- npm

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/fabriziograciosii/Paloma-Mensajera
```

Instalar las dependencias:

```bash
npm install
```

## Verificar TypeScript

Para verificar el código sin generar archivos JavaScript:

```bash
npx tsc --noEmit
```

## Ejecutar las pruebas

```bash
npm test
```

O directamente con Vitest:

```bash
npx vitest run
```

## Cobertura de código

```bash
npx vitest run --coverage
```

## Alcance

El funcionamiento del sistema se verifica mediante **pruebas automatizadas**, sin interfaz gráfica, API REST ni base de datos, tal como permite la consigna.
