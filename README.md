# 🌍 AFRICONNECT - AI-Powered African Travel Platform

AFRICONNECT is an AI-powered platform connecting the international community (UN employees, diplomats, NGO staff, and expats) to authentic local tourism businesses across Africa, while also bridging these businesses with travel influencers for strategic collaborations.

## 🎯 Mission

To make authentic African travel more accessible and profitable by empowering verified local businesses with AI tools, global visibility, and seamless collaborations — while ensuring travelers and influencers can trust and transact with confidence.

## 🧩 Platform Structure

AFRICONNECT operates as two integrated marketplaces powered by AI:

### 1. 🌐 Traveler ↔ Local Business Marketplace
- **AI-Powered Trip Discovery**: Generate personalized itineraries based on preferences
- **Business Verification System**: Multi-step verification for trust and safety
- **Secure Booking & Payments**: Stripe Connect with escrow functionality (15% commission)
- **AI Setup Wizard**: Help businesses create optimized listings

### 2. 🎥 Influencer ↔ Business Collaboration Hub
- **Campaign Creation**: Influencers post collaboration opportunities
- **AI-Driven Projections**: Predict reach, engagement, ROI, and fair pricing
- **Business Applications**: AI-generated insights for better matches
- **Secure Collaborations**: Escrow payments with 12% commission

## 🚀 Key Features

### For Travelers
- 🧭 AI-powered trip planning with personalized itineraries
- ✅ Verified local businesses with trust scores
- 💳 Secure payments held in escrow
- 🌍 Authentic African experiences

### For Businesses
- 🤖 AI listing optimization and content generation
- 📊 Business analytics and performance insights
- 📱 Influencer collaboration opportunities
- ✅ Verification badge for increased visibility

### For Influencers
- 📈 AI campaign projections (reach, engagement, ROI)
- 💰 Fair pricing recommendations
- 🤝 Business partnership opportunities
- 📊 Performance analytics

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** with TypeScript and App Router
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Clerk** for authentication

### Backend
- **Next.js API Routes** for RESTful endpoints
- **Prisma** ORM with PostgreSQL
- **Stripe Connect** for payments and escrow
- **OpenAI GPT-4** for AI features

### AI Service
- **Python FastAPI** microservice
- **OpenAI API** for text generation
- **Custom ML models** for campaign projections
- **LangChain** for complex AI workflows

### Database
- **PostgreSQL** via Supabase
- Comprehensive schema with all entities
- Real-time data synchronization

### Storage & Media
- **AWS S3** or **Supabase Storage** for media files
- **CDN delivery** for optimized performance

## 📊 Database Schema

### Core Entities
- **Users**: Travelers, businesses, influencers, admins
- **Businesses**: Local tourism businesses with verification
- **Listings**: Tours, experiences, and services
- **Bookings**: Traveler-business transactions
- **Campaigns**: Influencer collaboration opportunities
- **Applications**: Business applications to campaigns
- **Verifications**: Business verification documents
- **AIAnalyses**: AI-generated content and insights
- **Reviews**: Post-trip reviews and ratings

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL database
- Stripe account
- OpenAI API key
- Clerk account

### Frontend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Fill in your API keys and database URL

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### AI Service Setup
```bash
cd ai-service

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Fill in your OpenAI API key

# Start AI service
python main.py
```

### Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

## 🔑 Environment Variables

### Frontend (.env.local)
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/africonnect"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# AI Service
AI_SERVICE_URL=http://localhost:8000

# Storage
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### AI Service (.env)
```env
OPENAI_API_KEY=your_openai_api_key
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Fly.io)
1. Install Fly CLI
2. Run `fly launch` in the project directory
3. Set environment variables with `fly secrets set`
4. Deploy with `fly deploy`

### AI Service (Fly.io)
1. Navigate to ai-service directory
2. Run `fly launch`
2. Set OpenAI API key with `fly secrets set OPENAI_API_KEY=your_key`
3. Deploy with `fly deploy`

### Database (Supabase)
1. Create new Supabase project
2. Get connection string from project settings
3. Update DATABASE_URL in environment variables

## 📱 API Endpoints

### Authentication
- `POST /api/auth/webhook` - Clerk webhook handler

### Users
- `GET /api/users` - Get current user
- `PUT /api/users` - Update user profile

### Businesses
- `GET /api/businesses` - List businesses with filters
- `POST /api/businesses` - Create new business

### Listings
- `GET /api/listings` - List experiences with filters
- `POST /api/listings` - Create new listing

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking

### AI Services
- `POST /api/ai/generate-itinerary` - Generate AI itineraries
- `POST /api/ai/optimize-listing` - Optimize business listings

### Stripe
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `POST /api/stripe/complete-booking` - Complete booking

## 🧠 AI Features

### Trip Planning
- Analyzes traveler preferences
- Matches with verified local businesses
- Generates 2-3 complete itinerary options
- Includes accommodation, activities, meals, transport

### Business Optimization
- Generates polished titles and descriptions
- Suggests dynamic pricing based on regional data
- Creates hashtags and social media templates
- Provides content ideas for marketing

### Campaign Projections
- Predicts reach and engagement rates
- Estimates booking conversions
- Suggests fair collaboration pricing
- Analyzes influencer-business fit

## 💰 Monetization

- **15% commission** on traveler bookings
- **12% commission** on influencer collaborations
- No subscription fees or hidden costs
- Revenue only from successful transactions

## 🔒 Security & Trust

- **Business Verification**: Multi-step verification process
- **Payment Protection**: Escrow system holds funds until completion
- **Trust Scores**: Calculated from reviews and completion rates
- **Verified Badges**: Boost visibility for verified businesses

## 🌍 Target Users

### Travelers
- UN employees and diplomats
- NGO workers and volunteers
- International expats
- High-value travelers seeking authentic experiences

### Businesses
- Safari companies and lodges
- Tour operators and guides
- Restaurants and cultural centers
- Adventure and activity providers

### Influencers
- Travel influencers (5K-200K followers)
- Content creators focused on Africa
- Micro and mid-tier influencers
- Authentic storytellers

## 📈 Future Roadmap

- **Mobile App**: Native iOS and Android applications
- **Advanced Analytics**: Tourism intelligence for governments
- **Multi-language Support**: Local language interfaces
- **Blockchain Integration**: Enhanced trust and transparency
- **AR/VR Experiences**: Virtual previews of experiences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

- Email: support@africonnect.com
- Documentation: [docs.africonnect.com](https://docs.africonnect.com)
- Community: [community.africonnect.com](https://community.africonnect.com)

---

**AFRICONNECT** - Connecting the world to authentic African experiences through AI-powered technology. 🌍✨
