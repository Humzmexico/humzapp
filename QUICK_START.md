# Humz - Quick Start (5 minutos)

## 🚀 Inicio Rápido

### 1. Clonar y setup (1 minuto)

```bash
cd "App Humz"
npm install
```

### 2. Base de datos (2 minutos)

**Opción rápida: Local PostgreSQL**

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Crear base de datos
createdb humz

# Configurar .env.local
echo 'DATABASE_URL="postgresql://localhost:5432/humz"' > .env.local
echo 'NEXT_PUBLIC_DEFAULT_ORG_ID="org_test_123"' >> .env.local
```

**Opción cloud: Supabase (Recomendado)**

1. Ir a https://supabase.com → New Project
2. Copiar "Connection String (URI)"
3. Crear `.env.local`:
   ```
   DATABASE_URL="postgresql://[tu-string]"
   NEXT_PUBLIC_DEFAULT_ORG_ID="org_test_123"
   ```

### 3. Crear schema (1 minuto)

```bash
npm run db:push
```

### 4. Correr app (1 minuto)

```bash
npm run dev
```

Abrir: **http://localhost:3000/dashboard**

---

## ✨ Qué ves

- **Dashboard**: Métricas principales
- **Finanzas**: Crear transacciones
- **Clientes**: Gestión de CRM
- **Mensajes**: Historial de comunicación

---

## 🔨 Cambios Rápidos

### Agregar campo a tabla

```bash
# 1. Editar prisma/schema.prisma
# Ejemplo: agregar 'address' a Clients
model Client {
  ...
  address String?
}

# 2. Actualizar base de datos
npm run db:push

# 3. Usar en componente
const client = await db.client.findMany()
```

### Crear nueva API

```bash
# 1. Crear app/api/newfeature/route.ts
export async function GET(request: NextRequest) {
  const orgId = await getCurrentOrganization()
  // ... tu lógica
  return NextResponse.json(data)
}

# 2. Usar en componente
const data = await fetch('/api/newfeature')
```

### Crear nueva página

```bash
# 1. Crear app/dashboard/newpage/page.tsx
'use client'

export default function NewPage() {
  return <div>Mi página</div>
}

# 2. Agregar nav en components/layout/sidebar.tsx
{ href: '/dashboard/newpage', label: 'Nueva', icon: Icon }
```

---

## 📊 Datos de Prueba

```bash
# Via curl (requiere API corriendo)

# Crear cliente
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "status": "LEAD"
  }'

# Crear transacción
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INCOME",
    "amount": 5000,
    "category": "Ventas",
    "transactionDate": "2026-04-25T00:00:00Z"
  }'

# Crear mensaje
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "cli_123",
    "channel": "WHATSAPP",
    "direction": "INBOUND",
    "content": "Hola, tengo una pregunta"
  }'
```

---

## 🧭 Estructura Carpetas

```
App Humz/
├── app/                  ← Páginas y API
│   ├── api/             ← Endpoints (/api/*)
│   ├── dashboard/       ← Rutas del app
│   ├── globals.css      ← Estilos
│   └── layout.tsx       ← Layout raíz
├── components/          ← Componentes React
│   ├── ui/             ← Shadcn/ui basics
│   ├── layout/         ← Sidebar, topbar
│   ├── dashboard/      ← Dashboard components
│   ├── crm/            ← Cliente components
│   ├── finances/       ← Transacciones components
│   └── messaging/      ← Mensajes components
├── lib/                ← Utilidades
│   ├── prisma.ts       ← DB client
│   ├── auth.ts         ← Auth helpers
│   └── utils.ts        ← cn(), etc
├── prisma/             ← ORM
│   └── schema.prisma   ← Definición de DB
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🚀 Deploy en 5 minutos

```bash
# 1. Push a GitHub
git add .
git commit -m "Humz MVP ready"
git push

# 2. Ir a vercel.com/new
# 3. Seleccionar repo
# 4. Agregar DATABASE_URL
# 5. Click Deploy ✨
```

---

## 🐛 Debug

### Ver base de datos
```bash
npm run db:studio
# Abre http://localhost:5555
```

### Ver logs de API
```bash
# En development, logs aparecen en terminal
npm run dev
```

### Resetear todo
```bash
npm run db:push --force
# ⚠️ Borra todos los datos
```

---

## 📚 Próximas Lecturas

- [README.md](./README.md) - Documentación completa
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Diseño del sistema
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy a producción

---

## 💡 Tips

1. **Prisma Studio**: `npm run db:studio` para explorar datos
2. **TypeScript**: `npm run build` para verificar tipos
3. **Testing**: `npm test` (cuando se agregue)
4. **Hot reload**: Cambios se aplican automáticamente
5. **Ambiente**: `NEXT_PUBLIC_*` es accesible en cliente

---

**¡Listo! Ahora puedes empezar a desarrollar Humz.**

Preguntas? Ver docs en README.md o ARCHITECTURE.md
