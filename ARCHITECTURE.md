# Humz - Arquitectura del Sistema

## 🏗️ Visión General

Humz es un sistema SaaS multi-tenant construido sobre Next.js 15 con App Router, diseñado para centralizar la operación de pequeños negocios y servicios.

```
┌─────────────────────────────────────────┐
│           Navegador del Usuario         │
│  (React Components + Shadcn/UI)         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│      Next.js App Router (Frontend)      │
│  - /dashboard                           │
│  - /dashboard/clients                   │
│  - /dashboard/finances                  │
│  - /dashboard/messages                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│       Next.js API Routes (Backend)      │
│  - /api/clients                         │
│  - /api/transactions                    │
│  - /api/messages                        │
│  - /api/metrics                         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│    Prisma ORM (Data Access Layer)       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│      PostgreSQL Database                │
│  - users, organizations, memberships    │
│  - clients, messages, transactions      │
└─────────────────────────────────────────┘
```

## 🔐 Modelo Multi-Tenant

### Estructura de Datos
```
users (1) ←─ memberships (M) → (M) organizations ← (1) users (owner)
                                        │
                                        ├─ clients
                                        ├─ messages
                                        └─ transactions
```

### Aislamiento de Datos
Cada API route DEBE validar `organizationId` antes de acceder a datos:

```typescript
const orgId = await getCurrentOrganization() // Valida usuario y obtiene org
if (!orgId) return 401 Unauthorized

const clients = await prisma.client.findMany({
  where: { organizationId: orgId } // ← Filtro crítico
})
```

### Seguridad
- ✅ Cada usuario pertenece a una organización
- ✅ Datos filtrados SIEMPRE por `organizationId` en API
- ✅ Frontend asume organización actual (en production, de sesión)
- ✅ Base de datos usa índices para performance multi-tenant

## 📊 Capas de la Aplicación

### 1. **Capa de Presentación** (`/components`)

#### Componentes UI (Reutilizables)
```
components/ui/
├── button.tsx          # Base para todas las acciones
├── card.tsx            # Contenedor principal
├── input.tsx           # Campos de texto
├── table.tsx           # Tablas de datos
├── badge.tsx           # Estados y categorías
└── select.tsx          # Dropdowns
```

#### Componentes de Negocio (Feature-specific)
```
components/
├── layout/
│   ├── sidebar.tsx     # Navegación
│   └── topbar.tsx      # Header y usuario
├── dashboard/
│   ├── metrics-card.tsx           # KPI cards
│   ├── revenue-chart.tsx          # Gráfico ingresos
│   ├── clients-growth-chart.tsx   # Crecimiento clientes
│   └── recent-*-table.tsx         # Tablas recientes
├── crm/
│   ├── client-form.tsx     # Crear/editar cliente
│   └── clients-table.tsx   # Lista de clientes
├── finances/
│   ├── transaction-form.tsx    # Crear transacción
│   └── transaction-table.tsx   # Historial
└── messaging/
    ├── messages-table.tsx        # Historial de mensajes
    └── message-stats-cards.tsx   # Estadísticas
```

### 2. **Capa de Rutas/Páginas** (`/app`)

#### Estructura de Routing (App Router)
```
app/
├── layout.tsx              # Root layout
├── globals.css             # Estilos globales
└── dashboard/
    ├── layout.tsx          # Dashboard layout (sidebar + topbar)
    ├── page.tsx            # Dashboard principal (KPIs)
    ├── clients/
    │   └── page.tsx        # CRM de clientes
    ├── finances/
    │   └── page.tsx        # Gestión de finanzas
    └── messages/
        └── page.tsx        # Historial de mensajes
```

### 3. **Capa de API** (`/app/api`)

Cada endpoint sigue el patrón:
```typescript
1. Validar usuario y obtener organizationId
2. Validar datos de entrada con Zod
3. Ejecutar operación en base de datos
4. Retornar resultado o error
```

#### Endpoints
```
GET    /api/clients              Listar clientes de la org
POST   /api/clients              Crear cliente
GET    /api/transactions         Listar transacciones
POST   /api/transactions         Crear transacción
GET    /api/messages             Listar mensajes
POST   /api/messages             Crear mensaje
GET    /api/metrics              Obtener KPIs del mes
```

### 4. **Capa de Datos** (`/lib` + Prisma)

#### Prisma Client
```typescript
// lib/prisma.ts
// Singleton para evitar múltiples conexiones
// En development, Next.js hot-reload reutiliza la instancia
```

#### Utilidades
```
lib/
├── prisma.ts          # Cliente Prisma singleton
├── auth.ts            # getCurrentOrganization(), getCurrentUser()
└── utils.ts           # cn() para Tailwind + clsx
```

#### Schema Prisma
```prisma
// prisma/schema.prisma
model User { }           // Identidad
model Organization { }   // Multi-tenant container
model Membership { }     // Relación usuario-org
model Client { }         // CRM
model Message { }        // Comunicación
model FinancialTransaction { }  // Finanzas
```

## 🔄 Flujos de Datos

