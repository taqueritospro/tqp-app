# Documento de Arquitectura — TQP App

Oct 8, 2026 · @taqueritospro

## Control del documento

El presente documento describe cómo se construye TQP App para cumplir los requisitos de la Especificación de Requisitos de Software, versión 1.5. Cada decisión relevante se registra en la sección 15 y requiere la aprobación del responsable del producto.

| Campo | Valor |
| --- | --- |
| Producto | TQP App |
| Versión | 0.2 |
| Estado | Borrador para revisión del responsable del producto |
| Norma de estructura | ISO/IEC/IEEE 42010:2022, descripción de arquitectura |
| Documento base | Especificación de Requisitos de Software de TQP App, versión 1.5 |

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 0.2 | 2026-10-09 | La Plataforma reside en `apps/api/src/core/` y los 17 módulos restantes en `apps/api/src/modules/`; eslint-plugin-import-x sustituye a eslint-plugin-boundaries por las vulnerabilidades de sus dependencias; nuevas dependencias de calidad de código |
| 0.1 | 2026-10-08 | Borrador inicial |

## 1. Introducción

### 1.1 Propósito

Este documento establece la estructura de TQP App, las tecnologías que se utilizan, la forma en que se despliega y se entrega, y las decisiones que lo sustentan. Está dirigido al responsable del producto y al equipo de desarrollo, y sirve como referencia obligatoria para la construcción del sistema.

### 1.2 Alcance

El documento cubre el backend, el frontend, la base de datos, la infraestructura local y en la nube, la seguridad, las pruebas y el proceso de entrega. No repite los requisitos funcionales; los referencia por su identificador en el SRS.

### 1.3 Referencias

- Especificación de Requisitos de Software de TQP App, versión 1.5.
- ISO/IEC/IEEE 42010:2022: descripción de arquitectura.
- ISO/IEC 25010:2023: modelo de calidad del producto.
- OWASP ASVS 5.0: requisitos de seguridad verificables.
- RFC 6749, OpenID Connect Core 1.0, RFC 7519 y RFC 9457.
- OpenAPI 3.1, Semantic Versioning 2.0.0 y Conventional Commits 1.0.0.

## 2. Partes interesadas y preocupaciones

| Parte interesada | Preocupaciones principales | Vistas que las atienden |
| --- | --- | --- |
| Responsable del producto | Mantenibilidad, costo, derechos sobre el código, control de cada cambio | Módulos y capas, desarrollo y entrega, proveedores y presupuesto |
| Usuarios registrados | Disponibilidad, privacidad de sus datos, rapidez, facilidad de uso | Seguridad, despliegue, errores y resiliencia |
| Equipo de desarrollo | Estructura clara, convenciones, pruebas automatizadas, entorno local fiel a la nube | Módulos y capas, calidad y pruebas, configuración |
| Futuras aplicaciones propias, como la aplicación Android | Contrato estable de la API y autenticación para clientes nativos | Contexto, seguridad |

## 3. Principios de arquitectura

1. **Nube primero, local equivalente**: el sistema se diseña para la nube y el entorno local reproduce la misma topología, de modo que un cambio probado localmente funcione igual al desplegarse.
2. **Módulos aislados**: cada módulo expone una interfaz pública y oculta su implementación; ningún módulo accede a las tablas de otro.
3. **Capas con dirección única**: las peticiones fluyen de rutas a controladores, servicios y repositorios, nunca en sentido inverso.
4. **Falla contenida**: el error de un bloque, un módulo o un servicio externo no detiene el resto del sistema.
5. **API sin estado**: ninguna sesión vive en la memoria del servidor, lo que permite ejecutar varias instancias de la API.
6. **Seguridad por defecto**: toda entrada se valida, todo acceso se autoriza por propietario y ningún secreto reside en el código.
7. **Extensión sin modificación**: los tipos de bloque, los lectores de dependencias y las metodologías se agregan mediante registro, sin modificar lo existente.
8. **Estándares internacionales**: cada decisión se apoya en una norma o especificación reconocida cuando existe una aplicable.

## 4. Vista de contexto

TQP App se relaciona con dos tipos de clientes y con seis servicios externos. Ninguno de los servicios externos es indispensable para consultar los proyectos existentes.

| Elemento | Tipo | Relación con TQP App |
| --- | --- | --- |
| Usuario en navegador | Cliente | Usa la aplicación web en `tqp-app.com` |
| Aplicación Android futura | Cliente | Consume la API en `api.tqp-app.com` con tokens para clientes nativos |
| Google | Servicio externo | Proveedor de identidad mediante OpenID Connect |
| Resend | Servicio externo | Envío de correos de recuperación de contraseña |
| Backblaze B2 | Servicio externo | Almacenamiento de imágenes y diagramas, compatible con S3 |
| Cloudflare | Servicio externo | Registro del dominio, DNS y CAPTCHA invisible Turnstile |
| GitHub | Servicio externo | Repositorio, integración y entrega continuas, y registro de imágenes Docker |
| Monitor externo | Servicio externo | Consulta periódica del punto de salud y avisos de caída |

