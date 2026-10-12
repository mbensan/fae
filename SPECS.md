# Desafío Acoge

## Especificación UX/UI y técnica para MVP web

**Stack objetivo:** HTML5, CSS3 y JavaScript ES6+ sin framework  
**Formato prioritario:** aplicación web móvil responsive  
**Persistencia del MVP:** `localStorage`  
**Idioma:** español de Chile  
**Propósito:** capacitar de forma dinámica a personas interesadas en ser familia de acogida, resolver dudas frecuentes y reconocer participación y aprendizaje mediante puntos, misiones e insignias.

---

## 1. Principios del producto

1. **Capacitar, no calificar idoneidad.** Los puntos representan participación y aprendizaje, nunca aptitud parental, evaluación psicológica ni prioridad de postulación.
2. **Acompañar una decisión informada.** La experiencia debe aclarar expectativas, presentar situaciones realistas y animar a pedir apoyo.
3. **Lenguaje respetuoso y no punitivo.** Una respuesta incorrecta abre una oportunidad de aprendizaje. Evitar “fallaste”, “incorrecto para acoger” o mensajes equivalentes.
4. **Privacidad desde el diseño.** Todos los casos son ficticios. No usar nombres, imágenes ni historias identificables de niños, niñas, adolescentes o familias reales.
5. **Progreso personal, no competencia parental.** No implementar ranking entre participantes. Las metas pueden ser individuales o comunitarias.
6. **Diseño mobile first.** El prototipo debe funcionar desde 360 px de ancho y escalar correctamente a tablet y escritorio.
7. **Accesibilidad.** Objetivo WCAG 2.2 AA: navegación por teclado, foco visible, contraste suficiente, etiquetas accesibles y compatibilidad con reducción de movimiento.

> Mensaje ético permanente: “El participante es el adulto, el desafío es prepararse y el propósito es cuidar.”

---

## 2. Arquitectura de información

### Navegación principal

- **Inicio**
- **Misiones**
- **Pasaporte**
- **Premios**
- **Más**: ayuda, accesibilidad, privacidad, reiniciar demo y créditos

### Cinco pantallas principales

1. Inicio
2. Mapa de misiones
3. Pregunta o caso interactivo
4. Pasaporte Acoge
5. Tienda de premios

### Navegación inferior

Visible en Inicio, Misiones, Pasaporte y Premios. Debe ocultarse durante una pregunta o caso para reducir distracciones.

---

## 3. Sistema visual

### 3.1 Paleta de colores

```css
:root {
  --color-primary-900: #063B78;
  --color-primary-700: #07559A;
  --color-primary-500: #0878BE;
  --color-accent-orange: #FF7800;
  --color-accent-yellow: #FFC21C;
  --color-success-700: #15803D;
  --color-success-500: #22A84A;
  --color-success-100: #E9F8EC;
  --color-info-500: #44B7DE;
  --color-danger-600: #DC3545;
  --color-heart: #F43F4F;
  --color-lock: #718096;
  --color-text: #0B376B;
  --color-text-muted: #52677F;
  --color-surface: #FFFFFF;
  --color-surface-warm: #FFF9EF;
  --color-surface-soft: #F6F8FA;
  --color-border: #D8DEE6;
  --color-focus: #7C3AED;
  --color-shadow: rgb(6 59 120 / 14%);
}
```

### Uso semántico

- Azul oscuro: identidad, títulos, navegación y botones primarios.
- Naranjo: llamados de atención, premios y marca.
- Amarillo: energía, acentos, recompensas y mensajes destacados.
- Verde: progreso, selección confirmada y respuestas de aprendizaje adecuadas.
- Rojo coral: icono de puntos/corazones. No usar como único indicador de error.
- Gris azulado: contenido bloqueado, textos secundarios y separadores.

### Contraste

- Texto principal siempre en azul oscuro sobre blanco o crema.
- Texto blanco solo sobre azul oscuro, verde oscuro o naranjo suficientemente oscuro.
- No comunicar estado únicamente mediante color. Agregar icono, texto o patrón.

---

## 4. Tipografía

### Fuentes

```css
--font-display: "Nunito", "Trebuchet MS", sans-serif;
--font-body: "Inter", "Segoe UI", Arial, sans-serif;
```

Si se desea evitar dependencias externas, utilizar únicamente `Trebuchet MS` para títulos y `Segoe UI` para interfaz.

### Escala tipográfica

```css
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-md: 1rem;
--text-lg: 1.25rem;
--text-xl: 1.5rem;
--text-2xl: 2rem;
--text-3xl: 2.5rem;
```

### Reglas

- Títulos: peso 800, interlineado 1.1.
- Cuerpo: peso 400 o 500, interlineado mínimo 1.5.
- Botones: peso 700.
- Evitar bloques largos centrados. Centrar solo títulos breves, cifras y mensajes de logro.
- Tamaño mínimo de texto funcional: 16 px.

---

