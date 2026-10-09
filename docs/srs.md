# Especificación de Requisitos de Software — TQP App

Oct 8, 2026 · @taqueritospro

## Control del documento

El presente documento especifica los requisitos de software de TQP App, es decir, lo que el sistema deberá hacer. La arquitectura y el diseño se describen en un documento de arquitectura independiente, y el alcance del producto mínimo viable se define en un tercer documento.

| Campo | Valor |
| --- | --- |
| Producto | TQP App |
| Versión | 1.5 |
| Estado | Decisiones confirmadas por el responsable del producto; pendiente de su revisión final |
| Norma de estructura | ISO/IEC/IEEE 29148:2018, ingeniería de requisitos para sistemas y software |
| Modelo de calidad | ISO/IEC 25010:2023, modelo de calidad del producto de software |
| Prioridad | Método MoSCoW. M: debe incluirse. S: debería incluirse. C: podría incluirse. W: no se incluye por ahora |

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.5 | 2026-10-08 | Nuevo incremento MBI-14 Lanzamiento público con la landing, el despliegue, los textos legales, el CAPTCHA, la eliminación de cuenta y la descarga de datos; MBI-13 conserva el tutorial y la ayuda |
| 1.4 | 2026-10-08 | SeaweedFS sustituye a MinIO como almacenamiento local compatible con S3, porque MinIO tiene licencia AGPL y su repositorio fue archivado |
| 1.3 | 2026-10-08 | Orientación a despliegue en la nube con un entorno local equivalente; entornos y subdominios; almacenamiento compatible con S3; base de datos separada; aviso de privacidad, términos de uso, exportación de datos, CAPTCHA invisible y monitoreo; repositorio público |
| 1.2 | 2026-10-08 | La bitácora se diseña y construye en un incremento propio; el tutorial ofrece seguir un ejemplo ya creado o crear uno paso a paso, y al omitirse no agrega el proyecto de ejemplo |
| 1.1 | 2026-10-08 | Redacción formal del documento; Funcionalidades se confirma como pestaña independiente |
| 1.0 | 2026-10-08 | Nombre TQP App; reorganización de pestañas; jerarquía configurable; landing, tutorial y ayuda; español e inglés; política de imágenes; metas de calidad; OWASP ASVS 5.0 nivel 2; convenciones de código; licencia propietaria |
| 0.1 | 2026-10-08 | Borrador inicial elaborado a partir de la sesión de definición |

## 1. Introducción

### 1.1 Propósito

TQP App es una aplicación web que permite registrar proyectos de software y documentar su propósito, los pasos necesarios para ejecutarlos desde cero o nuevamente, y su documentación técnica y de gestión. Este documento está dirigido al responsable del producto, al equipo de desarrollo y a futuros colaboradores.

### 1.2 Alcance

El sistema comprende:

- Registro de cuentas, inicio de sesión con usuario y contraseña o con Google, y sesiones basadas en tokens.
- Proyectos clasificados por ámbito de aplicación, entorno de ejecución y lenguaje de programación.
- Contenido dinámico construido mediante bloques que se arrastran y se sueltan.
- Pestañas de Contenido, Bitácora, Metodología, Funcionalidades y Documentación. La pestaña Documentación agrupa las secciones Ficha técnica, Documentación técnica, Documentación general y Estándares.
- Ficha técnica del proyecto: tecnologías, dependencias, prerrequisitos, variables, puertos y enlaces.
- Diagramas generados con PlantUML, imágenes y archivos.
- Búsqueda global, panel de inicio con estadísticas, y exportación e importación de proyectos con autoría y licencia.
- Página pública de presentación, tutorial guiado y ayuda.
- Aviso de privacidad, términos de uso y exportación de todos los datos del usuario.
- Interfaz en español e inglés.
- Despliegue en la nube con tres entornos, y un entorno local que reproduce la topología de la nube.

Quedan fuera del alcance de esta versión la aplicación para Android, la aplicación de escritorio, el catálogo público compartido, que requiere la aplicación desplegada en un servidor, la ejecución de comandos desde la aplicación y los temas visuales personalizados.

### 1.3 Visión del producto

TQP App sustituye los archivos de texto dispersos, como el archivo actual denominado Herramientas previas, por un repositorio estructurado en el que cada proyecto puede consultarse en segundos y ejecutarse nuevamente sin depender de la memoria del usuario. El sistema se diseña para operar en la nube y ser utilizado por otras personas, cada una con su propia cuenta. Durante el desarrollo se ejecuta en la computadora del responsable del producto, en un entorno que reproduce la topología de la nube.

### 1.4 Glosario

| Término | Definición |
| --- | --- |
| Proyecto | Unidad principal del sistema: un software del usuario con su contenido, su ficha técnica y su información de gestión |
| Ámbito | Área de aplicación del proyecto, seleccionada de una lista fija; por ejemplo, Ciencia de datos |
| Sub ámbito | Especialización opcional dentro de un ámbito; por ejemplo, Visualización |
| Entorno | Forma y lugar de ejecución del proyecto: Docker, VPS u One time run |
| Bloque | Pieza de contenido que se arrastra al proyecto, como una descripción, un comando o un fragmento de código |
| Ficha técnica | Conjunto de datos técnicos del proyecto: bases de datos, dependencias, prerrequisitos, variables, puertos y enlaces |
| Variable reutilizable | Dato definido una sola vez, por ejemplo RUTA, que se utiliza como `{{RUTA}}` en comandos y código |
| Prerrequisito | Herramienta que debe estar instalada antes de ejecutar el proyecto, junto con su versión mínima |
| Dependencia | Librería que utiliza el proyecto, con su versión y el gestor que la administra, como npm o pip |
| Bitácora | Registro de intentos, errores y soluciones de un proyecto |
| Spike | Investigación acotada en tiempo para resolver una duda técnica |
| Épica | Necesidad de negocio de gran tamaño que se divide en elementos menores |
| Historia de usuario | Necesidad concreta descrita desde el punto de vista del usuario |
| ADR | Registro de decisión de arquitectura: documento breve que justifica una decisión técnica |
| Landing | Página pública de presentación que explica el producto antes del inicio de sesión |
| MVP | Producto mínimo viable: primera versión utilizable del sistema |
| MBI | Incremento mínimo de negocio: conjunto de funcionalidades que entrega valor por sí mismo |
| MoSCoW | Método de priorización con cuatro niveles: debe, debería, podría y no por ahora |
| Instancia | Instalación del sistema con su propia base de datos |

### 1.5 Referencias y normas

- ISO/IEC/IEEE 29148:2018: estructura y calidad de los requisitos.
- ISO/IEC 25010:2023: características de calidad del producto, aplicadas en la sección 4.
- ISO/IEC/IEEE 42010:2022: descripción de arquitectura, aplicada en el documento de arquitectura.
- RFC 6749, marco de autorización OAuth 2.0; OpenID Connect Core 1.0; RFC 7519, JSON Web Token: autenticación.
- RFC 9457, detalles de problemas para APIs HTTP: formato de errores de la API.
- OpenAPI 3.1: descripción de la API.
- OWASP ASVS 5.0: requisitos de seguridad verificables.
- WCAG 2.2: accesibilidad.
- ISO 8601 para fechas, Semantic Versioning 2.0.0 para versiones, SPDX para identificadores de licencias y CommonMark para Markdown.

## 2. Descripción general

### 2.1 Perspectiva del producto

TQP App es un sistema nuevo e independiente, diseñado para desplegarse en la nube. Se compone de una aplicación web de una sola página desarrollada con React y publicada en `tqp-app.com`; de una API REST desarrollada con Node.js y Express, publicada en `api.tqp-app.com`; y de una base de datos PostgreSQL alojada en un servidor independiente del de la aplicación. El sistema utiliza servicios auxiliares: un servidor PlantUML para generar diagramas, un almacenamiento de objetos compatible con S3 para los archivos y un servicio de correo transaccional. Durante el desarrollo, el sistema se ejecuta en la computadora del responsable del producto mediante contenedores Docker que reproducen la misma topología.

### 2.2 Funciones principales

