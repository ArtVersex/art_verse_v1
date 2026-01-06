🎨 Aartverse
Where Artists Meet Collectors

Aartverse is a curated digital platform that connects independent artists with collectors and art lovers worldwide.
Discover original artworks, commission custom pieces, and engage directly with verified artists — all in one seamless experience.

🌐 Live Website: https://aartverse.com

🌟 Why Aartverse?

The art world is full of talent, yet:

Artists struggle to gain visibility

Collectors struggle to find authentic, original work

Commissions are often unstructured and opaque

Aartverse bridges this gap by creating a transparent, artist-first ecosystem that enables meaningful connections and trusted transactions.

✨ Key Features
🧑‍🎨 Artist-First Platform

Verified artist profiles

Detailed bios & artist statements

Portfolio galleries

Social media & contact links

Direct commission access

🖼️ Art Discovery & Sales

Curated artist pages

Clean, gallery-style artwork presentation

Optimized image loading for performance

Mobile-first responsive design

🎯 Commission Workflow

Structured commission request forms

Budget & vision capture

Email notifications to admins/artists

WhatsApp integration for instant communication

📩 Email & Notifications

SMTP-based transactional emails (Hostinger)

Order confirmations

Commission requests

Contact form submissions

Spam-safe setup (SPF / DKIM / DMARC)

📱 Modern UI / UX

Premium, minimal design

Tailwind CSS styling

Smooth transitions & micro-interactions

Fully responsive across devices

🛠️ Tech Stack
Frontend

Next.js (App Router)

React

Tailwind CSS

Lucide Icons

Backend & Services

Firebase Firestore – data storage

Next.js API Routes – serverless backend

SMTP (Hostinger) – email delivery

Deployment

Vercel – frontend + serverless APIs

🗂️ Project Structure
app/
├─ artists/
│  └─ [brandID]/          # Artist profile pages
├─ components/            # Reusable UI components
├─ api/
│  ├─ contact-email/      # Contact form email API
│  ├─ commission-email/   # Commission request email API
│  └─ order-email/        # Order confirmation email API
├─ about-us/
├─ contact-us/
└─ page.js

🔐 Environment Setup

Create a .env.local file in the root directory:

EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USER=contact@aartverse.com
EMAIL_PASS=your_password_here


⚠️ Important: Never commit .env.local to GitHub.

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/aartverse.git
cd aartverse

2️⃣ Install Dependencies
npm install

3️⃣ Run Locally
npm run dev


Visit 👉 http://localhost:3000

🧠 Design Philosophy

🎨 Artists First – creative freedom & visibility

🔍 Trust & Authenticity – verified profiles

🤝 Direct Connections – minimal middle layers

⚡ Scalable Architecture – built for growth

🖥️ Performance Focused – optimized images & rendering

🛣️ Roadmap

Planned & upcoming enhancements:

🔐 Artist authentication & dashboards

💳 Integrated payments (Card / UPI / Crypto)

📦 Order & commission tracking

⭐ Reviews & ratings

🧾 Artwork certificates & invoices

🌍 Multi-currency & localization

📊 Admin moderation tools

🤝 Contributing

Contributions, ideas, and feedback are welcome!

Fork the repository

Create a feature branch

Submit a pull request

Open issues for bugs or suggestions

📬 Contact

🌐 Website: https://aartverse.com

📧 Email: contact@aartverse.com

📄 License

This project is currently under a private / custom license.
For usage, collaboration, or commercial inquiries, please contact the owner.
