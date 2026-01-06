This README is:

Clear for recruiters / collaborators

Honest about current features

Scalable for future roadmap

Well-structured and modern

🎨 Aartverse

Aartverse is a curated digital platform that connects independent artists with collectors and art lovers.
It enables users to discover original artworks, purchase art, and commission custom pieces directly from verified artists — all in one seamless experience.

🌐 Live: https://aartverse.com

✨ Features
🧑‍🎨 Artist-Centric Platform

Artist profile pages with:

Biography & artist statement

Portfolio images

Social links

Contact & commission options

Verified artists for trust & authenticity

🖼️ Art Discovery & Sales

Browse artworks by artist

View detailed artwork listings

Clean, gallery-style product presentation

Optimized image handling for performance

🎯 Commission System

Commission request form per artist

Direct email notifications to admins/artists

WhatsApp integration for instant artist communication

Structured request flow (vision, budget, contact details)

📩 Email Notifications

SMTP-based email delivery (Hostinger)

Order confirmations

Commission request notifications

Contact form submissions

Spam-safe setup with SPF/DKIM/DMARC support

📱 Responsive & Modern UI

Fully responsive design (mobile-first)

Smooth transitions & micro-interactions

Clean typography and premium aesthetics

Built with Tailwind CSS

🛠️ Tech Stack
Frontend

Next.js (App Router)

React

Tailwind CSS

Lucide Icons

Backend / Services

Firebase Firestore – data storage

Next.js Server Actions & API Routes

SMTP (Hostinger) – transactional emails

Deployment

Vercel – frontend & serverless APIs

🧩 Project Structure
app/
├─ artists/
│  └─ [brandID]/        # Artist profile pages
├─ components/          # Reusable UI components
├─ api/
│  ├─ contact-email/    # Contact form email API
│  ├─ commission-email/ # Commission email API
│  └─ order-email/      # Order confirmation API
├─ about-us/
├─ contact-us/
└─ page.js

🔐 Environment Variables

Create a .env.local file:

EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USER=contact@aartverse.com
EMAIL_PASS=your_password_here


⚠️ Never commit .env.local to GitHub.

🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/your-username/aartverse.git
cd aartverse

2️⃣ Install dependencies
npm install

3️⃣ Run locally
npm run dev


Visit: http://localhost:3000

🧠 Design Philosophy

Artists first – visibility, storytelling, and fair access

Collectors second – trust, clarity, and authenticity

Minimal middle layers – direct communication wherever possible

Scalable architecture – ready for payments, dashboards, and growth

🛣️ Roadmap (Planned)

🔐 Artist authentication & dashboards

💳 Integrated payments (card / crypto)

📦 Order & commission tracking

⭐ Reviews & ratings

🧾 Invoices & artwork certificates

🌍 Multi-currency & localization

🤝 Contributing

Contributions are welcome!
Feel free to fork the repository, open issues, or submit pull requests.

📬 Contact

Website: https://aartverse.com

Email: contact@aartverse.com

📄 License

This project is currently under a private / custom license.
Please contact the owner for usage or collaboration permissions.
