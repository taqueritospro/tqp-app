# Producto Mínimo Viable — TQP App

2026-10-08 · @taqueritospro

## Control del documento

El presente documento define el alcance del producto mínimo viable de TQP App y las historias de usuario que lo componen. Cada historia se convertirá en un issue de GitHub dentro del milestone de su incremento.

| Campo                | Valor                                                                                                                   |
|----------------------|-------------------------------------------------------------------------------------------------------------------------|
| Producto             | TQP App                                                                                                                 |
| Versión              | 0.1                                                                                                                     |
| Estado               | Aprobado por el responsable del producto el 8 de octubre de 2026                                                        |
| Documentos base      | SRS versión 1.5 y Documento de Arquitectura versión 0.1                                                                 |
| Formato de historias | Como, quiero, para; criterios de aceptación en formato Dado, Cuando, Entonces                                           |
| Estimación           | Puntos de historia en escala de Fibonacci: 1, 2, 3, 5 y 8. Son una estimación inicial de esfuerzo relativo, no de horas |

## 1. Objetivo del MVP

El MVP permite al responsable del producto sustituir su archivo Herramientas previas por TQP App en su computadora: crear proyectos clasificados, armar sus pasos con bloques, registrar su ficha técnica y exportarlos a Markdown, con cuentas seguras y sobre la misma arquitectura que se desplegará en la nube.

**Criterio de éxito**: el proyecto Generador de código QR queda registrado en TQP App con todos sus pasos, variables y dependencias, y su exportación a Markdown contiene la misma información que el archivo Herramientas previas, en el entorno local de nube simulada.

## 2. Alcance

### 2.1 Incrementos incluidos

| Incremento        | Entrega en el MVP                                                                                                                                            |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MBI-0 Fundación   | Monorepo, entorno local de nube simulada, plataforma de la API, base de datos, idiomas, frontend base e integración continua                                 |
| MBI-1 Acceso      | Registro, inicio de sesión con usuario o Google, tokens con rotación, sesiones, perfil y preferencias; recuperación de contraseña implementada pero inactiva |
| MBI-2 Proyectos   | Catálogos, proyectos con clasificación, etiquetas, estados y favoritos, lista con filtros y panel de inicio básico                                           |
| MBI-3 Editor      | Pantalla del proyecto, bloques de descripción, comando, código, título y separador, variables, guardado automático y exportación a Markdown                  |
| MBI-4 Tecnologías | Pestaña Documentación con la sección Ficha técnica: bases de datos, dependencias, lectura de npm y pip, prerrequisitos, puertos y enlaces                    |

### 2.2 Excluido del MVP

- Despliegue en la nube; el MVP se ejecuta en el entorno local de nube simulada.
- Pestañas Bitácora, Metodología y Funcionalidades, y las secciones Documentación técnica, Documentación general y Estándares; en el MVP solo se muestran las pestañas Contenido y Documentación.
- Bloques de imagen, alerta, checklist, tabla, enlace, árbol de carpetas y diagramas.
- Búsqueda global, estadísticas, compartición, plantillas, historial de versiones, landing, tutorial y ayuda.
- Eliminación de cuenta, descarga de datos, CAPTCHA, textos legales y segundo factor de autenticación.

### 2.3 Versiones posteriores propuestas

| Versión             | Contenido                                                                                                                     | Condición                                             |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| MVP                 | MBI-0 a MBI-4                                                                                                                 | Uso local por el responsable                          |
| Lanzamiento público | MBI-14: despliegue en la nube; textos legales; CAPTCHA; eliminación de cuenta y descarga de datos; landing; monitoreo externo | Necesario antes de que otras personas usen el sistema |
| Posteriores         | MBI-5 a MBI-13 en el orden de dependencias del SRS; MBI-13 conserva el tutorial y la ayuda                                    | Según prioridad del responsable                       |

Por decisión del responsable, la landing se adelantó al incremento MBI-14 Lanzamiento público, que se construye inmediatamente después del MVP; el SRS versión 1.5 refleja este cambio.

## 3. Definición de listo y definición de terminado

**Una historia está lista para comenzar cuando**:

- [ ] Tiene redactados el enunciado y los criterios de aceptación.
- [ ] Indica los requisitos del SRS que cubre.
- [ ] Tiene estimación.
- [ ] No depende de otra historia pendiente.

