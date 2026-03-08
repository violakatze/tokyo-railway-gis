import { useEffect, useRef } from 'react';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { PopupData } from '../types/railway';

type PopupProps = {
  map: Map | null;
  popupData: PopupData;
  onClose: () => void;
};

/**
 * 地図上にポップアップを表示するコンポーネント
 */
export const Popup = ({ map, popupData, onClose }: PopupProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);

  useEffect(() => {
    if (!map || !containerRef.current) return;
    const overlay = new Overlay({
      element: containerRef.current,
      autoPan: { animation: { duration: 250 } },
    });
    map.addOverlay(overlay);
    overlayRef.current = overlay;
    return () => {
      map.removeOverlay(overlay);
    };
  }, [map]);

  useEffect(() => {
    if (!overlayRef.current) return;
    if (popupData) {
      overlayRef.current.setPosition(popupData.coordinate);
    } else {
      overlayRef.current.setPosition(undefined);
    }
  }, [popupData]);

  if (!popupData) return <div ref={containerRef} />;

  return (
    <div ref={containerRef}>
      <Paper elevation={3} sx={{ p: 1.5, minWidth: 160, position: 'relative' }}>
        {popupData.type === 'railway' && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" fontWeight="bold">
                {popupData.routeName}
              </Typography>
              <IconButton size="small" onClick={onClose} sx={{ ml: 1 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {popupData.operatorName}
            </Typography>
          </>
        )}
        {popupData.type === 'station' && (
          <>
            <Typography variant="subtitle2" fontWeight="bold">
              {popupData.stationName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {popupData.routeName}
            </Typography>
          </>
        )}
      </Paper>
    </div>
  );
};
