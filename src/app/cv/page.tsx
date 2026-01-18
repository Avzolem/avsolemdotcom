'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Mail, MapPin, Globe, Linkedin, Github, ExternalLink, Sun, Moon, Languages, Phone } from 'lucide-react';
import './print.css';

// Inject print styles into head to ensure they load before print - Critical for Edge
const printStyles = `
@media print {
  @page { size: 8.5in 11in !important; margin: 0 !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
  html, body { width: 8.5in !important; height: 11in !important; margin: 0 !important; padding: 0 !important; background: #fff !important; background-color: #fff !important; background-image: none !important; overflow: hidden !important; }
  .no-print, button, [class*="fixed"] { display: none !important; visibility: hidden !important; position: absolute !important; left: -9999px !important; }
  #cv-print-area, .print-container { all: unset !important; display: block !important; position: absolute !important; top: 0 !important; left: 0 !important; width: 8.5in !important; height: 11in !important; margin: 0 !important; padding: 0 !important; background: #fff !important; background-color: #fff !important; background-image: none !important; overflow: hidden !important; }
  .cv-container { all: unset !important; display: block !important; width: 8.5in !important; height: 11in !important; margin: 0 !important; padding: 0 !important; background: #fff !important; background-color: #fff !important; box-shadow: none !important; border-radius: 0 !important; overflow: hidden !important; }
  .cv-content { all: unset !important; display: flex !important; flex-direction: row !important; width: 8.5in !important; height: 11in !important; background: #fff !important; background-color: #fff !important; }
  .cv-sidebar { all: unset !important; display: block !important; width: 2.5in !important; min-width: 2.5in !important; height: 11in !important; padding: 0.18in !important; background: #f0f1f3 !important; background-color: #f0f1f3 !important; box-sizing: border-box !important; overflow: hidden !important; flex-shrink: 0 !important; }
  .cv-main { all: unset !important; display: block !important; flex: 1 !important; width: 6in !important; height: 11in !important; padding: 0.18in 0.22in !important; background: #fff !important; background-color: #fff !important; box-sizing: border-box !important; overflow: hidden !important; }
  [class*="bg-gray-800"], [class*="bg-gray-900"], [class*="bg-gray-950"], [class*="bg-gradient"], [class*="from-gray"], [class*="via-gray"], [class*="to-gray"] { background: #fff !important; background-color: #fff !important; background-image: none !important; }
}
`;