## 5. Vista de módulos y capas

### 5.1 Estructura del monorepo

El código reside en un único repositorio administrado con npm workspaces. El paquete compartido contiene los esquemas de validación que utilizan tanto el frontend como el backend.

```text
tqp-app/
├── apps/
│   ├── api/                       Backend con Express
│   │   ├── prisma/                schema.prisma y migraciones
│   │   └── src/
│   │       ├── core/              Plataforma: configuración, errores, registros, base de datos, salud, idiomas
│   │       ├── modules/           Un directorio por módulo del SRS
│   │       │   └── projects/
│   │       │       ├── projects.routes.ts
│   │       │       ├── projects.controller.ts
│   │       │       ├── projects.service.ts
│   │       │       ├── projects.repository.ts
│   │       │       ├── index.ts   Interfaz pública del módulo
│   │       │       └── __tests__/
│   │       ├── app.ts
│   │       └── server.ts
│   └── web/                       Frontend con React
│       └── src/
│           ├── app/               Rutas, proveedores y diseño general
│           ├── features/          Un directorio por funcionalidad
│           │   └── editor/blocks/ Un directorio por tipo de bloque
│           ├── shared/            Componentes, hooks y utilidades comunes
│           └── locales/           en.json y es.json
├── packages/
│   └── shared/                    Esquemas Zod, tipos y constantes comunes
├── e2e/                           Pruebas Playwright
├── docker/                        Archivos de Docker Compose y Dockerfiles
├── docs/                          SRS, arquitectura, MVP y registros de decisiones
├── .github/workflows/             Integración y entrega continuas
├── CLAUDE.md
├── LICENSE
├── README.md
└── README.en.md
```

### 5.2 Capas del backend

Cada módulo del backend se organiza en cuatro capas. Las dependencias solo apuntan hacia abajo.

| Capa | Archivo | Responsabilidad | No debe |
| --- | --- | --- | --- |
| Ruta | `*.routes.ts` | Declarar direcciones, métodos HTTP y middleware de autenticación y validación | Contener lógica de negocio |
| Controlador | `*.controller.ts` | Leer la petición ya validada, invocar al servicio y dar formato a la respuesta | Acceder a la base de datos |
| Servicio | `*.service.ts` | Aplicar las reglas de negocio y la autorización por propietario; coordinar repositorios y otros módulos | Conocer detalles de HTTP |
| Repositorio | `*.repository.ts` | Leer y escribir en la base de datos mediante Prisma | Aplicar reglas de negocio |

Un módulo solo puede utilizar otro a través de su `index.ts`. Esta regla se verifica automáticamente con ESLint en la integración continua.

### 5.3 Módulos

Los 18 módulos corresponden a los de la sección 7.1 del SRS: Plataforma, Cuentas, Catálogos, Proyectos, Contenido, Ficha técnica, Archivos, Diagramas, Bitácora, Metodología, Funcionalidades, Documentación, Estándares, Búsqueda, Inicio, Compartición, Plantillas y Bienvenida. En el código, la Plataforma reside en `apps/api/src/core/` y no depende de ningún módulo; los 17 módulos restantes residen en `apps/api/src/modules/` y se nombran en inglés: `accounts`, `catalogs`, `projects`, `content`, `tech-sheet`, `files`, `diagrams`, `logbook`, `methodology`, `backlog`, `documentation`, `standards`, `search`, `home`, `sharing`, `templates` y `onboarding`. El módulo Funcionalidades se denomina `backlog` para no confundirlo con el directorio `features` del frontend.

### 5.4 Frontend

El frontend se organiza por funcionalidades. Cada funcionalidad contiene sus componentes, sus llamadas a la API y su estado. Los datos del servidor se manejan con TanStack Query; el estado del editor, incluido el historial para deshacer y rehacer, con Zustand; y los formularios con React Hook Form y los esquemas Zod compartidos. Cada página, panel y bloque se envuelve en un límite de error para que una falla no afecte al resto de la pantalla.

### 5.5 Registro de tipos de bloque

Cada tipo de bloque reside en su propio directorio dentro de `features/editor/blocks` y se registra con cuatro elementos: su identificador, su componente de lectura, su componente de edición para el panel derecho y su esquema de validación. El editor consulta el registro para mostrar la paleta de bloques. Agregar un tipo de bloque consiste en crear su directorio y registrarlo, sin modificar el editor ni los demás bloques. El mismo patrón se aplica en el backend a los lectores de archivos de dependencias, uno por gestor, y a las metodologías.

## 6. Vista de datos

### 6.1 Reglas generales