1. Registro de cuentas e inicio de sesión con usuario y contraseña o con Google.
2. Creación de proyectos y su clasificación por ámbito, sub ámbito, entorno y lenguajes.
3. Construcción del contenido de cada proyecto mediante bloques que se arrastran, y edición de dichos bloques en un panel lateral.
4. Registro de la ficha técnica: tecnologías, dependencias leídas del archivo del gestor o capturadas manualmente, prerrequisitos, variables, puertos y enlaces.
5. Generación de diagramas a partir de código PlantUML, con almacenamiento del código y de la imagen.
6. Gestión del proyecto mediante las pestañas Bitácora, Metodología, Funcionalidades y Documentación.
7. Búsqueda en todo el contenido y consulta de estadísticas en el panel de inicio.
8. Exportación e importación de proyectos conservando el autor y la licencia.
9. Presentación pública del producto, tutorial guiado y ayuda en español e inglés.

### 2.3 Usuarios

| Tipo | Descripción | Acceso |
| --- | --- | --- |
| Visitante | Persona que no ha iniciado sesión | Únicamente la landing, el registro, el inicio de sesión y la recuperación de contraseña |
| Usuario registrado | Desarrollador que documenta sus proyectos | Todos sus propios datos y ningún dato de otro usuario |

El sistema no contempla roles ni administradores: todos los usuarios registrados tienen las mismas capacidades sobre sus propios datos.

### 2.4 Entorno de operación

El sistema opera en tres entornos en la nube y en un entorno local equivalente.

| Entorno | Aplicación web | API | Rama de origen |
| --- | --- | --- | --- |
| Producción | `tqp-app.com`; `www.tqp-app.com` redirige a esta dirección | `api.tqp-app.com` | main |
| Preproducción | `pre.tqp-app.com` | `pre-api.tqp-app.com` | develop |
| Pruebas | `test.tqp-app.com` | `test-api.tqp-app.com` | test |
| Local | `tqp-app.localhost` | `api.tqp-app.localhost` | Cualquier rama |

| Componente | Nube | Local |
| --- | --- | --- |
| Servidor de aplicación | Servidor virtual en Estados Unidos con Docker Compose; la región se elegirá por menor latencia al momento del despliegue | Docker Compose en Fedora 44 Workstation |
| Proxy inverso y HTTPS | Caddy con certificados públicos | Caddy con certificados locales |
| Base de datos | PostgreSQL administrado y separado del servidor de aplicación en producción | PostgreSQL en un contenedor y una red propios |
| Archivos | Backblaze B2, compatible con S3 | SeaweedFS, compatible con S3 |
| Correo | Resend, con el remitente `no-reply@tqp-app.com` | Mailpit |
| Diagramas | PlantUML en contenedor, compartido entre entornos | PlantUML en contenedor |
| Respaldos | Copias diarias fuera del servidor | Respaldos locales con `pg_dump` |
| Node.js | Versión LTS activa, fija en todo el proyecto | La misma versión |

Al inicio, la aplicación de producción y los entornos de pruebas y preproducción compartirán un servidor; la base de datos de producción será administrada y separada desde el lanzamiento. La aplicación de producción se trasladará a un servidor propio cuando existan usuarios reales. Los navegadores compatibles son las dos versiones más recientes de Chrome, Firefox y Edge en equipos de escritorio.

### 2.5 Restricciones

- Se utilizará TypeScript en modo estricto en el frontend y en el backend, y Node.js en su versión LTS activa.
- El backend utilizará Express y Prisma; el frontend utilizará React con Vite.
- El sistema se organizará por módulos, cada uno con capas de rutas, controladores, servicios y acceso a datos. El detalle se especifica en el documento de arquitectura.
- La API no guardará estado de sesión en memoria, de modo que pueda ejecutarse en varios servidores sin cambios en el código.
- Todo el código se escribirá en inglés, incluidos nombres, comentarios, mensajes de commit, tablas y mensajes internos. Los textos que ve el usuario provendrán de archivos de traducción en formato JSON.
- Convenciones de nombres:
  - camelCase para variables, funciones, propiedades y campos JSON de la API.
  - PascalCase para clases, tipos y componentes.
  - UPPER\_SNAKE\_CASE para constantes globales y variables de entorno.
  - kebab-case para las rutas de la API.
  - snake\_case para tablas y columnas de la base de datos.
- TQP App es software propietario: todos los derechos quedan reservados al responsable del producto y su uso se regirá por términos de uso. El repositorio será público en la cuenta personal de GitHub del responsable; la visibilidad pública no otorga permiso para usar, modificar ni distribuir el código. No se utilizarán dependencias con licencia AGPL.
- El README estará en español con una versión en inglés; los documentos de la carpeta `docs` estarán en español.
- Todo el trabajo se basará en normas y estándares internacionales, enumerados en la sección 1.5 y en el Apéndice F.
- El sistema nunca ejecutará comandos en la computadora del usuario; únicamente los mostrará para que el usuario los copie.

### 2.6 Supuestos y dependencias

- El responsable del producto creará las credenciales de Google en Google Cloud Console.
- El dominio `tqp-app.com` está sujeto a su disponibilidad al momento del registro.
- La selección de proveedores y el presupuesto se documentan en el documento de arquitectura.
- Los textos del aviso de privacidad y de los términos de uso deberán ser revisados por un abogado antes de publicar el sistema.
- Compartir proyectos entre personas distintas requiere que el sistema esté desplegado; en uso local solo aplica la exportación e importación de archivos. Una futura aplicación de escritorio cubriría el uso sin servidor.

# 3. Requisitos funcionales

## 3.1 Autenticación y cuentas

Cada requisito cuenta con un identificador único y una prioridad según el método MoSCoW. La prioridad expresa importancia y no fecha de entrega; el documento del producto mínimo viable determinará el orden de construcción.

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-AUT-01 | El sistema deberá permitir que un visitante se registre con nombre de usuario, correo electrónico y contraseña | M |
| RF-AUT-02 | El sistema deberá permitir el inicio de sesión con nombre de usuario o correo electrónico, junto con la contraseña | M |
| RF-AUT-03 | El sistema deberá permitir el inicio de sesión con Google mediante OpenID Connect | M |
| RF-AUT-04 | Cuando el correo verificado de Google coincida con el de una cuenta existente, el sistema deberá vincular ambas formas de acceso a la misma cuenta | S |
| RF-AUT-05 | Al iniciar sesión, el sistema deberá emitir un token de acceso con vigencia de 15 minutos y un token de renovación con vigencia de 7 días, entregado según el tipo de cliente conforme a RF-AUT-18 | M |
| RF-AUT-06 | El sistema deberá rotar el token de renovación en cada uso; si se reutiliza un token ya utilizado, deberá cerrar todas las sesiones del usuario | M |
| RF-AUT-07 | El sistema deberá permitir cerrar sesión y revocar el token de renovación correspondiente | M |
| RF-AUT-08 | El sistema deberá mostrar al usuario sus sesiones activas, con dispositivo, fecha de inicio y último uso, y permitirle cerrarlas | S |
| RF-AUT-09 | El sistema deberá permitir recuperar la contraseña mediante un enlace de un solo uso con vigencia de 30 minutos. La función quedará implementada pero desactivada hasta que se configure el servicio de correo | S |
| RF-AUT-10 | El sistema deberá permitir al usuario cambiar su contraseña y editar su perfil, incluidos nombre visible y fotografía | S |
| RF-AUT-11 | El sistema deberá permitir al usuario eliminar su cuenta y todos sus datos de forma definitiva, previa confirmación | S |
| RF-AUT-12 | El sistema deberá limitar los intentos de inicio de sesión, registro y recuperación de contraseña por dirección IP y por cuenta | M |
| RF-AUT-13 | El sistema deberá exigir contraseñas de al menos 12 caracteres y rechazar contraseñas comunes o filtradas | M |
| RF-AUT-14 | El sistema deberá garantizar que cada usuario solo pueda leer y modificar sus propios datos | M |
| RF-AUT-15 | El sistema deberá ofrecer un segundo factor de autenticación mediante aplicación autenticadora conforme al RFC 6238 | W |
| RF-AUT-16 | El sistema deberá verificar mediante un CAPTCHA invisible que el registro y la recuperación de contraseña provienen de una persona | M |
| RF-AUT-17 | El sistema deberá permitir al usuario descargar todos sus datos en un archivo JSON | S |
| RF-AUT-18 | El sistema deberá entregar el token de renovación en una cookie httpOnly, Secure y SameSite a la aplicación web, y en el cuerpo de la respuesta a los clientes nativos, que lo almacenarán en el almacenamiento cifrado del dispositivo | M |

