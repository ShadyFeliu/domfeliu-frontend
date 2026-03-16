export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string | null;
  spotifyUrl?: string | null;
  soundcloudUrl?: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  ticketUrl?: string | null;
  imageUrl?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string | null;
  order: number;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactFormData {
  id: string;
  isRead: boolean;
  createdAt: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface AdminUser {
  email: string;
  profileImage: string | null;
  bio: string | null;
  presskitUrl: string | null;
}

export interface ArtistProfile {
  profileImage: string | null;
  bio: string | null;
  presskitUrl: string | null;
}

export interface AdminStats {
  tracks: {
    total: number;
    published: number;
    latest: Track | null;
  };
  events: {
    total: number;
    upcoming: number;
    latest: Event | null;
  };
  messages: {
    total: number;
    unread: number;
    latest: ContactMessage | null;
  };
  gallery: {
    total: number;
    images: number;
    videos: number;
  };
  venues: {
    total: number;
  };
}
