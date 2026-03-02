// AzuraCast API integration module
// All URLs are configurable via environment variables
// Uses backend as BFF (Backend for Frontend) for better security and caching

export const API_BASE = import.meta.env.VITE_AZURACAST_BASE_URL || "https://demo.azuracast.com";
export const STATION_ID = import.meta.env.VITE_AZURACAST_STATION_ID || "1";
export const POLLING_INTERVAL = Number(import.meta.env.VITE_AZURACAST_POLLING_INTERVAL) || 15000;

// Backend API base (BFF) - use relative URL for Docker
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || "";

// --- Types matching AzuraCast /api/nowplaying/{station_id} response ---

export interface AzuraSong {
  id: string;
  art: string;
  text: string;
  artist: string;
  title: string;
  album: string;
  genre: string;
  lyrics: string;
}

export interface AzuraNowPlaying {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist: string;
  streamer: string;
  is_request: boolean;
  song: AzuraSong;
  elapsed: number;
  remaining: number;
}

export interface AzuraListeners {
  total: number;
  unique: number;
  current: number;
}

export interface AzuraLive {
  is_live: boolean;
  streamer_name: string;
  broadcast_start: number | null;
  art: string | null;
}

export interface AzuraStation {
  id: number;
  name: string;
  shortcode: string;
  description: string;
  frontend: string;
  backend: string;
  listen_url: string;
  url: string;
  public_player_url: string;
  playlist_pls_url: string;
  playlist_m3u_url: string;
  is_public: boolean;
  hls_enabled: boolean;
  hls_url: string | null;
  hls_listeners: number;
}

export interface AzuraSongHistory {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist: string;
  streamer: string;
  is_request: boolean;
  song: AzuraSong;
}

export interface AzuraPlayingNext {
  cued_at: number;
  played_at: number;
  duration: number;
  playlist: string;
  is_request: boolean;
  song: AzuraSong;
}

export interface AzuraNowPlayingResponse {
  station: AzuraStation;
  listeners: AzuraListeners;
  live: AzuraLive;
  now_playing: AzuraNowPlaying;
  playing_next: AzuraPlayingNext | null;
  song_history: AzuraSongHistory[];
  is_online: boolean;
}

// --- Additional Types for new endpoints ---

export interface AzuraStationInfo {
  id: number;
  name: string;
  shortcode: string;
  description: string;
  frontend_type: string;
  backend_type: string;
  listen_url: string;
  url: string;
  public_player_url: string;
  playlist_pls_url: string;
  playlist_m3u_url: string;
  is_public: boolean;
  hls_enabled: boolean;
  hls_url: string | null;
  hls_listeners: number;
  mount_count: number;
  remote_count: number;
}

export interface AzuraStationInfoResponse {
  station: AzuraStationInfo;
  listeners: AzuraListeners;
  is_online: boolean;
  uptime: number;
}

export interface AzuraScheduleItem {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  day: number;
  loop_days: number[];
  station_id: number;
  description: string;
  url: string;
  artwork: string;
  color: string;
}

export interface AzuraScheduleResponse {
  schedule: AzuraScheduleItem[];
  day: number;
  yesterday: string;
  tomorrow: string;
}

export interface AzuraOnDemand {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  lyrics: string;
  art: string;
  mime: string;
  length: number;
  size: number;
  path: string;
  download_url: string;
}

export interface AzuraOnDemandResponse {
  ondemand: AzuraOnDemand[];
  total: number;
  page: number;
  pages: number;
}

export interface AzuraPodcast {
  id: number;
  title: string;
  description: string;
  link: string;
  author: string;
  email: string;
  language: string;
  website: string;
  episodes_count: number;
  art: string;
}

export interface AzuraPodcastResponse {
  podcasts: AzuraPodcast[];
  total: number;
  page: number;
  pages: number;
}

export interface AzuraPodcastEpisode {
  id: number;
  title: string;
  description: string;
  publish_date: string;
  length: number;
  size: number;
  mime: string;
  art: string;
  download_url: string;
  play_url: string;
}

