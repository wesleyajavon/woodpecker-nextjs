#!/bin/bash

# 🗄️ Script de configuration de la base de données Woodpecker Beats
# Ce script automatise la configuration initiale de PostgreSQL et Prisma

set -e

echo "🚀 Configuration de la base de données Woodpecker Beats"
echo "=================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Node.js et npm sont installés"

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé à partir de .env.example"
        echo "⚠️  N'oubliez pas de configurer votre DATABASE_URL dans .env"
    else
        echo "❌ Fichier .env.example introuvable"
        exit 1
    fi
else
    echo "✅ Fichier .env existe déjà"
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo "✅ Dépendances installées"
else
    echo "✅ Dépendances déjà installées"
fi

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npm run db:generate
echo "✅ Client Prisma généré"

# Vérifier la connexion à la base de données
echo "🔍 Test de la connexion à la base de données..."
if npm run db:push --silent; then
    echo "✅ Connexion à la base de données réussie"
else
    echo "❌ Échec de la connexion à la base de données"
    echo "⚠️  Vérifiez votre DATABASE_URL dans le fichier .env"
    echo "📚 Consultez DATABASE.md pour plus d'informations"
    exit 1
fi

# Peupler la base avec des données de test
echo "🌱 Peuplement de la base avec des données de test..."
if npm run db:seed --silent; then
    echo "✅ Base de données peuplée avec succès"
else
    echo "⚠️  Échec du peuplement de la base (peut être normal si déjà peuplée)"
fi

echo ""
echo "🎉 Configuration terminée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifiez que votre base de données est bien configurée"
echo "2. Lancez l'application : npm run dev"
echo "3. Ouvrez Prisma Studio : npm run db:studio"
echo ""
echo "📚 Documentation : DATABASE.md"
echo "🔧 Prisma Studio : http://localhost:5555"
echo "🌐 Application : http://localhost:3000"
