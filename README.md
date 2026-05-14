# Gestión Organizacional — App del equipo

Aplicación web estática con organigrama jerárquico, login por usuario y panel para que cada colaborador llene sus funciones, proceso y propuestas de mejora.

## 📋 Características

- **Login multiusuario** — Administrador + 32 perfiles individuales
- **Vista Árbol** — Organigrama jerárquico visual completo (solo admin)
- **Vista Lista** — Tarjetas agrupadas por proceso con buscador y filtros (solo admin)
- **Vista Personal** — Cada colaborador edita solo su perfil
- **Persistencia** — Datos guardados en el navegador (localStorage)
- **Sesión** — Recuerda la sesión hasta cerrar el navegador

## 🔑 Credenciales

| Usuario | Contraseña |
|---------|------------|
| Administrador | `admin123` |
| Todos los demás | `pass123` |

> Para cambiar contraseñas individuales, edita el campo `pass` de cada persona en `data.js`.

## 🚀 Desplegar en Vercel

### Opción 1 — Drag & drop (la más fácil)

1. Ve a [vercel.com/new](https://vercel.com/new) (necesitas una cuenta gratuita)
2. Crea un nuevo proyecto
3. Arrastra y suelta toda esta carpeta (`go-app`) en el área de carga
4. Vercel detecta que es un sitio estático y lo despliega automáticamente
5. En ~30 segundos tendrás una URL pública tipo `tu-proyecto.vercel.app`

### Opción 2 — Desde GitHub

1. Sube esta carpeta a un repositorio en GitHub
2. En [vercel.com/new](https://vercel.com/new) importa el repositorio
3. Deja la configuración por defecto (Framework: "Other")
4. Click en **Deploy**

### Opción 3 — Con Vercel CLI

```bash
npm install -g vercel
cd go-app
vercel
```

Sigue las preguntas en pantalla. Vercel te dará una URL pública.

## 📁 Estructura del proyecto

```
go-app/
├── index.html      ← Página principal
├── styles.css      ← Estilos
├── data.js         ← Personas y configuración (EDITA AQUÍ)
├── app.js          ← Lógica de la app
├── vercel.json     ← Configuración de despliegue
└── README.md       ← Este archivo
```

## ✏️ Personalizar el equipo

Edita `data.js` para agregar, quitar o modificar personas. Cada entrada tiene este formato:

```javascript
{
  id: 'identificador-unico',
  name: 'Nombre Completo',
  role: 'Cargo',
  proc: 'Proceso al que pertenece',
  tier: 'gg' | 'dir' | 'coord' | 'ejec' | 'aux',
  parent: 'id-del-jefe' | null,
  pass: 'contraseña-individual'
}
```

**Niveles (`tier`):**
- `gg` — Gerencia General
- `dir` — Dirección
- `coord` — Coordinación
- `ejec` — Ejecutivo / Especialista
- `aux` — Auxiliar / Asesor

## ⚠️ Sobre la persistencia de datos

Los datos se guardan en el `localStorage` del navegador de cada usuario, lo que significa:

- ✅ Persisten al cerrar y abrir el navegador
- ✅ No necesitas servidor ni base de datos
- ❌ No se sincronizan entre dispositivos
- ❌ Si un usuario limpia el caché, pierde sus datos

Para una versión con base de datos centralizada, recomiendo migrar a Vercel + Postgres, Supabase o Firebase. Avísame si quieres que prepare esa versión.

## 🎨 Personalización visual

- Colores principales: edita las variables CSS en `:root` dentro de `styles.css`
- Tipografía: usa Google Fonts (DM Sans + DM Serif Display por defecto)
- Tema oscuro por defecto

---

Hecho con ❤️ — listo para producción.
