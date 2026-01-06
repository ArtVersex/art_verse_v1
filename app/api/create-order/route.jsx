import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount, currency = 'INR' } = req.body;
      
      const order = await razorpay.orders.create({
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
      });

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}