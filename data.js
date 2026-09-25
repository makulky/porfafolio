/* ==========================================================
   CONTENIDO DEL PORTAFOLIO
   ----------------------------------------------------------
   Edita solo este archivo para personalizar tu portafolio.
   Todo lo marcado con "TODO" es texto de ejemplo.
   ========================================================== */
window.PORTFOLIO = {
  profile: {
    name: "Miguel Figuerola Alonso",                     // TODO
    handle: "miguel",                    // TODO: se usa en el prompt (tunombre@portfolio)
    role: "Desarrollador Full Stack",    // TODO
    location: "Huelva, España",              // TODO
    bio: [
      // TODO: cada string es un párrafo
      "Hola, soy desarrollador de software especializado en el ecosistema .NET (C#), Java, JavaScript y bases de datos SQL y NoSQL con sólidos conocimientos en arquitecturas RESTful, backend con Node.js y desarrollo web/móvil (React, Angular, .NET MAUI).",
      "Experiencia práctica diseñando y desplegando soluciones de software reales orientadas a la automatización de procesos.",
      "Proactivo, enfocado en buenas prácticas de código y altamente motivado para aportar valor desde el primer día en equipos ágiles."
    ],
    email: "miguelfiguerolaalonso@gmail.com",        // TODO
    links: [
      { label: "GitHub",   url: "https://github.com/makulky" },          // TODO
      { label: "LinkedIn", url: "https://www.linkedin.com/in/miguel-figuerola-alonso" }, // TODO
      { label: "CV (PDF)", url: "#" }                                       // TODO
    ]
  },

  projects: [
    {
      name: "Sistema de Control Horario y Fichaje por Código QR",
      description: "Aplicación completa para la gestión y registro automatizado de jornadas laborales mediante escaneo de código QR único por empleado. Programada en C# (POO) con validación en tiempo real, prevención de fichajes duplicados y cálculo automático de horas trabajadas. Diseñada en MySQL para el almacenamiento seguro de usuarios, fichajes, accesos y marcas temporales (timestamps). Administración: Panel interactivo para la gestión de altas/bajas de empleados y exportación de informes de asistencia.",
      stack: ["C#", ".NET", "MySQL"],
      link: "",
      demo: ""
    },
  ],

  experience: [
    {
      role: "Técnico / Desarrollador de Software",
      company: "Liser Informática",
      period: "",
      achievements: [
        "Manejo y optimización de herramientas informáticas de gestión empresarial y bases de datos.",
        "Resolución rápida de incidencias técnicas y tareas de soporte con alta precisión organizativa."
      ]
    },
    {
      role: "Técnico de Soporte en Tienda y Atención al Cliente",
      company: "El Corte Inglés",
      period: "",
      achievements: [
        "Atención y asesoramiento personalizado a clientes en gran superficie comercial.",
        "Mantenimiento operativo y resolución de incidencias en sistemas TPV, cajas registradoras y periféricos.",
        "Apoyo en reposición, colocación de producto, etiquetado y control de stock en tienda.",
        "Trabajo coordinado en equipo para garantizar la satisfacción del cliente y la agilidad en tienda."
      ]
    },
    {
      role: "Desarrollador y Diseñador Web (Freelance)",
      company: "",
      period: "",
      achievements: [
        "Trato directo y continuo con clientes para la definición y entrega de proyectos.",
        "Autonomía, cumplimiento riguroso de plazos y alta orientación al detalle y la calidad."
      ]
    },
    {
      role: "Recepcionista y Atención al Cliente",
      company: "Centro Dental Guadiana",
      period: "",
      achievements: [
        "Atención presencial y telefónica directa, acogida al cliente y resolución de dudas.",
        "Gestión de cobros, arqueo de caja diario y manejo de terminales punto de venta (TPV) y efectivo.",
        "Control de agenda, facturación básica y registro administrativo informatizado.",
        "Gestión de pedidos de material e inventario de suministros para recepción y gabinete."
      ]
    }
  ],

  // level: 0 a 100
  skills: [
    {
      category: "Lenguajes",
      items: [
        { name: "JavaScript", level: 90 },
        { name: "TypeScript", level: 90 },
        { name: "Java", level: 80 },
        { name: "C#", level: 90 },
        { name: "Python", level: 75 },
        { name: "PHP", level: 75 },
        { name: "SQL", level: 90 },
      ]
    },
    {
      category: "Frontend",
      items: [
        { name: "React", level: 85 },
        { name: "Angular", level: 85 },
        { name: "HTML / CSS", level: 90 },
        { name: "Tailwind", level: 75 }
      ]
    },
    {
      category: "Backend y herramientas",
      items: [
        { name: "Node.js", level: 90 },
        { name: "ASP.NET Core", level: 80 },
        { name: "Spring Boot", level: 80 },
        { name: "Git", level: 90 },
        { name: "Django", level: 75 },
        { name: "Docker", level: 60 },
        { name: "Laravel", level: 75 },
        { name: "Linux", level: 80 }
      ]
    }
  ],

  courses: [
    {
      name: "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
      institution: "I.E.S. La Marisma",
      year: "2025",
      link: "#"
    },
    {
      name: "Dev. Móvil Avanzado (Xamarin / .NET MAUI)",
      institution: "Udemy",
      year: "2025",
      link: "#"
    },
    {
      name: "Desarrollo con Node.js: Testing y Seguridad",
      institution: "Udemy",
      year: "2025",
      link: "#"
    },
    {
      name: "Mejores Prácticas de Seguridad Web",
      institution: "Udemy",
      year: "2025",
      link: "#"
    },
    {
      name: "Python 3: Data Analysis y Matplotlib",
      institution: "Udemy",
      year: "2025",
      link: "#"
    },
    {
      name: "Técnico en Sistemas Microinformáticos y Redes (SMR)",
      institution: "I.E.S. La Marisma",
      year: "2014",
      link: "#"
    },
  ]
};
