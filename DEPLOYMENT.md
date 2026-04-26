# Humz - Guía de Deployment

## 🚀 Deployment en Vercel

Humz está optimizado para ser deployado en Vercel en minutos.

### Requisitos
- Repositorio GitHub
- Cuenta Vercel (gratis)
- Base de datos PostgreSQL (Supabase o Neon)

---

## Step 1: Preparar Base de Datos

### Opción A: Supabase (Recomendado)

1. **Crear proyecto**
   - Ir a https://supabase.com
   - Click en "New Project"
   - Nombre: `humz` (o tu preferencia)
   - Region: Más cercana a tus usuarios
   - Password: Guardar en lugar seguro

2. **Obtener connection string**
   - En Supabase dashboard: Settings → Database
   - Copiar "Connection string" → "URI"
   - Cambiar `[YOUR-PASSWORD]` por tu contraseña

3. **String de ejemplo**
   ```
   postgresql://postgres.[project-id].supabase.co:5432/postgres?password=YOUR-PASSWORD&sslmode=require
   ```

### Opción B: Neon

1. **Crear proyecto**
   - Ir a https://neon.tech
   - Click "Create project"
   - Nombre: `humz`
   - Region: Más cercana

2. **Obtener connection string**
   - Dashboard → Copy connection string
   - Guardará en `.env`

### Opción C: AWS RDS / Google Cloud SQL

Soportados pero requieren configuración adicional.

---

## Step 2: Preparar GitHub

### 1. Crear repositorio

```bash
cd /path/to/App\ Humz
git init
git add .
git commit -m "Initial Humz project - SaaS operating system"
```

### 2. Crear en GitHub

- Ir a https://github.com/new
- Nombre: `humz` (o `humz-app`)
- Descripción: "SaaS operating system for service businesses"
- Public o Private (recomendado Private para MVP)
- No inicializar con README (ya existe)
- Click "Create repository"

### 3. Pushear código

```bash
git branch -M main
git remote add origin https://github.com/TU-USUARIO/humz.git
git push -u origin main
```

Verificar que el código esté en GitHub:
```
https://github.com/TU-USUARIO/humz
```

---

## Step 3: Desplegar en Vercel

### 1. Conectar repositorio

- Ir a https://vercel.com/new
- Click "Import Project"
- Seleccionar repositorio `humz`
- Click "Import"

### 2. Configurar variables de entorno

En la página de configuración, agregarse bajo "Environment Variables":

```
DATABASE_URL = postgresql://[tu-connection-string]
NEXT_PUBLIC_DEFAULT_ORG_ID = org_test_123
```

**⚠️ Crítico**: La variable `DATABASE_URL` debe tener acceso desde Vercel.

#### Si usas Supabase
- En Supabase dashboard → Settings → Database
- Copiar "Connection string (URI)"

#### Si usas Neon
- En Neon dashboard → Connection String

### 3. Deploy

- Click "Deploy"
- Esperar 3-5 minutos
- Vercel asignará URL: `https://humz-[random].vercel.app`

---

## Step 4: Inicializar Base de Datos (Post-Deploy)

Después del primer deploy, necesitas crear el schema:

### Opción A: Desde tu máquina local

```bash
# 1. Asegurate de tener .env.local con DATABASE_URL

# 2. Aplicar schema
npm run db:push

# 3. (Opcional) Ver datos con Prisma Studio
npm run db:studio
# Abre http://localhost:5555
```

### Opción B: Desde Vercel CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Conectar a proyecto
vercel link

# 3. Ejecutar comando en serverless function
vercel run "npm run db:push"
```

**Nota**: El schema solo se crea UNA VEZ. Después, Vercel tendrá acceso automático.

---

## Step 5: Verificar Deployment

1. **Abrir aplicación**
   ```
   https://humz-[random].vercel.app/dashboard
   ```

2. **Verificar funcionalidad**
   - ✅ Dashboard carga
   - ✅ Tablas muestran datos (vacías al inicio)
   - ✅ Formularios funcionan
   - ✅ API responde

3. **Ver logs en Vercel**
   - Vercel Dashboard → [Tu proyecto] → Deployments
   - Logs de build y runtime

---

## 🔧 Configuración de Producción

### 1. Environment Variables en Vercel

```
VERCEL_ENV = production
DATABASE_URL = postgresql://... (de Supabase/Neon)
NEXT_PUBLIC_DEFAULT_ORG_ID = org_prod_xxx
NEXTAUTH_SECRET = [generar con openssl rand -base64 32]
NEXTAUTH_URL = https://humz-xxx.vercel.app
```

### 2. Optimizaciones para Producción

**Vercel detecta automáticamente**:
- ✅ Recompilación bajo demanda
- ✅ Caché de artefactos
- ✅ Imagen optimizada
- ✅ ISR (Incremental Static Regeneration)

**En Next.js (`next.config.js`)**:
```javascript
module.exports = {
  reactStrictMode: true,
  swcMinify: true,  // Minificación automática
}
```

### 3. Database Connection Pooling

Para producción con alto tráfico, usa Prisma with Supabase connection pooling:

En Supabase:
- Settings → Database → Pooler mode
- Cambiar de `Transaction` a `Session`

En Prisma schema:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DATABASE_DIRECT_URL")  // Para migraciones
}
```

