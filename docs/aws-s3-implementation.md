# Implémentation AWS S3 - Système de Téléchargement Sécurisé

## Vue d'ensemble

Ce document décrit l'implémentation complète du système de téléchargement sécurisé utilisant AWS S3 pour les fichiers audio (master WAV et stems ZIP) dans l'application Woodpecker Next.js.

## Architecture du Système

### 1. Stockage des Fichiers

#### Structure S3
```
woodpecker-beats/
├── masters/
│   └── {beatId}/
│       └── master.wav
└── stems/
    └── {beatId}/
        └── stems.zip
```

#### Configuration AWS
- **Bucket**: `loutsider-beats-storage-wesley-ajavon` (configuré via `AWS_S3_BUCKET_NAME`)
- **Région**: `us-east-1` (N.Virginia)
- **Permissions**: Accès privé avec URLs signées pour téléchargements sécurisés

### 2. Modèles de Données (Prisma)

#### Beat Model
```prisma
model Beat {
  id            String   @id @default(cuid())
  title         String
  s3MasterKey   String?  // Chemin S3 vers le fichier master
  s3StemsKey    String?  // Chemin S3 vers le fichier stems
  stemsUrl      String?  // URL publique des stems (legacy)
  // ... autres champs
}
```

#### OrderItem Model
```prisma
model OrderItem {
  id          String      @id @default(cuid())
  beatId      String
  beat        Beat        @relation(fields: [beatId], references: [id])
  licenseType LicenseType @default(WAV_LEASE)
  // ... autres champs
}
```

#### LicenseType Enum
```prisma
enum LicenseType {
  WAV_LEASE      // Accès uniquement au master WAV
  TRACKOUT_LEASE // Accès au master WAV + stems
  UNLIMITED_LEASE // Accès au master WAV + stems
}
```

## APIs de Téléchargement

### 1. API Single Beat Download
**Endpoint**: `POST /api/download/beat/[beatId]`

#### Fonctionnalités
- Génération d'URLs signées S3 sécurisées
- Vérification des permissions basée sur le type de licence
- Support des commandes simples et multi-items
- Expiration automatique des URLs (30 minutes)

#### Logique de Licence
```typescript
// Master WAV - toujours disponible
const masterUrl = generateSignedUrl(beat.s3MasterKey)

// Stems ZIP - seulement pour TRACKOUT_LEASE et UNLIMITED_LEASE
if (licenseType === 'TRACKOUT_LEASE' || licenseType === 'UNLIMITED_LEASE') {
  if (beat.s3StemsKey || beat.stemsUrl) {
    const stemsUrl = generateSignedUrl(beat.s3StemsKey)
  }
}
```

### 2. API Multi-Order Download
**Endpoint**: `POST /api/download/multi-order/[orderId]`

#### Fonctionnalités
- Génération d'URLs pour toutes les commandes multi-items
- Support des licences mixtes (différents types par beat)
- Vérification de l'email client pour sécurité

## Flux de Commande et Téléchargement

### 1. Processus de Commande

#### Étape 1: Création de Commande PENDING
```typescript
// Single Item
const pendingOrder = await prisma.order.create({
  data: {
    beatId,
    licenseType,
    status: 'PENDING',
    customerEmail
  }
})

// Multi Item
const pendingOrder = await prisma.multiItemOrder.create({
  data: {
    status: 'PENDING',
    customerEmail,
    items: {
      create: items.map(item => ({
        beatId: item.beatId,
        licenseType: item.licenseType
      }))
    }
  }
})
```

#### Étape 2: Redirection Stripe avec Metadata
```typescript
const session = await stripe.checkout.sessions.create({
  // ... configuration Stripe
  metadata: {
    order_id: pendingOrder.id,
    items: JSON.stringify(items) // Pour multi-items
  }
})
```

#### Étape 3: Webhook Stripe
```typescript
// Détection du type de commande
const isMultiItem = lineItems.length > 1 || fullSession.metadata?.order_id

if (isMultiItem) {
  await handleMultiItemOrder(fullSession)
} else {
  await handleSingleItemOrder(fullSession)
}
```

### 2. Mise à Jour du Statut

#### Single Item Order
```typescript
const order = await prisma.order.findFirst({
  where: {
    OR: [
      { id: orderId },
      { paymentId: sessionId }
    ]
  }
})

await prisma.order.update({
  where: { id: order.id },
  data: { 
    status: 'PAID',
    paymentId: sessionId 
  }
})
```

#### Multi Item Order
```typescript
const order = await prisma.multiItemOrder.findUnique({
  where: { id: orderId }
})

// Mise à jour des items avec leurs licenseType
const items = JSON.parse(fullSession.metadata?.items || '[]')
const updatedItems = items.map(item => ({
  beatId: item.beatId,
  licenseType: item.licenseType
}))

await prisma.multiItemOrder.update({
  where: { id: orderId },
  data: { 
    status: 'PAID',
    paymentId: sessionId,
    items: {
      deleteMany: {},
      create: updatedItems
    }
  }
})
```

## Interface Utilisateur

### 1. Page de Succès (`/success`)

