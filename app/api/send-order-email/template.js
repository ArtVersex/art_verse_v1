export function generateOrderEmail({
  userName,
  orderId,
  items,
  subtotal,
  deliveryAddress
}) {
  return `
  <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; background:#ffffff; padding:24px; border-radius:12px">
    
    <h2 style="color:#4f46e5">Thank you for your order, ${userName}! 🎉</h2>

    <p>Your order <strong>#${orderId}</strong> has been successfully placed.</p>

    <hr style="margin:20px 0"/>

    <h3>🛒 Order Details</h3>

    <table width="100%" cellpadding="8" cellspacing="0">
      ${items
        .map(
          (item) => `
        <tr>
          <td>${item.product?.title}</td>
          <td align="right">₹${item.product?.price}</td>
        </tr>`
        )
        .join("")}
    </table>

    <hr />

    <p style="font-size:16px"><strong>Total:</strong> ₹${subtotal}</p>

    <hr style="margin:20px 0"/>

    <h3>📦 Delivery Address</h3>
    <p>
      ${deliveryAddress.firstName} ${deliveryAddress.lastName}<br/>
      ${deliveryAddress.address}<br/>
      ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.zipCode}
    </p>

    <div style="margin-top:30px; padding:16px; background:#f9fafb; border-radius:8px">
      <p>
        🎨 Our team will reach out to you shortly regarding your artwork and delivery.
      </p>
    </div>

    <p style="margin-top:30px; font-size:12px; color:#6b7280">
      © ${new Date().getFullYear()} Aartverse. All rights reserved.
    </p>
  </div>
  `;
}
