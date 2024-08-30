import { PlaybackContext } from '@/scripts/playbackContext';
import { calculateNewPlayPosition, playFromNewPosition } from '@/scripts/player';
import { useContext, useEffect, useState } from 'react';

const usePlayPosition = () => {
  const [playPosition, setPlayPosition] = useState(0);
  const [elementWidth, setElementWidth] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const { playbackData } = useContext(PlaybackContext);

  useEffect(() => {
    if (playbackData.currentSound && isMoving) {
      const position = calculateNewPlayPosition(playPosition, elementWidth);
      playFromNewPosition(playbackData.currentSound, position);
    }
  }, [elementWidth, playPosition, playbackData.currentSound]);

  return { setPlayPosition, setElementWidth, setIsMoving };
};

export default usePlayPosition;
