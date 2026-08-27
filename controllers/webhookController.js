import Order from "../models/Order.js";
import stripe from "../services/stripeService.js";

export const handleStripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Webhook signature verification failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const metadata = session.metadata || {};

            const items = JSON.parse(metadata.items || "[]");
            const address = JSON.parse(metadata.address || "{}");

            const existingOrder = await Order.findOne({
                stripeSessionId: session.id,
            });

            if (!existingOrder) {
                await Order.create({
                    id: "FS-" + String(Math.floor(100000 + Math.random() * 900000)),
                    stripeSessionId: session.id,
                    user: session.customer_email,
                    lines: items,
                    subtotal: Number(metadata.subtotal || 0),
                    discount: Number(metadata.discount || 0),
                    shipping: Number(metadata.shipping || 0),
                    total: Number(metadata.total || 0),
                    address,
                    status: "Paid",
                });

                console.log("Order created:", session.id);
            }
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return res.status(500).json({
            success: false,
            message: "Webhook processing failed",
        });
    }
};