**Una historia está terminada cuando**:

- [ ] Cumple todos sus criterios de aceptación.
- [ ] Tiene pruebas automatizadas y la cobertura de servicios se mantiene en 70 % o más.
- [ ] Pasa todas las comprobaciones de la integración continua: tipos, estilo, pruebas, vulnerabilidades, secretos y licencias.
- [ ] Los textos visibles están en español y en inglés.
- [ ] Los cambios de base de datos se realizan con una migración de Prisma.
- [ ] La documentación afectada está actualizada.
- [ ] Funciona en el entorno local de nube simulada.
- [ ] El responsable del producto revisó y aprobó el pull request.

## 4. Historias de MBI-0 Fundación

Las historias de este incremento son habilitadoras: no entregan funciones al usuario final, pero son la base de todas las demás.

### HU-001 Estructura del monorepo y calidad de código

Como responsable del producto, quiero un monorepo con reglas de calidad automáticas, para que el código sea mantenible desde el primer día.

Requisitos: RNF-23, RNF-24, RNF-25 · Prioridad: M · Estimación: 5

- Dado el repositorio recién clonado, cuando ejecuto la instalación de dependencias, entonces quedan disponibles los paquetes `apps/api`, `apps/web` y `packages/shared` según la arquitectura.
- Dado un archivo con un error de tipos, de estilo o con una función de complejidad mayor a 10, cuando intento hacer commit, entonces el commit se rechaza e indica el problema.
- Dado un módulo que importa archivos internos de otro módulo, cuando se ejecuta ESLint, entonces la regla de fronteras entre módulos lo reporta como error.

### HU-002 Entorno local que simula la nube

Como responsable del producto, quiero levantar en mi computadora la misma topología que tendrá la nube, para que lo que funcione localmente funcione al desplegar.

Requisitos: RNF-29 · Prioridad: M · Estimación: 8

- Dado Docker instalado, cuando ejecuto el comando de inicio en modo nube simulada, entonces se levantan Caddy, el frontend, la API, PostgreSQL 18, SeaweedFS, Mailpit y PlantUML.
- Dado el entorno levantado, cuando abro `https://tqp-app.localhost` y `https://api.tqp-app.localhost`, entonces ambos responden con HTTPS.
- Dado el entorno levantado, cuando intento conectarme a PostgreSQL o a PlantUML desde fuera de la red de Docker, entonces la conexión no está disponible, salvo el puerto de base de datos habilitado solo para desarrollo con DBeaver.
- Dado el modo desarrollo, cuando modifico código del frontend o de la API, entonces el cambio se refleja sin reiniciar los contenedores.

### HU-003 Plataforma de la API

Como responsable del producto, quiero que la API valide su configuración, registre cada petición y responda errores uniformes, para detectar problemas rápido y no exponer detalles internos.

Requisitos: RNF-10, RNF-12, RNF-13, RNF-19, RNF-28, ADR-012 · Prioridad: M · Estimación: 5

- Dada una variable de entorno obligatoria ausente, cuando arranca la API, entonces no inicia e indica qué variable falta.
- Dada cualquier petición, cuando se registra, entonces el registro es estructurado, incluye un identificador de petición y no contiene contraseñas ni tokens.
- Dado un error en un servicio, cuando la API responde, entonces el cuerpo sigue el formato del RFC 9457 con un código estable y sin trazas internas.
- Dado el punto `/health`, cuando PostgreSQL no responde, entonces informa el estado degradado de esa dependencia por separado.

### HU-004 Base de datos y migraciones

Como responsable del producto, quiero el esquema inicial en PostgreSQL con migraciones versionadas, para que la base de datos evolucione de forma controlada.

Requisitos: RNF-27, ADR-006 · Prioridad: M · Estimación: 3

- Dada una base vacía, cuando aplico las migraciones, entonces se crean las tablas con nombres en snake_case e identificadores UUID versión 7 generados por la base de datos.
- Dado el esquema de Prisma, cuando lo consulto, entonces los modelos usan PascalCase y los campos camelCase, mapeados a snake_case.
- Dada la integración continua, cuando se ejecuta, entonces verifica que todas las migraciones se aplican sobre una base vacía.

