# Cooflotax Web

Sitio web oficial de la **Cooperativa de Transportadores Flotax Duitama (COOFLOTAX)**, empresa de transporte público colombiana fundada en 1964 con sede en Duitama, Boyacá.

---

## Descripción

Plataforma web institucional que presenta los servicios de transporte intermunicipal y taxi de COOFLOTAX, incluyendo rutas, horarios, información corporativa, documentos de transparencia y políticas internas.

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 14.2 | Framework React con export estático |
| React | 18.2 | UI |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| Lucide React | 0.400 | Íconos |
| React Icons | 5.6 | Íconos adicionales |

**Output:** Static export (`next export`) — compatible con hosting estático (Apache/Nginx).

---

## Estructura del Proyecto

```
cooflotax-web/
├── public/
│   ├── logo.webp
│   ├── bus.mp4                      # Video hero principal
│   ├── HistoriaFondo.mp4            # Video fondo historia
│   ├── poster-bus.webp
│   ├── terminal.webp, duitama.webp, soata.webp
│   ├── Taxi.webp, Flota.webp, Duitaxi.webp
│   ├── redbus.png
│   ├── documentos-2022/             # Documentos ESAL 2022
│   ├── esal2023/                    # Documentos ESAL 2023
│   ├── documentos_essa_2024/        # Documentos ESAL 2024
│   └── Politicas/                   # Políticas internas (PDFs)
├── src/
│   ├── app/
│   │   ├── layout.js                # Layout raíz (Navbar + Footer + WhatsApp)
│   │   ├── page.js                  # Página de inicio
│   │   ├── globals.css              # Estilos globales
│   │   ├── nosotros/page.js         # Historia de la cooperativa
│   │   ├── servicios/page.js        # Servicios de bus y taxi
│   │   ├── rutas/page.js            # Buscador de rutas y tarifas
│   │   ├── contacto/page.js         # Formulario de contacto y mapa
│   │   ├── Documentos/page.js       # Documentos de transparencia ESAL
│   │   └── politicas/page.js        # Políticas institucionales
│   └── components/
│       ├── Navbar.js                # Navegación fija con menú móvil
│       ├── Footer.js                # Pie de página con links y contacto
│       ├── WhatsappButton.js        # Botón flotante de WhatsApp
│       └── WhatsappButtonConditional.js  # WhatsApp con visibilidad condicional
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
└── .htaccess                        # Reglas de routing para export estático
```

---

## Páginas

### `/` — Inicio
- Hero con video de fondo y animación de entrada
- Contadores animados (60 años, 380 conductores, 450 familias, 24+ rutas)
- Tarjetas de servicios (bus intermunicipal y taxi)
- Showcase de rutas populares con precios
- CTA de contacto con mapa embebido de Google Maps

### `/nosotros` — Quiénes Somos
- Línea de tiempo visual de 60 años (1964–2024)
- Indicador circular de progreso animado
- Historia por décadas con hitos clave
- Mapa SVG animado de rutas con vehículos en movimiento

### `/servicios` — Servicios
- Detalle del servicio de transporte intermunicipal
- Detalle del servicio de taxi urbano en Duitama
- Comparativa de características y estadísticas
- Galería editorial con imágenes de flota

### `/rutas` — Rutas y Tarifas
- Buscador interactivo por ciudad de origen (Duitama, Sogamoso, Tunja)
- Filtro en tiempo real por destino
- Tarjetas estilo tiquete con precio, duración y frecuencia
- Información de puntos de venta

### `/contacto` — Contacto
- Tarjetas de información (teléfono, email, dirección, horario)
- Formulario de contacto (PQR)
- Mapa de Google Maps embebido con indicaciones

### `/Documentos` — Documentos de Transparencia
- Documentos ESAL 2022, 2023 y 2024 (financieros, legales, informes)
- Búsqueda por nombre y filtro por categoría
- Visualización/descarga de PDFs

### `/politicas` — Políticas
- Políticas de Seguridad Vial, SST y Operativas
- Organización por categorías
- Descarga de documentos PDF

---

## Componentes

### `Navbar.js`
- Fija en la parte superior con efecto de reducción al hacer scroll
- Animación shimmer en el logo
- Menú hamburguesa para móvil con overlay
- Links con subrayado gradiente en hover

### `Footer.js`
- Tema oscuro consistente con el header
- Grid con: marca, navegación, servicios y contacto
- Links a redes sociales (Facebook, Instagram, Google Maps)
- Créditos y nota de regulador (Superintendencia)

### `WhatsappButtonConditional.js`
- Botón flotante de WhatsApp visible en todas las páginas
- Se oculta en rutas específicas según configuración

---

## Sistema de Diseño

### Paleta de Colores

| Token | Valor | Uso |
|---|---|---|
| Primary Blue | `#1A7FE8` | Acento de marca principal |
| Dark Blue | `#0057B8` | Variante oscura |
| Sky Blue | `#5DB8FF` | Resaltados claros |
| Navy | `#0A1628` | Fondos oscuros |
| Accent Orange | `#D97706` | Servicio de taxis |

### Tipografía

| Fuente | Rol |
|---|---|
| Cormorant Garamond | Encabezados (elegante, serif) |
| DM Sans | Cuerpo de texto |
| Montserrat | Navegación (bold, marcado) |
| Open Sans | Texto secundario |
| JetBrains Mono | Etiquetas técnicas |

---

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción (export estático)
npm run build

# Previsualizar build
npm start
```

El build genera una carpeta `out/` con archivos estáticos listos para despliegue en cualquier servidor web.

---

## Despliegue

El proyecto usa `output: 'export'` en `next.config.js`, generando archivos HTML/CSS/JS estáticos. El archivo `.htaccess` incluye las reglas de reescritura necesarias para el routing en servidores Apache.

**Pasos:**
1. Ejecutar `npm run build`
2. Subir el contenido de la carpeta `out/` al servidor web
3. Asegurarse de que el `.htaccess` esté en la raíz del servidor

---

## Información de la Empresa

| Campo | Detalle |
|---|---|
| Nombre | Cooperativa de Transportadores Flotax Duitama |
| Fundación | 1964 |
| Sede | CRA 18 N° 23-30, Duitama (Terminal de Transportes) |
| Teléfono oficina | 313-393-8967 |
| Teléfono taxi | 316-760-2222 |
| WhatsApp | 310-333-2323 |
| Email | pqrsdcooflotax@gmail.com |
| Horario | Lunes a Domingo, 5:00 AM – 10:00 PM |
| Certificaciones | ISO 9001:2015 · OHSAS 18001:2007 |