## 3.2 Proyectos, clasificación y pantalla del proyecto

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-PRY-01 | El sistema deberá permitir crear, editar, archivar y eliminar proyectos | M |
| RF-PRY-02 | Cada proyecto deberá tener nombre, descripción breve, versión conforme a Semantic Versioning, estado y marca de favorito | M |
| RF-PRY-03 | Los estados posibles de un proyecto serán: Idea, En desarrollo, Activo, Pausado, Terminado y Archivado | M |
| RF-PRY-04 | Cada proyecto deberá tener un ámbito de la lista fija del Apéndice A y, de forma opcional, un sub ámbito perteneciente a dicho ámbito | M |
| RF-PRY-05 | Cada proyecto deberá tener un entorno de ejecución: Docker, VPS u One time run, según el Apéndice B | M |
| RF-PRY-06 | Cada proyecto deberá tener un lenguaje principal y cero o más lenguajes secundarios | M |
| RF-PRY-07 | El sistema deberá permitir asignar etiquetas libres a los proyectos | M |
| RF-PRY-08 | Cada proyecto deberá tener una licencia del catálogo del Apéndice D | M |
| RF-PRY-09 | El sistema deberá permitir registrar la fecha de la última ejecución del proyecto | C |
| RF-PRY-10 | El sistema deberá permitir duplicar un proyecto propio | C |

### Pantalla del proyecto

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-PRY-11 | La pantalla deberá mostrar un encabezado con el título del proyecto y, a su lado, la versión; debajo, la descripción breve | M |
| RF-PRY-12 | Bajo el encabezado, la pantalla deberá mostrar las pestañas Contenido, Bitácora, Metodología, Funcionalidades y Documentación | M |
| RF-PRY-13 | La pestaña Documentación deberá contener cuatro secciones: Ficha técnica, Documentación técnica, Documentación general y Estándares | M |
| RF-PRY-14 | La pantalla deberá mostrar un panel izquierdo con los bloques que pueden arrastrarse al contenido | M |
| RF-PRY-15 | La pantalla deberá mostrar un área central con el contenido ya formateado, en modo de solo lectura | M |
| RF-PRY-16 | La pantalla deberá mostrar un panel derecho para editar el elemento seleccionado | M |
| RF-PRY-17 | El sistema deberá permitir ocultar los paneles laterales para leer el contenido a todo lo ancho | S |

## 3.3 Editor de contenido y tipos de bloque

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-EDI-01 | El sistema deberá permitir arrastrar un bloque desde el panel izquierdo y soltarlo en cualquier posición del contenido | M |
| RF-EDI-02 | El sistema deberá permitir reordenar los bloques arrastrándolos | M |
| RF-EDI-03 | Al hacer clic o doble clic sobre un bloque, el sistema deberá seleccionarlo y abrir su editor en el panel derecho | M |
| RF-EDI-04 | El sistema deberá permitir duplicar y eliminar bloques; la eliminación requerirá confirmación o podrá deshacerse | M |
| RF-EDI-05 | El sistema deberá permitir deshacer y rehacer cambios en el contenido | S |
| RF-EDI-06 | El sistema deberá guardar los cambios de forma automática y mostrar el estado del guardado: guardando, guardado o error | S |
| RF-EDI-07 | Si un bloque falla al mostrarse, el sistema deberá mostrar un aviso únicamente en ese bloque y mantener visible el resto del contenido | M |
| RF-EDI-08 | La incorporación de un nuevo tipo de bloque no deberá requerir modificaciones en los tipos existentes | M |

### Tipos de bloque

| Tipo | Comportamiento | Prioridad |
| --- | --- | --- |
| Descripción | Texto con formato Markdown conforme a CommonMark | M |
| Comando | Una o más líneas de terminal. Su ancho y alto se ajustan al texto; si supera el ancho del área central, se desplaza horizontalmente. Incluye botón de copiar y admite variables | M |
| Código | Resaltado de sintaxis según el lenguaje elegido. Ocupa el ancho del área central y su alto se ajusta al contenido. Incluye botón de copiar y admite variables | M |
| Título de sección | Encabezado que divide el contenido, por ejemplo Instalación o Ejecución | M |
| Separador | Línea horizontal entre partes del contenido | S |
| Alerta | Aviso destacado con nivel de información, advertencia o peligro | S |
| Checklist | Lista de casillas que el usuario marca y que se conservan | S |
| Imagen | Imagen o captura de pantalla con pie de imagen opcional | S |
| Tabla | Filas y columnas editables | S |
| Enlace | Tarjeta con el título y la dirección de una página | S |
| Árbol de carpetas | El usuario pega la salida del comando `tree` y el sistema la muestra como un árbol plegable; cada carpeta o archivo admite un comentario | S |
| Diagrama PlantUML | Código PlantUML que el sistema convierte en imagen, conforme a la sección 3.5 | S |

## 3.4 Tecnologías, dependencias, prerrequisitos, variables, puertos y enlaces

Estos datos conforman la ficha técnica del proyecto y se muestran en la sección Ficha técnica de la pestaña Documentación.

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-TEC-01 | El sistema deberá permitir registrar las bases de datos que utiliza el proyecto, con su versión, a partir de un catálogo que incluya la opción Otra | M |
| RF-TEC-02 | Cada dependencia deberá registrar nombre, versión, gestor y tipo, ya sea de producción o de desarrollo | M |
| RF-TEC-03 | El sistema deberá permitir agregar, editar y quitar dependencias de forma manual | M |
| RF-TEC-04 | El sistema deberá leer los archivos `package.json` de npm y `requirements.txt` de pip, pegados o subidos por el usuario, y agregar sus dependencias | M |
| RF-TEC-05 | El sistema deberá leer los archivos `pom.xml` de Maven y `build.gradle` o `build.gradle.kts` de Gradle. Para Gradle la lectura es aproximada y el sistema solicitará al usuario revisar el resultado | S |
| RF-TEC-06 | El sistema deberá leer los archivos de los demás gestores enumerados en el Apéndice E | C |
| RF-TEC-07 | Antes de confirmar la lectura de un archivo, el sistema deberá mostrar qué dependencias se agregarán, cuáles cambiarán y cuáles ya existen | M |
| RF-TEC-08 | Mientras el usuario agrega dependencias, la sección deberá mostrar un aviso que indique que es su responsabilidad registrar todas las dependencias del proyecto | M |
| RF-TEC-09 | El sistema deberá generar los archivos `package.json` y `requirements.txt` a partir de las dependencias registradas | S |
| RF-TEC-10 | El sistema deberá permitir registrar prerrequisitos, indicando la herramienta y su versión mínima; por ejemplo, Python 3.13 o Docker 27 | S |
| RF-TEC-11 | El sistema deberá generar un script de terminal que revise los prerrequisitos en la computadora del usuario e informe cuáles faltan o no coinciden | C |
| RF-TEC-12 | El sistema deberá permitir definir variables reutilizables por proyecto, con nombre, valor y descripción | S |
| RF-TEC-13 | Los bloques de comando y de código deberán admitir variables con la sintaxis `{{NOMBRE}}`; el área central mostrará el valor sustituido y el botón de copiar copiará dicho valor | S |
| RF-TEC-14 | Si un bloque utiliza una variable inexistente, el sistema deberá marcarla como faltante | S |
| RF-TEC-15 | El sistema deberá permitir registrar los puertos que utiliza el proyecto, con número, protocolo y servicio | S |
| RF-TEC-16 | Si dos proyectos del mismo usuario declaran el mismo puerto, el sistema deberá advertirlo | C |
| RF-TEC-17 | El sistema deberá permitir registrar enlaces de repositorio, demostración, documentación y otros | S |

Ejemplo de variable: si se define `RUTA = ~/Proyectos/Codigo/Python`, el comando `cd {{RUTA}}` se muestra y se copia como `cd ~/Proyectos/Codigo/Python`.

