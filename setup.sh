#!/bin/bash

echo "📦 Setting up Todo App..."
echo ""

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
echo "✅ Server dependencies installed"
echo ""

# Copy .env template
if [ ! -f .env ]; then
  cp .env.example .env
  echo "📝 Created .env file - update with your Supabase credentials"
fi
echo ""

cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
echo "✅ Client dependencies installed"
echo ""

cd ..

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update server/.env with your Supabase credentials"
echo "2. Run the Supabase SQL setup (see README.md)"
echo "3. Start the server: cd server && npm run dev"
echo "4. In another terminal, start the client: cd client && npm run dev"
echo "5. Open http://localhost:5173"
