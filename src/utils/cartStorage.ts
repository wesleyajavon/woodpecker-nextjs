// Utilitaire pour nettoyer le localStorage en cas de conflit
export function clearCartStorage() {
  if (typeof window !== 'undefined') {
    // Nettoyer les deux clés possibles
    localStorage.removeItem('loutsider-cart') // Ancien système
    localStorage.removeItem('loutsider-cart-zustand') // Nouveau système (si utilisé)
    
    console.log('Cart storage cleared')
  }
}

// Utilitaire pour vérifier l'état du localStorage
export function checkCartStorage() {
  if (typeof window !== 'undefined') {
    const oldCart = localStorage.getItem('loutsider-cart')
    const newCart = localStorage.getItem('loutsider-cart-zustand')
    
    console.log('Old cart storage:', oldCart ? 'exists' : 'empty')
    console.log('New cart storage:', newCart ? 'exists' : 'empty')
    
    return { oldCart: !!oldCart, newCart: !!newCart }
  }
  return { oldCart: false, newCart: false }
}

// Utilitaire pour migrer les données de l'ancien vers le nouveau système
export function migrateCartData() {
  if (typeof window !== 'undefined') {
    try {
      const oldCartData = localStorage.getItem('loutsider-cart')
      if (oldCartData) {
        const parsed = JSON.parse(oldCartData)
        if (parsed && Array.isArray(parsed.items)) {
          // Sauvegarder dans le nouveau format Zustand
          const newCartData = {
            state: {
              items: parsed.items,
              totalItems: parsed.totalItems || 0,
              totalPrice: parsed.totalPrice || 0,
              isOpen: false
            },
            version: 0
          }
          localStorage.setItem('loutsider-cart-zustand', JSON.stringify(newCartData))
          console.log('Cart data migrated successfully')
          return true
        }
      }
    } catch (error) {
      console.error('Error migrating cart data:', error)
    }
  }
  return false
}