### HU-005 Idiomas español e inglés

Como usuario, quiero ver la aplicación en mi idioma, para entenderla sin esfuerzo.

Requisitos: RF-IDI-01, RF-IDI-02, RF-IDI-04, RF-IDI-05 · Prioridad: M · Estimación: 3

- Dado un navegador en español, cuando abro la aplicación por primera vez, entonces se muestra en español.
- Dado un navegador en francés, cuando abro la aplicación, entonces se muestra en inglés.
- Dado un mensaje de error de la API, cuando se muestra, entonces aparece en el idioma de la interfaz.
- Dado un texto nuevo sin traducción en español, cuando se ejecuta la integración continua, entonces la revisión de traducciones lo reporta.

### HU-006 Frontend base

Como usuario, quiero una interfaz consistente, accesible y con tema claro y oscuro, para usar la aplicación con comodidad.

Requisitos: RNF-08, RF-NAV-07, ADR-004 · Prioridad: M · Estimación: 5

- Dado el sistema operativo en modo oscuro, cuando abro la aplicación, entonces se muestra el tema oscuro.
- Dado un error en una página, cuando ocurre, entonces solo esa página muestra un aviso y el menú sigue funcionando.
- Dada cualquier pantalla, cuando la recorro solo con el teclado, entonces puedo alcanzar y activar todos los controles.

### HU-007 Integración continua, licencia y repositorio

Como responsable del producto, quiero que cada cambio se verifique automáticamente y que el repositorio refleje mis derechos, para proteger la calidad y la propiedad del código.

Requisitos: RNF-21, RNF-33, ADR-009, ADR-013, ADR-015 · Prioridad: M · Estimación: 5

- Dado un push a cualquier rama, cuando se ejecuta `ci.yml`, entonces corren las pruebas 1 a 6 y las revisiones de vulnerabilidades, secretos y licencias.
- Dado un cambio que agrega una dependencia con licencia AGPL o un secreto, cuando se ejecuta la integración continua, entonces el cambio se rechaza.
- Dadas las ramas `test`, `develop` y `main`, cuando intento unir un cambio sin pull request, con pruebas fallidas o con commits sin firmar, entonces GitHub lo impide.
- Dado el repositorio, cuando lo consulto, entonces contiene `LICENSE` con todos los derechos reservados, `README.md` en español y `README.en.md` en inglés, y plantillas de issues para historia de usuario, bug y spike.

## 5. Historias de MBI-1 Acceso

### HU-008 Registro con usuario y contraseña

Como visitante, quiero crear una cuenta con usuario, correo y contraseña, para guardar mis proyectos.

Requisitos: RF-AUT-01, RF-AUT-13 · Prioridad: M · Estimación: 3

- Dados datos válidos, cuando me registro, entonces se crea la cuenta y la contraseña se guarda con Argon2id.
- Dada una contraseña de menos de 12 caracteres o incluida en la lista de contraseñas filtradas, cuando me registro, entonces el sistema la rechaza y explica el motivo.
- Dado un usuario o correo ya registrado, cuando intento registrarme con él, entonces el sistema lo indica sin crear una cuenta duplicada.

### HU-009 Inicio y cierre de sesión

Como usuario, quiero iniciar y cerrar sesión de forma segura, para acceder solo yo a mis proyectos.

Requisitos: RF-AUT-02, RF-AUT-05, RF-AUT-07, RF-AUT-12, RF-AUT-18 · Prioridad: M · Estimación: 5

- Dadas credenciales correctas, cuando inicio sesión con usuario o correo, entonces recibo un token de acceso de 15 minutos y el token de renovación en una cookie httpOnly, Secure y SameSite Strict.
- Dado un cliente nativo, cuando inicia sesión, entonces recibe el token de renovación en el cuerpo de la respuesta.
- Dados varios intentos fallidos seguidos, cuando se supera el límite, entonces el sistema bloquea temporalmente nuevos intentos desde esa dirección y para esa cuenta.
- Dada una sesión activa, cuando cierro sesión, entonces el token de renovación queda revocado y ya no permite renovar.

### HU-010 Renovación de sesión con rotación