## 3.5 Diagramas PlantUML, archivos e imágenes

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-DIA-01 | El sistema deberá permitir pegar código PlantUML y generar la imagen en formato SVG mediante un servidor PlantUML propio, ejecutado en contenedor | S |
| RF-DIA-02 | El sistema deberá almacenar el código y la imagen generada; la imagen permanecerá visible aunque el servidor PlantUML esté apagado | S |
| RF-DIA-03 | El sistema deberá permitir subir únicamente la imagen de un diagrama, sin código | S |
| RF-DIA-04 | Si el servidor PlantUML no responde o el código contiene errores, el sistema deberá mostrar el error en el diagrama y conservar la última imagen válida | M |
| RF-DIA-05 | El sistema nunca deberá enviar el código PlantUML a servidores de terceros | M |
| RF-DIA-06 | Cada diagrama deberá tener un tipo: modelo entidad relación, modelo relacional, actividades, secuencia, casos de uso, clases, componentes u otro | C |
| RF-DIA-07 | El sistema deberá ofrecer un editor visual de diagramas entidad relación | W |
| RF-ARC-01 | El sistema deberá permitir subir imágenes PNG, JPG, WebP y SVG de hasta 20 MB y 40 megapíxeles | S |
| RF-ARC-02 | El sistema deberá reducir cada imagen a un máximo de 2560 píxeles en su lado más largo, convertirla a WebP, generar una miniatura y descartar el archivo original | S |
| RF-ARC-03 | El sistema no deberá redimensionar los archivos SVG; deberá eliminar de ellos cualquier código ejecutable y limitar su tamaño a 1 MB | M |
| RF-ARC-04 | El sistema deberá comprobar el tipo real de cada archivo, no solo su extensión, y rechazar las imágenes que superen los límites antes de procesarlas | M |
| RF-ARC-05 | El sistema deberá almacenar los archivos en un almacenamiento de objetos compatible con S3, mediante una interfaz de almacenamiento: SeaweedFS en el entorno local y Backblaze B2 en la nube | M |
| RF-ARC-06 | El cambio de proveedor de almacenamiento compatible con S3 no deberá requerir cambios en los módulos que guardan archivos | S |
| RF-ARC-07 | El sistema deberá permitir que únicamente el propietario de un archivo lo vea o lo descargue | M |
| RF-ARC-08 | El sistema deberá detectar y eliminar los archivos que ya no utilice ningún proyecto | C |

## 3.6 Pestañas de gestión

### Pestaña Bitácora

El diseño definitivo de la bitácora se realizará en el incremento MBI-12, una vez concluidas las demás pestañas; los siguientes requisitos constituyen la base para dicha definición.

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-BIT-01 | El sistema deberá permitir registrar entradas con fecha, problema, intentos realizados, resultado y solución | S |
| RF-BIT-02 | El sistema deberá permitir vincular una entrada con un bloque del contenido | C |
| RF-BIT-03 | El sistema deberá permitir filtrar las entradas por resultado y buscar en su texto | C |

### Pestaña Metodología

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-MET-01 | El sistema deberá permitir asignar al proyecto una o varias metodologías del catálogo del Apéndice C, o la opción Otra con nombre libre | S |
| RF-MET-02 | Para las metodologías con fases definidas, el sistema deberá mostrar dichas fases y permitir marcar la fase actual | S |
| RF-MET-03 | El sistema deberá conservar el historial de cambios de fase con su fecha | C |
| RF-MET-04 | El sistema deberá permitir anotar cómo se aplica la metodología en el proyecto | C |

### Pestaña Funcionalidades

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-FUN-01 | El sistema deberá ofrecer los siguientes tipos de elemento: épica, característica, historia de usuario, tarea, spike y bug | S |
| RF-FUN-02 | El sistema deberá permitir activar, en cada proyecto, únicamente los niveles que el usuario utilice; por ejemplo, prescindir de característica en un proyecto pequeño. La jerarquía se ajustará a los niveles activos | S |
| RF-FUN-03 | Cada historia de usuario deberá seguir el formato Como, quiero, para; incluir criterios de aceptación en formato Dado, Cuando, Entonces; y registrar prioridad, estimación y estado | S |
| RF-FUN-04 | El sistema deberá ofrecer una vista de lista y una vista de tablero por estado | C |
| RF-FUN-05 | El sistema deberá permitir asociar cada elemento a un incremento mínimo de negocio o a una versión del proyecto | C |
| RF-FUN-06 | El sistema deberá permitir exportar las funcionalidades a Markdown | C |
| RF-FUN-07 | El sistema deberá permitir niveles con nombres totalmente personalizados por proyecto | W |

### Pestaña Documentación

La pestaña Documentación agrupa cuatro secciones: Ficha técnica, descrita en la sección 3.4; Documentación técnica; Documentación general; y Estándares.

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-DOC-01 | La sección Ficha técnica deberá mostrar y permitir editar los datos descritos en la sección 3.4 | M |
| RF-DOC-02 | La sección Documentación técnica deberá almacenar documentos como especificaciones de requisitos, arquitectura, registros de decisiones de arquitectura, spikes y diagramas | S |
| RF-DOC-03 | La sección Documentación general deberá almacenar documentos redactados en lenguaje natural, como manuales, guías, actas y acuerdos entre cliente y proveedor | S |
| RF-DOC-04 | El sistema deberá permitir redactar los documentos en Markdown con vista previa | S |
| RF-DOC-05 | El sistema deberá permitir organizar los documentos en carpetas y subcarpetas dentro de cada sección | S |
| RF-DOC-06 | Cada documento deberá tener estado, versión y fecha de aprobación; los estados posibles serán borrador, en revisión y aprobado, para que el documento pueda utilizarse como documento oficial | S |
| RF-DOC-07 | El sistema deberá permitir incluir diagramas PlantUML en los documentos, como diagramas de actividades o de secuencia | S |
| RF-DOC-08 | El sistema deberá ofrecer plantillas por tipo de documento, como una especificación de requisitos basada en ISO/IEC/IEEE 29148 o un spike | C |
| RF-DOC-09 | El sistema deberá permitir exportar un documento a Markdown y a PDF | C |
| RF-DOC-10 | El sistema deberá conservar el historial de versiones aprobadas de cada documento | C |

### Sección Estándares de la pestaña Documentación

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-EST-01 | El sistema deberá permitir registrar los estándares que aplica el proyecto a partir del catálogo del Apéndice F, con su versión y una nota sobre su aplicación | S |
| RF-EST-02 | El sistema deberá agrupar los estándares por área: requisitos, calidad, seguridad, accesibilidad, API, documentación y procesos | C |
| RF-EST-03 | El sistema deberá permitir enlazar cada estándar con su evidencia dentro del proyecto, ya sea un documento o un bloque | C |

## 3.7 Navegación, búsqueda y panel de inicio

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-NAV-01 | Tras iniciar sesión, el sistema deberá dirigir al usuario al panel de inicio, que mostrará sus proyectos recientes y favoritos | M |
| RF-NAV-02 | El panel de inicio deberá mostrar estadísticas de proyectos por ámbito, lenguaje, entorno y estado | S |
| RF-NAV-03 | La lista de proyectos deberá agruparse por ámbito y permitir filtrar por ámbito, sub ámbito, entorno, lenguaje, metodología, estado y etiqueta | M |
| RF-NAV-04 | El sistema deberá ofrecer una búsqueda global en el nombre, la descripción, las etiquetas y el contenido de los bloques, incluidos los comandos | M |
| RF-NAV-05 | La combinación de teclas `Ctrl+F` deberá abrir la búsqueda del sistema; una segunda pulsación deberá permitir la búsqueda nativa del navegador | S |
| RF-NAV-06 | El sistema deberá documentar los atajos de teclado en una ayuda accesible desde la interfaz | C |
| RF-NAV-07 | El sistema deberá ofrecer tema claro y tema oscuro, siguiendo por defecto la configuración del sistema operativo | S |
| RF-NAV-08 | El sistema deberá ofrecer temas visuales personalizados | W |

## 3.8 Exportación, importación, compartición y licencias

