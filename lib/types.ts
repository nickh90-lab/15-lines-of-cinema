export interface TechnicalScores {
  story: number;
  acting: number;
  pace: number;
  ending: number;
  originality: number;
  audiovisual: number;
}

export interface CastMember {
  name: string;
  role: string;
  imageUrl?: string;
}

export interface Movie {
  id: string;
  slug: string; // URL-friendly title
  title: string;
  year: number;
  duration?: number; // Runtime in minutes
  director: string;
  posterUrl: string; // Absolute or relative URL
  backdropUrl?: string; // Optional wide image
  rating: number; // 0-10 floating point
  certification?: string; // e.g. "PG-13", "R"
  spokenLanguages?: string[]; // e.g. ["English", "French"]
  reviewShort: string;
  reviewLong: string; // Markdown supported
  plot?: string; // Optional plot summary
  review15Lines?: string[]; // The 15 lines of the review
  genres: string[];

  technicalScores: TechnicalScores;
  awards?: string[];
  releaseDate: string; // ISO date string
  createdAt: string; // ISO date string
  cast?: CastMember[];
  trailerUrl?: string; // YouTube embed URL
  streaming?: string[]; // Array of service names e.g. "Netflix", "HBO Max"
}


