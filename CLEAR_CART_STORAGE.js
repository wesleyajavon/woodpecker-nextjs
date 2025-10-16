// Script pour nettoyer le localStorage depuis la console du navigateur
// Copiez-collez ce code dans la console de votre navigateur

console.log('🧹 Nettoyage du localStorage du panier...')

// Vérifier l'état actuel
const oldCart = localStorage.getItem('loutsider-cart')
const newCart = localStorage.getItem('loutsider-cart-zustand')

console.log('État avant nettoyage:')
console.log('- Ancien système:', oldCart ? 'Présent' : 'Absent')
console.log('- Nouveau système:', newCart ? 'Présent' : 'Absent')

if (oldCart) {
  console.log('Données ancien système:', JSON.parse(oldCart))
}

if (newCart) {
  console.log('Données nouveau système:', JSON.parse(newCart))
}

// Nettoyer
localStorage.removeItem('loutsider-cart')
localStorage.removeItem('loutsider-cart-zustand')

console.log('✅ localStorage nettoyé!')
console.log('Rechargez la page pour voir les changements.')