La compartición de proyectos entre personas distintas aplica cuando el sistema esté desplegado. En uso local, únicamente se exportan e importan archivos.

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-COM-01 | El sistema deberá permitir exportar un proyecto a un documento Markdown legible y equivalente a su contenido | M |
| RF-COM-02 | El sistema deberá permitir exportar un proyecto a un archivo JSON que incluya su contenido, el autor original, la licencia y una firma digital | S |
| RF-COM-03 | Al importar un archivo JSON, el sistema deberá verificar la firma; si el archivo fue alterado, el proyecto quedará marcado como Autoría no verificada | S |
| RF-COM-04 | En un proyecto importado, el sistema deberá mostrar siempre el autor original y no deberá permitir quitarlo ni modificarlo | S |
| RF-COM-05 | Antes de importar, el sistema deberá mostrar la licencia del proyecto y solicitar al usuario que acepte sus términos | S |
| RF-COM-06 | El sistema deberá bloquear la importación cuando la licencia no permita modificar la obra, conforme al Apéndice D | S |
| RF-COM-07 | Al importar, el sistema deberá solicitar los valores de las variables reutilizables del proyecto | S |
| RF-COM-08 | El sistema deberá ofrecer un catálogo central para publicar, buscar e importar proyectos con un vínculo permanente al original | W |
| RF-COM-09 | El sistema deberá permitir generar un enlace público de solo lectura a un proyecto | W |

La licencia expresa permisos de carácter legal. El sistema muestra la licencia y conserva la atribución, pero no puede impedir copias realizadas fuera de él.

## 3.9 Plantillas, versiones y preferencias

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-PLA-01 | Al crear un proyecto, el sistema deberá permitir partir de una plantilla por ámbito o por entorno con bloques predefinidos | S |
| RF-PLA-02 | El sistema deberá permitir guardar un proyecto propio como plantilla | C |
| RF-PLA-03 | El sistema deberá conservar el historial de versiones del proyecto, con número conforme a Semantic Versioning, fecha y notas de cambios | S |
| RF-PLA-04 | El sistema deberá permitir configurar las preferencias del usuario: idioma, que podrá ser español o inglés, tema y zona horaria | S |

## 3.10 Landing, tutorial, ayuda, idiomas y textos legales

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-BIE-01 | El sistema deberá ofrecer una página pública de presentación, previa al inicio de sesión, que explique qué hace el producto y cómo funciona, con acceso al registro y al inicio de sesión | S |
| RF-BIE-02 | En el primer inicio de sesión, el sistema deberá ofrecer el tutorial guiado con tres opciones: seguir un ejemplo ya creado, crear un ejemplo paso a paso u omitir el tutorial | S |
| RF-BIE-03 | Con la opción seguir un ejemplo ya creado, el sistema deberá agregar el proyecto de ejemplo Generador de código QR y recorrerlo, resaltando cada parte de la pantalla y cada pestaña con una explicación breve y los botones Anterior, Siguiente y Saltar tutorial | S |
| RF-BIE-04 | Con la opción crear un ejemplo paso a paso, el sistema deberá mostrar primero la lista de proyectos vacía y guiar al usuario en la creación de su primer proyecto, bloque por bloque | S |
| RF-BIE-05 | Si el usuario omite el tutorial, el sistema no deberá agregar el proyecto de ejemplo y deberá indicarle dónde encontrar el tutorial por si lo necesita más adelante | S |
| RF-BIE-06 | El sistema deberá recordar si el usuario concluyó u omitió el tutorial y no deberá iniciarlo de nuevo de forma automática | S |
| RF-BIE-07 | El sistema deberá permitir editar y eliminar el proyecto de ejemplo como cualquier otro proyecto | S |
| RF-BIE-08 | El sistema deberá ofrecer un botón de ayuda siempre visible que abra una guía por sección con capturas de pantalla y explicaciones en ambos idiomas | S |
| RF-BIE-09 | Dentro de la ayuda, el botón Hacer tutorial deberá iniciar nuevamente el tutorial y ofrecer las opciones de seguir un ejemplo ya creado o crear un ejemplo paso a paso | S |
| RF-IDI-01 | La interfaz deberá estar disponible en español y en inglés; los textos residirán en un archivo JSON por idioma, con el inglés como idioma base | M |
| RF-IDI-02 | El idioma inicial deberá ser el del navegador cuando este sea español o inglés; en cualquier otro caso, deberá ser inglés | M |
| RF-IDI-03 | El sistema deberá permitir al usuario cambiar el idioma en sus preferencias y recordar su elección | M |
| RF-IDI-04 | El sistema deberá mostrar fechas y números con el formato propio del idioma elegido | S |
| RF-IDI-05 | La incorporación de un nuevo idioma solo deberá requerir agregar su archivo JSON | S |

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-LEG-01 | El sistema deberá publicar un aviso de privacidad, en español y en inglés, accesible sin iniciar sesión | M |
| RF-LEG-02 | El sistema deberá publicar los términos de uso, en español y en inglés, accesibles sin iniciar sesión | M |
| RF-LEG-03 | Al registrarse, el usuario deberá aceptar los términos de uso y el aviso de privacidad; el sistema registrará la versión aceptada y la fecha | M |
| RF-LEG-04 | Cuando cambie la versión de los términos o del aviso, el sistema deberá solicitar al usuario su aceptación en el siguiente inicio de sesión | S |
| RF-LEG-05 | La landing y el pie de página deberán enlazar al aviso de privacidad y a los términos de uso | M |

El contenido que redacta el usuario, como proyectos, bloques y documentos, no se traduce; únicamente se traduce la interfaz.

## 4. Requisitos no funcionales

Los requisitos no funcionales se organizan según las características de calidad de ISO/IEC 25010:2023. Todas las metas numéricas fueron confirmadas por el responsable del producto.

| ID | Característica | Requisito | Prioridad |
| --- | --- | --- | --- |
| RNF-01 | Adecuación funcional | Cada requisito con prioridad M deberá contar con al menos un criterio de aceptación verificable | M |
| RNF-02 | Eficiencia de desempeño | Las operaciones de lectura de la API deberán responder en menos de 300 ms en el 95 % de los casos, con 500 proyectos en la instancia | S |
| RNF-03 | Eficiencia de desempeño | La pantalla de un proyecto con 100 bloques deberá cargar en menos de 2 segundos en la red local | S |
| RNF-04 | Eficiencia de desempeño | La búsqueda global deberá responder en menos de 500 ms con 500 proyectos | S |
| RNF-05 | Eficiencia de desempeño | El código inicial que descarga el navegador deberá pesar menos de 300 KB comprimido | S |
| RNF-06 | Compatibilidad | La API deberá documentarse en OpenAPI 3.1 y poder utilizarse desde una futura aplicación Android sin cambios | M |
| RNF-07 | Compatibilidad | La política CORS deberá permitir únicamente los orígenes configurados | M |
| RNF-08 | Capacidad de interacción | La interfaz deberá cumplir WCAG 2.2 en el nivel AA y poder utilizarse únicamente con el teclado | S |
| RNF-09 | Capacidad de interacción | Cada pantalla deberá obtener una calificación de 90 o superior en la auditoría de accesibilidad de Lighthouse | S |
| RNF-10 | Capacidad de interacción | Los mensajes de error deberán ser claros, estar en el idioma del usuario e indicar qué ocurrió y qué hacer | M |
| RNF-11 | Fiabilidad | El fallo de un módulo o de un servicio externo, como PlantUML, el correo o Google, no deberá detener los demás; únicamente la función afectada responderá como no disponible | M |
| RNF-12 | Fiabilidad | Si el proceso del servidor se detiene, deberá reiniciarse automáticamente y estar disponible de nuevo en menos de 30 segundos | M |
| RNF-13 | Fiabilidad | El punto de salud `/health` deberá informar el estado de la base de datos y de cada servicio externo | M |
| RNF-14 | Fiabilidad | La base de datos deberá respaldarse con `pg_dump` y su restauración deberá estar documentada. Una vez desplegado el sistema, el respaldo será diario, la pérdida máxima de datos será de 24 horas y la restauración tomará menos de 1 hora | S |
| RNF-15 | Fiabilidad | Una vez desplegado, el sistema deberá alcanzar una disponibilidad mensual de 99.5 % | S |
| RNF-16 | Seguridad | El sistema deberá cumplir los requisitos aplicables de OWASP ASVS 5.0 en el nivel 2 | M |
| RNF-17 | Seguridad | Las contraseñas deberán almacenarse con Argon2id y los tokens de renovación únicamente como hash | M |
| RNF-18 | Seguridad | Toda entrada deberá validarse en el servidor mediante esquemas compartidos con el frontend | M |
| RNF-19 | Seguridad | Los secretos deberán residir únicamente en variables de entorno, fuera del repositorio, y los registros no deberán contener contraseñas ni tokens | M |
| RNF-20 | Seguridad | En despliegue, todo el tráfico deberá utilizar HTTPS | M |
| RNF-21 | Seguridad | Antes de cada versión, `npm audit` no deberá reportar vulnerabilidades críticas ni altas | M |
| RNF-22 | Seguridad operacional | El sistema nunca deberá ejecutar comandos en la computadora del usuario | M |
| RNF-23 | Mantenibilidad | El sistema deberá organizarse en módulos independientes; un módulo solo podrá utilizar otro a través de su interfaz pública | M |
| RNF-24 | Mantenibilidad | Cada cambio deberá pasar TypeScript en modo estricto, ESLint y Prettier sin errores, y respetar las convenciones de nombres de la sección 2.5 | M |
| RNF-25 | Mantenibilidad | Ninguna función deberá superar una complejidad ciclomática de 10 | S |
| RNF-26 | Mantenibilidad | Los servicios y la API deberán contar con pruebas automatizadas, con una cobertura mínima de 70 % en los servicios | S |
| RNF-27 | Mantenibilidad | Los cambios en la base de datos deberán realizarse únicamente mediante migraciones versionadas de Prisma | M |
| RNF-28 | Mantenibilidad | Los registros deberán ser estructurados e incluir un identificador por petición | S |
| RNF-29 | Flexibilidad | Todo el sistema deberá levantarse con Docker Compose y configurarse mediante variables de entorno; el entorno local deberá reproducir la topología de la nube: proxy con HTTPS, subdominios, base de datos separada, almacenamiento compatible con S3 y correo | S |
| RNF-30 | Flexibilidad | El proveedor de almacenamiento compatible con S3 deberá poder cambiarse sin modificar los módulos | S |
| RNF-31 | Fiabilidad | Un monitor externo deberá consultar el punto de salud de producción cada 5 minutos y notificar al responsable ante una caída | S |
| RNF-32 | Flexibilidad | La API deberá poder ejecutarse en varias instancias detrás de un balanceador de carga sin cambios en el código | M |
| RNF-33 | Seguridad | Ningún secreto deberá existir en el repositorio público; la integración continua deberá rechazar cambios que contengan secretos | M |