### Flujo 1: Crear Cliente
```
User Form
    ↓
ClientForm.tsx (state)
    ↓
fetch('/api/clients', { method: 'POST', body: {...} })
    ↓
/api/clients POST route
    ├─ getCurrentOrganization() → org_123
    ├─ Validar datos con Zod
    └─ prisma.client.create({ organizationId: 'org_123', ... })
        ↓
    Database → Guardar cliente
        ↓
    Response { id, name, ... }
        ↓
Form reset + onSuccess() → Refetch /api/clients
```

### Flujo 2: Dashboard Metrics
```
Dashboard page mounts
    ↓
useEffect(() => fetch('/api/metrics'))
    ↓
/api/metrics GET route
    ├─ getCurrentOrganization() → org_123
    ├─ Fetch financial_transactions (last month)
    ├─ Count clients total y new
    ├─ Calcula tiempos respuesta
    └─ Retorna { monthlyRevenue, monthlyProfit, ... }
        ↓
setMetrics(data) → Actualiza componentes
```

## 📈 Cálculos de Negocio

### Ingresos del Mes
```sql
SELECT SUM(amount) 
FROM financial_transactions 
WHERE organizationId = 'org_123'
  AND type = 'INCOME'
  AND transactionDate >= date_trunc('month', now())
```

### Tiempo Promedio de Respuesta
```
Para cada pareja (inbound, outbound) del mismo cliente:
  tiempoRespuesta = outbound.timestamp - inbound.timestamp
promedio = SUM(tiempoRespuesta) / COUNT(pairs)
```

### Clientes por Estado
```sql
SELECT status, COUNT(*) 
FROM clients 
WHERE organizationId = 'org_123'
GROUP BY status
```

## 🎨 Diseño UI/UX

### Color Palette
- **Primary**: Negro (#000000) - Acciones, destacados
- **Secondary**: Gris (#999999) - Secundario
- **Accent**: Gris claro (#CCCCCC) - Fondo
- **Background**: Blanco (#FFFFFF)
- **Destructive**: Rojo (#FF0000) - Gastos, eliminación

### Componentes Principales
1. **Card**: Contenedor base para secciones
2. **Button**: Primaria (negro) y secundaria (gris)
3. **Badge**: Estados de clientes, tipos de transacciones
4. **Table**: Listados de datos
5. **Input**: Formularios

### Patrones
- Sidebar fijo (256px) con navegación
- Topbar con user menu y notificaciones
- Content area con padding generoso
- Grid responsive (1 col móvil, 2-4 cols desktop)

## 🔌 Puntos de Integración (Futuro)

### 1. Autenticación (NextAuth)
```
← GitHub/Google OAuth
→ Store user + org in database
```

### 2. Pagos (Stripe)
```
← Payment events
→ Update subscription status
```

### 3. Invent Integration
```
← Lead creation webhook
→ Create client automatically
← Message logs
→ Store messages + calculate response time
```

### 4. WhatsApp API
```
← Incoming messages
→ Store in messages table
← Outbound request
→ Send via WhatsApp
```

## 📊 Performance Considerations

### Database Indexes
```prisma
@@index([organizationId])        // Filtro principal
@@index([clientId])               // Relaciones
@@index([transactionDate])        // Range queries
@@unique([userId, organizationId]) // Memberships
```

### Caching
- Dashboard metrics: Cache en memoria o Redis (TTL 5 min)
- Client list: Revalidate on demand
- Messages: Scroll infinito con cursor pagination

### Query Optimization
- Select solo campos necesarios
- Include relaciones requeridas (client info)
- Limit resultados (últimos 100 mensajes)

## 🧪 Testing Strategy

### Unit Tests
```typescript
// lib/utils.ts
// lib/auth.ts
// Funciones puras
```

### Integration Tests
```typescript
// API routes
// Validación multi-tenant
// Cálculos de métricas
```

### E2E Tests
```typescript
// Flujos completos: crear cliente → mensaje → transacción
// Verificar datos en dashboard
```

## 🚀 Escalabilidad

### Momento 1 (MVP - Actual)
- Single organization testing
- In-memory cache
- Direct database calls

### Momento 2 (Product)
- Multi-org completo
- Redis para cache
- Connection pooling (Prisma+Supabase)
- Rate limiting

### Momento 3 (Scale)
- Microservicios (finanzas, CRM, messaging separados)
- Event-driven architecture
- Document DB para messages
- Workers para cálculos pesados

## 📝 Convenciones de Código

### Naming
```typescript
// Componentes
ExportedComponent.tsx (PascalCase)

// Funciones
getOrganizationMetrics() (camelCase)

// Tipos
interface ClientFormProps { }

// API routes
/api/clients/route.ts (lowercase, plural)
```

### Imports
```typescript
// Absolutos (pathAlias)
import { Button } from '@/components/ui/button'

// Relativos para locales
import { helper } from './utils'
```

### Error Handling
```typescript
// API
try {
  // operación
  return NextResponse.json(data)
} catch (error) {
  if (error instanceof ZodError) return 400
  return 500
}

// Frontend
try {
  const res = await fetch(...)
  if (!res.ok) throw new Error()
} catch (error) {
  console.error() // Log
  // User-facing error message
}
```

---

**Última actualización**: Abril 2026  
**Versión**: 0.1.0
