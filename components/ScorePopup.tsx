import React, { useEffect, useState } from 'react';
import { ScorePopupInfo } from '../types';

interface ScorePopupProps {
  popups: ScorePopupInfo[];
}

const ScorePopup: React.FC<ScorePopupProps> = ({ popups }) => {
  const [visiblePopups, setVisiblePopups] = useState<ScorePopupInfo[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisiblePopups(popups);
    const timer = setTimeout(() => {
      setVisiblePopups([]);
    }, 2000 * popups.length); // Clear after animation time
    return () => clearTimeout(timer);
  }, [popups]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
      {visiblePopups.map((popup) => (
        <div key={popup.id} className="animate-popup text-center">
          <p className="text-4xl font-black text-coral-bright drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            +{popup.score}
          </p>
          {popup.bonuses.map((bonus, i) => (
            <p key={i} className="text-lg font-bold text-teal drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              {bonus}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScorePopup;