## 5. Espaciado, bordes y elevación

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --radius-sm: 0.75rem;
  --radius-md: 1.25rem;
  --radius-lg: 2rem;
  --shadow-card: 0 10px 30px rgb(6 59 120 / 12%);
  --shadow-float: 0 16px 40px rgb(6 59 120 / 18%);
}
```

- Área táctil mínima: 44 × 44 px.
- Separación mínima entre controles táctiles: 8 px.
- Tarjetas: fondo blanco, radio de 20 px, borde suave y sombra corta.
- Contenedor móvil de referencia: 390 × 844 px.
- Ancho máximo en escritorio: 480 px para la experiencia de participante.

---

## 6. Componentes UI

### 6.1 Encabezado de aplicación

Contiene botón volver cuando corresponda, logo o título, puntos acumulados y acceso opcional al perfil.

```html
<header class="app-header">
  <button class="icon-button" aria-label="Volver" data-action="back">←</button>
  <a class="brand" href="#/inicio" aria-label="Desafío Acoge, ir al inicio">Desafío Acoge</a>
  <output class="points-pill" aria-label="350 puntos">❤️ <strong>350</strong></output>
</header>
```

### 6.2 Navegación inferior

- Icono más etiqueta visible.
- Estado activo con azul oscuro, peso 700 y pequeña línea inferior.
- `aria-current="page"` en la opción activa.

### 6.3 Tarjeta

Variantes:

- `card--mission`
- `card--question`
- `card--reward`
- `card--feedback`
- `card--stat`

### 6.4 Botones

- Primario: azul oscuro, texto blanco.
- Secundario: blanco, borde azul.
- Recompensa: naranjo.
- Deshabilitado: gris, sin sombra.
- Destructivo: únicamente para “reiniciar demo”, con confirmación.

### 6.5 Indicador de progreso

Debe exponer valor semántico mediante `<progress>` o atributos ARIA.

```html
<progress class="progress" max="5" value="3">3 de 5</progress>
```

### 6.6 Opción de respuesta

Una opción completa funciona como botón o radio. Estados:

- reposo
- hover
- foco
- seleccionada
- correcta/recomendada
- alternativa a revisar
- deshabilitada después de responder

### 6.7 Modal

Usar `<dialog>` para confirmación de canje, detalle de misión y logro desbloqueado.

### 6.8 Toast

Mensajes breves: puntos ganados, misión guardada, premio canjeado. Debe usar una región `aria-live="polite"`.

### 6.9 Iconografía

- Inicio: casa
- Misiones: mapa
- Preguntas: diálogo/libro
- Pasaporte: libreta con corazón
- Premios: regalo
- Completada: check
- Bloqueada: candado

Preferir SVG local o iconos CSS. No depender de emojis como único icono de interfaz.

---

## 7. Estados globales

### Carga

- Skeleton corto en tarjetas.
- Mantener dimensiones para evitar saltos de contenido.

### Vacío

Ejemplo: “Aún no tienes insignias. Completa tu primera misión para obtener una.”

### Error recuperable

Ejemplo: “No pudimos guardar el avance. Reintenta o continúa sin cerrar esta pestaña.”

### Sin conexión

El MVP debe seguir funcionando si ya se cargó, dado que los datos se incluyen localmente. Mostrar “Modo sin conexión. Tu avance se guardará en este dispositivo.”

### Éxito

Confirmación clara, puntos ganados y próximo paso. No usar animación larga.

### Bloqueado

Mostrar el requisito exacto: “Completa la Misión 2 para desbloquear esta misión.”

### Movimiento reducido

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Diseño detallado de las cinco pantallas

## 8.1 Pantalla 1: Inicio

### Objetivo

Permitir que la persona comprenda su estado y continúe la misión pendiente en pocos segundos.

### Jerarquía

1. Logo y perfil de demo.
2. Saldo de puntos.
3. Ilustración principal.
4. Mensaje: “Las grandes historias también empiezan con una pregunta”.
5. Misión actual y progreso.
6. CTA “Continuar misión”.
7. Accesos rápidos a Misiones, Pasaporte y Premios.
8. Navegación inferior.

### Contenido de demo

- Alias: Camila
- Nivel: Explorador
- Puntos: 350
- Misión actual: Misión 1, Abrir la puerta
- Progreso de misión: 70%

### Acciones

- Continuar misión: abre la primera actividad incompleta.
- Seleccionar puntos: abre un resumen de movimientos.
- Seleccionar tarjeta de misión: abre detalle.
- Acceso Misiones: abre mapa.

### Responsive

- Móvil: una columna.
- Desde 768 px: acceso rápido en tres columnas, pero mantener el contenido principal dentro de 480 px.

---

## 8.2 Pantalla 2: Mapa de misiones

### Objetivo

Presentar el recorrido completo, el progreso y el próximo paso disponible.

### Estructura visual

- Header con título “Tu ruta de aprendizaje” y puntos.
- Mensajes motivadores breves.
- Camino vertical ascendente con nodos alternados.
- Fondo ilustrado de paisaje chileno genérico, sin lugares identificables.
- Barra de navegación inferior.

### Misiones

| Orden | ID | Nombre | Icono | Estado inicial de demo |
|---:|---|---|---|---|
| 0 | mission-0 | Motivaciones y expectativas | brote | completada |
| 1 | mission-1 | Abrir la puerta | puerta | actual |
| 2 | mission-2 | Mirar con otros ojos | binoculares | disponible |
| 3 | mission-3 | La familia completa | casa | bloqueada |
| 4 | mission-4 | Vínculos y familia de origen | grupo | bloqueada |
| 5 | mission-5 | Cuando las cosas se ponen difíciles | nube/rayo | bloqueada |
| 6 | mission-6 | Dejar ir | avión de papel | bloqueada |
| 7 | mission-final | Decisión informada | bandera | bloqueada |

### Reglas

- Una misión se desbloquea al completar la anterior.
- Las misiones completadas se pueden revisar sin volver a entregar puntos.
- La misión actual muestra “Continúa aquí”.
- Al seleccionar una misión bloqueada se abre un diálogo con el requisito.

---

## 8.3 Pantalla 3: Pregunta o caso interactivo

### Objetivo

Entregar una experiencia focalizada de aprendizaje y retroalimentación inmediata.

### Jerarquía

1. Volver, logo y puntos.
2. Progreso de actividad.
3. Tipo y misión.
4. Enunciado o caso.
5. Ilustración opcional.
6. Alternativas.
7. Botón Responder.
8. Retroalimentación.
9. Botón Siguiente.

### Comportamiento

- Antes de seleccionar: Responder deshabilitado.
- Al seleccionar: borde azul y radio marcado.
- Al responder: bloquear alternativas, mostrar retroalimentación y sumar puntos una sola vez.
- Pregunta correcta: 50 puntos totales.
- Pregunta respondida: mínimo 10 puntos por participar.
- Caso reflexivo: 100 puntos al completarlo.
- Al terminar: mostrar resumen y CTA “Ver mi Pasaporte”.

### Texto no punitivo

- Adecuada: “¡Buen análisis! Esta alternativa protege la escucha y evita promesas que no puedes garantizar.”
- A revisar: “Miremos esta situación nuevamente. Es una duda frecuente y aquí hay una idea importante para considerar.”

### Accesibilidad

- Alternativas implementadas con `fieldset`, `legend` y radios.
- El foco pasa a la retroalimentación después de responder.
- La selección correcta no depende solo de verde.

---

## 8.4 Pantalla 4: Pasaporte Acoge

### Objetivo

Mostrar avance, sellos e insignias sin sugerir idoneidad para acoger.

### Jerarquía

1. Título “Tu Pasaporte Acoge”.
2. Texto: “Cada misión completada es un paso hacia una decisión informada”.
3. Resumen: misiones, puntos e insignias.
4. Cuadrícula de sellos.
5. Próxima insignia.
6. CTA “Continuar mi recorrido”.
7. Nota ética.

### Sellos

- Completado: color completo y check.
- Actual: borde azul y texto “En curso”.
- Bloqueado: monocromo y candado.

### Insignias

- Rompe Mitos
- Mirada Abierta
- Conversación en Familia
- Buen Acompañamiento
- Decisión Informada

### Nota obligatoria

“El Pasaporte reconoce tu participación y aprendizaje. No acredita idoneidad ni reemplaza el proceso formal de evaluación.”

---

## 8.5 Pantalla 5: Tienda de premios

### Objetivo

Permitir el uso de puntos en recompensas coherentes con el aprendizaje.

### Jerarquía

1. Marca, puntos y perfil.
2. Mensaje: “Premios que inspiran más familias que acogen”.
3. Filtros: Todos, Digitales, Experiencias, Productos y Sorteos.
4. Grilla de recompensas.
5. Confirmación de canje.
6. Historial de canjes.
7. Navegación inferior.

### Tarjeta de premio

- Imagen o icono.
- Nombre.
- Descripción de máximo 120 caracteres.
- Costo.
- CTA Canjear o Participar.
- Estado agotado/no disponible si corresponde.

### Reglas

- No permitir saldo negativo.
- El botón queda deshabilitado si faltan puntos y muestra “Te faltan X puntos”.
- Confirmar el canje en `<dialog>`.
- Registrar fecha ISO, premio, costo y saldo posterior.
- Para el MVP, no implementar pagos ni despacho real.

---

## 9. Flujo de navegación

```text
Carga de aplicación
  └─ Sin perfil local → crear perfil demo → Inicio
  └─ Con perfil local → restaurar sesión → Inicio

