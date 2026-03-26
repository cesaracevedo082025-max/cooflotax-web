"use client"

import { useState, useMemo } from "react"

const DOCS = [
  // ── VIGENCIA 2022 ──────────────────────────────────────────────────────
  {
    nombre: "Estados Financieros Consolidados — Dic. 2022",
    archivo: "/documentos-2022/ESTADOS FINANCIEROS CONSOLIDADO A 31 DE DICIEMBRE DE 2022.pdf",
    categoria: "Financieros",
    vigencia: "2022",
    fecha: "Dic 2022",
  },
  {
    nombre: "Numeral 1 · Denominación, identificación y domicilio",
    archivo: "/documentos-2022/Numeral 1. La denominación, identificación y el domicilio de la entidad.pdf",
    categoria: "Legales",
    vigencia: "2022",
    fecha: "2022",
  },
  {
    nombre: "Numeral 2 · Informe de Gerencia — Asamblea 2022",
    archivo: "/documentos-2022/Numeral 2. Informe de gerencia asamblea general 2022.pdf",
    categoria: "Informes",
    vigencia: "2022",
    fecha: "Mar 2022",
  },
  {
    nombre: "Numeral 3 · Monto y destino de reinversión",
    archivo: "/documentos-2022/Numeral 3. Monto y destino de la reinversion del beneficio o excedente neto cuando corresponda.pdf",
    categoria: "Financieros",
    vigencia: "2022",
    fecha: "2022",
  },
  {
    nombre: "Numeral 4 · Cumplimiento Régimen Tributario Especial",
    archivo: "/documentos-2022/Numeral 4. Cumplimiento de requisitos Regimen Tributario Especial.pdf",
    categoria: "Legales",
    vigencia: "2022",
    fecha: "2022",
  },
  {
    nombre: "Numeral 5 · Personas en cargos gerenciales y directivos",
    archivo: "/documentos-2022/Numeral 5. Nombres e identificación de personas que ocupan cargos gerenciales, directivos o de control.pdf",
    categoria: "Directivos",
    vigencia: "2022",
    fecha: "2022",
  },
  {
    nombre: "Numeral 6 · Monto total de pagos salariales directivos",
    archivo: "/documentos-2022/Numeral 6. Monto total de pagos salariales a miembros de los cuerpos directivos.pdf",
    categoria: "Financieros",
    vigencia: "2022",
    fecha: "2022",
  },
  {
    nombre: "Numeral 7 · Nombre e identificación de fundadores",
    archivo: "/documentos-2022/Numeral 7. Nombre e identificación de los fundadores.pdf",
    categoria: "Legales",
    vigencia: "2022",
    fecha: "2022",
  },
  {
    nombre: "Numeral 8 · Monto del patrimonio a 31 dic. 2022",
    archivo: "/documentos-2022/Numeral 8. Monto del patrimonio a 31 de diciembre de 2022.pdf",
    categoria: "Financieros",
    vigencia: "2022",
    fecha: "Dic 2022",
  },

  // ── VIGENCIA 2023 ──────────────────────────────────────────────────────
  {
    nombre: "Estados Financieros — 2023",
    archivo: "/esal2023/ESTADOS FINANCIEROS 2023.pdf",
    categoria: "Financieros",
    vigencia: "2023",
    fecha: "Dic 2023",
  },
  {
    nombre: "Numeral 1 · Denominación, identificación y domicilio",
    archivo: "/esal2023/NUMERAL 1. LA DENOMINACIÓN, IDENTIFICACIÓN Y EL DOMICILIO DE LA IDENTIDAD.pdf",
    categoria: "Legales",
    vigencia: "2023",
    fecha: "2023",
  },
  {
    nombre: "Numeral 2 · Informe de Gerencia — 2023",
    archivo: "/esal2023/NUMERAL 2. INFORME DE GERENCIA,.pdf",
    categoria: "Informes",
    vigencia: "2023",
    fecha: "Mar 2023",
  },
  {
    nombre: "Numeral 3 · Monto y destino de reinversión",
    archivo: "/esal2023/NUMERAL 3. MONTO Y DESTINO DE LA REINVERSION DEL BENEFICIO O DEL EXCEDENTE CUANDO CORRESPONDA.pdf",
    categoria: "Financieros",
    vigencia: "2023",
    fecha: "2023",
  },
  {
    nombre: "Numeral 4 · Cumplimiento Régimen Tributario Especial",
    archivo: "/esal2023/NUMERAL 4. CUMPLIMIENTO DE LOS REQUISITOS REGIMEN TRIBUTARIO ESPECIAL.pdf",
    categoria: "Legales",
    vigencia: "2023",
    fecha: "2023",
  },
  {
    nombre: "Numeral 5 · Nombre e identificación de los cargos",
    archivo: "/esal2023/NUMERAL 5. NOMBRE E IDENTIFICACION DE LOS CARGOS.pdf",
    categoria: "Directivos",
    vigencia: "2023",
    fecha: "2023",
  },
  {
    nombre: "Numeral 6 · Monto total de pagos salariales directivos",
    archivo: "/esal2023/NUMERAL 6. MONTO TOTAL DE PAGOS SALARIALES A MIEMBROS DE CUERPOS DIRECTIVOS..pdf",
    categoria: "Financieros",
    vigencia: "2023",
    fecha: "2023",
  },
  {
    nombre: "Numeral 7 · Nombre e identificación de fundadores",
    archivo: "/esal2023/NUMERAL 7.NOMBRE E IDENTIFICACION DE LOS FUNDADORES.pdf",
    categoria: "Legales",
    vigencia: "2023",
    fecha: "2023",
  },
  {
    nombre: "Numeral 8 · Monto final del patrimonio 2023",
    archivo: "/esal2023/NUMERAL 8. MONTO FINAL DEL PATRIMONIO 2023.pdf",
    categoria: "Financieros",
    vigencia: "2023",
    fecha: "Dic 2023",
  },
  {
    nombre: "Numeral 9 · Memoria Económica",
    archivo: "/esal2023/NUMERAL 9. MEMORIA ECONOMICA.pdf",
    categoria: "Informes",
    vigencia: "2023",
    fecha: "2023",
  },
]

