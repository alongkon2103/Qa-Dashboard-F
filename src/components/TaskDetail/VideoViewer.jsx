import { useEffect, useRef, useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VideocamIcon from '@mui/icons-material/Videocam';

export default function VideoViewer() {
  const imgElementRef = useRef(null);
  const wsRef = useRef(null);
  const [lastQuality, setLastQuality] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [imageSrc, setImageSrc] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKFI8lnfFTPJCDQAB-OKXsSOUMXNXB12J3Gg&s'); // 🖼️ เพิ่ม state สำหรับ dummy image

  useEffect(() => {
    let ws;
    let reconnectTimeout;

    const connectWebSocket = () => {
      ws = new WebSocket('ws://localhost:8765');

      ws.onopen = () => {
        console.log('✅ WebSocket Connected');
      };

      let frameCount = 0;
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { quality, confidence: conf, frame } = data;

          if (quality === 'good' || quality === 'bad') {
            frameCount++;
            setLastQuality(quality);
            setConfidence(conf);
            setImageSrc(`data:image/jpeg;base64,${frame}`); // 🟢 เปลี่ยนภาพเมื่อได้รับ frame ใหม่

            if (frameCount % 30 === 0) {
              console.log(
                `📸 Received ${frameCount} frames | Quality: ${quality} | Confidence: ${conf.toFixed(1)}%`
              );
            }
          }
        } catch (err) {
          console.error('❌ Error parsing WebSocket message', err);
        }
      };

      ws.onerror = (err) => {
        console.error('❌ WebSocket Error:', err);
      };

      ws.onclose = () => {
        console.log('🔒 WebSocket Closed, retrying in 2s...');
        reconnectTimeout = setTimeout(connectWebSocket, 2000);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Card
        elevation={4}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: '#fff',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <img
            ref={imgElementRef}
            alt="Camera Feed"
            src={imageSrc} // 🖼️ ใช้ dummy จนกว่าจะมีภาพจริง
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />

          {!imageSrc && (
            <Box
              sx={{
                aspectRatio: '16/9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#fafafa',
                gap: 2,
              }}
            >
              <VideocamIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
              <Typography variant="body1" color="text.secondary">
                Waiting for video feed...
              </Typography>
            </Box>
          )}
        </Box>

        {lastQuality && (
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {lastQuality === 'good' ? (
                  <CheckCircleIcon
                    sx={{
                      fontSize: 32,
                      color: '#4caf50',
                    }}
                  />
                ) : (
                  <CancelIcon
                    sx={{
                      fontSize: 32,
                      color: '#f44336',
                    }}
                  />
                )}

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: lastQuality === 'good' ? '#4caf50' : '#f44336',
                  }}
                >
                  {lastQuality.toUpperCase()}
                </Typography>
              </Box>

              {confidence > 0 && (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {confidence.toFixed(1)}% confidence
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
}