- Motor: PostgreSQL 18, misma versión mayor en todos los entornos.
- Identificadores: UUID versión 7, generados por la función `uuidv7()` de PostgreSQL; son únicos y conservan el orden de creación.
- Nombres de tablas y columnas en inglés y en snake\_case; los modelos de Prisma se nombran en PascalCase y sus campos en camelCase, con mapeo explícito.
- Fechas en `timestamptz`, almacenadas en UTC; cada tabla incluye `created_at` y `updated_at`.
- Cada tabla de datos del usuario incluye `owner_id` o pertenece a un proyecto; todas las consultas se filtran por propietario en la capa de servicio.
- La eliminación de una cuenta borra en cascada todos sus datos, conforme a RF-AUT-11.
- El contenido de cada bloque se guarda en una columna JSONB y se valida con el esquema Zod de su tipo antes de escribirse.
- La búsqueda global utiliza la búsqueda de texto completo de PostgreSQL con índices GIN y la extensión `unaccent`, para encontrar palabras con o sin acentos, y la extensión pg\_trgm para tolerar errores de escritura. La caché de resultados reside en el navegador mediante TanStack Query, y la búsqueda se envía solo cuando el usuario deja de escribir durante un instante.
- Los cambios de esquema se realizan exclusivamente con migraciones de Prisma versionadas en el repositorio.

### 6.2 Tablas por módulo

| Módulo | Tabla | Columnas principales |
| --- | --- | --- |
| Cuentas | `users` | id, username, email, email\_verified\_at, password\_hash, display\_name, avatar\_file\_id, locale, theme, time\_zone, tutorial\_status |
| Cuentas | `external_identities` | id, user\_id, provider, provider\_user\_id, email |
| Cuentas | `sessions` | id, user\_id, refresh\_token\_hash, family\_id, client\_type, user\_agent, ip\_address, last\_used\_at, expires\_at, revoked\_at, replaced\_by\_id |
| Cuentas | `password_reset_tokens` | id, user\_id, token\_hash, expires\_at, used\_at |
| Cuentas | `legal_acceptances` | id, user\_id, document\_type, document\_version, accepted\_at |
| Catálogos | `application_areas`, `application_subareas` | id, code, area\_id para el sub ámbito; los nombres visibles provienen de los archivos de idioma |
| Catálogos | `run_environments`, `languages`, `database_engines`, `package_managers`, `licenses`, `methodologies`, `methodology_phases`, `standards` | id, code y atributos propios, como `allows_modification` en licencias o `position` en fases |
| Proyectos | `projects` | id, owner\_id, name, short\_description, version, status, is\_favorite, is\_example, application\_area\_id, application\_subarea\_id, run\_environment\_id, license\_id, last\_run\_at, archived\_at |
| Proyectos | `project_languages` | project\_id, language\_id, is\_primary |
| Proyectos | `tags`, `project_tags` | id, owner\_id, name; project\_id, tag\_id |
| Proyectos | `project_versions` | id, project\_id, version, notes, released\_at |
| Contenido | `blocks` | id, project\_id, type, position, content |
| Ficha técnica | `project_databases` | id, project\_id, database\_engine\_id, other\_name, version |
| Ficha técnica | `dependencies` | id, project\_id, package\_manager\_id, name, version, kind |
| Ficha técnica | `prerequisites`, `variables`, `ports`, `links` | id, project\_id y los campos de RF-TEC-10 a RF-TEC-17 |
| Archivos | `files` | id, owner\_id, storage\_key, thumbnail\_key, mime\_type, size\_bytes, width, height |
| Diagramas | `diagrams` | id, project\_id, type, source\_code, file\_id, last\_error, rendered\_at |
| Metodología | `project_methodologies`, `methodology_phase_changes` | project\_id, methodology\_id, other\_name, current\_phase\_id, notes; historial de fases con fecha |
| Funcionalidades | `backlog_level_settings`, `backlog_items` | project\_id, item\_type, is\_enabled; id, project\_id, parent\_id, item\_type, title, description, acceptance\_criteria, priority, estimate, status, position |
| Documentación | `doc_folders`, `documents`, `document_versions` | id, project\_id, section, parent\_id, name; id, folder\_id, doc\_type, title, content\_md, status, version, approved\_at; historial de versiones aprobadas |
| Estándares | `project_standards` | project\_id, standard\_id, version, notes, evidence\_ref |
| Compartición | `import_origins` | project\_id, original\_author\_name, license\_id, signature, is\_verified, imported\_at |
| Plantillas | `templates` | id, owner\_id nulo para plantillas del sistema, name, scope, blocks |
| Bitácora | `logbook_entries` | Se definirá en el incremento MBI-12 |

El esquema definitivo de Prisma se elaborará en el incremento MBI-0 a partir de esta vista y se revisará contra el modelo conceptual del SRS.

## 7. Vista de despliegue

Al lanzamiento, un servidor de aplicación aloja los tres entornos y la base de datos de producción vive en un servicio administrado aparte. El entorno local reproduce esta misma topología, según la sección 2.4 del SRS.

> Diagrama no exportable a Markdown: Despliegue en la nube al lanzamiento · nivel 1. Consúltalo en la versión del documento en claude.ai; la tabla siguiente contiene la misma información.

La base de datos de producción solo acepta conexiones desde el servidor de aplicación; PlantUML y la base de datos de pruebas no son accesibles desde internet.

