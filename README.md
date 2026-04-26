# Humz - Business Operating System

Sistema SaaS todo-en-uno para centralizar la operación de negocios de servicios y pequeñas empresas.

Combina **finanzas, CRM y comunicación** en una plataforma integrada.

## 🎯 Características Principales

### 1. **Dashboard**
- KPIs en tiempo real (ingresos, gastos, utilidad)
- Métricas de clientes y comunicación
- Gráficos de crecimiento y tendencias
- Tablas de actividad reciente

### 2. **Módulo Financiero**
- CRUD completo de transacciones
- Clasificación: Ingresos, Gastos, Costos
- Cálculo automático de utilidad
- Seguimiento por categoría

### 3. **CRM (Gestión de Clientes)**
- Pipeline visual con estados: Lead → Prospect → Cliente
- Gestión de contactos (email, teléfono)
- Relación con transacciones y mensajes
- Seguimiento de actividad por cliente

### 4. **Comunicación**
- Registro de mensajes (WhatsApp, Email, SMS)
- Cálculo de tiempo de respuesta
- Seguimiento de conversaciones
- Métricas de comunicación

### 5. **Multi-Tenant**
- Aislamiento completo de datos por organización
- Soporte para múltiples usuarios por organización
- Validación de permisos en backend

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 15 (App Router)
- **UI**: Shadcn/UI + Tailwind CSS
- **Backend**: API Routes de Next.js
- **Database**: PostgreSQL (Supabase o Neon)
- **ORM**: Prisma
- **Charts**: Recharts
- **Deployment**: Vercel

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- PostgreSQL (local o en la nube)
- Cuenta en Vercel (para deployment)

## 🛠️ Instalación Local

### 1. Clonar y preparar el proyecto

```bash
cd "App Humz"
npm install
```

### 2. Configurar base de datos

Crear `.env.local` con tu conexión PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/humz"
NEXT_PUBLIC_DEFAULT_ORG_ID="org_test_123"
```

#### Opción A: Supabase (Recomendado)
1. Crear proyecto en https://supabase.com
2. Copiar `Project URL` (como `postgresql://...`)
3. Crear `.env.local` con `DATABASE_URL`

#### Opción B: Neon
1. Crear proyecto en https://neon.tech
2. Copiar connection string
3. Crear `.env.local` con `DATABASE_URL`

#### Opción C: PostgreSQL Local
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15
psql postgres
CREATE DATABASE humz;

# Linux
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb humz

