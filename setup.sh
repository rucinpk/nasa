#!/bin/bash

echo "🚀 NASA Space Explorer Setup Script (TypeScript)"
echo "================================================="

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🔧 Setting up backend environment..."
if [ ! -f .env ]; then
    echo "NASA_API_KEY=DEMO_KEY" > .env
    echo "PORT=5000" >> .env
    echo "✅ Created .env file with demo API key"
else
    echo "✅ .env file already exists"
fi

echo "🔨 Building backend TypeScript..."
npm run build || echo "⚠️ Backend build failed - dependencies may not be installed yet"

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🔨 Checking TypeScript setup..."
npx tsc --noEmit || echo "⚠️ TypeScript check failed - will resolve after dependencies are installed"

echo "🌟 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && npm run dev (development) or npm start (production)"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "Development commands:"
echo "- Backend dev: cd backend && npm run dev (with hot reload)"
echo "- Backend build: cd backend && npm run build"
echo "- Frontend dev: cd frontend && npm start"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo ""
echo "🔑 For better performance, get your NASA API key at:"
echo "https://api.nasa.gov/ and update backend/.env"
echo ""
echo "📝 Note: This is now a full TypeScript application!"
echo "🚀 Happy space exploring!" 