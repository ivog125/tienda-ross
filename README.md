# Tienda Ross

Proyecto de tienda online estática con Firebase Firestore, Auth y Cloudinary.

## Estructura principal

- `index.html`: tienda pública con carrito, búsqueda, filtros y lectura de productos desde Firestore.
- `gestion-r7x2.html`: panel administrativo para gestionar productos, categorías y banners.
- `importar.html`: herramienta de importación inicial de productos a Firestore.

## Auth & seguridad

- `gestion-r7x2.html` exige Firebase Auth antes de mostrar el panel.
- `importar.html` activa los botones de importación y limpieza solo si el usuario está autenticado.
- **Importante:** también hay que aplicar reglas de seguridad de Firestore en la consola de Firebase para bloquear accesos directos desde la API.

Ejemplo mínimo de regla Firestore (solo admin):

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /banners/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

> Ajustá el campo `admin` según tu configuración de Firebase Auth o usando `customClaims`.

## Modelo de producto

Los productos deben incluir los siguientes campos en Firestore:

- `name` (string)
- `category` (string)
- `price` (number)
- `description` (string)
- `image` (string)
- `benefits` (string)
- `ingredients` (string)
- `usage` (string)
- `stock` (string) — `in` / `out`
- `createdAt` / `updatedAt` (timestamp)

## Notas adicionales

- El admin sube imágenes a Cloudinary usando el preset `tienda-ross`.
- `package.json` no es necesario para el frontend estático; la dependencia `firebase-admin` parece no usarse aquí.

## Asignar rol admin (custom claim)

Para que los usuarios puedan administrar la tienda deben tener el claim `admin` en su token. Usá el Admin SDK desde un entorno seguro (servidor o máquina local con credenciales) para asignarlo:

Node.js (ejemplo):

```js
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// Asignar claim admin a un usuario por UID
admin.auth().setCustomUserClaims('<UID_DEL_USUARIO>', { admin: true })
  .then(() => console.log('Claim admin asignado'))
  .catch(console.error);
```

Luego el usuario debe volver a autenticarse en el cliente o forzar la renovación del token para que el claim esté presente.

Otra opción rápida desde la consola es usar una Cloud Function o un script temporal que llame a `setCustomUserClaims`.
