import { PlaybackContext } from '@/scripts/playbackContext';
import { calculateNewPlayPosition, playFromNewPosition } from '@/scripts/player';
import { useContext, useEffect, useState } from 'react';

const usePlayPosition = () => {
  const [playPosition, setPlayPosition] = useState(0);
  const [elementWidth, setElementWidth] = useState(1);
  const { playbackData } = useContext(PlaybackContext);


  useEffect(() => {
    if (playbackData.currentSound) {
      
      const position = calculateNewPlayPosition(playPosition, elementWidth);
      console.log('happens', position)
          playFromNewPosition(playbackData.currentSound, position);
    }
  }, [elementWidth, playPosition, playbackData.currentSound]);

  return { setPlayPosition, setElementWidth };
};

export default usePlayPosition;