const VIGENCIAS = ["Todas", "2022", "2023"]
const CATEGORIAS = ["Todas", ...Array.from(new Set(DOCS.map((d) => d.categoria)))]

const CATEGORIA_STYLES = {
  Financieros: "bg-orange-50 text-orange-700",
  Legales:     "bg-rose-50 text-rose-700",
  Informes:    "bg-teal-50 text-teal-700",
  Directivos:  "bg-purple-50 text-purple-700",
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PdfIcon() {
  return (
    <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
      <rect width="28" height="34" rx="4" fill="#FEF2F2" />
      <path d="M6 4H18L24 10V30H6V4Z" fill="#FECACA" />
      <path d="M18 4L24 10H18V4Z" fill="#FCA5A5" />
      <text x="14" y="23" textAnchor="middle" fontSize="7" fontWeight="700" fill="#DC2626" fontFamily="system-ui">PDF</text>
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.5 2.5H2.5C1.948 2.5 1.5 2.948 1.5 3.5V11.5C1.5 12.052 1.948 12.5 2.5 12.5H10.5C11.052 12.5 11.5 12.052 11.5 11.5V8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8.5 1.5H12.5V5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 1.5L6.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export default function DocumentosPage() {
  const [busqueda, setBusqueda] = useState("")
  const [vigencia, setVigencia] = useState("Todas")
  const [categoria, setCategoria] = useState("Todas")

  const docsFiltrados = useMemo(() => {
    return DOCS.filter((doc) => {
      const coincideBusqueda =
        busqueda === "" ||
        doc.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        doc.categoria.toLowerCase().includes(busqueda.toLowerCase())
      const coincideVigencia = vigencia === "Todas" || doc.vigencia === vigencia
      const coincideCategoria = categoria === "Todas" || doc.categoria === categoria
      return coincideBusqueda && coincideVigencia && coincideCategoria
    })
  }, [busqueda, vigencia, categoria])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO — fondo azul oscuro ── */}
      <div style={{
        background: '#020A14',
        paddingTop: '192px', // compensa el navbar fixed
        paddingBottom: '48px',
        paddingLeft: '48px',
        paddingRight: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Resplandor decorativo */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: '100%',
          background: 'radial-gradient(ellipse 60% 180px at 50% 0%, rgba(26,127,232,0.10) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        {/* Línea shimmer superior */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(26,127,232,0.6), transparent)',
        }} />

        <p style={{
          fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#1A7FE8', marginBottom: 12, position: 'relative',
        }}>
          Empresa · Transparencia
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300,
          color: 'white', letterSpacing: '-0.02em', marginBottom: 8,
          fontFamily: "'Cormorant Garamond', serif", position: 'relative',
        }}>
          Documentación ESAL
        </h1>
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.40)',
          fontFamily: "'DM Sans', sans-serif", position: 'relative',
        }}>
          {DOCS.length} documentos oficiales · Vigencias 2022 y 2023
        </p>
      </div>

      {/* ── FILTROS — fondo blanco ── */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-12 py-4 flex flex-wrap items-center gap-4">

        {/* Buscador */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 min-w-[240px]">
          <span className="text-gray-400 flex-shrink-0"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 w-full"
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")} className="text-gray-400 hover:text-gray-600 text-lg leading-none">
              ×
            </button>
          )}
        </div>

        {/* Tabs vigencia */}
        <div className="flex gap-2">
          {VIGENCIAS.map((v) => (
            <button
              key={v}
              onClick={() => setVigencia(v)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
                vigencia === v
                  ? "bg-gray-900 text-white border-gray-900 font-medium"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {v === "Todas" ? "Todas" : `Vigencia ${v}`}
            </button>
          ))}
        </div>

        {/* Tabs categoría */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.filter((c) => c !== "Todas").map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(categoria === cat ? "Todas" : cat)}
              className={`px-3 py-1 rounded-full text-xs transition-all border ${
                categoria === cat
                  ? "bg-gray-700 text-white border-gray-700 font-medium"
                  : "bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRID DE DOCUMENTOS — fondo gris claro ── */}
      <div className="px-6 md:px-12 py-8">
        {docsFiltrados.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-base mb-1">No se encontraron documentos</p>
            <p className="text-sm">Intenta con otro término o filtro</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-5">
              {docsFiltrados.length} resultado{docsFiltrados.length !== 1 ? "s" : ""}
              {vigencia !== "Todas" ? ` · Vigencia ${vigencia}` : ""}
              {categoria !== "Todas" ? ` · ${categoria}` : ""}
              {busqueda ? ` para "${busqueda}"` : ""}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {docsFiltrados.map((doc, i) => (
                <a
                  key={i}
                  href={doc.archivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-md transition-all duration-150 hover:-translate-y-0.5"
                >
                  <div className="mb-3"><PdfIcon /></div>

                  <div className="flex flex-wrap gap-1 mb-2.5">
                    <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded ${CATEGORIA_STYLES[doc.categoria] || "bg-gray-100 text-gray-600"}`}>
                      {doc.categoria}
                    </span>
                    <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                      {doc.vigencia}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 leading-snug mb-3">{doc.nombre}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{doc.fecha}</span>
                    <span className="text-gray-300 group-hover:text-gray-500 transition-colors">
                      <ExternalLinkIcon />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}