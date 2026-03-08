import { useRef } from 'react';
import { Box } from '@mui/material';
import { useMap } from '../hooks/useMap';
import { Popup } from './Popup';

/**
 * 地図コンポーネント
 */
export const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, popupData, setPopupData } = useMap(mapRef);

  return (
    <Box sx={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Box ref={mapRef} sx={{ width: '100%', height: '100%' }} />
      <Popup map={map} popupData={popupData} onClose={() => setPopupData(null)} />
    </Box>
  );
};
