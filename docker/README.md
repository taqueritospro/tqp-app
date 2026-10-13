# Entorno local de nube simulada

[English version](README.en.md)

Este directorio levanta en tu computadora la misma topología que tendrá la nube (RNF-29, HU-002): Caddy con HTTPS, los subdominios `tqp-app.localhost` y `api.tqp-app.localhost`, PostgreSQL 18 en una red propia, almacenamiento compatible con S3 con SeaweedFS, correo con Mailpit y PlantUML.

## Requisitos

- Docker Engine con Docker Compose v2, en modo rootful para que Caddy use los puertos 80 y 443. Probado con Docker 29.8.2 y Compose v5.6.0 en Fedora 44.
- Node.js 24.21.0, como indica `.nvmrc`, para ejecutar los scripts `npm run env:*`.
- Los puertos 80, 443 y 8025 libres en `127.0.0.1`, y el 5433 en modo desarrollo.

## Primer arranque

```bash
npm install                  # dependencias del monorepo
cp .env.example .env         # variables locales con valores ficticios
npm run env:dev              # levanta el modo desarrollo
npm run env:ca               # exporta la CA local de Caddy y muestra cómo confiar en ella
sudo trust anchor --store docker/.local/caddy-root.crt
npm run env:verify           # comprueba los criterios de aceptación
```

Después de confiar en la CA, reinicia Chrome por completo (`chrome://restart`) y abre <https://tqp-app.localhost> y <https://api.tqp-app.localhost>.

Si falta `.env`, todos los scripts `env:*` se detienen con el mensaje `Missing .env — run: cp .env.example .env`.

## Modos

| Modo          | Comando             | Qué ejecuta                                                                                                                                                                                                                             |
| ------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desarrollo    | `npm run env:dev`   | Monta el código del repositorio en los contenedores. Vite recarga el frontend en el navegador y `tooling/dev-runner.mjs` reinicia el proceso de la API sin reiniciar el contenedor. Publica PostgreSQL en `127.0.0.1:5433` para DBeaver |
| Nube simulada | `npm run env:cloud` | Construye las imágenes como en la nube: la API compilada con dependencias de producción y el frontend estático servido por Caddy, ambos sin privilegios de root. No publica PostgreSQL                                                  |

Puedes cambiar de modo sin detener el entorno: el comando recrea los contenedores y conserva los volúmenes.

## Comandos

| Comando              | Qué hace                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm run env:dev`    | Construye y levanta el modo desarrollo; recrea los `node_modules` internos de los contenedores                           |
| `npm run env:cloud`  | Construye y levanta el modo nube simulada                                                                                |
| `npm run env:down`   | Detiene y elimina los contenedores; conserva los volúmenes con los datos                                                 |
| `npm run env:logs`   | Sigue los registros de todos los servicios; `npm run env:logs -- api` solo los de la API                                 |
| `npm run env:ca`     | Exporta la CA local de Caddy a `docker/.local/caddy-root.crt` y muestra los comandos para confiar en ella o retirarla    |
| `npm run env:verify` | Comprueba servicios, puertos publicados, aislamiento de redes, HTTPS y que la página cargue todos sus módulos JavaScript |

## Topología

| Servicio         | Redes                              | Puertos en el host                           |
| ---------------- | ---------------------------------- | -------------------------------------------- |
| Caddy            | `edge`                             | `127.0.0.1` y `[::1]`: 80, 443/tcp y 443/udp |
| Frontend (`web`) | `edge`                             | Ninguno                                      |
| API              | `edge`, `data`, `services`, `mail` | Ninguno                                      |
| PostgreSQL 18    | `data`, y `db-admin` en desarrollo | `127.0.0.1:5433`, solo en desarrollo         |
| SeaweedFS        | `services`                         | Ninguno                                      |
| Mailpit          | `mail`                             | `127.0.0.1:8025` (interfaz web)              |
| PlantUML         | `services`                         | Ninguno                                      |

Las redes `data` y `services` son internas: no tienen salida a internet y solo la API puede alcanzar PostgreSQL, SeaweedFS y PlantUML. PlantUML tiene un límite de 512 MB y su JVM usa como máximo el 75 % para el heap.

### Alcance del aislamiento

El criterio de HU-002 se cumple así: PostgreSQL y PlantUML no publican puertos, salvo PostgreSQL en `127.0.0.1:5433` en desarrollo; todo puerto publicado escucha solo en `127.0.0.1` o `[::1]`; y ningún contenedor de otra red de Docker los alcanza. En Linux, el propio host puede llegar a las IP internas de los contenedores en redes bridge. Ese acceso queda fuera del criterio por decisión del responsable y no se agregan reglas de firewall.

## Certificados HTTPS

Caddy crea una autoridad certificadora local, "Caddy Local Authority", que se guarda en el volumen `caddy_data`.

- **Confiar:** `npm run env:ca` y después `sudo trust anchor --store docker/.local/caddy-root.crt`. En Fedora, Chrome usa el almacén del sistema mediante p11-kit.
- **Retirar:** `sudo trust anchor --remove docker/.local/caddy-root.crt`. Si ese archivo ya se regeneró, busca la entrada anterior con `trust list --filter=ca-anchors | grep -B2 -A2 Caddy` y retírala por su URI `pkcs11:`.
- **Verificar en Chrome:** reinicia Chrome (`chrome://restart`) y abre <https://tqp-app.localhost>; no debe aparecer ninguna advertencia. En el icono de información del sitio, entra a "La conexión es segura" y luego a "El certificado es válido": la raíz es "Caddy Local Authority".
- Si borras el volumen `caddy_data`, la CA cambia y hay que repetir estos pasos.