---

## 📊 Monitoreo en Producción

### Vercel Analytics

Automáticamente habilitado:
- Web Vitals (LCP, FID, CLS)
- Performance by page
- Error logs

### Base de Datos

**Supabase Dashboard**:
- Query performance
- Storage usage
- Realtime subscriptions

**Neon Dashboard**:
- Query history
- Connection stats
- Performance graphs

### Errores

**Vercel Deployments → Logs**:
```
Build errors → Mostrados en la consola
Runtime errors → Capturados en /app/api y componentes
```

---

## 🔄 Actualizar Código

Para nuevas features o bugfixes:

```bash
# 1. Cambios locales
git add .
git commit -m "Descripción del cambio"

# 2. Push a GitHub
git push origin main

# 3. Vercel auto-deploy
# Vercel detecta push → builds automáticamente
# Nuevo deployment en 2-5 minutos
```

Para preview de cambios:
```bash
# Vercel automáticamente crea Preview Deployment
# URL: https://humz-git-branch-name.vercel.app
```

---

## 🗄️ Backups de Base de Datos

### Supabase

**Automático**:
- Backups diarios (7 días retenidos)
- Backups semanales (4 semanas)

**Manual**:
```bash
# Descargar backup
pg_dump -h db.xxx.supabase.co -U postgres humz > backup.sql
```

### Neon

**Automático**:
- Backups horarios (7 días)
- Point-in-time recovery (PITR)

---

## 🛡️ Seguridad para Producción

### 1. Variables Secretas

```bash
# Generar secretos
openssl rand -base64 32  # Para NEXTAUTH_SECRET

# En Vercel: Settings → Environment Variables
# Seleccionar "Encrypted" para variables sensibles
```

### 2. Database Firewall

**Supabase**:
- Settings → Database → Firewall Rules
- Whitelist solo IPs de Vercel (automático)

**Neon**:
- Settings → IP Whitelist
- Agregar rangos de Vercel

### 3. CORS

En `/api` routes, agregar headers:
```typescript
export async function GET(request: NextRequest) {
  // ... tu código
  
  const response = NextResponse.json(data)
  response.headers.set('Access-Control-Allow-Origin', 'https://humz-xxx.vercel.app')
  return response
}
```

### 4. Rate Limiting

Para prevenir abuso:
```typescript
// En /api routes (futuro)
import { Ratelimit } from "@upstash/ratelimit"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 h"),
})

const { success } = await ratelimit.limit("req")
if (!success) return new Response("Too Many Requests", { status: 429 })
```

---

## 🆘 Troubleshooting

### "Database connection refused"

**Síntomas**: Error en `/api/metrics`, `/api/clients`, etc.

**Soluciones**:
1. ✅ Verificar `DATABASE_URL` en `.env.local`
2. ✅ Verificar IP whitelist (Supabase/Neon)
3. ✅ Ejecutar `npm run db:push` localmente
4. ✅ Verificar password correcta

```bash
# Test conexión local
psql $DATABASE_URL
```

### "Vercel deployment fails"

**Build Error**:
```
npm run build
# Ejecutar localmente para ver error
```

**Soluciones comunes**:
- TypeScript errors → `npm run build`
- Missing dependencies → `npm install`
- Environment variables → Verificar en Vercel dashboard

### "Dashboard muestra datos vacíos"

**Esperado**: En primer deploy, todas las tablas están vacías.

**Solución**: Crear datos de prueba via API:
```bash
# POST /api/clients
{
  "name": "Cliente Test",
  "email": "test@example.com",
  "status": "LEAD"
}

# POST /api/transactions
{
  "type": "INCOME",
  "amount": 5000,
  "category": "Ventas",
  "transactionDate": "2026-04-25T00:00:00Z"
}
```

### "Prisma Studio no funciona en Vercel"

**Explicación**: Prisma Studio es herramienta local.

**Alternativa**: Usar SQL client directo:
```bash
# Supabase: SQL Editor en dashboard
# Neon: SQL Editor en dashboard
```

---

## 📋 Checklist de Deployment

- [ ] Base de datos creada (Supabase/Neon)
- [ ] CONNECTION_STRING copiado
- [ ] GitHub repo creado
- [ ] Código pusheado a `main`
- [ ] Vercel project creado
- [ ] Environment variables configuradas
- [ ] Primer deploy completado
- [ ] `npm run db:push` ejecutado
- [ ] Dashboard accesible
- [ ] Datos de prueba creados
- [ ] Formularios funcionan

---

## 🎯 URLs de Referencia

| Servicio | URL |
|----------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| GitHub | https://github.com |
| Supabase | https://supabase.com |
| Neon | https://neon.tech |
| Tu App | https://humz-[random].vercel.app |

---

## 📞 Soporte

- Vercel Issues: https://vercel.com/support
- Supabase Docs: https://supabase.com/docs
- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs

---

**Última actualización**: Abril 2026  
**Versión**: 0.1.0  
**Status**: Listo para production
