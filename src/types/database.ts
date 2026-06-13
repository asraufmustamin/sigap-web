/**
 * Database type definitions matching the Supabase schema
 * from the SRS document (Section 6).
 */

export type UserRole = 'warga' | 'babinsa' | 'admin';

export type ReportStatus = 'pending' | 'diproses' | 'selesai';

export interface User {
  id: string;
  name: string;
  phone: string;
  nik_hash: string | null;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  image_url: string;
  status: ReportStatus;
  assigned_to: string | null;
  created_at: string;
  resolved_at: string | null;
}

export type ReportCategory =
  | 'Bencana Alam'
  | 'Kriminalitas'
  | 'Kebakaran'
  | 'Kecelakaan'
  | 'Gangguan Keamanan'
  | 'Lainnya';
