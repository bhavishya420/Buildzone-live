# BuildZone - Construction Materials B2B Platform

A comprehensive B2B platform for construction materials dealers with AI-powered reorder management, voice ordering, and credit management features.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project setup

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhavishya420/BuildZone---Rocket.git
   cd BuildZone---Rocket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   ```env
   # Required - Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Required - OpenAI (for voice transcription)
   VITE_OPENAI_API_KEY=your_openai_api_key

   # Optional - ElevenLabs (alternative STT provider)
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   STT_PROVIDER=whisper  # or "elevenlabs"

   # Required - Security
   SEED_TOKEN=your_secure_seed_token_for_demo_data
   ```

4. **Database Setup**
   Run the initial schema migration in your Supabase SQL Editor:
   ```sql
   -- Copy and run the contents of migrations/initial_schema.sql
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`

## 📊 Demo Data Setup

### Option 1: API Endpoint (Recommended)
```bash
curl -H "x-seed-token: YOUR_SEED_TOKEN" http://localhost:3000/api/seed-demo
```

### Option 2: Node Script
```bash
npm run seed-demo
```

### Option 3: Manual SQL
Update `migrations/seed_demo.sql` with actual user UUIDs after signup, then run in Supabase SQL Editor.

## 🧪 Testing the Platform

### 1. Voice Ordering Test
1. Open the app and click the microphone button
2. Record: *"आधा इंच पीवीसी पाइप 50 पीस"* or *"10 bags cement needed"*
3. Transcription should appear with product search results
4. Verify products match your voice query

### 2. Reorder Agent Test
```bash
curl -X POST http://localhost:3000/api/run-reorder \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_UUID_FROM_DEMO_DATA"}'
```

### 3. Draft Order Workflow Test
1. Run reorder agent (creates draft orders)
2. Check suggested orders in dashboard
3. Confirm draft order:
```bash
curl -X POST http://localhost:3000/api/confirm-draft \
  -H "Content-Type: application/json" \
  -d '{"orderId": "DRAFT_ORDER_UUID"}'
```

## 📁 Project Structure

```
├── migrations/                 # Database migrations
│   ├── initial_schema.sql     # Complete database schema
│   └── seed_demo.sql          # Demo data with placeholders
├── scripts/
│   └── seed-demo.js           # Node.js seeding script
├── api/                       # Serverless API routes
│   ├── transcribe.js          # Voice transcription endpoint
│   ├── run-reorder.js         # Reorder agent execution
│   ├── confirm-draft.js       # Draft order confirmation
│   └── seed-demo.js           # Demo data seeding API
├── src/
│   ├── components/            # React components
│   ├── services/              # API service layers
│   ├── pages/                 # Application pages
│   └── lib/                   # Supabase client
└── README.md                  # You are here!
```

## 🎛️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed-demo` - Seed demo data via Node script

## 🔊 Voice Features

### Supported Speech-to-Text Providers
- **OpenAI Whisper** (default) - Requires `VITE_OPENAI_API_KEY`
- **ElevenLabs STT** (optional) - Set `STT_PROVIDER=elevenlabs` and `ELEVENLABS_API_KEY`

### Language Support
- English and Hindi voice commands supported
- Automatic language detection
- Construction materials terminology optimized

## 🤖 AI Agent Features

### Reorder Agent
- Analyzes order history and current inventory
- Calculates average daily consumption
- Suggests optimal reorder quantities
- Creates draft orders automatically

### Server-side Operations
All AI agent operations use `SUPABASE_SERVICE_ROLE_KEY` for security:
- ✅ Suggested orders creation
- ✅ Agent logs insertion  
- ✅ Draft order management
- ✅ Inventory analysis

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Service role key** for server-side operations only
- **Anonymous key** for client-side reads only
- **Protected API routes** with token validation
- **No secrets in client code** - all sensitive operations server-side

## 📊 Admin Query Examples

### View Agent Logs
```sql
SELECT agent_name, event_type, payload, created_at 
FROM agent_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

### Analyze User Activity
```sql
SELECT 
  up.name,
  up.shop_name,
  COUNT(o.id) as total_orders,
  SUM(o.total_amount) as total_spent,
  lp.tier as loyalty_tier
FROM user_profiles up
LEFT JOIN orders o ON up.id = o.user_id
LEFT JOIN loyalty_points lp ON up.id = lp.user_id
GROUP BY up.id, up.name, up.shop_name, lp.tier;
```

### Monitor Reorder Suggestions
```sql
SELECT 
  so.*,
  p.name as product_name,
  up.shop_name
FROM suggested_orders so
JOIN products p ON so.product_id = p.id
JOIN user_profiles up ON so.user_id = up.id
WHERE so.status = 'suggested'
ORDER BY so.created_at DESC;
```

## 🌐 Deployment

### Environment Variables for Production
```env
# Production Supabase
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Production APIs
VITE_OPENAI_API_KEY=your_production_openai_key
ELEVENLABS_API_KEY=your_production_elevenlabs_key

# Security
SEED_TOKEN=your_production_seed_token
NODE_ENV=production
```

### Build and Deploy
```bash
npm run build
# Deploy 'dist' folder to your hosting platform
```

### API Routes Deployment
Ensure your hosting platform supports:
- Node.js serverless functions
- File upload handling (multipart/form-data)
- Environment variables access

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For technical support or questions:
- Check the database schema in `migrations/initial_schema.sql`
- Review API endpoints in the `api/` directory
- Test with demo data using seed scripts
- Check browser console for client-side debugging

## 🔧 Troubleshooting

### Common Issues

**Voice transcription fails:**
- Check `VITE_OPENAI_API_KEY` is set
- Verify microphone permissions in browser
- Try different audio formats (WebM, MP3)

**Database connection errors:**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase project status
- Ensure RLS policies are correctly configured

**Demo data not loading:**
- Run `migrations/initial_schema.sql` first
- Check `SUPABASE_SERVICE_ROLE_KEY` for seeding
- Verify `SEED_TOKEN` matches in requests

**Agent functions failing:**
- Ensure database functions exist (check Supabase dashboard)
- Verify service role key has proper permissions
- Check agent_logs table for error details

---

Built with ❤️ using React + Vite + Supabase + OpenAI