Inicio
  ├─ Continuar misión → Pregunta/Caso pendiente
  ├─ Misiones → Mapa de misiones
  ├─ Pasaporte → Pasaporte Acoge
  └─ Premios → Tienda

Mapa de misiones
  ├─ Completada → Resumen de misión
  ├─ Actual/disponible → Detalle → Iniciar/continuar → Pregunta/Caso
  └─ Bloqueada → Diálogo de requisito

Pregunta/Caso
  ├─ Seleccionar opción → Responder → Retroalimentación
  ├─ Siguiente → Actividad siguiente
  └─ Última actividad → Resumen → Pasaporte

Pasaporte
  ├─ Sello → Detalle de misión
  ├─ Insignia → Detalle de logro
  └─ Continuar recorrido → Mapa o actividad pendiente

Tienda
  ├─ Filtrar → Actualizar grilla
  ├─ Canjear → Confirmar → Guardar → Toast
  └─ Historial → Lista de canjes
```

### Rutas hash sugeridas

```text
#/inicio
#/misiones
#/misiones/:missionId
#/actividad/:activityId
#/pasaporte
#/premios
#/premios/historial
#/mas
```

---

## 10. Mecánica de puntos

```text
Participar en una pregunta:         10 puntos
Respuesta esperada:                +40 puntos
Completar un caso:                 100 puntos
Completar una misión:              150 puntos
Completar actividad familiar:      200 puntos
Completar el recorrido:            500 puntos
```

### Prevención de duplicados

Cada actividad contiene `awardedAt`. Si existe, la revisión de la actividad no vuelve a sumar puntos.

### Nivel de demo

- Explorador: 0 a 499 puntos
- Aprendiz: 500 a 1.199 puntos
- Acompañante: desde 1.200 puntos

Estos niveles son elementos lúdicos y no representan una evaluación de capacidad para acoger.

---

## 11. Banco de preguntas para el MVP

> Nota editorial: antes de producción, el contenido debe ser validado por el equipo técnico responsable del programa. El MVP debe citar o enlazar sus fuentes oficiales desde una sección “Más información”.

### Q01: Propósito

- Tipo: opción única
- Misión: Abrir la puerta
- Puntaje máximo: 50
- Pregunta: ¿Cuál es el propósito principal de una familia de acogida?
- A: Adoptar inmediatamente a un niño o niña.
- B: Entregar cuidado temporal, protector y seguro.
- C: Reemplazar permanentemente a la familia de origen.
- D: Participar solo en actividades recreativas.
- Respuesta: B
- Retroalimentación: Una familia de acogida entrega cuidado y protección temporal mientras se define la alternativa correspondiente para el niño, niña o adolescente.

### Q02: Acogida y adopción

- Tipo: mito o realidad
- Misión: Abrir la puerta
- Pregunta: “Ser familia de acogida es lo mismo que iniciar una adopción”.
- Respuesta: Mito
- Retroalimentación: El acogimiento y la adopción son procesos distintos. El acogimiento es una medida de cuidado temporal.

### Q03: Apoyo

- Tipo: selección múltiple
- Misión: Mirar con otros ojos
- Pregunta: ¿Qué apoyo puede recibir una familia de acogida?
- A: Acompañamiento psicosocial.
- B: Apoyo para el niño, niña o adolescente.
- C: Apoyo monetario o en especies, según el programa.
- D: Ningún apoyo durante el acogimiento.
- Respuestas: A, B y C
- Retroalimentación: El acompañamiento y los apoyos disponibles deben explicarse durante el proceso formal correspondiente.

### Q04: Espacio en el hogar

- Tipo: mito o realidad
- Misión: La familia completa
- Pregunta: “Para acoger siempre es obligatorio tener una habitación completamente exclusiva”.
- Respuesta: Mito
- Retroalimentación: La situación del hogar se evalúa de manera particular. Deben garantizarse condiciones adecuadas de cuidado y descanso.

### Q05: Rango de edad

- Tipo: verdadero o falso
- Misión: La familia completa
- Pregunta: “Durante la evaluación, una familia puede conversar sobre el rango de edad que considera posible acoger”.
- Respuesta: Verdadero
- Retroalimentación: Las posibilidades, expectativas y características del hogar forman parte de la conversación con el equipo evaluador.

### Q06: Duración

- Tipo: opción única
- Misión: Dejar ir
- Pregunta: ¿La duración del acogimiento es siempre igual?
- A: Sí, siempre dura seis meses.
- B: Sí, siempre dura dieciocho meses.
- C: No, depende del tipo de acogimiento y de la situación particular.
- D: La familia decide libremente cuándo finaliza.
- Respuesta: C
- Retroalimentación: La duración depende del tipo de acogimiento y de la situación particular del niño, niña o adolescente.

### Q07: Familia de origen

- Tipo: opción única
- Misión: Vínculos y familia de origen
- Pregunta: ¿Cuál de estas actitudes favorece mejor el acompañamiento?
- A: Evitar siempre cualquier conversación sobre la familia de origen.
- B: Escuchar respetuosamente y seguir las orientaciones del equipo.
- C: Prometer que la situación terminará pronto.
- D: Pedir al niño o niña que elija entre ambas familias.
- Respuesta: B
- Retroalimentación: Acompañar implica escuchar sin presionar, evitar promesas inciertas y solicitar orientación profesional.

### Q08: Pedir ayuda

- Tipo: opción única
- Misión: Cuando las cosas se ponen difíciles
- Pregunta: Si una situación supera las herramientas de la familia, ¿qué acción es más apropiada?
- A: Ocultarla para evitar problemas.
- B: Resolverla sin contarle a nadie.
- C: Contactar al equipo que acompaña el acogimiento.
- D: Publicarla en redes sociales para pedir opiniones.
- Respuesta: C
- Retroalimentación: Pedir ayuda es una conducta responsable y permite elaborar estrategias con acompañamiento profesional.

### Q09: Privacidad

- Tipo: opción única
- Misión: Mirar con otros ojos
- Pregunta: ¿Qué harías si una persona cercana pide detalles personales de la historia de un niño o niña acogido?
- A: Compartir solo los detalles más interesantes.
- B: Contar la historia sin mencionar el nombre.
- C: Proteger la privacidad y no compartir antecedentes personales.
- D: Publicar una explicación general en redes sociales.
- Respuesta: C
- Retroalimentación: Proteger la privacidad forma parte del cuidado.

### Q10: Decisión informada

- Tipo: reflexión sin respuesta correcta
- Misión: Decisión informada
- Pregunta: Después del recorrido, ¿qué aspecto conversarías con tu hogar antes de avanzar?
- Opciones: rutinas, red de apoyo, expectativas, disponibilidad emocional, todas las anteriores.
- Retroalimentación: Una decisión informada puede considerar todos estos aspectos y conversarse con el equipo del programa.

---

## 12. Casos interactivos

### CASE01: Extrañar a la familia de origen

**Misión:** Vínculos y familia de origen  
**Puntaje:** 100

> Sofía, de 9 años, acaba de llegar al hogar. Durante la noche dice que extraña mucho a su familia de origen y que no desea continuar conversando.

- A: Explicar que es mejor no volver a hablar del tema.
- B: Escuchar, validar lo expresado y respetar que no quiera continuar conversando.
- C: Cambiar inmediatamente de tema.
- D: Prometer que volverá pronto con su familia.

**Alternativa recomendada:** B  
**Retroalimentación:** Escuchar no significa presionar. También es importante evitar promesas sobre resultados o plazos que la familia de acogida no controla.

### CASE02: Conversación en el hogar

> Una persona del hogar está muy entusiasmada con la posibilidad de acoger, pero otra expresa dudas sobre los cambios en rutinas y espacios compartidos.

- A: Iniciar la postulación de todas formas.
- B: Evitar el tema para que no surjan más dudas.
- C: Conversar sobre expectativas, temores, responsabilidades y límites antes de avanzar.
- D: Pedir que decida la persona más entusiasmada.

**Alternativa recomendada:** C  
**Retroalimentación:** Tener dudas no es un fracaso. Conversarlas permite tomar una decisión más consciente.

### CASE03: Una pregunta difícil

> Un niño pregunta: “¿Me voy a quedar aquí para siempre?”.

- A: “Sí, seguramente”.
- B: “No lo sé todavía, pero podemos preguntarle al equipo y te acompañaremos”.
- C: “Eso no se pregunta”.
- D: “Depende de cómo te portes”.

**Alternativa recomendada:** B  
**Retroalimentación:** La respuesta reconoce la incertidumbre sin evadir la pregunta ni entregar una promesa que no se puede garantizar.

### CASE04: Privacidad

> Una persona conocida pregunta detalles sobre la historia del niño o niña que vive temporalmente en el hogar.

- A: Compartir aspectos generales de la historia.
- B: Contar la historia sin mencionar el nombre.
- C: Proteger la privacidad y explicar que no corresponde compartir información personal.
- D: Publicar una explicación en redes sociales.

**Alternativa recomendada:** C  
**Retroalimentación:** La curiosidad de otras personas no justifica compartir antecedentes personales.

### CASE05: Momento de tensión

> Durante varios días se repite una situación que altera las rutinas del hogar. Las estrategias utilizadas no están funcionando.

- A: Aplicar consecuencias cada vez más intensas.
- B: Contactar al equipo, describir lo ocurrido y elaborar una estrategia conjunta.
- C: Esperar indefinidamente a que se resuelva solo.
- D: Comparar la conducta con la de otros niños.

**Alternativa recomendada:** B  
**Retroalimentación:** Pedir apoyo permite comprender mejor la situación y actuar con acompañamiento profesional.

---

## 13. Modelo JSON

### 13.1 Configuración de aplicación

```json
{
  "app": {
    "name": "Desafío Acoge",
    "version": "0.1.0",
    "locale": "es-CL",
    "currencyName": "puntos",
    "ethicalNotice": "Los puntos reconocen participación y aprendizaje. No representan idoneidad para acoger."
  }
}
```

### 13.2 Misión

```json
{
  "id": "mission-1",
  "order": 1,
  "title": "Abrir la puerta",
  "shortDescription": "Conoce qué es una familia de acogida y cómo puedes ser parte.",
  "icon": "door",
  "theme": "orange",
  "prerequisites": ["mission-0"],
  "activityIds": ["q01", "q02", "case02"],
  "completionBonus": 150,
  "estimatedMinutes": 8
}
```

### 13.3 Actividad

```json
{
  "id": "q01",
  "missionId": "mission-1",
  "type": "single-choice",
  "title": "Propósito de la acogida",
  "prompt": "¿Cuál es el propósito principal de una familia de acogida?",
  "options": [
    { "id": "a", "text": "Adoptar inmediatamente a un niño o niña." },
    { "id": "b", "text": "Entregar cuidado temporal, protector y seguro." },
    { "id": "c", "text": "Reemplazar permanentemente a la familia de origen." },
    { "id": "d", "text": "Participar solo en actividades recreativas." }
  ],
  "correctOptionIds": ["b"],
  "participationPoints": 10,
  "correctBonus": 40,
  "feedback": {
    "recommended": "Una familia de acogida entrega cuidado y protección temporal.",
    "review": "Miremos nuevamente el carácter temporal y protector del acogimiento."
  },
  "sourceIds": ["official-faq-01"]
}
```

### 13.4 Perfil y progreso

```json
{
  "id": "demo-user",
  "displayName": "Camila",
  "points": 350,
  "level": "Explorador",
  "currentMissionId": "mission-1",
  "currentActivityId": "q02",
  "completedMissionIds": ["mission-0"],
  "completedActivities": {
    "q01": {
      "selectedOptionIds": ["b"],
      "isRecommended": true,
      "pointsAwarded": 50,
      "awardedAt": "2026-10-07T18:30:00-03:00"
    }
  },
  "badgeIds": ["first-step"],
  "redemptionIds": []
}
```

### 13.5 Premio

```json
{
  "id": "reward-guide",
  "category": "digital",
  "title": "Guía digital Familias que acogen",
  "description": "Material para seguir aprendiendo sobre acogimiento familiar.",
  "cost": 300,
  "image": "assets/rewards/guide.webp",
  "available": true,
  "stock": null,
  "actionLabel": "Canjear"
}
```

### 13.6 Canje

```json
{
  "id": "redemption-001",
  "rewardId": "reward-guide",
  "cost": 300,
  "balanceAfter": 550,
  "createdAt": "2026-10-07T19:00:00-03:00",
  "status": "confirmed"
}
```

---

## 14. Estructura de archivos

```text
desafio-acoge/
├── index.html
├── README.md
├── assets/
│   ├── icons/
│   ├── illustrations/
│   ├── rewards/
│   └── fonts/
├── css/
│   ├── tokens.css
│   ├── reset.css
│   ├── base.css
│   ├── components.css
│   ├── layouts.css
│   ├── screens.css
│   └── accessibility.css
├── js/
│   ├── app.js
│   ├── router.js
│   ├── store.js
│   ├── data.js
│   ├── scoring.js
│   ├── render.js
│   ├── events.js
│   └── accessibility.js
└── data/
    ├── missions.json
    ├── activities.json
    ├── rewards.json
    └── mock-profile.json