#### Single Item Orders
```tsx
{downloadUrls.stems && (
  <Button asChild variant="secondary" className="w-full">
    <a href={downloadUrls.stems} download>
      <Download className="w-4 h-4 mr-2" />
      {t('success.downloadStems')}
    </a>
  </Button>
)}
```

#### Multi Item Orders
```tsx
{multiOrderDownloads.beats.map((beatDownload, index) => (
  <div key={index}>
    <h4>{beatDownload.beatTitle}</h4>
    
    {/* Master WAV */}
    <Button asChild variant="primary">
      <a href={beatDownload.downloadUrls.master} download>
        {t('success.downloadMaster')}
      </a>
    </Button>
    
    {/* Stems ZIP */}
    {beatDownload.downloadUrls.stems && (
      <Button asChild variant="secondary">
        <a href={beatDownload.downloadUrls.stems} download>
          {t('success.downloadStems')}
        </a>
      </Button>
    )}
  </div>
))}
```

## Sécurité et Bonnes Pratiques

### 1. URLs Signées S3
- **Expiration**: 30 minutes maximum
- **Permissions**: Lecture seule
- **Validation**: Vérification de l'email client et du statut de commande

### 2. Validation des Accès
```typescript
// Vérification de l'email
if (order.customerEmail !== customerEmail) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}

// Vérification du statut
if (order.status !== 'PAID') {
  return NextResponse.json({ error: 'Order not paid' }, { status: 403 })
}
```

### 3. Gestion des Erreurs
- Logs détaillés pour debugging
- Fallback vers URLs publiques si S3 échoue
- Messages d'erreur utilisateur-friendly

## Configuration Environnement

### Variables d'Environnement Requises
```env
# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=woodpecker-beats
AWS_S3_REGION=eu-west-3

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://...
```

## Migration et Déploiement

### 1. Migration de Base de Données
```bash
# Ajout du champ licenseType à OrderItem
npx prisma db push

# Suppression du champ licenseType de MultiItemOrder
npx prisma db push --accept-data-loss
```

### 2. Upload des Fichiers S3
```typescript
// Script de migration des fichiers existants
const uploadToS3 = async (beatId: string, filePath: string, type: 'master' | 'stems') => {
  const key = `${type}s/${beatId}/${type === 'master' ? 'master.wav' : 'stems.zip'}`
  
  await s3.upload({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: fs.createReadStream(filePath),
    ContentType: type === 'master' ? 'audio/wav' : 'application/zip'
  }).promise()
  
  // Mise à jour de la base de données
  await prisma.beat.update({
    where: { id: beatId },
    data: { [`s3${type.charAt(0).toUpperCase() + type.slice(1)}Key`]: key }
  })
}
```

## Monitoring et Logs

### 1. Logs de Debug
```typescript
console.log('🔍 License type:', licenseType)
console.log('🔍 Beat stems data:', beatWithStems)
console.log('✅ Stems URL generated:', downloadUrls.stems)
console.log('❌ No stems available for this beat')
```

### 2. Métriques Importantes
- Taux de succès des téléchargements
- Temps de génération des URLs signées
- Erreurs de permissions S3
- Utilisation des différents types de licence

## Tests et Validation

### 1. Tests de Licence
- ✅ WAV_LEASE: Seulement master WAV
- ✅ TRACKOUT_LEASE: Master WAV + stems ZIP
- ✅ UNLIMITED_LEASE: Master WAV + stems ZIP

### 2. Tests de Sécurité
- ✅ Validation de l'email client
- ✅ Vérification du statut de commande
- ✅ Expiration des URLs signées
- ✅ Accès refusé pour commandes non payées

## Problèmes Résolus

### 1. Problème Initial
- **Symptôme**: Seul le master WAV était disponible pour les licences UNLIMITED_LEASE
- **Cause**: L'API `/api/download/multi-order/[orderId]` ne générait pas les URLs stems
- **Solution**: Ajout de la génération d'URLs stems basée sur le type de licence

### 2. Problème de Webhook
- **Symptôme**: Commandes créées en fallback avec WAV_LEASE par défaut
- **Cause**: Le webhook ne trouvait pas les commandes PENDING existantes
- **Solution**: Création des commandes PENDING avant redirection Stripe + passage de l'order_id dans les métadonnées

### 3. Problème de Schema Prisma
- **Symptôme**: Erreurs de contrainte null sur licenseType
- **Cause**: licenseType était requis sur MultiItemOrder mais non fourni
- **Solution**: Déplacement de licenseType vers OrderItem avec valeur par défaut

## Améliorations Futures

### 1. Cache des URLs Signées
- Implémentation d'un cache Redis pour éviter la régénération fréquente
- Réduction de la latence pour les téléchargements répétés

### 2. Compression des Fichiers
- Compression automatique des stems ZIP
- Optimisation de la taille des fichiers master WAV

### 3. Analytics Avancées
- Tracking des téléchargements par type de licence
- Métriques d'utilisation des stems vs master uniquement
- Dashboard d'analytics pour les artistes

### 4. CDN Integration
- Distribution des fichiers via CloudFront
- Réduction de la latence mondiale
- Cache intelligent des fichiers audio

---

*Documentation mise à jour le: $(date)*
*Version: 1.0*
*Auteur: Assistant IA*
