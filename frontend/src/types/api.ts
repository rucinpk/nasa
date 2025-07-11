export interface APODResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

export interface MarsRoverPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

export interface MarsRoverResponse {
  photos: MarsRoverPhoto[];
}

export interface NearEarthObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    miles: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    feet: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: {
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }[];
  is_sentry_object: boolean;
}

export interface NEOResponse {
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NearEarthObject[];
  };
}

export interface EPICImage {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
  dscovr_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  lunar_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  sun_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  attitude_quaternions: {
    q0: number;
    q1: number;
    q2: number;
    q3: number;
  };
  date: string;
  coords: {
    centroid_coordinates: {
      lat: number;
      lon: number;
    };
    dscovr_j2000_position: {
      x: number;
      y: number;
      z: number;
    };
    lunar_j2000_position: {
      x: number;
      y: number;
      z: number;
    };
    sun_j2000_position: {
      x: number;
      y: number;
      z: number;
    };
    attitude_quaternions: {
      q0: number;
      q1: number;
      q2: number;
      q3: number;
    };
  };
}

export interface MediaItem {
  href: string;
  rel: string;
  render?: string;
}

export interface MediaData {
  center: string;
  title: string;
  nasa_id: string;
  date_created: string;
  keywords?: string[];
  media_type: 'image' | 'video' | 'audio';
  description?: string;
  photographer?: string;
  location?: string;
  album?: string[];
  description_508?: string;
  secondary_creator?: string;
}

export interface MediaSearchItem {
  href: string;
  data: MediaData[];
  links?: MediaItem[];
}

export interface MediaSearchResponse {
  collection: {
    version: string;
    href: string;
    items: MediaSearchItem[];
    metadata: {
      total_hits: number;
    };
    links?: {
      next?: string;
      prev?: string;
    }[];
  };
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface APODParams {
  date?: string;
  count?: number;
}

export interface MarsPhotosParams {
  sol?: string;
  camera?: string;
  rover?: string;
  page?: number;
}

export interface NEOParams {
  start_date?: string;
  end_date?: string;
}

export interface EPICParams {
  date?: string;
}

export interface SearchParams {
  q: string;
  media_type?: string;
  page?: number;
} 