import Stripe from 'stripe'

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

// Helper function to create a test product
export async function createTestProduct() {
  try {
    // Create a test product
    const product = await stripe.products.create({
      name: 'Test Beat - Midnight Trap',
      description: 'A test beat product for development purposes',
      metadata: {
        genre: 'Trap',
        bpm: '140',
        key: 'C#',
        duration: '3:24',
      },
    })

    // Create a price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2999, // $29.99 in cents
      currency: 'eur',
      metadata: {
        product_id: product.id,
      },
    })

    console.log('✅ Test product created:', {
      productId: product.id,
      priceId: price.id,
      name: product.name,
      price: `€${(price.unit_amount! / 100).toFixed(2)}`,
    })

    return { product, price }
  } catch (error) {
    console.error('❌ Error creating test product:', error)
    throw error
  }
}

// Helper function to list all products
export async function listProducts() {
  try {
    const products = await stripe.products.list({
      limit: 100,
    })

    return products.data
  } catch (error) {
    console.error('❌ Error listing products:', error)
    throw error
  }
}

// Helper function to get a product by ID
export async function getProduct(productId: string) {
  try {
    const product = await stripe.products.retrieve(productId)
    return product
  } catch (error) {
    console.error('❌ Error retrieving product:', error)
    throw error
  }
}

// Helper function to create a checkout session
export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        price_id: priceId,
      },
    })

    return session
  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    throw error
  }
}
