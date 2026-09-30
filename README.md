# Inscripciones Extracurriculares · Eight Academy

Sistema gratuito de inscripción en línea a actividades extracurriculares (Básica y Bachillerato).

- **Página web** (este repositorio): se publica gratis con **GitHub Pages**.
- **Base de datos**: una hoja de **Google Sheets** en la cuenta de la institución.
- **API**: el archivo `apps-script/Codigo.gs`, publicado como aplicación web de **Google Apps Script**. Une la página con la hoja.

```
Estudiante / Coordinación
        │  (navegador)
        ▼
GitHub Pages ── index.html / admin.html
        │  fetch POST (JSON)
        ▼
Google Apps Script (Codigo.gs)  ──►  Google Sheets (Estudiantes, Inscripciones, Actividades…)
```

> **Protección de datos:** las listas de estudiantes **no** se suben a GitHub. Viven solo en la hoja de Google Sheets. El archivo `.gitignore` bloquea `.xlsx`, `.csv` y `.docx` para evitar subirlos por error.

## Contenido

| Archivo | Uso |
|---|---|
| `index.html` | Página de inscripción para estudiantes |
| `admin.html` | Panel de administración (protegido con clave) |
| `js/config.js` | **Aquí se pega la URL de la API** de Apps Script |
| `js/api.js` | Conexión con la API (no se modifica) |
| `apps-script/Codigo.gs` | Código que se pega en Apps Script (no se ejecuta en GitHub) |

## Instalación

### 1. Google Sheets y Apps Script (API)

1. Sube `BD_Extracurriculares_EightAcademy.xlsx` a Google Drive y ábrelo con **Hojas de cálculo de Google**. Luego elige **Archivo › Guardar como Hojas de cálculo de Google**.
2. En esa hoja, abre **Extensiones › Apps Script**. Borra el contenido de `Código.gs` y pega todo `apps-script/Codigo.gs`. Guarda. **No hace falta crear archivos HTML en Apps Script.**
3. En la lista de funciones, elige `configurarSistema`, pulsa **Ejecutar** y acepta los permisos.
4. Pulsa **Implementar › Nueva implementación › Aplicación web** y configura:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. Copia la **URL de la aplicación web**, que termina en `/exec`.
   - Si la abres en el navegador, debe mostrar `{"ok":true,...,"estado":"activa"}`.

### 2. GitHub Pages (página web)

1. Crea una cuenta en [github.com](https://github.com) y pulsa **New repository**.
   - Nombre: `eight-extracurriculares`
   - Visibilidad: **Public** (necesaria para GitHub Pages gratis)
2. En el repositorio, pulsa **Add file › Upload files**. Arrastra todo el contenido de esta carpeta: `index.html`, `admin.html`, la carpeta `js`, la carpeta `apps-script`, `README.md`, `.gitignore` y `.nojekyll`. Pulsa **Commit changes**.
3. Abre `js/config.js` y pulsa el lápiz ✏️. Reemplaza `PEGAR_AQUI_LA_URL_DE_APPS_SCRIPT` por la URL `/exec` del paso 1.5 y pulsa **Commit changes**.
4. Ve a **Settings › Pages**:
   - Source: **Deploy from a branch**
   - Branch: **main** y carpeta **/ (root)**
   - Pulsa **Save**.
5. Espera 1 a 2 minutos. La página quedará en:
   - Estudiantes: `https://TU-USUARIO.github.io/eight-extracurriculares/`
   - Administración: `https://TU-USUARIO.github.io/eight-extracurriculares/admin.html`
6. Opcional: escribe la dirección de la página en la hoja **Configuracion › URL de la página**. Así el menú **Extracurriculares › Ver enlaces** muestra todos los enlaces.

### 3. Antes de abrir el registro

- Cambia la **Clave administrador** en la hoja Configuracion (la inicial es `EightAdmin2026`).
- Haz una inscripción de prueba y luego bórrala. Sigue la guía de operación, sección 6.

## Actualizaciones

| Cambio | Qué hacer |
|---|---|
| Cupos, actividades, abrir o cerrar el registro, clave | Solo editar la hoja de Google Sheets. Se aplica al instante. |
| Código de `Codigo.gs` | Pegar el código en Apps Script y luego **Implementar › Administrar implementaciones › ✏️ › Versión: Nueva versión › Implementar**. La URL no cambia. |
| `index.html`, `admin.html` o `js/` | Subir o editar el archivo en GitHub. Se publica solo en 1 a 2 minutos. |
| Se creó una **nueva implementación** (URL distinta) | Actualizar la URL en `js/config.js`. |

## Solución de problemas

- **"Falta configurar la URL de la API"**: falta pegar la URL en `js/config.js`, o tiene espacios o comillas de más.
- **"No se pudo conectar con el servidor"** o **"Respuesta no válida"**: revisa que la implementación tenga **Quién tiene acceso: Cualquier usuario** y que la URL termine en `/exec` (no en `/dev`).
- **Error 404 en GitHub Pages**: espera unos minutos. Revisa también que `index.html` esté en la raíz del repositorio y no dentro de una carpeta.
- **Los cambios en `Codigo.gs` no se reflejan**: falta publicar una **nueva versión** de la implementación.
