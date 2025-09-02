import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { OrderService } from "../../src/services/orderService";
import { BeatService } from "../../src/services/beatService";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
  })

// Stripe requires the raw body to verify the signature
export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = async (req: NextApiRequest) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("PaymentIntent succeeded:", paymentIntent.id);
      break;
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout session completed:", session.id);
      
      try {
        // Retrieve the full session details from Stripe
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'line_items.data.price.product']
        });

        if (!fullSession.line_items?.data[0]) {
          console.error('No line items found in session:', session.id);
          break;
        }

        const lineItem = fullSession.line_items.data[0];
        const price = lineItem.price;
        const product = price?.product;

        if (!product || typeof product === 'string' || product.deleted) {
          console.error('Invalid or deleted product data in session:', session.id);
          break;
        }

        // Get the beat ID from the product metadata
        console.log('Product metadata:', product.metadata);
        const beatId = product.metadata?.beat_id;
        if (!beatId) {
          console.error('No beat_id found in product metadata:', product.id);
          console.error('Available metadata keys:', Object.keys(product.metadata || {}));
          break;
        }
        
        console.log('Found beat_id:', beatId);

        // Get the beat details
        const beat = await BeatService.getBeatById(beatId);
        if (!beat) {
          console.error('Beat not found:', beatId);
          break;
        }

        // Create the order in the database
        const orderData = {
          customerEmail: fullSession.customer_email || fullSession.customer_details?.email || 'unknown@example.com',
          customerName: fullSession.customer_details?.name || undefined,
          customerPhone: fullSession.customer_details?.phone || undefined,
          totalAmount: (fullSession.amount_total || 0) / 100, // Convert from cents
          currency: fullSession.currency?.toUpperCase() || 'EUR',
          paymentMethod: 'card',
          paymentId: session.id,
          licenseType: beat.isExclusive ? 'EXCLUSIVE' as const : 'NON_EXCLUSIVE' as const,
          usageRights: beat.isExclusive 
            ? ['Exclusive rights', 'Commercial use', 'Streaming', 'Distribution']
            : ['Non-exclusive rights', 'Commercial use', 'Streaming'],
          beatId: beatId
        };

        const order = await OrderService.createOrder(orderData);
        console.log('Order created successfully:', order.id);

      } catch (error) {
        console.error('Error processing checkout session:', error);
      }
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