Como usuario, quiero que mi sesión se renueve sin volver a escribir mi contraseña, y que un token robado sea inútil, para estar cómodo y protegido.

Requisitos: RF-AUT-06 · Prioridad: M · Estimación: 5

- Dado un token de acceso vencido, cuando la aplicación lo renueva, entonces recibo un token de acceso nuevo y un token de renovación nuevo, y el anterior queda revocado.
- Dado un token de renovación ya utilizado, cuando alguien lo presenta, entonces el sistema revoca todas mis sesiones.
- Dado un token de renovación con más de 7 días, cuando se presenta, entonces el sistema lo rechaza y solicita iniciar sesión.

### HU-011 Inicio de sesión con Google

Como usuario, quiero entrar con mi cuenta de Google, para no recordar otra contraseña.

Requisitos: RF-AUT-03, RF-AUT-04 · Prioridad: M · Estimación: 5

- Dada mi cuenta de Google, cuando elijo iniciar sesión con Google, entonces el flujo usa código de autorización con PKCE, `state` y `nonce`.
- Dado un correo de Google verificado que coincide con una cuenta existente, cuando inicio sesión con Google, entonces ambas formas de acceso quedan vinculadas a la misma cuenta.
- Dado un correo de Google no verificado, cuando coincide con una cuenta existente, entonces el sistema no la vincula.

### HU-012 Sesiones activas

Como usuario, quiero ver y cerrar mis sesiones abiertas, para cortar el acceso desde dispositivos que ya no uso.

Requisitos: RF-AUT-08 · Prioridad: S · Estimación: 2

- Dadas varias sesiones abiertas, cuando abro mi perfil, entonces veo cada una con dispositivo, fecha de inicio y último uso.
- Dada una sesión de la lista, cuando la cierro, entonces ese dispositivo ya no puede renovar su sesión.

### HU-013 Recuperación de contraseña inactiva

Como usuario, quiero recuperar mi contraseña por correo cuando la olvide, para no perder mi cuenta.

Requisitos: RF-AUT-09 · Prioridad: S · Estimación: 3

- Dada la variable `PASSWORD_RESET_ENABLED` en falso, cuando abro la pantalla de inicio de sesión, entonces la opción de recuperación no aparece.
- Dada la función activa en el entorno local, cuando solicito recuperar la contraseña, entonces Mailpit recibe un enlace de un solo uso con vigencia de 30 minutos.
- Dado un correo no registrado, cuando solicito recuperación, entonces la respuesta es la misma que para uno registrado.

### HU-014 Perfil y preferencias

Como usuario, quiero editar mi perfil y elegir idioma, tema y zona horaria, para adaptar la aplicación a mí.

Requisitos: RF-AUT-10, RF-PLA-04, RF-IDI-03 · Prioridad: S · Estimación: 3

- Dado mi perfil, cuando cambio mi nombre visible o mi contraseña, entonces los cambios se guardan; el cambio de contraseña exige la contraseña actual.
- Dado mi perfil, cuando elijo idioma, tema o zona horaria, entonces la interfaz se actualiza y la elección se conserva al volver a iniciar sesión.

### HU-015 Aislamiento de datos entre usuarios

Como usuario, quiero que nadie más pueda ver ni modificar mis datos, para confiar en la aplicación.

Requisitos: RF-AUT-14, RNF-16 · Prioridad: M · Estimación: 3

- Dados dos usuarios, cuando el primero solicita a la API un recurso del segundo con su identificador, entonces la API responde que no existe, sin revelar que pertenece a otra persona.
- Dado cada recurso nuevo de la API, cuando se agrega, entonces incluye una prueba de integración que verifica este aislamiento.

## 6. Historias de MBI-2 Proyectos

### HU-016 Catálogos iniciales

Como usuario, quiero elegir ámbitos, entornos, lenguajes y licencias de listas predefinidas, para clasificar mis proyectos de forma consistente.

Requisitos: RF-PRY-04, RF-PRY-05, RF-PRY-06, RF-PRY-08, Apéndices A, B, D y E del SRS · Prioridad: M · Estimación: 3

- Dada una base nueva, cuando se aplican los datos iniciales, entonces existen los 16 ámbitos con sus sub ámbitos, los 3 entornos, las licencias, los lenguajes, los motores de base de datos y los gestores de dependencias.
- Dado el idioma de la interfaz, cuando veo un catálogo, entonces sus nombres aparecen en ese idioma.

