# Desafío Acoge

Aplicación web móvil para capacitar de forma lúdica a personas adultas interesadas en ser familia de acogida en Chile. Los puntos reconocen participación y aprendizaje. No representan idoneidad para acoger.

## Cómo ejecutar

Necesitas un servidor local porque los datos se cargan con `fetch`. Los estilos usan Tailwind CSS por CDN, más `css/app.css` para barra de progreso, diálogos y movimiento reducido.

```bash
python -m http.server 8080
```

Abre `http://localhost:8080`.

## Qué incluye este MVP

- Inicio, mapa de misiones, preguntas y casos, Pasaporte Acoge, tienda de premios y sección Más.
- Progreso en `localStorage` con la clave `desafioAcoge:v1`.
- Perfil de demo: Camila, nivel Explorador, 350 puntos.
- Canje simulado, sin pagos ni despacho.
- Advertencias éticas en Pasaporte y Más.

El contenido formativo está pendiente de validación técnica del programa antes de producción.

## Pruebas manuales sugeridas

1. Recargar en `#/misiones` y comprobar que la ruta se mantiene.
2. Continuar la Misión 1, responder Q02 y ver que los puntos suben una sola vez.
3. Reabrir la misma pregunta y confirmar que no vuelve a sumar.
4. Intentar abrir una misión bloqueada y leer el requisito.
5. Canjear un premio con saldo suficiente y revisar el historial.
6. Intentar un premio más caro que el saldo.
7. Reiniciar la demo desde Más, con confirmación.
8. Recorrer Inicio, Misiones, una pregunta, Pasaporte y Premios solo con teclado.