// CV Data in both languages
const cvData = {
  en: {
    name: 'José Andrés Aguilar Calderón',
    role: 'Department Head & Web Developer',
    email: 'andresaguilar.exe@gmail.com',
    phone: '+52 625 121 7055',
    location: 'Chihuahua, México',
    avatar: '/images/andres.jpeg',
    languages: [
      { name: 'Spanish', level: 'Native' },
      { name: 'English', level: 'Professional' }
    ],
    social: {
      linkedin: 'https://www.linkedin.com/in/avsolem/',
      github: 'https://github.com/Avzolem',
      twitter: 'https://twitter.com/avsolem',
      website: 'https://avsolem.com'
    },
    summary: 'Software developer and project manager with 10+ years of experience in creating development and logistics departments. Expert in React/Next.js development, Web3 technologies, and digital transformation. Proven track record working with multinational companies and government institutions.',
    sections: {
      contact: 'Contact',
      languages: 'Languages',
      technicalSkills: 'Technical Skills',
      professionalSkills: 'Professional Skills',
      experience: 'Experience',
      education: 'Education'
    },
    experience: [
      {
        company: 'Government of the State of Chihuahua',
        role: 'Department Head',
        period: 'Sept 2023 — Present',
        achievements: [
          'Leading department operations and managing technology initiatives for the State Government',
          'Overseeing digital transformation projects and implementing modern web solutions',
          'Coordinating with Digital Policy teams and municipal IT liaison offices'
        ]
      },
      {
        company: 'Autonomous University of Chihuahua',
        role: 'Web Developer',
        period: 'Jul 2022 — Sept 2023',
        achievements: [
          'Developed web applications using Next.js, Unity, and Vercel',
          'Implemented MongoDB databases and TailwindCSS for modern UIs',
          'Created interactive educational platforms for students'
        ]
      },
      {
        company: 'Etherfuse',
        role: 'Freelance Web Developer',
        period: 'Nov 2022 — Jan 2023',
        achievements: [
          'Developed tokenized certificates web app for Hackathon Etherfuse 2023',
          'Delivered talks about decentralized web pages and Web3 technologies',
          'Completed web development bounties with SuperTeam (Solana ecosystem)'
        ]
      },
      {
        company: 'Chihuahua Youth Institute',
        role: 'Networks and Systems Area Coordinator',
        period: 'Jan 2019 — Jul 2022',
        achievements: [
          'Managed entire IT infrastructure and network systems',
          'Coordinated technology projects and digital solutions',
          'Led team for maintaining technological capabilities'
        ]
      },
      {
        company: 'Transportes Borunda',
        role: 'Logistics and Operations Coordinator',
        period: 'Jul 2017 — Jan 2019',
        achievements: [
          'Managed sales control and created commercial alliances',
          'Worked with Daewoo, Pemex, GHMECC Logistics, Wialon, Industrias Fehr, Intermetro'
        ]
      },
      {
        company: 'Corelion LLC',
        role: 'Web Design Assistant Developer',
        period: 'Aug 2015 — Jun 2017',
        achievements: [
          'Assisted in developing web applications for client projects',
          'Collaborated with senior developers on responsive designs'
        ]
      },
      {
        company: 'Black Shark',
        role: 'Computer Equipment Repair Technician',
        period: 'Oct 2014 — Jul 2015',
        achievements: [
          'Diagnosed and repaired computer hardware issues',
          'Provided technical support and system maintenance'
        ]
      }
    ],
    education: [
      {
        institution: 'Autonomous University of Guadalajara',
        degree: 'Master of Architecture, CISCO Networks',
        period: '2017 — 2018',
        detail: 'Developed internal projects for the University Center of Exact Sciences'
      },
      {
        institution: 'Technological Institute of Cd. Cuauhtémoc',
        degree: 'Systems Engineering',
        period: '2013 — 2017',
        detail: 'Thesis: "Cognitive Through Genetic Algorithms: The way to the new A.I."'
      },
      {
        institution: 'LivingLab CUU',
        degree: 'Tech Community Member',
        period: 'Ongoing',
        detail: 'Active collaboration on innovative projects and continuous learning'
      }
    ],
    skills: {
      technical: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'TailwindCSS', 'Node.js', 'MongoDB', 'Vercel', 'Unity', 'Web3', 'Blockchain', 'Solana', 'CorelDraw', 'Power BI', 'Office', 'Cloud Management', 'DevOps', 'Ruby', 'Rails', 'Dart', 'Flutter', 'Java', 'C++', 'Docker', 'Canva', 'Slack', 'Warp', 'Git/GitHub', 'SQL', 'REST APIs', 'AWS', 'Linux', 'Figma', 'Python'],
      professional: ['Project Management', 'Team Leadership', 'Business Strategy', 'Digital Transformation', 'CISCO Networks', 'IT Infrastructure', 'Agile/Scrum', 'Public Speaking', 'Technical Documentation', 'Stakeholder Management', 'Remote Team Management']
    },
    footer: 'Generated from avsolem.com/cv',
    buttons: {
      download: 'Download PDF',
      portfolio: 'Portfolio',
      language: 'ES',
      lightMode: 'Light',
      darkMode: 'Dark'
    }
  },
  es: {
    name: 'José Andrés Aguilar Calderón',
    role: 'Jefe de Departamento y Desarrollador Web',
    email: 'andresaguilar.exe@gmail.com',
    phone: '+52 625 121 7055',
    location: 'Chihuahua, México',
    avatar: '/images/andres.jpeg',
    languages: [
      { name: 'Español', level: 'Nativo' },
      { name: 'Inglés', level: 'Profesional' }
    ],
    social: {
      linkedin: 'https://www.linkedin.com/in/avsolem/',
      github: 'https://github.com/Avzolem',
      twitter: 'https://twitter.com/avsolem',
      website: 'https://avsolem.com'
    },
    summary: 'Desarrollador de software y gerente de proyectos con más de 10 años de experiencia en la creación de departamentos de desarrollo y logística. Experto en desarrollo React/Next.js, tecnologías Web3 y transformación digital. Con una gran trayectoria trabajando con empresas multinacionales e instituciones gubernamentales.',
    sections: {
      contact: 'Contacto',
      languages: 'Idiomas',
      technicalSkills: 'Habilidades Técnicas',
      professionalSkills: 'Habilidades Profesionales',
      experience: 'Experiencia',
      education: 'Educación'
    },
    experience: [
      {
        company: 'Gobierno del Estado de Chihuahua',
        role: 'Jefe de Departamento',
        period: 'Sept 2023 — Presente',
        achievements: [
          'Liderando operaciones departamentales y gestionando iniciativas tecnológicas para el Gobierno del Estado',
          'Supervisando proyectos de transformación digital e implementando soluciones web modernas',
          'Coordinando con equipos de Política Digital y enlaces de TI municipales'
        ]
      },
      {
        company: 'Universidad Autónoma de Chihuahua',
        role: 'Desarrollador Web',
        period: 'Jul 2022 — Sept 2023',
        achievements: [
          'Desarrollé aplicaciones web usando Next.js, Unity y Vercel',
          'Implementé bases de datos MongoDB y TailwindCSS para interfaces modernas',
          'Creé plataformas educativas interactivas para estudiantes'
        ]
      },
      {
        company: 'Etherfuse',
        role: 'Desarrollador Web Freelance',
        period: 'Nov 2022 — Ene 2023',
        achievements: [
          'Desarrollé aplicación web de certificados tokenizados para el Hackathon Etherfuse 2023',
          'Impartí conferencias sobre páginas web descentralizadas y tecnologías Web3',
          'Completé bounties de desarrollo web con SuperTeam (ecosistema Solana)'
        ]
      },
      {
        company: 'Instituto Chihuahuense de la Juventud',
        role: 'Coordinador del Área de Redes y Sistemas',
        period: 'Ene 2019 — Jul 2022',
        achievements: [
          'Gestioné toda la infraestructura de TI y sistemas de red',
          'Coordiné proyectos tecnológicos y soluciones digitales',
          'Lideré equipo para mantener las capacidades tecnológicas'
        ]
      },
      {
        company: 'Transportes Borunda',
        role: 'Coordinador de Logística y Operaciones',
        period: 'Jul 2017 — Ene 2019',
        achievements: [
          'Gestioné control de ventas y creé alianzas comerciales',
          'Trabajé con Daewoo, Pemex, GHMECC Logistics, Wialon, Industrias Fehr, Intermetro'
        ]
      },
      {
        company: 'Corelion LLC',
        role: 'Asistente de Desarrollador de Diseño Web',
        period: 'Ago 2015 — Jun 2017',
        achievements: [
          'Asistí en el desarrollo de aplicaciones web para proyectos de clientes',
          'Colaboré con desarrolladores senior en diseños responsivos'
        ]
      },
      {
        company: 'Black Shark',
        role: 'Técnico en Reparación de Equipos de Cómputo',
        period: 'Oct 2014 — Jul 2015',
        achievements: [
          'Diagnostiqué y reparé problemas de hardware de computadoras',
          'Proporcioné soporte técnico y mantenimiento de sistemas'
        ]
      }
    ],
    education: [
      {
        institution: 'Universidad Autónoma de Guadalajara',
        degree: 'Maestría en Arquitectura, Redes CISCO',
        period: '2017 — 2018',
        detail: 'Desarrollé proyectos internos para el Centro Universitario de Ciencias Exactas'
      },
      {
        institution: 'Instituto Tecnológico de Cd. Cuauhtémoc',
        degree: 'Ingeniería en Sistemas',
        period: '2013 — 2017',
        detail: 'Tesis: "Cognitivo a través de Algoritmos Genéticos: El camino hacia la nueva I.A."'
      },
      {
        institution: 'LivingLab CUU',
        degree: 'Miembro de la Comunidad Tech',
        period: 'Continuo',
        detail: 'Colaboración activa en proyectos innovadores y aprendizaje continuo'
      }
    ],
    skills: {
      technical: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'TailwindCSS', 'Node.js', 'MongoDB', 'Vercel', 'Unity', 'Web3', 'Blockchain', 'Solana', 'CorelDraw', 'Power BI', 'Office', 'Cloud Management', 'DevOps', 'Ruby', 'Rails', 'Dart', 'Flutter', 'Java', 'C++', 'Docker', 'Canva', 'Slack', 'Warp', 'Git/GitHub', 'SQL', 'REST APIs', 'AWS', 'Linux', 'Figma', 'Python'],
      professional: ['Gestión de Proyectos', 'Liderazgo de Equipos', 'Estrategia de Negocios', 'Transformación Digital', 'Redes CISCO', 'Infraestructura TI', 'Agile/Scrum', 'Oratoria', 'Documentación Técnica', 'Gestión de Stakeholders', 'Gestión de Equipos Remotos']
    },
    footer: 'Generado desde avsolem.com/cv',
    buttons: {
      download: 'Descargar PDF',
      portfolio: 'Portafolio',
      language: 'EN',
      lightMode: 'Claro',
      darkMode: 'Oscuro'
    }
  }
};