### HU-017 Crear y editar un proyecto

Como usuario, quiero crear un proyecto con su nombre, descripción, versión y clasificación, para tenerlo organizado desde el inicio.

Requisitos: RF-PRY-01 a RF-PRY-06, RF-PRY-08 · Prioridad: M · Estimación: 5

- Dado el formulario de nuevo proyecto, cuando lo completo con nombre, descripción breve, versión, ámbito, entorno, lenguaje principal y licencia, entonces el proyecto se crea a mi nombre.
- Dado un sub ámbito, cuando lo elijo, entonces solo se ofrecen los del ámbito seleccionado.
- Dada una versión que no sigue Semantic Versioning, cuando guardo, entonces el sistema la rechaza con un ejemplo válido.
- Dado un proyecto existente, cuando edito cualquiera de sus datos, entonces los cambios se guardan.

### HU-018 Estados, etiquetas y favoritos

Como usuario, quiero marcar el estado de mis proyectos, ponerles etiquetas y destacar mis favoritos, para encontrarlos según lo que necesito.

Requisitos: RF-PRY-02, RF-PRY-03, RF-PRY-07 · Prioridad: M · Estimación: 3

- Dado un proyecto, cuando cambio su estado, entonces solo puedo elegir entre Idea, En desarrollo, Activo, Pausado, Terminado y Archivado.
- Dado un proyecto, cuando le agrego etiquetas, entonces puedo reutilizar mis etiquetas existentes o crear nuevas.
- Dado un proyecto, cuando lo marco como favorito, entonces aparece en la sección de favoritos del panel de inicio.

### HU-019 Archivar y eliminar proyectos

Como usuario, quiero archivar los proyectos que ya no uso y eliminar los que no quiero conservar, para mantener ordenada mi lista.

Requisitos: RF-PRY-01 · Prioridad: M · Estimación: 2

- Dado un proyecto, cuando lo archivo, entonces deja de aparecer en la lista principal y puedo consultarlo con el filtro de archivados.
- Dado un proyecto, cuando lo elimino, entonces el sistema pide confirmación escribiendo su nombre y después lo borra con todo su contenido.

### HU-020 Lista de proyectos con filtros

Como usuario, quiero ver mis proyectos agrupados por ámbito y filtrarlos, para llegar rápido al que busco.

Requisitos: RF-NAV-03 · Prioridad: M · Estimación: 5

- Dados mis proyectos, cuando abro la lista, entonces aparecen agrupados por ámbito.
- Dada la lista, cuando filtro por ámbito, sub ámbito, entorno, lenguaje, estado o etiqueta, entonces solo veo los proyectos que cumplen todos los filtros elegidos.
- Dado que no tengo proyectos, cuando abro la lista, entonces veo una invitación a crear el primero.

### HU-021 Panel de inicio básico

Como usuario, quiero llegar a un panel con mis proyectos recientes y favoritos al iniciar sesión, para retomar mi trabajo de inmediato.

Requisitos: RF-NAV-01 · Prioridad: M · Estimación: 2

- Dado un inicio de sesión exitoso, cuando entro, entonces llego al panel de inicio.
- Dado el panel, cuando lo veo, entonces muestra mis proyectos modificados más recientemente y mis favoritos, con acceso directo a cada uno.

## 7. Historias de MBI-3 Editor

### HU-022 Pantalla del proyecto

Como usuario, quiero una pantalla con el título, la versión, la descripción, las pestañas y los paneles de bloques y edición, para trabajar cada proyecto en un solo lugar.

Requisitos: RF-PRY-11 a RF-PRY-17 · Prioridad: M · Estimación: 5

- Dado un proyecto, cuando lo abro, entonces veo el título con la versión a su lado, la descripción breve debajo y las pestañas Contenido y Documentación.
- Dada la pestaña Contenido, cuando la abro, entonces veo el panel izquierdo de bloques, el área central de solo lectura y el panel derecho de edición.
- Dados los paneles laterales, cuando los oculto, entonces el contenido ocupa todo el ancho.

### HU-023 Arrastrar, soltar y reordenar bloques

