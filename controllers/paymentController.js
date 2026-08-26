import stripe from "../services/stripeService.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const {
      items,
      email,
      shippingAddress,
      discount,
      couponCode,
      shipping,
      wrapCost,
      total,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    let calculatedDiscount = 0;

    if (couponCode === "FASCO10") {
      calculatedDiscount = subtotal * 0.1;
    } else if (couponCode === "FASCO20") {
      calculatedDiscount = subtotal * 0.2;
    }

    const calculatedTotal =
      Math.max(0, subtotal - calculatedDiscount) +
      Number(shipping || 0) +
      Number(wrapCost || 0);

    const frontendTotal = Number(total || 0);

    if (Math.abs(calculatedTotal - frontendTotal) > 0.01) {
      return res.status(400).json({
        success: false,
        message: "Order total mismatch. Please refresh and try again.",
      });
    }
    const discountRate =
      couponCode === "FASCO10"
        ? 0.1
        : couponCode === "FASCO20"
          ? 0.2
          : 0;

    const lineItems = items.map((item) => {
      const originalPrice = Number(item.price);

      const discountedPrice = originalPrice * (1 - discountRate);

      return {
        price_data: {
          currency: "usd",

          product_data: {
            name: item.name,
          },

          unit_amount: Math.round(discountedPrice * 100),
        },

        quantity: Number(item.quantity),
      };
    });
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    if (wrapCost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Gift Wrap",
          },
          unit_amount: Math.round(wrapCost * 100),
        },
        quantity: 1,
      });
    }


    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: lineItems,

      customer_email: email,
      metadata: {
        items: JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            name: item.name,
            qty: item.quantity,
            price: Number(item.price),
          }))
        ),

        address: JSON.stringify(shippingAddress || {}),

        subtotal: String(subtotal),
        discount: String(calculatedDiscount),
        couponCode: couponCode || "",
        shipping: String(shipping || 0),
        wrapCost: String(wrapCost || 0),
        total: String(calculatedTotal),
      },

      success_url: "https://fasco-frontend-theta.vercel.app/payment-success",
      cancel_url: "https://fasco-frontend-theta.vercel.app/payment-cancelled",
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create Stripe checkout session",
    });
  }
};
export const getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return res.status(200).json({
      success: true,
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total / 100,
        currency: session.currency,
        metadata: session.metadata,
      },
    });
  } catch (error) {
    console.error("Get Checkout Session Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve payment details",
    });
  }
};