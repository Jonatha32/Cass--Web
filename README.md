# Cassé Web 🔄📱♻️

**Versión web de la aplicación Cassé para intercambio de dispositivos electrónicos.**

🌐 **[Ver Demo en Vivo](https://jonatha32.github.io/Cass--Web)**

## ✨ Características Principales

- 📱 **Diseño Responsive** - Optimizado para móviles, tablets y desktop
- 🔄 **Navegación Fluida** - HashRouter para compatibilidad con GitHub Pages
- 🎨 **UI Moderna** - Interfaz elegante con Tailwind CSS
- 🔍 **Búsqueda Avanzada** - Filtrado inteligente de productos
- ❤️ **Sistema de Favoritos** - Guarda tus productos preferidos
- 💬 **Chat Integrado** - Comunicación directa entre usuarios
- 🏷️ **Categorías** - Organización por tipos de dispositivos
- 🔐 **Autenticación Segura** - Login/Register con Firebase

## 🚀 Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/Jonatha32/Cass--Web.git
cd Cass--Web

# Instalar dependencias
npm install

# Iniciar desarrollo
npm start
```

## 🛠 Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **React** | 18.2.0 | Framework frontend |
| **Firebase** | 10.7.1 | Backend y autenticación |
| **Tailwind CSS** | 3.3.6 | Estilos y diseño |
| **React Router** | 6.8.0 | Navegación SPA |
| **Lucide React** | 0.263.1 | Iconos modernos |
| **React Hot Toast** | 2.4.1 | Notificaciones |

## 📱 Funcionalidades

### ✅ Implementadas
- 🏠 **Página Principal** - Hero section, categorías, productos destacados
- 🔐 **Autenticación** - Login/Register completo
- 📋 **Vista de Productos** - Grid responsive con filtros
- 🔍 **Búsqueda** - Búsqueda en tiempo real
- 📱 **Categorías** - Smartphones, Gaming, Laptops, Audio, etc.
- 👤 **Perfiles de Usuario** - Información y productos del usuario
- ❤️ **Favoritos** - Sistema de productos favoritos
- 📱 **Responsive Design** - Optimizado para todos los dispositivos
- 🍔 **Menú Móvil** - Navegación hamburguesa para móviles

### 🔄 En Desarrollo
- 💬 Chat en tiempo real
- ✏️ Crear/editar productos
- 🔔 Notificaciones push
- 📊 Dashboard de usuario
- 🌙 Modo oscuro

## 🎨 Diseño

### Paleta de Colores
- **Azul Principal**: `#205781`
- **Verde Agua**: `#71BBB2`
- **Grises**: `#F3F4F6`, `#9CA3AF`

### Tipografía
- **Fuente**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia servidor de desarrollo
npm run build      # Build para producción
npm test           # Ejecuta tests
npm run eject      # Expone configuración (irreversible)

# Deployment
npm run predeploy  # Pre-build para deploy
npm run deploy     # Deploy a GitHub Pages
```

## 🌐 Deployment

La aplicación está configurada para deployment automático en GitHub Pages:

1. **Push a main** - Activa GitHub Actions
2. **Build automático** - Construye la aplicación
3. **Deploy automático** - Publica en GitHub Pages

### Configuración Manual

```bash
# Build y deploy manual
npm run build
npm run deploy
```

## 📂 Estructura del Proyecto

```
Cass--Web/
├── public/
│   ├── index.html
│   ├── 404.html          # Manejo de rutas SPA
│   └── Cassé.png
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Navbar.js
│   │   └── ProductCard.js
│   ├── pages/           # Páginas principales
│   │   ├── HomePage.js
│   │   ├── CategoriesPage.js
│   │   └── ProductDetailPage.js
│   ├── hooks/           # Custom hooks
│   ├── services/        # Servicios (Firebase, API)
│   └── data/           # Datos mock
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions
└── package.json
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
# ... más configuraciones de Firebase
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Jonathan** - [GitHub](https://github.com/Jonatha32)

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