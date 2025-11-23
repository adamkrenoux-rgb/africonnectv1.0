#!/bin/bash

# Connexus Setup Script
echo "🌍 Setting up Connexus..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install AI service dependencies
echo "🤖 Installing AI service dependencies..."
cd ai-service
pip install -r requirements.txt
cd ..

# Set up environment variables
echo "🔧 Setting up environment variables..."
if [ ! -f .env.local ]; then
    cp env.example .env.local
    echo "📝 Please fill in your environment variables in .env.local"
fi

if [ ! -f ai-service/.env ]; then
    cp ai-service/env.example ai-service/.env
    echo "📝 Please fill in your OpenAI API key in ai-service/.env"
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development servers:"
echo "   Frontend: npm run dev"
echo "   AI Service: cd ai-service && python main.py"
echo ""
echo "📝 Don't forget to:"
echo "   1. Set up your database (PostgreSQL)"
echo "   2. Configure Clerk authentication"
echo "   3. Set up Stripe for payments"
echo "   4. Get your OpenAI API key"