```

---

## 15. Estructura HTML

```html
<!doctype html>
<html lang="es-CL">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#063B78">
  <meta name="description" content="Desafío Acoge, experiencia formativa sobre familias de acogida.">
  <title>Desafío Acoge</title>
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/layouts.css">
  <link rel="stylesheet" href="css/screens.css">
  <link rel="stylesheet" href="css/accessibility.css">
  <script type="module" src="js/app.js"></script>
</head>
<body>
  <a class="skip-link" href="#main-content">Saltar al contenido</a>

  <div id="app" class="app-shell">
    <header id="app-header" class="app-header"></header>
    <main id="main-content" tabindex="-1"></main>
    <nav id="bottom-nav" class="bottom-nav" aria-label="Navegación principal"></nav>
  </div>

  <div id="toast-region" class="toast-region" aria-live="polite" aria-atomic="true"></div>
  <dialog id="app-dialog" class="dialog"></dialog>

  <noscript>Necesitas activar JavaScript para usar Desafío Acoge.</noscript>
</body>
</html>
```

### Plantilla de pantalla

```html
<section class="screen screen--home" aria-labelledby="screen-title">
  <h1 id="screen-title">Hola, Camila</h1>
  <p class="eyebrow">Nivel Explorador</p>
  <article class="current-mission card">
    <h2>Abrir la puerta</h2>
    <p>Conoce qué es una familia de acogida y cómo puedes ser parte.</p>
    <progress max="100" value="70">70%</progress>
    <a class="button button--primary" href="#/actividad/q02">Continuar misión</a>
  </article>