| Componente | Red | Puertos accesibles desde internet |
| --- | --- | --- |
| Caddy | Pública | 80, que redirige a 443, y 443 |
| Acceso administrativo | Pública, restringida por el firewall del proveedor | 22, solo con llave SSH y sin contraseña |
| Frontend, API, PlantUML y PostgreSQL de pruebas y preproducción | Red interna de Docker | Ninguno |
| PostgreSQL de producción | Red privada del proveedor, con acceso solo desde el servidor de aplicación | Ninguno |

| Elemento | Estrategia de despliegue |
| --- | --- |
| Imágenes | GitHub Actions construye una imagen por aplicación y la publica en el registro de GitHub, etiquetada con la versión y el commit |
| Actualización | El servidor descarga la imagen nueva y reemplaza el contenedor; el anterior se conserva para revertir |
| Migraciones | Se ejecutan con Prisma antes de iniciar la nueva versión de la API, después de un respaldo de la base de datos |
| Reversión | Volver a la imagen anterior; las migraciones se diseñan compatibles con la versión previa |

## 8. Vista de seguridad

### 8.1 Autenticación y sesiones

1. **Inicio de sesión con contraseña**: la API verifica la contraseña con Argon2id y emite un token de acceso JWT con vigencia de 15 minutos, firmado con algoritmo asimétrico mediante la librería `jose`, y un token de renovación aleatorio de 256 bits.
2. **Almacenamiento del token de renovación**: la base de datos guarda únicamente su hash, junto con un identificador de familia, el tipo de cliente y la fecha de expiración.
3. **Rotación**: cada uso del token de renovación lo revoca y emite uno nuevo de la misma familia. Si se presenta un token ya utilizado, la API revoca todas las sesiones del usuario, conforme a RF-AUT-06.
4. **Aplicación web**: el token de acceso vive solo en memoria, nunca en `localStorage`. El token de renovación viaja en una cookie httpOnly, Secure y SameSite Strict, restringida a la ruta de renovación de `api.tqp-app.com`. Como `tqp-app.com` y `api.tqp-app.com` pertenecen al mismo sitio, la cookie funciona sin relajar esa protección.
5. **Clientes nativos**: indican su tipo en una cabecera; reciben el token de renovación en el cuerpo de la respuesta y lo guardan en el almacenamiento cifrado del dispositivo.
6. **Google**: flujo de código de autorización con PKCE, `state` y `nonce`, mediante la librería `openid-client`. Solo se vincula una cuenta existente si Google confirma que el correo está verificado.
7. **Recuperación de contraseña**: token aleatorio de un solo uso, guardado como hash y con vigencia de 30 minutos. La respuesta es idéntica exista o no la cuenta, para no revelar qué correos están registrados.
8. **Protección contra abuso**: límites de intentos por dirección IP y por cuenta guardados en PostgreSQL, para que funcionen con varias instancias de la API sin servicios adicionales, y verificación de Cloudflare Turnstile en el servidor para registro y recuperación.

### 8.2 Controles por capítulo de OWASP ASVS 5.0

| Capítulo | Controles en TQP App |
| --- | --- |
| Codificación y sanitización | React escapa la salida por defecto; Markdown se muestra sin HTML incrustado; SVG limpiados con DOMPurify |
| Validación y lógica de negocio | Esquemas Zod en el servidor para toda entrada; reglas de negocio en la capa de servicio |
| Seguridad del frontend web | Política de seguridad de contenido estricta sin scripts en línea, HSTS, protección contra incrustación en marcos y política de referencia mediante helmet |
| API y servicios web | CORS con lista de orígenes permitidos; errores con el formato del RFC 9457; límites de tamaño de petición |
| Manejo de archivos | Verificación del tipo real, límites de tamaño y megapíxeles, conversión a WebP, almacenamiento fuera del servidor con acceso solo del propietario |
| Autenticación | Argon2id, contraseñas de 12 caracteres o más, rechazo de contraseñas filtradas, límites de intentos, CAPTCHA invisible |
| Gestión de sesiones | Tokens de renovación rotativos, revocación por familia, cierre de sesiones desde el perfil |
| Autorización | Toda consulta filtrada por propietario en la capa de servicio; pruebas de integración que intentan acceder a datos ajenos |
| Tokens autocontenidos | JWT de corta vigencia con algoritmo fijo y verificación de emisor, audiencia y expiración |
| OAuth y OpenID Connect | Código de autorización con PKCE, `state` y `nonce`; verificación de correo confirmado |
| Criptografía | Algoritmos estándar de librerías mantenidas; ningún algoritmo propio |
| Comunicación segura | HTTPS obligatorio con certificados automáticos de Caddy; red interna para la base de datos y PlantUML |
| Configuración | Secretos solo en variables de entorno; imágenes Docker sin herramientas innecesarias; usuario sin privilegios dentro de los contenedores |
| Protección de datos | Exportación y eliminación de datos del usuario; registros sin contraseñas ni tokens; respaldos cifrados en el proveedor |
| Codificación segura y arquitectura | Revisión automática de dependencias, licencias y secretos en cada cambio |
| Registro de seguridad y errores | Registros estructurados con identificador por petición; eventos de autenticación registrados sin datos sensibles |
| WebRTC | No aplica |

