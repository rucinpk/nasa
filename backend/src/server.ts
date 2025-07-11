import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

// Configure CORS allowed domains
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      "https://upsun-deployment-xiwfmii-hicxhmcu6rthk.ch-1.platformsh.site",
      "https://www.upsun-deployment-xiwfmii-hicxhmcu6rthk.ch-1.platformsh.site",
    ];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-profile-id'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);

const nasaAPI: AxiosInstance = axios.create({
  baseURL: 'https://api.nasa.gov',
  timeout: 10000,
  params: {
    api_key: NASA_API_KEY
  }
});

interface APODQuery {
  date?: string;
  count?: string;
}

interface MarsPhotosQuery {
  sol?: string;
  camera?: string;
  rover?: string;
  page?: string;
}

interface NEOQuery {
  start_date?: string;
  end_date?: string;
}

interface EPICQuery {
  date?: string;
}

interface SearchQuery {
  q?: string;
  media_type?: string;
  page?: string;
}

app.get('/api/apod', async (req: Request<{}, any, any, APODQuery>, res: Response) => {
  try {
    const { date, count } = req.query;
    const params: any = {};
    
    if (date) params.date = date;
    if (count) params.count = count;
    
    const response = await nasaAPI.get('/planetary/apod', { params });
    res.json(response.data);
  } catch (error: any) {
    console.error('APOD Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Astronomy Picture of the Day',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

app.get('/api/mars-photos', async (req: Request<{}, any, any, MarsPhotosQuery>, res: Response) => {
  try {
    const { sol, camera, rover = 'curiosity', page = '1' } = req.query;
    const params: any = { page };
    
    if (sol) params.sol = sol;
    if (camera) params.camera = camera;
    
    const response = await nasaAPI.get(`/mars-photos/api/v1/rovers/${rover}/photos`, { params });
    res.json(response.data);
  } catch (error: any) {
    console.error('Mars Photos Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Mars rover photos',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

app.get('/api/neo', async (req: Request<{}, any, any, NEOQuery>, res: Response) => {
  try {
    const { start_date, end_date } = req.query;
    const params: any = {};
    
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    
    const response = await nasaAPI.get('/neo/rest/v1/feed', { params });
    res.json(response.data);
  } catch (error: any) {
    console.error('NEO Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Near Earth Objects',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

app.get('/api/epic', async (req: Request<{}, any, any, EPICQuery>, res: Response) => {
  try {
    const { date } = req.query;
    let endpoint = '/EPIC/api/natural';
    
    if (date) {
      endpoint += `/date/${date}`;
    }
    
    const response = await nasaAPI.get(endpoint);
    res.json(response.data);
  } catch (error: any) {
    console.error('EPIC Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Earth images',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

app.get('/api/search', async (req: Request<{}, any, any, SearchQuery>, res: Response) => {
  try {
    const { q, media_type = 'image', page = '1' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const response = await axios.get('https://images-api.nasa.gov/search', {
      params: { q, media_type, page }
    });
    
    return res.json(response.data);
  } catch (error: any) {
    console.error('Search Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to search NASA media',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Space Explorer API running on port ${PORT}`);
  console.log(`📡 NASA API Key: ${NASA_API_KEY === 'DEMO_KEY' ? 'Demo (limited)' : 'Custom'}`);
}); 