</section>
```

---

## 16. Estructura CSS

### tokens.css

Variables de color, tipografía, espacio, radios, sombras, capas y duraciones.

### reset.css

Normalización mínima, `box-sizing`, márgenes y estilos base del formulario.

### base.css

```css
html { color-scheme: light; }

body {
  margin: 0;
  background: var(--color-surface-warm);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.5;
}

button, input, select, textarea { font: inherit; }

:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
```

### layouts.css

```css
.app-shell {
  min-height: 100dvh;
  max-width: 30rem;
  margin-inline: auto;
  background: var(--color-surface);
  box-shadow: var(--shadow-float);
}

.screen {
  display: grid;
  gap: var(--space-6);
  padding: var(--space-5);
  padding-bottom: 7rem;
}

.reward-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 42rem) {
  .reward-grid { grid-template-columns: repeat(2, 1fr); }
}
```

### components.css

```css
.button {
  min-height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border: 0;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.button--primary {
  color: #fff;
  background: var(--color-primary-900);
}

.button--reward {
  color: #fff;
  background: var(--color-accent-orange);
}

.button:disabled {
  cursor: not-allowed;
  color: var(--color-text-muted);
  background: var(--color-border);
}

.card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}
```

### screens.css

Estilos específicos de `.screen--home`, `.screen--missions`, `.screen--activity`, `.screen--passport` y `.screen--rewards`.

### Convención de clases

Usar BEM simplificado:

```text
.block
.block__element
.block--modifier
```

No usar estilos inline. No acoplar estilos a identificadores.

---

## 17. JavaScript y comportamiento

### app.js

- Inicializa store.
- Carga datos locales.
- Registra router hash.
- Renderiza ruta inicial.

### router.js

Mapeo de rutas y parámetros, sin dependencias.

### store.js

- `loadState()`
- `saveState()`
- `resetState()`
- `getProfile()`
- `completeActivity()`
- `completeMission()`
- `redeemReward()`

### scoring.js

Funciones puras para calcular puntaje y evitar doble asignación.

```js
export function calculateActivityPoints(activity, selectedIds) {
  const selected = new Set(selectedIds);
  const expected = new Set(activity.correctOptionIds ?? []);
  const isExact = selected.size === expected.size && [...selected].every(id => expected.has(id));
  return activity.participationPoints + (isExact ? activity.correctBonus : 0);
}
```

### Persistencia

```js
const STORAGE_KEY = "desafioAcoge:v1";

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
```

### Seguridad del cliente

- Renderizar texto con `textContent`, no con `innerHTML` para datos variables.
- No usar `eval` ni `Function`.
- Validar IDs antes de buscar datos.
- El MVP no almacena datos sensibles.

---

## 18. Mock de datos

```js
export const mockData = {
  profile: {
    id: "demo-user",
    displayName: "Camila",
    points: 350,
    level: "Explorador",
    currentMissionId: "mission-1",
    currentActivityId: "q02",
    completedMissionIds: ["mission-0"],
    badgeIds: ["first-step"]
  },
  missions: [
    { id: "mission-0", order: 0, title: "Motivaciones y expectativas", icon: "sprout", status: "completed" },
    { id: "mission-1", order: 1, title: "Abrir la puerta", icon: "door", status: "current" },
    { id: "mission-2", order: 2, title: "Mirar con otros ojos", icon: "binoculars", status: "available" },
    { id: "mission-3", order: 3, title: "La familia completa", icon: "home", status: "locked" },
    { id: "mission-4", order: 4, title: "Vínculos y familia de origen", icon: "people", status: "locked" },
    { id: "mission-5", order: 5, title: "Cuando las cosas se ponen difíciles", icon: "storm", status: "locked" },
    { id: "mission-6", order: 6, title: "Dejar ir", icon: "paper-plane", status: "locked" },
    { id: "mission-final", order: 7, title: "Decisión informada", icon: "flag", status: "locked" }
  ],
  rewards: [
    { id: "reward-guide", category: "digital", title: "Guía digital Familias que acogen", cost: 300, available: true },
    { id: "reward-mug", category: "product", title: "Tazón Desafío Acoge", cost: 500, available: true },
    { id: "reward-workshop", category: "experience", title: "Taller online con especialistas", cost: 1000, available: true },
    { id: "reward-cards", category: "product", title: "Kit de conversación familiar", cost: 700, available: true },
    { id: "reward-raffle", category: "raffle", title: "Sorteo mensual", cost: 200, available: true },
    { id: "reward-badges", category: "digital", title: "Insignias digitales", cost: 150, available: true }
  ]
};
```

---

## 19. Criterios de aceptación

### Funcionales

- La aplicación muestra las cinco pantallas.
- La navegación por hash funciona al recargar.
- El progreso se conserva en `localStorage`.
- Una actividad no entrega puntaje dos veces.
- Las misiones se desbloquean secuencialmente.
- El pasaporte refleja el estado real.
- El canje descuenta puntos y se registra.
- No se permite canjear sin saldo suficiente.
- Reiniciar demo solicita confirmación.

### Visuales

- Funciona desde 360 px de ancho.
- No hay scroll horizontal.
- Botones y tarjetas respetan la paleta.
- La barra inferior indica la ruta activa.
- Los estados bloqueado, actual y completado son distinguibles sin depender solo del color.

### Accesibilidad

- Toda interacción se completa usando teclado.
- El foco es visible.
- Imágenes decorativas tienen `alt=""`.
- Imágenes informativas tienen texto alternativo útil.
- Los formularios usan etiquetas y agrupación semántica.
- Retroalimentación y toast son anunciados por lector de pantalla.
- Se respeta `prefers-reduced-motion`.

### Calidad

- Sin errores en consola.
- Sin dependencias obligatorias.
- Código modular y comentado solo cuando aporta contexto.
- README con instrucciones para ejecutar mediante servidor local.

---

## 20. Prompt optimizado para Codex o Cursor

Copiar desde “INICIO DEL PROMPT” hasta “FIN DEL PROMPT”.

```text
INICIO DEL PROMPT

