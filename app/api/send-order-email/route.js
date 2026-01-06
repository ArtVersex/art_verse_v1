import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

/* ✅ ARTISTIC EMAIL TEMPLATE - SPAM-SAFE */
function generateOrderEmail({
  userName,
  orderId,
  items,
  subtotal,
  deliveryAddress
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f8f9fa;font-family:'Segoe UI',Arial,sans-serif">
      <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#f8f9fa">
        <tr>
          <td align="center" style="padding:40px 20px">
            
            <!-- Main Container -->
            <table role="presentation" style="max-width:600px;width:100%;border-collapse:collapse;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08)">
              
              <!-- Header with Gradient -->
              <tr>
                <td style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:40px 30px;text-align:center">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:600;letter-spacing:-0.5px">
                    Aartverse
                  </h1>
                  <p style="margin:8px 0 0;color:#ffffff;font-size:14px;opacity:0.95">
                    Art that speaks to the soul
                  </p>
                </td>
              </tr>
              
              <!-- Thank You Section -->
              <tr>
                <td style="padding:40px 30px 20px">
                  <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:24px;font-weight:600">
                    Thank you, ${userName}!
                  </h2>
                  <p style="margin:0;color:#4a5568;font-size:16px;line-height:1.6">
                    Your order has been confirmed and our artisans are preparing your beautiful pieces.
                  </p>
                </td>
              </tr>
              
              <!-- Order Number Badge -->
              <tr>
                <td style="padding:0 30px 30px">
                  <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#f7fafc;border-radius:8px;border-left:4px solid #667eea">
                    <tr>
                      <td style="padding:16px 20px">
                        <p style="margin:0;color:#718096;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">
                          Order Number
                        </p>
                        <p style="margin:4px 0 0;color:#2d3748;font-size:18px;font-weight:600">
                          #${orderId}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Order Items -->
              <tr>
                <td style="padding:0 30px 20px">
                  <h3 style="margin:0 0 16px;color:#2d3748;font-size:18px;font-weight:600">
                    Your Order
                  </h3>
                  <table role="presentation" style="width:100%;border-collapse:collapse">
                    ${items.map((item, index) => `
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #e2e8f0">
                          <p style="margin:0;color:#2d3748;font-size:15px">
                            ${item.productName}
                          </p>
                          <p style="margin:4px 0 0;color:#718096;font-size:13px">
                            Quantity: ${item.quantity}
                          </p>
                        </td>
                        <td style="padding:12px 0;text-align:right;border-bottom:1px solid #e2e8f0">
                          <p style="margin:0;color:#2d3748;font-size:15px;font-weight:600">
                            $${item.price}
                          </p>
                        </td>
                      </tr>
                    `).join('')}
                    
                    <!-- Total -->
                    <tr>
                      <td style="padding:16px 0 0">
                        <p style="margin:0;color:#2d3748;font-size:17px;font-weight:600">
                          Total Amount
                        </p>
                      </td>
                      <td style="padding:16px 0 0;text-align:right">
                        <p style="margin:0;color:#667eea;font-size:20px;font-weight:700">
                          $${subtotal}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Delivery Address -->
              <tr>
                <td style="padding:20px 30px 30px">
                  <h3 style="margin:0 0 12px;color:#2d3748;font-size:18px;font-weight:600">
                    Delivery Address
                  </h3>
                  <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#f7fafc;border-radius:8px">
                    <tr>
                      <td style="padding:16px 20px">
                        <p style="margin:0;color:#2d3748;font-size:15px;line-height:1.7">
                          ${deliveryAddress.firstName} ${deliveryAddress.lastName}<br>
                          ${deliveryAddress.address}<br>
                          ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zipCode}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Next Steps -->
              <tr>
                <td style="padding:0 30px 40px">
                  <table role="presentation" style="width:100%;border-collapse:collapse;background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);border-radius:8px">
                    <tr>
                      <td style="padding:20px;text-align:center">
                        <p style="margin:0;color:#92400e;font-size:15px;line-height:1.6">
                          <strong>What's Next?</strong><br>
                          Our team will contact you shortly with delivery details and tracking information.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color:#f7fafc;padding:30px;text-align:center;border-top:1px solid #e2e8f0">
                  <p style="margin:0 0 8px;color:#718096;font-size:13px">
                    Have questions? We're here to help!
                  </p>
                  <p style="margin:0;color:#4a5568;font-size:13px">
                    &copy; ${new Date().getFullYear()} Aartverse. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function POST(req) {
  try {
    const body = await req.json();
    //console.log("📦 Email payload:", body);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.verify();
    console.log("✅ SMTP verified");

    const html = generateOrderEmail(body);

    await transporter.sendMail({
      from: `"Aartverse" <${process.env.EMAIL_USER}>`,
      to: [body.userEmail,`${process.env.EMAIL_USER}`],
      bcc: `"Aartverse" <${process.env.ADMIN_EMAIL}>`,
      subject: `Order Confirmation — #${body.orderId}`,
      html,
      // Anti-spam headers
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'Aartverse Order System'
      }
    });

    console.log("📤 Email sent");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 Email error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}