## 9. Manejo de errores y resiliencia

| Nivel | Mecanismo | Resultado ante una falla |
| --- | --- | --- |
| Bloque o panel del frontend | Límite de error de React por bloque, panel y página | Solo el elemento afectado muestra un aviso |
| Petición a la API | Errores tipados lanzados por los servicios y convertidos por un manejador global al formato del RFC 9457, con mensaje traducible y código estable | El cliente recibe un error claro; el servidor sigue atendiendo |
| Servicio externo | Tiempo límite y reintento acotado para PlantUML, almacenamiento, correo, Google y Turnstile; respuesta de no disponible solo en la función afectada | El resto del sistema funciona, conforme a RNF-11 |
| Proceso de la API | Política de reinicio automático de Docker y apagado ordenado al recibir señales del sistema | Disponible de nuevo en menos de 30 segundos, conforme a RNF-12 |
| Supervisión | Punto `/health` con el estado de cada dependencia y monitor externo cada 5 minutos | El responsable recibe un aviso ante una caída |
| Datos | Respaldos diarios fuera del servidor y procedimiento de restauración probado | Pérdida máxima de 24 horas y restauración en menos de 1 hora |

## 10. Calidad y pruebas

| # | Tipo | Alcance | Herramientas | Momento |
| --- | --- | --- | --- | --- |
| 1 | Análisis estático | Tipos, estilo, formato, complejidad máxima de 10 y fronteras entre módulos | TypeScript, ESLint, Prettier | Antes de cada commit y en cada push |
| 2 | Unitarias | Servicios del backend; utilidades y hooks del frontend; cobertura mínima de 70 % en servicios | Vitest | Cada push |
| 3 | De componentes | Cada tipo de bloque y los límites de error | Vitest y Testing Library | Cada push |
| 4 | De integración | API completa contra PostgreSQL y almacenamiento S3 reales en contenedores; aislamiento entre usuarios por cada recurso | Vitest, Supertest y Testcontainers | Cada push |
| 5 | De migraciones | Aplicación de todas las migraciones sobre una base vacía | Prisma | Cada push |
| 6 | De resiliencia | Comportamiento con servicios externos caídos | Vitest con servicios simulados | Cada push |
| 7 | De extremo a extremo | Flujos completos en navegador, incluido el idioma con navegador en francés | Playwright | Al unir a `test`, `develop` y `main` |
| 8 | De accesibilidad | WCAG 2.2 AA y calificación de 90 o más en Lighthouse | axe-core con Playwright y Lighthouse CI | Al unir a `test`, `develop` y `main` |
| 9 | De rendimiento | Metas RNF-02 a RNF-05 | autocannon y size-limit | Al unir a `main` |
| 10 | De seguridad | Vulnerabilidades, secretos, licencias prohibidas y escaneo de la aplicación en ejecución | npm audit, gitleaks, license-checker y OWASP ZAP | Cada push; ZAP al unir a `main` |

La matriz de trazabilidad entre requisitos, historias de usuario y pruebas se mantiene en `docs/` y se actualiza con cada historia terminada.

## 11. Desarrollo y entrega

### 11.1 Flujo de ramas

> Diagrama no exportable a Markdown: Flujo de ramas y entornos. En texto: cada historia se trabaja en `feature/hu-XXX` creada desde `test`; se une a `test` (pruebas 1 a 8, despliegue a test.tqp-app.com), después `test` se une a `develop` (pre.tqp-app.com) y `develop` a `main` (prueba 9, escaneo ZAP, etiqueta SemVer y despliegue a tqp-app.com). Las correcciones urgentes salen de `main` en `hotfix/*` y se integran de vuelta en `main`, `develop` y `test`.

### 11.2 Protección de ramas

Las ramas `test`, `develop` y `main` tendrán las siguientes reglas en GitHub:

- Solo aceptan cambios mediante pull request.
- Todas las comprobaciones de la integración continua deben pasar antes de unir.
- Todos los commits deben estar firmados.
- No se permite forzar el historial ni eliminar la rama.
- No se exige aprobación de otra persona mientras el responsable sea el único desarrollador.

### 11.3 Integración y entrega continuas

| Flujo de trabajo | Se ejecuta | Contenido |
| --- | --- | --- |
| `ci.yml` | En cada push y pull request | Pruebas 1 a 6, revisión de vulnerabilidades, secretos y licencias, y compilación |
| `e2e.yml` | En pull requests hacia `test`, `develop` y `main` | Pruebas 7 y 8 en un entorno levantado con Docker Compose |
| `release.yml` | Al unir a `main` | Pruebas 9 y escaneo con ZAP, etiqueta de versión, historial de cambios y publicación de imágenes |
| `deploy.yml` | Al unir a cada rama protegida, una vez exista la nube | Despliegue al entorno correspondiente según la sección 7 |
| `cleanup.yml` | Semanalmente | Eliminación de imágenes Docker antiguas para conservar el almacenamiento gratuito |

