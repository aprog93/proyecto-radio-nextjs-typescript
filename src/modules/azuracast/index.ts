/**
 * AzuraCast Module - Public API
 * Complete integration with AzuraCast radio streaming API
 *
 * Usage:
 * import { useAzuracastStation, stationService } from '@/modules/azuracast';
 * import { Dashboard, NowPlayingPage } from '@/modules/azuracast';
 */

// Hooks
export { useAzuracastStation } from './hooks/useAzuracastStation';
export type {
  UseAzuracastStationReturn,
} from './hooks/useAzuracastStation';

// Services
export {
  stationService,
  historyService,
  type ApiResponse,
} from './services';

// Types
export type {
  Station,
  Song,
  NowPlaying,
  StationInfo,
} from './types/azuracast';

// Components
export {
  NowPlayingCard,
  SongListItem,
  StationInfoCard,
} from './components';
export type {
  NowPlayingCardProps,
  SongListItemProps,
  StationInfoCardProps,
} from './components';

// Pages
export { Dashboard, NowPlayingPage } from './pages';
