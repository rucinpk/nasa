# NASA Space Explorer 🚀

A stunning web application that leverages NASA's Open APIs to showcase space-related data through an interactive and visually appealing interface. Built with **TypeScript**, React frontend and Node.js backend for type safety and better developer experience.

![Space Explorer Preview](https://via.placeholder.com/800x400/0B0D17/FFFFFF?text=NASA+Space+Explorer)

## ✨ Features

- **Astronomy Picture of the Day (APOD)** - Daily featured space imagery with detailed explanations
- **Mars Rover Explorer** - Browse photographs from Curiosity, Opportunity, and Spirit rovers
- **Near Earth Object Tracker** - Track asteroids and assess potential impact risks with data visualization
- **Earth View** - Real-time Earth imagery from NASA's EPIC satellite camera
- **Media Search** - Search through NASA's vast collection of space images and videos
- **Interactive Data Visualization** - Charts, graphs, and interactive elements
- **Responsive Design** - Optimized for all screen sizes
- **Modern UI/UX** - Beautiful space-themed interface with smooth animations

## 🛠️ Tech Stack

### Frontend
- **TypeScript** - Type-safe JavaScript for better development
- **React 18** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Data fetching and state management
- **React Router** - Client-side routing
- **Recharts** - Interactive data visualization
- **Lucide Icons** - Beautiful icon library

### Backend
- **TypeScript** - Type-safe server development
- **Node.js** - JavaScript runtime
- **Express** - Web framework with TypeScript support
- **Axios** - HTTP client for API calls
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 📁 Project Structure

```
bounce/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── APOD.tsx
│   │   │   ├── MarsExplorer.tsx
│   │   │   ├── NEOTracker.tsx
│   │   │   ├── EarthView.tsx
│   │   │   └── Search.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── src/
│   │   └── server.ts
│   ├── dist/ (compiled JavaScript)
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- NASA API key (optional - demo key works with limitations)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bounce
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup (Optional)**
   ```bash
   # In backend directory, create .env file
   echo "NASA_API_KEY=your_nasa_api_key_here" > .env
   echo "PORT=5000" >> .env
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   # For development (with TypeScript compilation and hot reload)
   npm run dev
   
   # For production (compile first, then start)
   npm run build
   npm start
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### NASA API Key

While the application works with the demo API key, getting your own NASA API key is recommended for production use:

1. Visit [NASA API Portal](https://api.nasa.gov/)
2. Generate your free API key
3. Add it to the backend `.env` file:
   ```
   NASA_API_KEY=your_actual_api_key_here
   ```

### Environment Variables

#### Backend (.env)
```env
NASA_API_KEY=your_nasa_api_key_here
PORT=5000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🎨 Available Scripts

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend
- `npm run dev` - Start development server with TypeScript compilation and hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:watch` - Watch mode TypeScript compilation
- `npm start` - Start production server (requires build first)

## 📊 API Endpoints

The backend provides these endpoints:

- `GET /api/apod` - Astronomy Picture of the Day
- `GET /api/mars-photos` - Mars Rover Photos
- `GET /api/neo` - Near Earth Objects
- `GET /api/epic` - Earth Polychromatic Imaging Camera
- `GET /api/search` - NASA Image and Video Library
- `GET /api/health` - Health check endpoint

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Add environment variables if needed

### Backend (Render/Heroku)

1. **For Render:**
   - Connect repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables

2. **For Heroku:**
   ```bash
   heroku create your-app-name
   heroku config:set NASA_API_KEY=your_api_key
   git push heroku main
   ```

### Full-Stack Deployment

1. Deploy backend to Render/Heroku
2. Update frontend `REACT_APP_API_URL` to point to deployed backend
3. Deploy frontend to Vercel/Netlify

## 🎯 Features Explained

### Home Page
- Hero section with animated background
- Feature cards with navigation
- Responsive design with smooth animations

### APOD (Astronomy Picture of the Day)
- Daily astronomy images and videos
- Date picker for historical images
- Image sharing and download functionality
- Detailed explanations and metadata

### Mars Explorer
- Photos from multiple Mars rovers
- Camera filtering and sol (Mars day) selection
- Full-screen image viewer
- Download functionality

### NEO Tracker
- Near Earth Object tracking
- Interactive charts and data visualization
- Risk assessment and classification
- Detailed object information

### Earth View
- Real-time Earth imagery from EPIC
- Multiple daily captures
- Coordinate information
- High-resolution downloads

### Media Search
- Search NASA's image and video library
- Filter by media type
- Detailed media information
- Download functionality

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- Error handling

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes and orientations

## 🎨 UI/UX Features

- Modern space-themed design
- Smooth animations with Framer Motion
- Glass-morphism effects
- Interactive star field background
- Loading states and error handling
- Toast notifications
- Modal dialogs

## 📝 TypeScript Benefits

This application is built with TypeScript for enhanced development experience:

- **Type Safety** - Catch errors at compile time, not runtime
- **Better IDE Support** - Enhanced autocomplete, refactoring, and navigation
- **API Response Typing** - Fully typed NASA API responses for better data handling
- **Component Props** - Typed React component props prevent prop errors
- **Code Documentation** - Types serve as living documentation
- **Refactoring Confidence** - Safe refactoring with compiler assistance

## 🔧 Performance Optimizations

- Code splitting with React.lazy
- Image optimization
- API response caching
- Lazy loading
- Compression middleware
- Efficient state management
- TypeScript compilation optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- NASA for providing free access to their APIs
- React and Node.js communities
- All the amazing space imagery from NASA missions

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for space exploration enthusiasts** 