export default function CVPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const data = cvData[lang];

  // Inject print styles into head on mount
  useEffect(() => {
    const styleId = 'cv-print-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = printStyles;
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'es' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Liquid glass button style
  const liquidGlassStyle = theme === 'light'
    ? 'bg-white/70 backdrop-blur-xl backdrop-saturate-150 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] text-gray-800 hover:bg-white/90'
    : 'bg-white/[0.08] backdrop-blur-xl backdrop-saturate-150 border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] text-white hover:bg-white/[0.15]';

  return (
    <>
      {/* Main Container with theme */}
      <div
        id="cv-print-area"
        className={`print-container min-h-screen py-16 px-4 transition-colors duration-300 print:min-h-0 print:py-0 print:px-0 print:bg-white print:bg-none ${
        theme === 'light'
          ? 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'
          : 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'
      }`}>

        {/* Floating Controls - Right Side */}
        <div className="no-print fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {/* Download PDF */}
          <button
            onClick={handlePrint}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${liquidGlassStyle}`}
            title={data.buttons.download}
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Portfolio Link */}
          <Link
            href="/"
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${liquidGlassStyle}`}
            title={data.buttons.portfolio}
          >
            <ExternalLink className="w-5 h-5" />
          </Link>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${liquidGlassStyle}`}
            title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
          >
            <span className="text-sm font-bold">{data.buttons.language}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${liquidGlassStyle}`}
            title={theme === 'light' ? data.buttons.darkMode : data.buttons.lightMode}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        {/* CV Container */}
        <div
          className={`cv-container max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden transition-colors duration-300 print:shadow-none print:rounded-none print:max-w-full print:w-full print:m-0 print:bg-white ${
            theme === 'light'
              ? 'bg-white'
              : 'bg-gray-900'
          }`}
        >
          {/* Two Column Layout */}
          <div className="cv-content flex flex-col md:flex-row print:flex-row print:bg-white">

            {/* Left Sidebar */}
            <div className={`cv-sidebar w-full md:w-72 print:w-72 p-6 print:p-4 transition-colors duration-300 print:bg-gray-100 ${
              theme === 'light'
                ? 'bg-gray-50'
                : 'bg-gray-800/50'
            }`}>

              {/* Profile Photo */}
              <div className="profile-photo-container mb-6 flex justify-center">
                <div className="profile-photo relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-cyan-500/30 shadow-xl">
                  <Image
                    src={data.avatar}
                    alt={data.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Contact Section */}
              <div className="sidebar-section mb-6 avoid-break">
                <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider border-b border-cyan-500 pb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {data.sections.contact}
                </h3>
                <div className="space-y-2 text-sm">
                  <a href={`mailto:${data.email}`} className={`contact-item flex items-start gap-2 hover:text-cyan-600 transition-colors ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    <Mail className="w-4 h-4 mt-0.5 text-cyan-600 flex-shrink-0" />
                    <span className="break-all text-xs">{data.email}</span>
                  </a>
                  <a href={`tel:${data.phone.replace(/\s/g, '')}`} className={`contact-item flex items-start gap-2 hover:text-cyan-600 transition-colors ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    <Phone className="w-4 h-4 mt-0.5 text-cyan-600 flex-shrink-0" />
                    <span className="text-xs">{data.phone}</span>
                  </a>
                  <div className={`contact-item flex items-start gap-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    <MapPin className="w-4 h-4 mt-0.5 text-cyan-600 flex-shrink-0" />
                    <span className="text-xs">{data.location}</span>
                  </div>
                  <a href={data.social.website} target="_blank" rel="noopener noreferrer" className={`contact-item flex items-start gap-2 hover:text-cyan-600 transition-colors ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    <Globe className="w-4 h-4 mt-0.5 text-cyan-600 flex-shrink-0" />
                    <span className="text-xs">avsolem.com</span>
                  </a>
                  <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className={`contact-item flex items-start gap-2 hover:text-cyan-600 transition-colors ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    <Linkedin className="w-4 h-4 mt-0.5 text-cyan-600 flex-shrink-0" />
                    <span className="text-xs">linkedin.com/in/avsolem</span>
                  </a>
                  <a href={data.social.github} target="_blank" rel="noopener noreferrer" className={`contact-item flex items-start gap-2 hover:text-cyan-600 transition-colors ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    <Github className="w-4 h-4 mt-0.5 text-cyan-600 flex-shrink-0" />
                    <span className="text-xs">github.com/Avzolem</span>
                  </a>
                </div>
              </div>

              {/* Languages */}
              <div className="sidebar-section mb-6 avoid-break">
                <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider border-b border-cyan-500 pb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {data.sections.languages}
                </h3>
                <div className="space-y-1 text-xs">
                  {data.languages.map((language) => (
                    <div key={language.name} className={`language-item flex justify-between ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      <span>{language.name}</span>
                      <span className="text-cyan-600 font-medium">{language.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div className="sidebar-section mb-6 avoid-break">
                <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider border-b border-cyan-500 pb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {data.sections.technicalSkills}
                </h3>
                <div className="skills-container flex flex-wrap gap-1">
                  {data.skills.technical.map((skill) => (
                    <span
                      key={skill}
                      className={`skill-badge skill-badge-tech text-xs px-2 py-0.5 rounded ${
                        theme === 'light'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-cyan-900/30 text-cyan-300'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Professional Skills */}
              <div className="sidebar-section avoid-break">
                <h3 className={`text-sm font-bold mb-3 uppercase tracking-wider border-b border-cyan-500 pb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {data.sections.professionalSkills}
                </h3>
                <div className="skills-container flex flex-wrap gap-1">
                  {data.skills.professional.map((skill) => (
                    <span
                      key={skill}
                      className={`skill-badge skill-badge-prof text-xs px-2 py-0.5 rounded ${
                        theme === 'light'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Main Content */}
            <div className="cv-main flex-1 p-6 md:p-8 print:p-4 print:bg-white">

              {/* Header */}
              <header className="cv-header mb-6 border-b-2 border-cyan-500 pb-4">
                <h1 className={`text-3xl md:text-4xl font-bold mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {data.name}
                </h1>
                <h2 className="text-lg text-cyan-600 font-medium mb-3">
                  {data.role}
                </h2>
                <p className={`summary-text text-sm leading-relaxed ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {data.summary}
                </p>
              </header>

              {/* Experience Section */}
              <section className="cv-section mb-6">
                <h3 className={`section-title text-lg font-bold mb-4 uppercase tracking-wider flex items-center gap-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  <span className="w-6 h-0.5 bg-cyan-500"></span>
                  {data.sections.experience}
                </h3>
                <div className="space-y-3">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="experience-item avoid-break">
                      <div className="experience-header flex justify-between items-baseline gap-2">
                        <h4 className={`font-semibold text-sm ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          {exp.company}
                        </h4>
                        <span className={`period-badge text-xs whitespace-nowrap px-2 py-0.5 rounded ${
                          theme === 'light'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                          {exp.period}
                        </span>
                      </div>
                      <p className="role-text text-xs text-cyan-600 font-medium">
                        {exp.role}
                      </p>
                      <ul className={`text-xs space-y-0.5 ml-3 ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="relative pl-3 before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-cyan-500 before:rounded-full">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education Section */}
              <section className="cv-section">
                <h3 className={`section-title text-lg font-bold mb-4 uppercase tracking-wider flex items-center gap-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  <span className="w-6 h-0.5 bg-cyan-500"></span>
                  {data.sections.education}
                </h3>
                <div className="space-y-2">
                  {data.education.map((edu, index) => (
                    <div key={index} className="education-item avoid-break">
                      <div className="education-header flex justify-between items-baseline gap-2">
                        <h4 className={`font-semibold text-sm ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          {edu.institution}
                        </h4>
                        <span className={`period-badge text-xs whitespace-nowrap px-2 py-0.5 rounded ${
                          theme === 'light'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                          {edu.period}
                        </span>
                      </div>
                      <p className="degree-text text-xs text-cyan-600 font-medium">
                        {edu.degree}
                      </p>
                      <p className={`detail-text text-xs italic ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {edu.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