Actúa como desarrollador frontend senior, diseñador UX accesible y especialista en arquitectura JavaScript sin frameworks.

Debes construir un MVP funcional llamado “Desafío Acoge”, orientado a capacitar de forma lúdica a personas adultas interesadas en familias de acogida en Chile. La aplicación reconoce participación y aprendizaje. Nunca debe sugerir, calcular ni mostrar idoneidad parental, evaluación psicológica o ranking entre participantes.

OBJETIVO TÉCNICO

Crea una aplicación web mobile first usando exclusivamente:
- HTML5 semántico
- CSS3
- JavaScript ES6+ con módulos
- localStorage
- JSON local o módulos JS para datos

No usar React, Vue, Angular, Svelte, TypeScript, Bootstrap, Tailwind, jQuery ni backend. No usar un proceso de compilación. La aplicación debe poder ejecutarse con un servidor estático simple.

ENTREGABLES

Genera todos estos archivos completos y funcionales:
- index.html
- README.md
- css/tokens.css
- css/reset.css
- css/base.css
- css/components.css
- css/layouts.css
- css/screens.css
- css/accessibility.css
- js/app.js
- js/router.js
- js/store.js
- js/data.js
- js/scoring.js
- js/render.js
- js/events.js
- data/missions.json
- data/activities.json
- data/rewards.json
- data/mock-profile.json
- assets/icons/*.svg, solo iconos simples creados localmente

PANTALLAS

Implementa cinco pantallas navegables mediante hash routing:
1. #/inicio
2. #/misiones
3. #/actividad/:activityId
4. #/pasaporte
5. #/premios

INICIO
- Logo textual Desafío Acoge.
- Perfil demo: Camila, nivel Explorador.
- 350 puntos iniciales.
- Mensaje “Las grandes historias también empiezan con una pregunta”.
- Misión actual “Abrir la puerta”, 70%.
- Botón “Continuar misión”.
- Accesos a Misiones, Pasaporte y Premios.

MAPA DE MISIONES
- Camino vertical ascendente.
- Misiones: Motivaciones y expectativas; Abrir la puerta; Mirar con otros ojos; La familia completa; Vínculos y familia de origen; Cuando las cosas se ponen difíciles; Dejar ir; Decisión informada.
- Estados completada, actual, disponible y bloqueada.
- Las misiones deben desbloquearse secuencialmente.
- Una misión bloqueada abre un diálogo con el requisito.

PREGUNTA O CASO
- Header con volver y puntos.
- Barra de progreso.
- Etiqueta del tipo de actividad y misión.
- Enunciado.
- Alternativas con radio buttons semánticos.
- Botón Responder inicialmente deshabilitado.
- Retroalimentación inmediata y no punitiva.
- Botón Siguiente.
- Entregar 10 puntos por participar, 40 adicionales por respuesta esperada y 100 por completar un caso.
- No volver a entregar puntos al revisar.

PASAPORTE
- Resumen de misiones, puntos e insignias.
- Cuadrícula de sellos.
- Estados completado, en curso y bloqueado.
- Nota: “El Pasaporte reconoce tu participación y aprendizaje. No acredita idoneidad ni reemplaza el proceso formal de evaluación”.

TIENDA
- Filtros Todos, Digitales, Experiencias, Productos y Sorteos.
- Premios de datos mock.
- Confirmación con dialog.
- Evitar saldo negativo.
- Historial de canjes.
- El MVP no procesa pagos ni despachos.

IDENTIDAD VISUAL

Usa esta paleta:
- Azul oscuro #063B78
- Azul medio #07559A
- Naranjo #FF7800
- Amarillo #FFC21C
- Verde #22A84A
- Verde claro #E9F8EC
- Rojo coral #F43F4F
- Fondo crema #FFF9EF
- Texto #0B376B
- Borde #D8DEE6

Tipografía:
- Títulos: Nunito con fallback Trebuchet MS
- Cuerpo: Inter con fallback Segoe UI
- Si no hay internet, los fallbacks deben mantener el diseño.

Diseño:
- Tarjetas blancas, radio 20 px, sombra suave.
- Botones tipo píldora.
- Iconos SVG locales.
- Experiencia centrada con ancho máximo de 480 px.
- Responsive desde 360 px.
- No usar fotografías reales de niños, niñas, adolescentes o familias.

ACCESIBILIDAD

Cumple WCAG 2.2 AA:
- Navegación total por teclado.
- Enlace “Saltar al contenido”.
- Foco visible.
- Áreas táctiles mínimas de 44x44 px.
- aria-current en navegación.
- aria-live para puntos, feedback y toast.
- fieldset y legend para preguntas.
- No depender solo del color.
- Respetar prefers-reduced-motion.
- HTML válido y semántico.

DATOS Y ESTADO

- Usa localStorage con la clave desafioAcoge:v1.
- Incluye funciones loadState, saveState, resetState, completeActivity, completeMission y redeemReward.
- Protege contra doble asignación de puntos usando awardedAt.
- Renderiza texto variable con textContent. No usar eval ni insertar datos con innerHTML.
- Incluye el banco de 10 preguntas y 5 casos descrito en la especificación que acompaña este prompt.

CALIDAD

- No dejes TODOs ni pseudocódigo.
- Entrega contenido completo para cada archivo.
- No omitas imports ni exports.
- No generes código truncado.
- Evita errores de consola.
- Agrega comentarios solo donde expliquen decisiones no evidentes.
- README debe incluir cómo ejecutar con: python -m http.server 8080
- Al final, muestra el árbol de archivos y una lista breve de pruebas manuales.

Primero inspecciona la estructura existente del proyecto. Si está vacía, crea todos los archivos. Si ya existen archivos, consérvalos cuando sean compatibles y modifica únicamente lo necesario. Después ejecuta una revisión de enlaces, imports, JSON válido, navegación y estados persistentes. Corrige cualquier inconsistencia antes de finalizar.

FIN DEL PROMPT
```

---

## 21. Fuentes editoriales que debe registrar el MVP

El contenido definitivo debe mantener un catálogo de fuentes separado de las preguntas. Ejemplo:

```json
[
  {
    "id": "official-faq-01",
    "title": "Preguntas frecuentes sobre Familias de Acogida",
    "publisher": "Servicio Nacional de Protección Especializada a la Niñez y Adolescencia",
    "url": "https://servicioproteccion.gob.cl/601/w3-propertyvalue-808.html",
    "accessedAt": "2026-10-07"
  },
  {
    "id": "official-program-01",
    "title": "Familias de Acogida",
    "publisher": "Servicio Nacional de Protección Especializada a la Niñez y Adolescencia",
    "url": "https://www.servicioproteccion.gob.cl/601/w3-propertyname-521.html",
    "accessedAt": "2026-10-07"
  }
]
```

---

## 22. Definición de terminado del MVP

El MVP se considera terminado cuando:

- Las cinco pantallas están implementadas y conectadas.
- Se puede completar al menos una misión completa.
- El puntaje y el progreso sobreviven a una recarga.
- El pasaporte cambia según el avance.
- Se puede simular un canje.
- El usuario puede reiniciar la demo.
- Toda la experiencia funciona con teclado.
- No hay ranking de participantes ni inferencias de idoneidad.
- Las advertencias éticas aparecen en Pasaporte y Más.
- El contenido y los casos han sido marcados como pendientes de validación técnica antes de producción.