# Windows (usando WSL o Docker)
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=humz -p 5432:5432 -d postgres:15
```

### 3. Crear schema de base de datos

```bash
npm run db:push
```

Esto aplica el schema Prisma a tu base de datos.

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

Acceder a http://localhost:3000/dashboard

## 📦 Estructura del Proyecto

```
.
├── app/
│   ├── api/                    # API Routes
│   │   ├── clients/
│   │   ├── transactions/
│   │   ├── messages/
│   │   └── metrics/
│   ├── dashboard/              # App layout y páginas
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── clients/
│   │   ├── finances/
│   │   └── messages/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   └── select.tsx
│   ├── layout/                 # Sidebar y Topbar
│   ├── dashboard/              # Dashboard components
│   ├── crm/                    # Componentes de clientes
│   ├── finances/               # Componentes de finanzas
│   └── messaging/              # Componentes de mensajes
├── lib/
│   ├── prisma.ts              # Cliente Prisma
│   ├── auth.ts                # Utilidades de autenticación
│   └── utils.ts               # Utilidades (cn, etc)
├── prisma/
│   └── schema.prisma          # Schema de base de datos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── postcss.config.js
```

## 🗄️ Schema de Base de Datos

### Users (Usuarios)
```sql
CREATE TABLE users (
  id STRING PRIMARY KEY,
  email STRING UNIQUE,
  name STRING,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Organizations (Organizaciones)
```sql
CREATE TABLE organizations (
  id STRING PRIMARY KEY,
  name STRING,
  ownerId STRING (FK users),
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Clients (Clientes)
```sql
CREATE TABLE clients (
  id STRING PRIMARY KEY,
  organizationId STRING (FK organizations),
  name STRING,
  email STRING,
  phone STRING,
  status ENUM (LEAD, PROSPECT, CLIENT, INACTIVE),
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Messages (Mensajes)
```sql
CREATE TABLE messages (
  id STRING PRIMARY KEY,
  organizationId STRING (FK organizations),
  clientId STRING (FK clients),
  channel ENUM (WHATSAPP, EMAIL, SMS, OTHER),
  direction ENUM (INBOUND, OUTBOUND),
  content STRING,
  createdAt DATETIME
);
```

### FinancialTransactions (Transacciones)
```sql
CREATE TABLE financial_transactions (
  id STRING PRIMARY KEY,
  organizationId STRING (FK organizations),
  clientId STRING (FK clients, NULLABLE),
  type ENUM (INCOME, EXPENSE, COST),
  amount DECIMAL,
  category STRING,
  description STRING,
  transactionDate DATETIME,
  createdAt DATETIME
);
```

## 🔌 API Endpoints

### Clientes
```
GET    /api/clients           # Listar clientes
POST   /api/clients           # Crear cliente

Request body:
{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "+1234567890",
  "status": "LEAD"
}
```

### Transacciones
```
GET    /api/transactions      # Listar transacciones
POST   /api/transactions      # Crear transacción

Request body:
{
  "type": "INCOME",
  "amount": 5000,
  "category": "Ventas",
  "description": "Pago cliente XYZ",
  "transactionDate": "2026-04-25T00:00:00Z",
  "clientId": null
}
```

### Mensajes
```
GET    /api/messages          # Listar mensajes
POST   /api/messages          # Crear mensaje

Request body:
{
  "clientId": "cli_123",
  "channel": "WHATSAPP",
  "direction": "INBOUND",
  "content": "Hola, tengo una pregunta..."
}
```

### Métricas
```
GET    /api/metrics           # Obtener métricas del mes

Response:
{
  "monthlyRevenue": 25000,
  "monthlyExpenses": 8000,
  "monthlyProfit": 17000,
  "totalClients": 45,
  "newClientsThisMonth": 12,
  "averageResponseTime": 24.5
}
```

## 🔐 Autenticación (MVP)

Para MVP, el sistema usa un org ID simulado. En producción:

1. **Integrar NextAuth.js**:
```bash
npm install next-auth
```

2. **Configurar proveedores** (GitHub, Google, Email)

3. **Actualizar `lib/auth.ts`** para obtener usuario y organización desde sesión

Referencia: https://next-auth.js.org/

## 📊 Ejemplos de Uso

### Crear una transacción
```javascript
const response = await fetch('/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'INCOME',
    amount: 10000,
    category: 'Servicios',
    transactionDate: new Date().toISOString(),
  })
})
const transaction = await response.json()
```

### Crear un cliente
```javascript
const response = await fetch('/api/clients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Cliente Nuevo',
    email: 'cliente@ejemplo.com',
    status: 'LEAD'
  })
})
const client = await response.json()
```

### Registrar un mensaje
```javascript
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clientId: 'cli_123',
    channel: 'WHATSAPP',
    direction: 'INBOUND',
    content: 'Mensaje del cliente'
  })
})
const message = await response.json()
```

## 🚀 Deployment en Vercel

### 1. Preparar GitHub
```bash
git add .
git commit -m "Initial Humz project"
git branch -M main
git remote add origin https://github.com/usuario/humz.git
git push -u origin main
```

### 2. Deploy en Vercel
1. Ir a https://vercel.com/new
2. Seleccionar repositorio GitHub
3. Configurar variables de entorno:
   - `DATABASE_URL` (de Supabase/Neon)
   - `NEXT_PUBLIC_DEFAULT_ORG_ID`
4. Click en "Deploy"

### 3. Setup de base de datos en producción
```bash
# Local: ejecutar migraciones después de deployment
npm run db:push
```

## 🔄 Próximos Pasos (Roadmap)

### Fase 1 (Actual)
- ✅ MVP con módulos básicos
- ✅ Dashboard con KPIs
- ✅ API funcionales
- ✅ Diseño SaaS moderno

### Fase 2
- [ ] Autenticación completa (NextAuth)
- [ ] Integración Stripe para pagos
- [ ] Webhooks desde Invent
- [ ] Importación de datos

### Fase 3
- [ ] Integración WhatsApp API
- [ ] Automatización de workflows
- [ ] Reportes avanzados
- [ ] Mobile app

### Fase 4
- [ ] AI para análisis de conversaciones
- [ ] Predicción de churn
- [ ] Optimización de precios
- [ ] Marketplace de integraciones

## 📚 Documentación Adicional

### Prisma Studio (Ver base de datos)
```bash
npm run db:studio
```
Abre interfaz en http://localhost:5555

### Regenerar cliente Prisma
```bash
npm run db:generate
```

### Troubleshooting

**Error: "Cannot find module '@prisma/client'"**
```bash
npm run db:generate
```

**Error: Database connection failed**
- Verificar `DATABASE_URL` en `.env.local`
- Confirmar que PostgreSQL está corriendo
- Verificar credenciales

**Error: "P1001 Can't reach database"**
- Supabase: verificar IP está whitelisted
- Neon: verificar connection string
- Local: `brew services start postgresql@15` (macOS)

## 📞 Soporte

Para reportar bugs o sugerir features, crear issue en el repositorio.

## 📄 Licencia

MIT

---

**Versión**: 0.1.0  
**Última actualización**: Abril 2026  
**Estado**: MVP en desarrollo
