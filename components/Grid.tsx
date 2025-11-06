import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GRID_SIZE } from '../constants';
import { TileData } from '../types';
import Tile from './Tile';

interface GridProps {
  gridData: TileData[];
  // eslint-disable-next-line no-unused-vars
  onWordSubmit: (tiles: TileData[]) => void;
  disabled: boolean;
  // eslint-disable-next-line no-unused-vars
  onWordChange: (word: string) => void;
}

const TILE_SIZE = 80; // Corresponds to sm:w-20, sm:h-20
const GAP_SIZE = 12; // Corresponds to sm:gap-3

const Grid: React.FC<GridProps> = ({ gridData, onWordSubmit, disabled, onWordChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState<TileData[]>([]);
  const path = useMemo(() => {
    if (selectedTiles.length < 2) {
      return '';
    }
    const points = selectedTiles.map(tile => {
      const row = Math.floor(tile.id / GRID_SIZE);
      const col = tile.id % GRID_SIZE;
      const x = col * (TILE_SIZE + GAP_SIZE) + TILE_SIZE / 2;
      const y = row * (TILE_SIZE + GAP_SIZE) + TILE_SIZE / 2;
      return `${x},${y}`;
    }).join(' ');
    return points;
  }, [selectedTiles]);
  const gridRef = useRef<HTMLDivElement>(null);

  const getTileFromEvent = (e: React.MouseEvent | React.TouchEvent): HTMLElement | null => {
    const point = 'touches' in e ? e.touches[0] : e;
    const element = document.elementFromPoint(point.clientX, point.clientY);
    return element?.closest('[data-tile-id]') as HTMLElement | null;
  };

  const isAdjacent = (tile1: TileData, tile2: TileData): boolean => {
    if (!tile1 || !tile2) return false;
    const row1 = Math.floor(tile1.id / GRID_SIZE);
    const col1 = tile1.id % GRID_SIZE;
    const row2 = Math.floor(tile2.id / GRID_SIZE);
    const col2 = tile2.id % GRID_SIZE;
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    const tileElement = getTileFromEvent(e);
    if (tileElement) {
      const tileId = parseInt(tileElement.dataset.tileId!, 10);
      const tile = gridData.find(t => t.id === tileId);
      if (tile) {
        setIsDragging(true);
        const newSelection = [tile];
        setSelectedTiles(newSelection);
        onWordChange(newSelection.map(t => t.letter).join(''));
      }
    }
  };

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || disabled) return;
    e.preventDefault();
    const tileElement = getTileFromEvent(e);
    if (tileElement) {
      const tileId = parseInt(tileElement.dataset.tileId!, 10);
      if (selectedTiles.length > 1 && selectedTiles[selectedTiles.length - 2].id === tileId) {
        setSelectedTiles(prev => {
          const newSelection = prev.slice(0, -1);
          onWordChange(newSelection.map(t => t.letter).join(''));
          return newSelection;
        });
        return;
      }
      if (selectedTiles.some(t => t.id === tileId)) return;
      const tile = gridData.find(t => t.id === tileId);
      const lastSelected = selectedTiles[selectedTiles.length - 1];
      if (tile && isAdjacent(lastSelected, tile)) {
        setSelectedTiles(prev => {
          const newSelection = [...prev, tile];
          onWordChange(newSelection.map(t => t.letter).join(''));
          return newSelection;
        });
      }
    }
  };

  const handleInteractionEnd = useCallback(() => {
    if (!isDragging || disabled) return;
    setIsDragging(false);
    if (selectedTiles.length >= 3) {
      onWordSubmit(selectedTiles);
    }
    setSelectedTiles([]);
    onWordChange('');
  }, [isDragging, disabled, selectedTiles, onWordSubmit, onWordChange]);

  return (
    <div
      ref={gridRef}
      className="relative p-3 bg-medium-gray rounded-xl shadow-inner no-select w-[356px] h-[356px]" // Fixed size based on tiles and gaps
      onMouseDown={handleInteractionStart}
      onMouseMove={handleInteractionMove}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchMove={handleInteractionMove}
      onTouchEnd={handleInteractionEnd}
    >
      <AnimatePresence>
        {gridData.map((tile) => (
          <div
            key={tile.id}
            data-tile-id={tile.id}
            className="absolute"
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              transform: `translate(${(tile.id % GRID_SIZE) * (TILE_SIZE + GAP_SIZE)}px, ${Math.floor(tile.id / GRID_SIZE) * (TILE_SIZE + GAP_SIZE)}px)`
            }}
          >
            <Tile
              tile={tile}
              isSelected={selectedTiles.some(st => st.id === tile.id)}
            />
          </div>
        ))}
      </AnimatePresence>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20" style={{padding: '12px'}}>
        <motion.polyline
          points={path}
          fill="none"
          stroke="rgba(255, 138, 117, 0.8)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.2 }}
        />
      </svg>
    </div>
  );
};

export default Grid;
