# Prisma Migrations

Ce dossier contient les migrations de base de données générées par Prisma.

## 📝 **Qu'est-ce qu'une migration ?**

Une migration Prisma est un fichier SQL qui décrit les changements à apporter à votre schéma de base de données. Chaque migration contient :

- **Up** : Les commandes SQL pour appliquer les changements
- **Down** : Les commandes SQL pour annuler les changements

## 🚀 **Commandes de migration**

### **Créer une nouvelle migration**
```bash
npx prisma migrate dev --name "add_new_field"
```

### **Appliquer les migrations en production**
```bash
npx prisma migrate deploy
```

### **Réinitialiser la base de données**
```bash
npx prisma migrate reset
```

### **Voir l'état des migrations**
```bash
npx prisma migrate status
```

## 📋 **Bonnes pratiques**

1. **Nommage** : Utilisez des noms descriptifs pour vos migrations
2. **Tests** : Testez toujours vos migrations en développement
3. **Backup** : Sauvegardez votre base avant d'appliquer des migrations en production
4. **Révision** : Vérifiez le SQL généré avant de l'appliquer

## 🔄 **Workflow de développement**

1. Modifiez votre `schema.prisma`
2. Créez une migration : `npx prisma migrate dev`
3. Testez votre application
4. Si tout fonctionne, commitez la migration
5. En production, appliquez avec : `npx prisma migrate deploy`

## 🚨 **En cas de problème**

### **Migration échouée**
```bash
# Vérifiez le statut
npx prisma migrate status

# Réinitialisez si nécessaire
npx prisma migrate reset
```

### **Conflit de migration**
```bash
# Résolvez les conflits manuellement
# Puis appliquez
npx prisma migrate resolve --applied "migration_name"
```

---

**Note** : Ne modifiez jamais manuellement les fichiers de migration générés par Prisma !