## 5. Interfaces externas

### 5.1 Interfaz de usuario

| Pantalla | Contenido |
| --- | --- |
| Landing | Descripción del producto y de su funcionamiento, con acceso al registro y al inicio de sesión |
| Aviso de privacidad y términos de uso | Textos legales públicos en español y en inglés |
| Inicio de sesión y registro | Usuario o correo y contraseña, botón de Google, enlace de recuperación y aceptación de términos |
| Panel de inicio | Estadísticas, proyectos recientes y favoritos |
| Lista de proyectos | Proyectos agrupados por ámbito, filtros y búsqueda; cuando no hay proyectos, una invitación a crear el primero |
| Proyecto | Encabezado con título y versión, descripción, pestañas, panel izquierdo de bloques, área central de lectura y panel derecho de edición |
| Tutorial | Capa sobre la pantalla actual que resalta una parte a la vez, con los botones Anterior, Siguiente y Saltar tutorial |
| Ayuda | Guía por sección con capturas de pantalla y el botón Hacer tutorial |
| Perfil | Datos de la cuenta, contraseña, sesiones activas, idioma, tema, zona horaria, descarga de datos y eliminación de cuenta |
| Importación y exportación | Selección del archivo, revisión de licencia y autoría, y confirmación |

La disposición de la pantalla del proyecto sigue el boceto aprobado por el responsable del producto el 8 de octubre de 2026.

### 5.2 Interfaz de programación

- API REST con formato JSON publicada en `https://api.tqp-app.com/v1` y en los subdominios equivalentes de cada entorno.
- Autenticación mediante el token de acceso en la cabecera `Authorization: Bearer`; el token de renovación se entrega conforme a RF-AUT-18.
- Política CORS que admite únicamente las direcciones de la aplicación web de cada entorno.
- Errores conforme al formato del RFC 9457.
- Listados paginados.
- Descripción completa de la API en OpenAPI 3.1, para su consumo por aplicaciones propias como la futura aplicación Android.

### 5.3 Servicios externos

| Servicio | Uso | Comportamiento si no está disponible |
| --- | --- | --- |
| Google, mediante OpenID Connect | Inicio de sesión con Google | El acceso con usuario y contraseña sigue funcionando |
| Servidor PlantUML en contenedor | Generación de imágenes de diagramas | Se muestra la última imagen guardada junto con un aviso |
| Resend en la nube; Mailpit en local | Correos de recuperación de contraseña | La recuperación se informa como no disponible |
| Backblaze B2 en la nube; SeaweedFS en local | Almacenamiento de imágenes y diagramas | Las imágenes no se muestran y la carga se informa como no disponible; el resto del contenido sigue visible |
| CAPTCHA invisible | Protección del registro y de la recuperación | El sistema rechaza temporalmente registros nuevos e informa al usuario |
| PostgreSQL | Datos del sistema | El sistema informa que el servicio no está disponible |
| Monitor externo | Verificación periódica del punto de salud | Sin efecto en el sistema; solo se pierden los avisos |

## 6. Modelo de datos conceptual

Todo dato pertenece a un usuario o a un proyecto de ese usuario, con excepción de los catálogos, que son comunes y de solo lectura. El modelo físico, con tablas y campos, se detalla en el documento de arquitectura.

| Grupo | Entidades | Relación principal |
| --- | --- | --- |
| Cuentas | Usuario, con idioma, tema, zona horaria y estado del tutorial; Identidad externa de Google; Sesión con su token de renovación; Token de recuperación | Un usuario tiene varias identidades y sesiones |
| Catálogos | Ámbito, Sub ámbito, Entorno, Lenguaje, Base de datos, Gestor de dependencias, Licencia, Metodología, Fase y Estándar | Son comunes a todos los usuarios; sus nombres visibles provienen de los archivos de idioma |
| Proyecto | Proyecto, con marca de proyecto de ejemplo; Etiqueta; Versión del proyecto | Un usuario tiene muchos proyectos; un proyecto tiene un ámbito, un entorno y una licencia |
| Contenido | Bloque, con tipo, orden y contenido | Un proyecto tiene muchos bloques ordenados |
| Ficha técnica | Lenguaje del proyecto, principal o secundario; Base de datos del proyecto con su versión; Dependencia; Prerrequisito; Variable; Puerto; Enlace | Pertenecen a un proyecto |
| Archivos | Archivo, con versión optimizada y miniatura; Diagrama, con código y archivo de imagen | Un archivo pertenece a un usuario; los bloques y los documentos lo referencian |
| Gestión | Entrada de bitácora; Metodología del proyecto con su fase actual; Elemento de funcionalidad, que puede ser épica, característica, historia de usuario, tarea, spike o bug; Niveles activos del proyecto | Pertenecen a un proyecto; los elementos de funcionalidad forman una jerarquía |
| Documentación | Carpeta; Documento, con sección técnica o general, tipo, estado y versión; Estándar del proyecto | Pertenecen a un proyecto; las carpetas forman una jerarquía |
| Compartición | Origen de importación, con autor original, licencia, firma y estado de verificación | Un proyecto importado tiene un origen |
| Plantillas | Plantilla con bloques predefinidos | Puede ser del sistema o de un usuario |

En la base de datos, las tablas y columnas utilizan snake\_case y nombres en inglés; por ejemplo, `project_versions.created_at`.

## 7. Módulos, dependencias e incrementos

El sistema se divide en 18 módulos y se construye en 15 incrementos mínimos de negocio, denominados MBI, cada uno utilizable por sí mismo. Una vez concluido el incremento de Proyectos, los incrementos de Editor, Tecnologías y Gestión pueden desarrollarse en paralelo. El documento del producto mínimo viable determinará qué incrementos se construyen primero.

### 7.1 Módulos