Como usuario, quiero arrastrar bloques desde el panel izquierdo y reordenarlos, para armar los pasos de mi proyecto en el orden correcto.

Requisitos: RF-EDI-01, RF-EDI-02 · Prioridad: M · Estimación: 5

- Dado un tipo de bloque en el panel izquierdo, cuando lo arrastro y lo suelto en cualquier posición del contenido, entonces se crea ahí.
- Dado un bloque existente, cuando lo arrastro a otra posición, entonces el nuevo orden se conserva al recargar.
- Dado que uso solo el teclado, cuando muevo un bloque con las teclas de dirección, entonces también puedo reordenarlo.

### HU-024 Seleccionar y editar en el panel derecho

Como usuario, quiero que al seleccionar un bloque se abra su editor en el panel derecho, para modificarlo sin perder de vista el resultado.

Requisitos: RF-EDI-03 · Prioridad: M · Estimación: 3

- Dado un bloque, cuando hago clic o doble clic sobre él, entonces queda seleccionado y su editor aparece en el panel derecho.
- Dado un cambio en el editor, cuando escribo, entonces el área central refleja el resultado.

### HU-025 Bloque de descripción

Como usuario, quiero escribir explicaciones con formato Markdown, para documentar cada paso con claridad.

Requisitos: tipo Descripción de la sección 3.3 del SRS · Prioridad: M · Estimación: 2

- Dado un bloque de descripción, cuando escribo Markdown, entonces el área central lo muestra con formato.
- Dado HTML dentro del texto, cuando se muestra, entonces no se ejecuta ni se interpreta.

### HU-026 Bloque de comando

Como usuario, quiero bloques de comandos de terminal que pueda copiar con un clic, para volver a correr mis proyectos sin reescribir nada.

Requisitos: tipo Comando de la sección 3.3 del SRS · Prioridad: M · Estimación: 3

- Dado un bloque de comando, cuando su texto es corto, entonces el bloque se ajusta a su ancho y alto.
- Dado un comando más ancho que el área central, cuando se muestra, entonces se desplaza horizontalmente sin romper el diseño.
- Dado el botón de copiar, cuando lo pulso, entonces el comando queda en el portapapeles y el sistema lo confirma.

### HU-027 Bloque de código

Como usuario, quiero bloques de código con resaltado según su lenguaje, para guardar fragmentos legibles.

Requisitos: tipo Código de la sección 3.3 del SRS · Prioridad: M · Estimación: 3

- Dado un bloque de código, cuando elijo su lenguaje, entonces el contenido se resalta según ese lenguaje.
- Dado un fragmento largo, cuando se muestra, entonces el bloque ocupa el ancho del área central y crece en alto.
- Dado el botón de copiar, cuando lo pulso, entonces el código queda en el portapapeles.

### HU-028 Bloques de título de sección y separador

Como usuario, quiero dividir el contenido con títulos y separadores, para distinguir pasos como instalación y ejecución.

Requisitos: tipos Título de sección y Separador de la sección 3.3 del SRS · Prioridad: M · Estimación: 1

- Dado un bloque de título, cuando escribo su texto, entonces se muestra como encabezado.
- Dado un separador, cuando lo agrego, entonces aparece una línea horizontal entre bloques.

### HU-029 Variables reutilizables

Como usuario, quiero definir variables como la ruta de mi proyecto y usarlas en mis comandos, para actualizar un dato en un solo lugar.

Requisitos: RF-TEC-12, RF-TEC-13, RF-TEC-14 · Prioridad: S · Estimación: 5

- Dada la variable `RUTA` con un valor, cuando escribo `cd {{RUTA}}` en un comando, entonces el área central muestra la ruta sustituida.
- Dado el botón de copiar, cuando copio ese comando, entonces se copia con el valor sustituido.
- Dada una variable inexistente, cuando aparece en un bloque, entonces el sistema la marca como faltante.

### HU-030 Duplicar, eliminar, deshacer y guardado automático

Como usuario, quiero duplicar y eliminar bloques, deshacer errores y que todo se guarde solo, para editar sin miedo a perder trabajo.

Requisitos: RF-EDI-04, RF-EDI-05, RF-EDI-06 · Prioridad: M · Estimación: 5