### 11.4 Versiones y commits

- Versiones conforme a Semantic Versioning, con etiquetas `vX.Y.Z` en `main` y un historial de cambios generado a partir de los commits.
- Mensajes de commit en inglés conforme a Conventional Commits, por ejemplo `feat(editor): add command block`.
- Todos los commits se firman con la llave SSH del responsable y se registran únicamente a su nombre. Claude Code se configurará para no agregar líneas de coautoría en commits ni en pull requests.

### 11.5 Organización del trabajo en GitHub

- Un milestone por incremento, de MBI-0 a MBI-14.
- Un issue por historia de usuario, con plantillas para historia de usuario, bug y spike.
- Etiquetas de tipo, módulo, prioridad MoSCoW y estado.
- Un tablero de GitHub Projects con columnas por estado.
- Los issues y milestones se crearán a partir del documento del producto mínimo viable.

## 12. Configuración y secretos

- Toda la configuración se lee de variables de entorno y se valida con Zod al arrancar; si falta una variable obligatoria, la aplicación no inicia e indica cuál falta.
- El repositorio incluye `.env.example` con los nombres de las variables y valores ficticios; los archivos `.env` reales están excluidos de Git.
- En la nube, los secretos residen en los entornos de GitHub llamados `test`, `pre` y `production`, y se entregan al servidor en un archivo con permisos restringidos al desplegar.
- Las claves de firma se pueden rotar sin interrumpir sesiones: la API acepta temporalmente la clave anterior para verificar.