## DBeaver y Mailpit

- **DBeaver** (solo en desarrollo): host `127.0.0.1`, puerto `5433` o el valor de `DB_HOST_PORT`; base de datos, usuario y contraseña según `POSTGRES_DB`, `POSTGRES_USER` y `POSTGRES_PASSWORD` de tu `.env`.
- **Mailpit:** <http://127.0.0.1:8025>, en ambos modos. La API envía el correo a `mailpit:1025`, que no se publica en el host.

## Recarga en caliente

- **Frontend:** Vite recarga el módulo modificado en el navegador a través de Caddy (`wss://tqp-app.localhost`).
- **API:** `tooling/dev-runner.mjs` vigila `apps/api/src` y `packages/shared/src` y reinicia el proceso de Node cuando cambia un archivo `.ts`. Vigila directorios en lugar de archivos, así que también detecta los guardados que reemplazan el archivo (edición atómica, `git switch`, `git pull`). `node --watch` deja de detectar un archivo después de que se reemplaza, y nodemon se descartó por la vulnerabilidad GHSA-vfj7-8cjw-p6xm de su dependencia `braces`. El lanzador solo se usa en desarrollo y no entra en la imagen de producción.
- **Dependencias:** después de agregar o actualizar paquetes, vuelve a ejecutar `npm run env:dev`, que reconstruye las imágenes y recrea los `node_modules` internos.
- **Workspaces nuevos:** cada workspace nuevo debe agregarse en dos lugares: a la línea `RUN mkdir -p … node_modules` del stage `deps` de `api.Dockerfile` y de `web.Dockerfile`, y a la lista `x-source-volumes` de `compose.dev.yaml`. Si falta en los Dockerfiles, Docker crea su volumen anónimo con dueño `root` y las herramientas que escriben ahí fallan con `EACCES`; por ejemplo, Vite no puede preparar sus dependencias y la página queda en blanco.

## Solución de problemas

| Síntoma                                                                                    | Causa probable y solución                                                                       |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `Missing .env — run: cp .env.example .env`                                                 | Falta el archivo `.env`; cópialo desde la plantilla                                             |
| Caddy no arranca: puerto 80 o 443 en uso                                                   | Otro servicio ocupa el puerto; detenlo o libéralo                                               |
| PostgreSQL no arranca en desarrollo: puerto 5433 en uso                                    | Cambia `DB_HOST_PORT` en `.env`                                                                 |
| Chrome muestra "La conexión no es privada"                                                 | La CA no es de confianza o cambió; repite la sección de certificados y reinicia Chrome          |
| La API no ve un paquete recién instalado                                                   | Ejecuta `npm run env:dev` para reconstruir las imágenes                                         |
| La página sale en blanco y los registros del web muestran `EACCES` en `node_modules/.vite` | Falta un workspace en la línea `mkdir` de los Dockerfiles; agrégalo y ejecuta `npm run env:dev` |