export interface AzuraPodcastEpisodesResponse {
  episodes: AzuraPodcastEpisode[];
  total: number;
  page: number;
  pages: number;
}

export interface AzuraStreamer {
  id: number;
  streamer_username: string;
  display_name: string;
  description: string;
  art: string;
  is_active: boolean;
  last_seen: number;
}

export interface AzuraStreamersResponse {
  streamers: AzuraStreamer[];
}

export interface AzuraListener {
  ip: string;
  user_agent: string;
  connect_time: number;
  duration: number;
  mount_name: string;
  country: string;
  region: string;
  city: string;
}

export interface AzuraListenersResponse {
  listeners: AzuraListener[];
  total: number;
  unique: number;
}

export interface AzuraRequestsResponse {
  requests: unknown[];
  allowed: boolean;
  request_delay: number;
  request_limit: number;
}

export interface AzuraRequestSubmitResponse {
  success: boolean;
  message: string;
  request_id?: number;
}

// --- API Functions ---

/**
 * Fetch now playing from AzuraCast API directly
 * Used as fallback when backend is unavailable
 */
export async function fetchNowPlaying(): Promise<AzuraNowPlayingResponse> {
  const res = await fetch(`${API_BASE}/api/nowplaying/${STATION_ID}`);
  if (!res.ok) throw new Error(`AzuraCast API error: ${res.status}`);
  return res.json();
}

/**
 * Fetch now playing from backend BFF
 * This is the preferred method for frontend
 */
export async function fetchNowPlayingFromBackend(): Promise<AzuraNowPlayingResponse> {
  const res = await fetch(`${BACKEND_BASE}/api/station/now-playing`);
  if (!res.ok) throw new Error(`Backend API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}

/**
 * Fetch station info from backend
 */
export async function fetchStationInfo(): Promise<AzuraStationInfoResponse> {
  const res = await fetch(`${BACKEND_BASE}/api/station/info`);
  if (!res.ok) throw new Error(`Backend API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}

/**
 * Fetch schedule from backend
 */
export async function fetchSchedule(day?: number): Promise<AzuraScheduleResponse> {
  const params = day ? `?day=${day}` : '';
  const res = await fetch(`${BACKEND_BASE}/api/station/schedule${params}`);
  if (!res.ok) throw new Error(`Backend API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}

/**
 * Fetch on-demand media from backend
 */
export async function fetchOnDemand(page = 1, limit = 25): Promise<AzuraOnDemandResponse> {
  const res = await fetch(`${BACKEND_BASE}/api/station/ondemand?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Backend API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}

/**
 * Fetch podcasts from backend
 */
export async function fetchPodcasts(page = 1, limit = 25): Promise<AzuraPodcastResponse> {
  const res = await fetch(`${BACKEND_BASE}/api/station/podcasts?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Backend API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}

/**
 * Fetch podcast episodes from backend
 */
export async function fetchPodcastEpisodes(podcastId: number, page = 1, limit = 25): Promise<AzuraPodcastEpisodesResponse> {
  const res = await fetch(`${BACKEND_BASE}/api/station/podcasts/${podcastId}/episodes?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Backend API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}

/**
 * Fetch streamers/DJs from backend
 */
export async function fetchStreamers(): Promise<AzuraStreamersResponse> {
  const res = await fetch(`${BACKEND_BASE}/api/station/streamers`);
  if (!res.ok) throw new Error(`Backend API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}

/**
 * Fetch current listeners from backend
 */
export async function fetchListeners(): Promise<AzuraListenersResponse> {
  const res = await fetch(`${BACKEND_BASE}/api/station/listeners`);
  if (!res.ok) throw new Error(`Backend API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}

/**
 * Submit song request
 */
export async function submitSongRequest(requestId: number, token?: string): Promise<AzuraRequestSubmitResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BACKEND_BASE}/api/station/request/${requestId}`, {
    method: 'POST',
    headers,
  });
  
  if (!res.ok) throw new Error(`Backend API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}
