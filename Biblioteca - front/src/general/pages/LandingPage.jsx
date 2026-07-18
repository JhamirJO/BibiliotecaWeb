import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

   return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
            <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className="text-xl sm:text-2xl font-bold  text-slate-600 bg-clip-text">
                                BIBLIOTECA
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-blue-800 transition-colors font-medium">
                                Características
                            </button>
                            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-blue-800 transition-colors font-medium">
                                Acerca de
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-blue-800 transition-colors font-medium">
                                Contacto
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-info-content hover:bg-slate-600 text-white rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium text-sm sm:text-base"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            <section className="pt-32 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 sm:space-y-8">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Gestión Bibliotecaria
                                <span className="block text-info-content">
                                    del Futuro
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                                Plataforma integral para administrar el catálogo, préstamos, devoluciones de publicaciones, con reportes en tiempo real y recordatorios automáticos.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => scrollToSection('about')}
                                    className="px-8 py-4 border-4 border-info-content text-info-content font-bold rounded-xl hover:bg-blue-50 transition-all duration-200 text-xl"
                                >
                                    Saber Más
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-400 rounded-3xl blur-3xl opacity-20"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-slate-300 p-6 rounded-2xl">
                                        <div className="text-3xl font-bold text-slate-800 mb-2">150+</div>
                                        <div className="text-slate-800 font-medium">Publicaciones en el catálogo</div>
                                    </div>
                                    <div className="bg-slate-600  p-6 rounded-2xl">
                                        <div className="text-3xl font-bold text-white mb-2">100+</div>
                                        <div className="text-gray-100 font-medium">Lectores registrados</div>
                                    </div>
                                    <div className="bg-slate-600 p-6 rounded-2xl">
                                        <div className="text-3xl font-bold text-white mb-2">80+</div>
                                        <div className="text-gray-100 font-medium">Libros físicos disponibles</div>
                                    </div>
                                    <div className="bg-slate-300 p-6 rounded-2xl">
                                        <div className="text-3xl font-bold text-slate-800 mb-2">90+</div>
                                        <div className="text-slate-800 font-medium">Recursos digitales (artículos, tesis y otros)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Características Principales</h2>
                        <p className="text-lg sm:text-xl text-gray-600">Todo lo que necesitas saber acerca de la plataforma</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="group p-8 bg-slate-200/70 rounded-2xl hover:shadow-xl transition-all duration-300 border">
                            <div className="w-14 h-14 bg-info-content rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de Préstamos</h3>
                            <p className="text-gray-600 leading-relaxed">Registro ágil de préstamos, renovaciones, control de fechas de entrega y estados de cada ejemplar.</p>
                        </div>

                        <div className="group p-8 bg-slate-200/70 rounded-2xl hover:shadow-xl transition-all duration-300 border">
                            <div className="w-14 h-14 bg-info-content rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round"  strokeWidth={2} d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Catálogo y Búsqueda Avanzada</h3>
                            <p className="text-gray-600 leading-relaxed">Consulta por título, autor, ISBN, etiquetas y disponibilidad en tiempo real.</p>
                        </div>

                        <div className="group p-8 bg-slate-200/70 rounded-2xl hover:shadow-xl transition-all duration-300 border">
                            <div className="w-14 h-14 bg-info-content rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">lector y Membresías</h3>
                            <p className="text-gray-600 leading-relaxed">Alta y administración de lectores, historial de movimientos y niveles de permisos.</p>
                        </div>

                        <div className="group p-8 bg-slate-200/70 rounded-2xl hover:shadow-xl transition-all duration-300 border">
                            <div className="w-14 h-14 bg-info-content rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}  d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Devoluciones</h3>
                            <p className="text-gray-600 leading-relaxed">Recepción de ejemplares, verificación del estado físico y actualización inmediata del inventario.</p>
                        </div>

                        <div className="group p-8 bg-slate-200/70 rounded-2xl hover:shadow-xl transition-all duration-300 border">
                            <div className="w-14 h-14 bg-info-content rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Reportes y Analítica</h3>
                            <p className="text-gray-600 leading-relaxed">Indicadores clave: rotación de libros, morosidad, títulos más prestados y demanda.</p>
                        </div>

                        <div className="group p-8 bg-slate-200/70 rounded-2xl hover:shadow-xl transition-all duration-300 border">
                            <div className="w-14 h-14 bg-info-content rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sanciones y Exoneraciones</h3>
                            <p className="text-gray-600 leading-relaxed">Cálculo automático de multas, gestión de exoneraciones y bitácora de incidencias.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-400 rounded-3xl blur-3xl opacity-20"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Para Toda la Comunidad Lectora</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Lectores</div>
                                            <div className="text-gray-600 text-sm">Descubre nuevos libros y gestiona tus préstamos.</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Estudiantes y Docentes</div>
                                            <div className="text-gray-600 text-sm">Accede a materiales de estudio, tesis y artículos especializados.</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Familias y Lectores Independientes</div>
                                            <div className="text-gray-600 text-sm">Comparte lecturas, fomenta el hábito lector en casa y sigue tu historial.</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Bibliotecas y Organizaciones</div>
                                            <div className="text-gray-600 text-sm">Administra catálogos, usuarios, stock y reportes desde un solo lugar.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 order-1 lg:order-2">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                                Una Plataforma
                                <span className="block bg-info-content bg-clip-text text-transparent">
                                    Diseñada para Todos
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Nuestro sistema bibliotecario digitaliza el flujo completo: desde el registro de nuevas publicaciones hasta el seguimiento de préstamos y reportes. Está diseñado para bibliotecas públicas, comunitarias, académicas y privadas, así como para cualquier lector que quiera acceder a sus libros de forma rápida, ordenada y segura.
                            </p>
                
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={() => navigate('/preregistro')}
                                    className="px-8 py-4 bg-info-content text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                                >
                                    Únete Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Contáctanos</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para asistirte.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                        <p className="text-gray-600">contacto@solrasan.edu.pe</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-slate-800  rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                                        <p className="text-gray-600">+51 1 619-7000</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-slate-800  rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Ubicación</h3>
                                        <p className="text-gray-600">Universidad Nacional Mayor de San Marcos<br/>Lima, Perú</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
                            <div className="space-y-4">
                                <div className="border border-blue-100 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleFAQ(0)}
                                        className="w-full px-6 py-4 bg-white hover:bg-blue-50 transition-colors flex justify-between items-center text-left"
                                    >
                                        <span className="font-semibold text-gray-900">¿Qué puedo hacer en este sistema bibliotecario?</span>
                                        <svg className={`w-5 h-5 text-blue-600 transition-transform ${openFAQ === 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFAQ === 0 && (
                                        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                                            <p className="text-gray-600">Desde este sistema puedes buscar libros, artículos y tesis, 
                                                ver si están disponibles, revisar el historial de lo que has pedido y recibir notificaciones cuando 
                                                un material esté por vencer o ya esté disponible para ti.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-blue-100 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleFAQ(1)}
                                        className="w-full px-6 py-4 bg-white hover:bg-blue-50 transition-colors flex justify-between items-center text-left"
                                    >
                                        <span className="font-semibold text-gray-900">¿Cómo busco un libro, artículo o tesis en el catálogo?</span>
                                        <svg className={`w-5 h-5 text-blue-600 transition-transform ${openFAQ === 1 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFAQ === 1 && (
                                        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                                            <p className="text-gray-600">Ve a la opción “Catálogo”, escribe el título, autor, en el buscador y, 
                                                si quieres, filtra por tipo de publicación (libro, artículo o tesis). Luego haz clic en la publicación para ver sus datos completos y su disponibilidad.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-blue-100 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleFAQ(2)}
                                        className="w-full px-6 py-4 bg-white hover:bg-blue-50 transition-colors flex justify-between items-center text-left"
                                    >
                                        <span className="font-semibold text-gray-900">¿Cuánto tiempo puedo tener prestado un material y cómo lo renuevo?</span>
                                        <svg className={`w-5 h-5 text-blue-600 transition-transform ${openFAQ === 2 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFAQ === 2 && (
                                        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                                            <p className="text-gray-600">El plazo máximo de préstamo es de 7 días contados desde la fecha en que se realiza el préstamo. Puedes revisar las fechas de préstamo y devolución en la sección “Mis préstamos” de tu cuenta.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-blue-100 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleFAQ(3)}
                                        className="w-full px-6 py-4 bg-white hover:bg-blue-50 transition-colors flex justify-between items-center text-left"
                                    >
                                        <span className="font-semibold text-gray-900">¿Qué pasa si devuelvo un material con retraso?</span>
                                        <svg className={`w-5 h-5 text-blue-600 transition-transform ${openFAQ === 3 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFAQ === 3 && (
                                        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                                            <p className="text-gray-600">Si devuelves un material después de la fecha límite, la biblioteca puede aplicar 
                                                multas o restricciones temporales (por ejemplo, bloquear nuevos préstamos durante algunos días). 
                                                Te recomendamos revisar siempre la fecha de devolución en “Mis préstamos” y estar atento a las notificaciones de recordatorio.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-blue-100 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleFAQ(4)}
                                        className="w-full px-6 py-4 bg-white hover:bg-blue-50 transition-colors flex justify-between items-center text-left"
                                    >
                                        <span className="font-semibold text-gray-900">¿Cómo accedo al sistema por primera vez?</span>
                                        <svg className={`w-5 h-5 text-blue-600 transition-transform ${openFAQ === 4 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFAQ === 4 && (
                                        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                                            <p className="text-gray-600">Tu cuenta de usuario es creada por la biblioteca con tus 
                                                datos. Para ingresar, haz clic en “Iniciar sesión”, escribe tus credenciales y pulsa “Entrar”. 
                                                Si no puedes acceder o nunca recibiste tus credenciales, contáctanos a través de la sección “Contáctanos” para que verifiquemos tu cuenta.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gradient-to-br from-slate-100 to-slate-200 border-t border-blue-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-600 text-sm sm:text-base">
                        &copy; {currentYear} | BIBLIOTECA | Todos los derechos reservados por el autor.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