- Dado un bloque, cuando lo duplico, entonces aparece una copia debajo.
- Dado un bloque eliminado, cuando pulso deshacer, entonces vuelve a su posición.
- Dado cualquier cambio, cuando dejo de escribir, entonces se guarda automáticamente y el indicador muestra guardando, guardado o error.

### HU-031 Aislamiento de fallos y registro de bloques

Como responsable del producto, quiero que cada tipo de bloque se registre de forma independiente y que un bloque con error no afecte a los demás, para agregar tipos nuevos sin riesgo.

Requisitos: RF-EDI-07, RF-EDI-08 · Prioridad: M · Estimación: 3

- Dado un bloque cuyo contenido produce un error al mostrarse, cuando abro el proyecto, entonces solo ese bloque muestra un aviso y el resto se ve normalmente.
- Dado un tipo de bloque nuevo, cuando se agrega su directorio y se registra, entonces aparece en la paleta sin modificar el editor ni los demás tipos.

### HU-032 Exportar a Markdown

Como usuario, quiero exportar un proyecto a un archivo Markdown, para tener un respaldo legible fuera de la aplicación.

Requisitos: RF-COM-01 · Prioridad: M · Estimación: 3

- Dado un proyecto, cuando lo exporto, entonces descargo un archivo Markdown con sus datos, sus bloques en orden y las variables sustituidas.
- Dado el archivo exportado, cuando lo abro en otro editor, entonces los comandos y el código aparecen como bloques de código.

### HU-033 Registrar el proyecto Generador de código QR

Como responsable del producto, quiero registrar mi proyecto real del generador de código QR, para validar que TQP App sustituye a mi archivo de texto.

Requisitos: criterio de éxito del MVP · Prioridad: M · Estimación: 1

- Dado TQP App en el entorno de nube simulada, cuando registro el proyecto con su clasificación, sus pasos, la variable de ruta y su dependencia, entonces su exportación a Markdown contiene la misma información que el archivo Herramientas previas.

## 8. Historias de MBI-4 Tecnologías

### HU-034 Pestaña Documentación con la sección Ficha técnica

Como usuario, quiero una sección de ficha técnica dentro de la pestaña Documentación, para reunir lo que mi proyecto necesita para correr.

Requisitos: RF-PRY-13, RF-DOC-01 · Prioridad: M · Estimación: 3

- Dado un proyecto, cuando abro la pestaña Documentación, entonces veo la sección Ficha técnica con sus apartados de bases de datos, dependencias, prerrequisitos, puertos y enlaces.
- Dadas las demás secciones de Documentación, cuando abro la pestaña, entonces no aparecen hasta su incremento.

### HU-035 Bases de datos del proyecto

Como usuario, quiero registrar qué bases de datos usa mi proyecto y en qué versión, para recrear su entorno sin adivinar.

Requisitos: RF-TEC-01 · Prioridad: M · Estimación: 2

- Dado el catálogo de motores, cuando agrego uno con su versión, entonces queda registrado en el proyecto.
- Dado un motor fuera del catálogo, cuando elijo Otra, entonces puedo escribir su nombre.

### HU-036 Dependencias capturadas manualmente

Como usuario, quiero agregar, editar y quitar dependencias con su versión, gestor y tipo, para documentar cualquier proyecto aunque no tenga archivo de gestor.

Requisitos: RF-TEC-02, RF-TEC-03, RF-TEC-08 · Prioridad: M · Estimación: 3

- Dada la sección de dependencias, cuando agrego una con nombre, versión, gestor y tipo de producción o desarrollo, entonces queda registrada.
- Dado que estoy agregando dependencias, cuando veo la sección, entonces aparece el aviso de que es mi responsabilidad registrarlas todas.
- Dada una dependencia existente, cuando la edito o la quito, entonces el cambio se guarda.

### HU-037 Leer package.json y requirements.txt

Como usuario, quiero que la aplicación lea el archivo de mi gestor de dependencias, para no capturarlas una por una.

Requisitos: RF-TEC-04, RF-TEC-07 · Prioridad: M · Estimación: 5