| Variable | Uso |
| --- | --- |
| `APP_ENV` | Entorno: local, test, pre o production |
| `PORT` | Puerto interno de la API |
| `DATABASE_URL` | Conexión a PostgreSQL |
| `WEB_ORIGIN` | Dirección de la aplicación web permitida por CORS |
| `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `JWT_ISSUER`, `JWT_AUDIENCE` | Firma y verificación de tokens de acceso |
| `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL` | Vigencias de 15 minutos y 7 días |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Inicio de sesión con Google |
| `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Almacenamiento compatible con S3 |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM` | Envío de correos; `MAIL_FROM` es `no-reply@tqp-app.com` |
| `PASSWORD_RESET_ENABLED` | Activa la recuperación de contraseña cuando el correo está configurado |
| `TURNSTILE_SECRET_KEY` | Verificación del CAPTCHA invisible |
| `PLANTUML_URL` | Dirección interna del servidor PlantUML |
| `EXPORT_SIGNING_PRIVATE_KEY`, `EXPORT_SIGNING_PUBLIC_KEY` | Firma de proyectos exportados |
| `LOG_LEVEL` | Nivel de detalle de los registros |
| `VITE_API_BASE_URL`, `VITE_TURNSTILE_SITE_KEY` | Configuración pública del frontend, sin secretos |

## 13. Librerías y licencias

Todas las dependencias usan licencias permisivas compatibles con software propietario. La integración continua rechaza cualquier dependencia con licencia AGPL, SSPL o BUSL, o sin licencia declarada.

### 13.1 Frontend

| Área | Librería | Licencia |
| --- | --- | --- |
| Interfaz | React, Vite, Tailwind CSS, Radix UI, shadcn/ui | MIT |
| Navegación | React Router | MIT |
| Datos del servidor | TanStack Query | MIT |
| Estado del editor | Zustand | MIT |
| Formularios y validación | React Hook Form, Zod | MIT |
| Arrastrar y soltar | dnd-kit | MIT |
| Edición de código | CodeMirror 6 | MIT |
| Resaltado de código | Shiki | MIT |
| Markdown | react-markdown, remark-gfm | MIT |
| Tutorial guiado | driver.js | MIT |
| Idiomas | i18next, react-i18next | MIT |

### 13.2 Backend

| Área | Librería | Licencia |
| --- | --- | --- |
| Servidor HTTP | Express 5 | MIT |
| Base de datos | Prisma | Apache-2.0 |
| Validación y documentación | Zod, zod-to-openapi, Scalar | MIT |
| Contraseñas | argon2 | MIT |
| Tokens | jose | MIT |
| Google | openid-client | MIT |
| Seguridad HTTP | helmet, cors, express-rate-limit | MIT |
| Registros | pino | MIT |
| Carga de archivos | multer | MIT |
| Imágenes | sharp | Apache-2.0; incluye libvips con licencia LGPL, compatible al usarse como librería en el servidor |
| Limpieza de SVG | DOMPurify | MPL-2.0 o Apache-2.0, a elección |
| Almacenamiento S3 | Cliente S3 del AWS SDK para JavaScript | Apache-2.0 |
| Correo | Nodemailer | MIT-0 |

### 13.3 Pruebas y calidad

| Área | Herramienta | Licencia |
| --- | --- | --- |
| Pruebas unitarias, de componentes e integración | Vitest, Testing Library, Supertest, Testcontainers | MIT |
| Extremo a extremo | Playwright | Apache-2.0 |
| Accesibilidad | axe-core; Lighthouse CI | MPL-2.0; Apache-2.0 |
| Rendimiento | autocannon, size-limit | MIT |
| Seguridad | gitleaks; OWASP ZAP; license-checker | MIT; Apache-2.0; BSD-3-Clause |
| Calidad de código | ESLint, @eslint/js, typescript-eslint, eslint-plugin-import-x, globals, Prettier | MIT |
| Resolución de imports de TypeScript en ESLint | eslint-import-resolver-typescript | ISC |
| Revisión antes de cada commit | simple-git-hooks, lint-staged | MIT |
| Compilador | TypeScript 6.0, fijo en esa versión mayor hasta que typescript-eslint admita TypeScript 7 | Apache-2.0 |

La regla de fronteras entre módulos usa `no-restricted-paths` de eslint-plugin-import-x, con zonas generadas a partir de los directorios de `apps/api/src/modules/`.

### 13.4 Servicios en contenedor

| Servicio | Uso | Licencia |
| --- | --- | --- |
| PostgreSQL 18 | Base de datos | PostgreSQL License |
| Caddy | Proxy inverso y HTTPS | Apache-2.0 |
| Servidor PlantUML | Generación de diagramas | GPL; se ejecuta como servicio independiente y sin modificar, por lo que no impone obligaciones sobre el código de TQP App |
| SeaweedFS | Almacenamiento local compatible con S3, aprobado en ADR-007 en sustitución de MinIO | Apache-2.0 |
| Mailpit | Captura de correos en local | MIT |

Descartadas por licencia o mantenimiento: Shepherd.js e Intro.js por licencia AGPL; k6 por licencia AGPL; MinIO por licencia AGPL y porque su repositorio fue archivado el 25 de abril de 2026; eslint-plugin-boundaries porque su versión 7.2.0 depende de versiones de handlebars y braces con vulnerabilidades crítica y alta.

## 14. Proveedores y presupuesto

Durante el desarrollo local el costo es cero. Al lanzar en la nube con la base de datos de producción separada, el costo estimado es de aproximadamente 45 dólares estadounidenses al mes. Precios consultados el 8 de octubre de 2026; deben confirmarse al contratar.

| Concepto | Proveedor | Costo mensual estimado en USD |
| --- | --- | --- |
| Servidor de aplicación de 2 vCPU, 4 GB de RAM y 80 GB de disco | DigitalOcean | 24.00 |
| Respaldo semanal del servidor, 20 % de su costo | DigitalOcean | 4.80 |
| PostgreSQL administrado de un nodo para producción, con respaldos diarios y 7 días de retención | DigitalOcean | 15.00 |
| Almacenamiento de archivos y respaldos de base de datos | Backblaze B2, primeros 10 GB sin costo | 0.00 |
| Correo transaccional, hasta 3,000 correos al mes y 100 al día | Resend, plan gratuito | 0.00 |
| Dominio `tqp-app.com`, 10.46 dólares al año | Cloudflare Registrar | 0.87 |
| DNS y CAPTCHA invisible Turnstile | Cloudflare, plan gratuito | 0.00 |
| Repositorio, integración y entrega continuas | GitHub, repositorio público | 0.00 |
| Monitor externo | Plan gratuito de un servicio de monitoreo | 0.00 |
| **Total** |  | **44.67** |

Crecimiento previsto: trasladar producción a un servidor propio agrega aproximadamente 29 dólares al mes; un servidor de 4 vCPU y 8 GB cuesta 48 dólares al mes. La alta disponibilidad de la base de datos requiere la edición Advanced de DigitalOcean, cuyo precio se evaluará cuando el tráfico lo justifique.

Fuentes: [precios de Droplets](https://www.digitalocean.com/pricing/droplets), [precios de PostgreSQL administrado](https://docs.digitalocean.com/products/databases/postgresql/details/pricing/), [Backblaze B2](https://egresscost.com/backblaze-b2), [Resend](https://www.sequenzy.com/pricing/resend), [dominio .com en Cloudflare](https://domainoffer.net/tld/com/cloudflare).

## 15. Registro de decisiones de arquitectura

Cada decisión tendrá además su propio archivo en `docs/adr/`, con contexto, decisión, alternativas y consecuencias. Las decisiones en estado Propuesta requieren la aprobación del responsable del producto.

| ID | Decisión | Alternativas consideradas | Motivo | Estado |
| --- | --- | --- | --- | --- |
| ADR-001 | Monolito modular con capas de rutas, controladores, servicios y repositorios por módulo | Microservicios; MVC sin módulos | Mantenibilidad y aislamiento sin la complejidad operativa de los microservicios | Aprobada |
| ADR-002 | Monorepo con npm workspaces | Repositorios separados; pnpm con Turborepo | Esquemas compartidos entre frontend y backend con la herramienta incluida en npm | Aprobada |
| ADR-003 | TypeScript estricto, Express 5 y Prisma | Fastify; Drizzle | Elección del responsable; tipado y migraciones versionadas | Aprobada |
| ADR-004 | Frontend React con Vite, organizado por funcionalidades, con registro de tipos de bloque | Next.js | Aplicación de una sola página suficiente; API independiente para clientes nativos | Aprobada |
| ADR-005 | Token de acceso JWT de 15 minutos y token de renovación rotativo guardado como hash, entregado según el tipo de cliente | Sesiones en el servidor; tokens en `localStorage` | API sin estado y protección ante robo de tokens | Aprobada |
| ADR-006 | PostgreSQL 18 con identificadores UUID versión 7 y nombres en snake\_case | UUID versión 4; identificadores autoincrementales | Identificadores no adivinables que conservan el orden de creación | Aprobada |
| ADR-007 | Almacenamiento compatible con S3: SeaweedFS en local y Backblaze B2 en la nube | MinIO, con licencia AGPL y repositorio archivado; Garage, con licencia AGPL; disco local | Licencia Apache-2.0, mantenimiento activo y misma interfaz S3 en ambos entornos | Aprobada |
| ADR-008 | Servidor virtual con Docker Compose y Caddy; PostgreSQL administrado en producción | Plataforma administrada; nube de gran escala | Menor costo y control total, reutilizando contenedores | Aprobada |
| ADR-009 | GitHub Actions; ramas protegidas `test`, `develop` y `main`; etiquetas SemVer; Conventional Commits; commits firmados con llave SSH sin coautoría | Jenkins | Sin servidor que mantener; gratuito en repositorio público | Aprobada |
| ADR-010 | Idiomas con i18next y archivos JSON; inglés como base y respaldo | Crowdin | Sin dependencia de terceros y control total de los textos | Aprobada |
| ADR-011 | Servidor PlantUML propio en contenedor, compartido entre entornos | Servidor público de PlantUML; Mermaid | El código de los diagramas no sale de la infraestructura propia | Aprobada |
| ADR-012 | Errores con el formato del RFC 9457 y aislamiento de fallos por bloque, módulo y servicio externo | Mensajes de error libres | Respuestas uniformes y fallas contenidas | Aprobada |
| ADR-013 | Repositorio público con licencia propietaria y todos los derechos reservados | Repositorio privado con GitHub Pro | Costo cero; la licencia mantiene los derechos legales | Aprobada |
| ADR-014 | Proveedores DigitalOcean, Backblaze B2, Resend y Cloudflare | Hetzner; Amazon SES | Precios publicados y verificables, y servicios gratuitos a este volumen | Aprobada |
| ADR-015 | Prohibición de dependencias AGPL, SSPL y BUSL con verificación automática | Revisión manual | Protección del carácter propietario del código | Aprobada |
| ADR-016 | Búsqueda global con la búsqueda de texto completo de PostgreSQL y la extensión pg\_trgm para tolerar errores de escritura; caché en el navegador con TanStack Query y en la memoria propia de PostgreSQL, sin caché compartida en el servidor | Meilisearch; Elasticsearch; caché compartida con Valkey | Sin servicios adicionales; suficiente para la meta de 500 proyectos | Aprobada |

## 16. Riesgos y puntos abiertos

### 16.1 Riesgos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Cambios de precio o de planes de los proveedores; en 2026 Hetzner subió precios y DigitalOcean modificó sus planes de bases de datos | Aumento del costo mensual | Confirmar precios al contratar; arquitectura portable basada en contenedores |
| Límite del plan gratuito de Resend de 100 correos al día | Recuperaciones de contraseña bloqueadas en días de alta demanda | Supervisar el volumen y cambiar al plan de pago si se acerca al límite |
| Código visible en el repositorio público | Copia no autorizada del código | Licencia propietaria y aviso en el README; riesgo aceptado por el responsable |
| Consumo de memoria de PlantUML, que se ejecuta sobre Java | Presión de memoria en el servidor de 4 GB | Un solo contenedor compartido con límite de memoria; medición del consumo real |
| Google exige política de privacidad y dominio verificado para producción | Retraso en el inicio de sesión con Google | Publicar los textos legales antes del lanzamiento |
| Un solo servidor de aplicación al inicio | Caída de la aplicación si falla el servidor | Base de datos separada e imágenes listas para recrear el servidor; producción en servidor propio al haber usuarios |
| Cambio de licencia de una dependencia | Incompatibilidad con el carácter propietario | Verificación automática de licencias en cada cambio |

### 16.2 Puntos abiertos

- [x] Aprobación de ADR-016.
- [ ] Diseño definitivo de la bitácora en el incremento MBI-12.
- [ ] Elección de la región del servidor por menor latencia al momento del despliegue.
- [ ] Elección del servicio de monitoreo externo.
- [ ] Revisión legal del aviso de privacidad y de los términos de uso antes del lanzamiento.