| Módulo | Responsabilidad | Utiliza |
| --- | --- | --- |
| Plataforma | Configuración, manejo de errores, registros, salud, conexión a la base de datos e idiomas | Ninguno |
| Cuentas | Registro, inicio de sesión, tokens, sesiones, recuperación de contraseña y preferencias | Plataforma |
| Catálogos | Ámbitos, entornos, lenguajes, bases de datos, licencias, metodologías y estándares | Plataforma |
| Proyectos | Datos y clasificación de proyectos, etiquetas y versiones | Cuentas, Catálogos |
| Contenido | Bloques, orden, tipos de bloque y variables | Proyectos, Archivos, Diagramas |
| Ficha técnica | Bases de datos, dependencias, prerrequisitos, puertos y enlaces | Proyectos, Catálogos |
| Archivos | Carga, optimización, almacenamiento y entrega de archivos mediante la interfaz de almacenamiento | Cuentas |
| Diagramas | Generación y almacenamiento de diagramas PlantUML | Archivos |
| Bitácora | Entradas de intentos y errores | Proyectos |
| Metodología | Metodologías del proyecto y fase actual | Proyectos, Catálogos |
| Funcionalidades | Épicas, características, historias de usuario, tareas, spikes y bugs, con niveles activables | Proyectos |
| Documentación | Documentos Markdown técnicos y generales en carpetas, con estado y versión | Proyectos, Archivos, Diagramas |
| Estándares | Estándares aplicados por proyecto | Proyectos, Catálogos |
| Búsqueda | Búsqueda global en proyectos y contenido | Proyectos, Contenido, Ficha técnica |
| Inicio | Panel de inicio y estadísticas | Proyectos |
| Compartición | Exportación, importación, firma, licencias y autoría | Proyectos, Contenido, Ficha técnica, Catálogos |
| Plantillas | Plantillas de proyecto | Proyectos, Contenido |
| Bienvenida | Landing, tutorial guiado, proyecto de ejemplo y ayuda | Cuentas, Proyectos, Contenido |

### 7.2 Incrementos mínimos de negocio

> Diagrama no exportable a Markdown: Incrementos mínimos de negocio y sus dependencias · 15 incrementos. Consúltalo en la versión del documento en claude.ai; la tabla siguiente contiene la misma información.

| Incremento | Entrega | Módulos | Depende de |
| --- | --- | --- | --- |
| MBI-0 Fundación | Monorepo, Docker Compose, conexión a la base de datos, manejo de errores, registros, punto de salud, idiomas español e inglés y licencia propietaria | Plataforma | Ninguno |
| MBI-1 Acceso | Registro, inicio de sesión con usuario o con Google, tokens con rotación, sesiones y preferencias; recuperación de contraseña implementada pero inactiva | Cuentas | MBI-0 |
| MBI-2 Proyectos | Catálogos; alta y edición de proyectos con clasificación, etiquetas y licencia; lista con filtros; panel de inicio básico | Catálogos, Proyectos, Inicio | MBI-1 |
| MBI-3 Editor | Pantalla del proyecto con arrastrar y soltar; bloques de descripción, comando, código, título y separador; variables; botón de copiar; exportación a Markdown | Contenido | MBI-2 |
| MBI-4 Tecnologías | Pestaña Documentación con la sección Ficha técnica: bases de datos, dependencias leídas de npm y pip o capturadas manualmente, prerrequisitos, puertos y enlaces | Ficha técnica | MBI-2 |
| MBI-5 Gestión | Pestañas Metodología con fases y Funcionalidades con niveles activables | Metodología, Funcionalidades | MBI-2 |
| MBI-6 Bloques adicionales | Almacenamiento y optimización de imágenes; bloques de imagen, alerta, checklist, tabla, enlace y árbol de carpetas | Archivos, Contenido | MBI-3 |
| MBI-7 Diagramas | PlantUML en contenedor; almacenamiento de código e imagen; tolerancia a fallos | Diagramas | MBI-6 |
| MBI-8 Documentación | Secciones Documentación técnica, Documentación general y Estándares | Documentación, Estándares | MBI-4, MBI-7 |
| MBI-9 Búsqueda | Búsqueda global, atajo `Ctrl+F` y estadísticas completas | Búsqueda, Inicio | MBI-3 |
| MBI-10 Compartición | Exportación e importación de JSON firmado, licencias y autor original | Compartición | MBI-3, MBI-4 |
| MBI-11 Plantillas | Plantillas de proyecto e historial de versiones | Plantillas, Proyectos | MBI-3 |
| MBI-12 Bitácora | Diseño definitivo de la bitácora con el responsable del producto y construcción de la pestaña Bitácora | Bitácora | MBI-5, MBI-8, ya que se diseña al concluir las demás pestañas |
| MBI-13 Bienvenida | Tutorial guiado con sus dos modalidades y ayuda con capturas de pantalla | Bienvenida | MBI-12, ya que el tutorial recorre todas las pestañas |
| MBI-14 Lanzamiento público | Despliegue en la nube, landing, aviso de privacidad y términos de uso, CAPTCHA invisible, eliminación de cuenta, descarga de datos y monitoreo externo; se construye inmediatamente después del producto mínimo viable | Plataforma, Cuentas, Bienvenida | MBI-4, ya que publica el producto mínimo viable |
| Futuro | Catálogo central y enlace público, que requieren despliegue; aplicación Android; aplicación de escritorio; segundo factor de autenticación; temas; editor visual de diagramas entidad relación; niveles con nombres personalizados | Varios | Según el caso |

## 8. Verificación y criterios de aceptación

Cada requisito se verificará mediante al menos uno de los siguientes métodos: prueba automatizada, inspección o demostración. Junto al plan de pruebas se mantendrá una matriz de trazabilidad que relacione cada requisito con sus historias de usuario y sus pruebas.

Criterios de aceptación generales:

- [ ] Un usuario no puede leer ni modificar datos de otro usuario; existe una prueba de integración por cada recurso de la API.
- [ ] La reutilización de un token de renovación ya utilizado cierra todas las sesiones del usuario.
- [ ] Con el contenedor PlantUML detenido, el resto del sistema funciona y cada diagrama muestra su última imagen junto con un aviso.
- [ ] Un bloque que falla al mostrarse no impide visualizar los demás bloques.
- [ ] Un comando más ancho que el área central se desplaza horizontalmente sin afectar el diseño.
- [ ] Al copiar un comando que contiene `{{RUTA}}`, se copia el valor sustituido.
- [ ] La lectura de un archivo `package.json` muestra los cambios antes de confirmar y registra todas sus dependencias.
- [ ] Una fotografía de 15 MB se almacena como WebP de un máximo de 2560 píxeles y el archivo original no se conserva.
- [ ] Con el navegador configurado en francés, el sistema se muestra en inglés; con el navegador en español, se muestra en español.
- [ ] Al omitir el tutorial, no se agrega el proyecto de ejemplo, el sistema indica dónde encontrar el tutorial y este no vuelve a iniciarse automáticamente; el botón Hacer tutorial lo inicia de nuevo con sus dos modalidades.
- [ ] El proyecto Generador de código QR se registra completo y su exportación a Markdown contiene los mismos pasos que el archivo Herramientas previas.
- [ ] Un archivo JSON alterado se importa marcado como Autoría no verificada; un proyecto con una licencia que no permite modificaciones se rechaza.
- [ ] El punto de salud `/health` refleja por separado la caída de cada servicio externo.

## 9. Supuestos y decisiones

La siguiente tabla registra las decisiones tomadas con el responsable del producto el 8 de octubre de 2026.

