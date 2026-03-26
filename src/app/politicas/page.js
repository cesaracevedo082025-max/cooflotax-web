"use client"

import { useState, useMemo } from "react"

const DOCS = [
  {
    nombre: "Formato Transporte de Menores Cooflotax",
    archivo: "/Politicas/FORMATO TRANSPORTE DE MENORES COOFLOTAX.pdf",
    categoria: "Operativo",
    fecha: "2024",
  },
  {
    nombre: "Objetivos del SG-SST",
    archivo: "/Politicas/OBJETIVOS DEL SG-SST.pdf",
    categoria: "SST",
    fecha: "2024",
  },
  {
    nombre: "Política de Actores Viales",
    archivo: "/Politicas/POLITICA DE ACTORES VIALES.pdf",
    categoria: "Seguridad Vial",
    fecha: "2024",
  },
  {
    nombre: "Política de Prevención de la Distracción",
    archivo: "/Politicas/POLITICA DE LA PREVENCION DE LA DISTRACCION.pdf",
    categoria: "Seguridad Vial",
    fecha: "2024",
  },
  {
    nombre: "Política de Prevención de Consumo de Alcohol y Drogas",
    archivo: "/Politicas/POLITICA DE PREVENCION DE CONSUMO DE ALCOHOL Y DROGAS.pdf",
    categoria: "SST",
    fecha: "2024",
  },
  {
    nombre: "Política de Regulación de Horas de Conducción",
    archivo: "/Politicas/POLITICA DE REGULACION DE HORAS DE CONDUCCION.pdf",
    categoria: "Seguridad Vial",
    fecha: "2024",
  },
  {
    nombre: "Política de SST y PESV",
    archivo: "/Politicas/POLITICA DE SST Y PESV.pdf",
    categoria: "SST",
    fecha: "2024",
  },
  {
    nombre: "Política de Uso de Cinturón de Seguridad",
    archivo: "/Politicas/POLITICA DE USO DE CINTURON DE SEGURIDAD.pdf",
    categoria: "Seguridad Vial",
    fecha: "2024",
  },
  {
    nombre: "Política Transporte Menores de Edad",
    archivo: "/Politicas/POLÍTICA TRANSPORTE MENORES DE EDAD.docx.pdf",
    categoria: "Operativo",
    fecha: "2024",
  },
]

const CATEGORIAS = ["Todas", ...Array.from(new Set(DOCS.map((d) => d.categoria)))]

const CATEGORIA_STYLES = {
  "Seguridad Vial": "bg-red-50 text-red-700",
  SST:              "bg-teal-50 text-teal-700",
  Operativo:        "bg-blue-50 text-blue-700",
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

export default function PoliticasPage() {
  const [busqueda, setBusqueda] = useState("")
  const [categoria, setCategoria] = useState("Todas")

  const docsFiltrados = useMemo(() => {
    return DOCS.filter((doc) => {
      const coincideBusqueda =
        busqueda === "" ||
        doc.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        doc.categoria.toLowerCase().includes(busqueda.toLowerCase())
      const coincideCategoria = categoria === "Todas" || doc.categoria === categoria
      return coincideBusqueda && coincideCategoria
    })
  }, [busqueda, categoria])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ── */}
      <div style={{
        background: '#020A14',
        paddingTop: '192px',
        paddingBottom: '48px',
        paddingLeft: '48px',
        paddingRight: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: '100%',
          background: 'radial-gradient(ellipse 60% 180px at 50% 0%, rgba(26,127,232,0.10) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(26,127,232,0.6), transparent)',
        }} />

        <p style={{
          fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#1A7FE8', marginBottom: 12, position: 'relative',
        }}>
          Empresa · Políticas
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300,
          color: 'white', letterSpacing: '-0.02em', marginBottom: 8,
          fontFamily: "'Cormorant Garamond', serif", position: 'relative',
        }}>
          Políticas Internas
        </h1>
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.40)',
          fontFamily: "'DM Sans', sans-serif", position: 'relative',
        }}>
          {DOCS.length} documentos oficiales · Vigencia 2024
        </p>
      </div>

      {/* ── FILTROS ── */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-12 py-4 flex flex-wrap items-center gap-4">

        {/* Buscador */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 min-w-[240px]">
          <span className="text-gray-400 flex-shrink-0"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Buscar políticas..."
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

        {/* Tabs categoría */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
                categoria === cat
                  ? "bg-gray-900 text-white border-gray-900 font-medium"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRID ── */}
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