- Dado un `package.json` pegado o subido, cuando lo proceso, entonces el sistema muestra qué dependencias se agregarán, cuáles cambiarán de versión y cuáles ya existen, separando producción y desarrollo.
- Dado un `requirements.txt`, cuando lo proceso, entonces ocurre lo mismo con sus paquetes de pip.
- Dada la vista previa, cuando confirmo, entonces se aplican los cambios; cuando cancelo, no cambia nada.
- Dado un archivo mal formado, cuando lo proceso, entonces el sistema indica el error sin modificar las dependencias.

### HU-038 Generar package.json y requirements.txt

Como usuario, quiero generar el archivo del gestor a partir de las dependencias registradas, para reconstruir un proyecto desde cero.

Requisitos: RF-TEC-09 · Prioridad: S · Estimación: 2

- Dadas dependencias de npm registradas, cuando genero el archivo, entonces descargo un `package.json` válido con producción y desarrollo separados.
- Dadas dependencias de pip registradas, cuando genero el archivo, entonces descargo un `requirements.txt` con una dependencia y su versión por línea.

### HU-039 Prerrequisitos

Como usuario, quiero registrar qué herramientas y versiones mínimas necesita mi proyecto, para saber qué instalar antes de correrlo.

Requisitos: RF-TEC-10 · Prioridad: S · Estimación: 2

- Dada la sección de prerrequisitos, cuando agrego una herramienta con su versión mínima, por ejemplo Python 3.13, entonces queda registrada y visible en la ficha técnica.

### HU-040 Puertos y enlaces

Como usuario, quiero registrar los puertos y los enlaces de mi proyecto, para saber qué servicios usa y dónde está su código.

Requisitos: RF-TEC-15, RF-TEC-17 · Prioridad: S · Estimación: 2

- Dada la sección de puertos, cuando agrego un número con su protocolo y servicio, entonces queda registrado; un número fuera del rango de 1 a 65535 se rechaza.
- Dada la sección de enlaces, cuando agrego un repositorio, una demostración o documentación con su dirección, entonces el enlace queda disponible y se abre en una pestaña nueva.

## 9. Resumen de estimación y orden de trabajo

El MVP suma 40 historias y 141 puntos: 33 historias con prioridad M y 7 con prioridad S.

| Incremento        | Historias       | Prioridad M | Prioridad S | Puntos  |
|-------------------|-----------------|-------------|-------------|---------|
| MBI-0 Fundación   | HU-001 a HU-007 | 7           | 0           | 34      |
| MBI-1 Acceso      | HU-008 a HU-015 | 5           | 3           | 29      |
| MBI-2 Proyectos   | HU-016 a HU-021 | 6           | 0           | 20      |
| MBI-3 Editor      | HU-022 a HU-033 | 11          | 1           | 39      |
| MBI-4 Tecnologías | HU-034 a HU-040 | 4           | 3           | 19      |
| **Total**         | **40**          | **33**      | **7**       | **141** |

Orden de trabajo:

1.  MBI-0 completo, empezando por HU-001, HU-002 y HU-007, que habilitan el resto.

2.  MBI-1, empezando por HU-008, HU-009, HU-010 y HU-015.

3.  MBI-2.

4.  MBI-3 y MBI-4; pueden avanzar en paralelo porque solo dependen de MBI-2.

5.  HU-033 al final, porque valida el MVP completo e incluye la ficha técnica de MBI-4.

No se estima duración en semanas: la velocidad real se medirá con las primeras historias terminadas y entonces se proyectará la fecha del MVP.

## 10. Puntos a aprobar

- [x] Alcance del MVP: incrementos MBI-0 a MBI-4, ejecutados en el entorno local de nube simulada.
- [x] Eliminación de cuenta, descarga de datos, CAPTCHA y textos legales fuera del MVP y dentro del paquete de lanzamiento público.
- [x] Adelantar la landing al paquete de lanzamiento público y dejar el tutorial y la ayuda en MBI-13; este cambio se reflejaría en el SRS.
- [x] Durante el MVP, mostrar solo las pestañas Contenido y Documentación, y ocultar las que aún no existen.
- [x] Abrir el puerto de PostgreSQL únicamente en el entorno local, para consultar la base de datos con DBeaver.
- [x] Mantener en el MVP las 7 historias de prioridad S.
- [x] Estimación en puntos de Fibonacci y las definiciones de listo y terminado de la sección 3.