| # | Tema | Decisión | Estado |
| --- | --- | --- | --- |
| 1 | Nombre del producto | TQP App; la landing explica qué hace el producto y cómo funciona | Confirmado |
| 2 | Ficha técnica | Sección dentro de la pestaña Documentación | Confirmado |
| 3 | Vigencia de los tokens | Acceso de 15 minutos y renovación de 7 días | Confirmado |
| 4 | Imágenes | Hasta 20 MB y 40 megapíxeles; se almacenan en WebP con un máximo de 2560 píxeles y se descarta el original | Confirmado |
| 5 | Almacenamiento de archivos | Compatible con S3 desde el inicio: SeaweedFS en local y Backblaze B2 en la nube | Confirmado |
| 6 | Firma de exportaciones | Detecta alteraciones; la autoría solo se garantiza dentro de una misma instancia desplegada | Confirmado |
| 7 | Bitácora | Diseño definitivo y construcción en el incremento MBI-12, al concluir las demás pestañas | Confirmado |
| 8 | Metas de calidad | Las establecidas en la sección 4 | Confirmado |
| 9 | Seguridad | OWASP ASVS 5.0, nivel 2 | Confirmado |
| 10 | Catálogos fijos | Se amplían únicamente mediante actualizaciones del sistema; mientras tanto, se utiliza la opción Otra | Confirmado |
| 11 | Jerarquía de funcionalidades | Tipos fijos con niveles activables por proyecto; los nombres personalizados se incorporarán después | Confirmado |
| 12 | Convenciones de código | Las establecidas en la sección 2.5: código en inglés, camelCase y snake\_case en la base de datos | Confirmado |
| 13 | Idiomas | Español e inglés en archivos JSON, con el inglés como idioma base y de respaldo; sin servicios externos de traducción | Confirmado |
| 14 | Licencia de TQP App | Propietaria, con todos los derechos reservados y términos de uso; sin dependencias AGPL; el registro ante INDAUTOR o IMPI queda a decisión del responsable | Confirmado |
| 15 | Ubicación de Funcionalidades | Pestaña independiente | Confirmado |
| 16 | Tutorial omitido | Al omitir el tutorial no se agrega el proyecto de ejemplo y el sistema indica dónde encontrar el tutorial; al iniciarlo, el usuario elige seguir un ejemplo ya creado o crear uno paso a paso | Confirmado |
| 17 | Orientación del sistema | Diseñado para la nube; en desarrollo se ejecuta localmente reproduciendo la topología de la nube | Confirmado |
| 18 | Entornos | Producción, preproducción y pruebas en la nube, más el entorno local; inicialmente comparten servidor de aplicación | Confirmado |
| 19 | Base de datos de producción | Administrada y separada del servidor de aplicación desde el lanzamiento | Confirmado |
| 20 | Dominio | `tqp-app.com` sin www como dirección principal; API en `api.tqp-app.com` | Confirmado |
| 21 | Repositorio | Público en la cuenta personal de GitHub del responsable, con posibilidad de migrar a una organización | Confirmado |
| 22 | Textos legales | Aviso de privacidad y términos de uso en ambos idiomas, revisados por un abogado antes de publicar | Confirmado |
| 23 | Protección y monitoreo | CAPTCHA invisible en registro y recuperación; monitor externo del punto de salud | Confirmado |
| 24 | Documentación | README en español con versión en inglés; documentos de `docs` en español | Confirmado |

## Apéndices

### A. Ámbitos y sub ámbitos

Lista aprobada por el responsable del producto.

| Ámbito | Sub ámbitos |
| --- | --- |
| Desarrollo web | Frontend, Backend y APIs, Full stack, Sitios estáticos, Comercio electrónico, CMS |
| Aplicaciones móviles | Android nativo, iOS nativo, Multiplataforma |
| Aplicaciones de escritorio | Interfaz gráfica, Utilidades del sistema |
| Ciencia de datos | Análisis exploratorio, Visualización, Ingeniería de datos ETL, Web scraping, Estadística |
| Inteligencia artificial | Machine learning, Deep learning, Visión por computadora, Procesamiento de lenguaje natural, IA generativa y LLMs, Agentes |
| Automatización y scripts | Tareas repetitivas, Procesamiento de archivos, Generación de archivos y contenido, Bots, Tareas programadas |
| Multimedia | Imagen, Audio, Video |
| DevOps e infraestructura | CI/CD, Contenedores y orquestación, Monitoreo, Infraestructura como código, Redes |
| Bases de datos | Modelado, Migraciones, Administración y respaldos |
| Ciberseguridad | Auditoría y pruebas de penetración, Criptografía, Análisis forense |
| Videojuegos y gráficos | 2D, 3D, Simulación |
| Sistemas embebidos e IoT | Microcontroladores, Sensores, Domótica |
| Software empresarial | ERP y CRM, Gestión, Finanzas |
| Computación científica | Métodos numéricos, Simulación física |
| Herramientas para desarrolladores | CLI, Librerías y SDK, Extensiones, Plantillas |
| Educación y práctica | Algoritmos y estructuras de datos, Ejercicios, Proyectos escolares |

Ejemplo de clasificación: el proyecto Generador de código QR pertenece al ámbito Automatización y scripts, sub ámbito Generación de archivos y contenido, entorno One time run y lenguaje Python.

### B. Entornos

| Entorno | Definición |
| --- | --- |
| Docker | El proyecto se ejecuta dentro de uno o más contenedores |
| VPS | Código que se instala y ejecuta en un servidor |
| One time run | Script que se ejecuta desde la terminal, de forma local o en la nube, sin interfaz web, de escritorio ni móvil |

### C. Metodologías

| Metodología | Fases disponibles para marcar la fase actual |
| --- | --- |
| CRISP-DM | Comprensión del negocio, Comprensión de los datos, Preparación de los datos, Modelado, Evaluación, Despliegue |
| TDSP | Comprensión del negocio, Adquisición y comprensión de datos, Modelado, Despliegue, Aceptación del cliente |
| SEMMA | Muestrear, Explorar, Modificar, Modelar, Evaluar |
| KDD | Selección, Preprocesamiento, Transformación, Minería de datos, Interpretación |
| Cascada | Requisitos, Diseño, Implementación, Verificación, Mantenimiento |
| RUP | Inicio, Elaboración, Construcción, Transición |
| Espiral | Planificación, Análisis de riesgos, Ingeniería y Evaluación, repetidas en cada ciclo |
| Design Thinking | Empatizar, Definir, Idear, Prototipar, Evaluar |
| Scrum | Sin fases fijas; se marca el sprint actual |
| Kanban, Scrumban, XP, Lean, DevOps, MLOps, TDD, BDD, Prototipado | Sin fases fijas |

### D. Licencias

| Licencia según SPDX | Permite modificar | Se puede importar |
| --- | --- | --- |
| MIT | Sí | Sí |
| Apache-2.0 | Sí | Sí |
| GPL-3.0-only | Sí, bajo la misma licencia | Sí |
| BSD-3-Clause | Sí | Sí |
| MPL-2.0 | Sí | Sí |
| CC-BY-4.0 | Sí | Sí |
| CC-BY-NC-4.0 | Sí, sin uso comercial | Sí |
| CC-BY-ND-4.0 | No | No |
| CC-BY-NC-ND-4.0 | No | No |
| Todos los derechos reservados | No | No |

TQP App es software propietario: todos los derechos quedan reservados al responsable del producto.

### E. Gestores de dependencias

| Gestor | Archivo | Lectura | Generación |
| --- | --- | --- | --- |
| npm | `package.json` | M | S |
| pip | `requirements.txt` | M | S |
| Maven | `pom.xml` | S | C |
| Gradle | `build.gradle`, `build.gradle.kts` | S, con lectura aproximada | C |
| Cargo | `Cargo.toml` | C | C |
| Composer | `composer.json` | C | C |
| Go modules | `go.mod` | C | C |
| NuGet | `*.csproj` | C | C |
| vcpkg y Conan | `vcpkg.json`, `conanfile.txt` | C | C |

### F. Estándares

Catálogo inicial de la sección Estándares.

| Área | Estándares |
| --- | --- |
| Requisitos | ISO/IEC/IEEE 29148 |
| Calidad del producto | ISO/IEC 25010 |
| Arquitectura y diseño | ISO/IEC/IEEE 42010, IEEE 1016 |
| Ciclo de vida | ISO/IEC/IEEE 12207 |
| Pruebas | ISO/IEC/IEEE 29119 |
| Seguridad | ISO/IEC 27001, OWASP ASVS, OWASP Top 10 |
| Accesibilidad | WCAG 2.2 |
| API e intercambio | OpenAPI 3.1, RFC 9457, RFC 6749, OpenID Connect, RFC 7519 |
| Formatos y convenciones | ISO 8601, Semantic Versioning 2.0.0, SPDX, CommonMark |
| Gestión ágil | Guía de Scrum 2020 |
