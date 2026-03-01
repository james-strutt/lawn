import { useRef, useCallback, useEffect } from 'react';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';
import { usePropertyStore } from '@/stores/propertyStore';
import type { SheetState } from '@/stores/bottomSheetStore';
import { GripHorizontal } from 'lucide-react';
import BottomSheetTabs from './BottomSheetTabs';
import BottomSheetContent from './BottomSheetContent';

const SHEET_HEIGHTS: Record<SheetState, string> = {
  hidden: '0px',
  collapsed: '64px',
  peek: '45vh',
  expanded: '85vh',
};

const SNAP_THRESHOLDS = {
  collapsed: 80,
  peek: window.innerHeight * 0.3,
  expanded: window.innerHeight * 0.65,
};

export default function BottomSheet() {
  const { sheetState, setSheetState } = useBottomSheetStore();
  const { selectedProperty } = usePropertyStore();
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const snapToNearest = useCallback((currentHeight: number) => {
    const vh = window.innerHeight;
    if (currentHeight < SNAP_THRESHOLDS.collapsed) {
      setSheetState('collapsed');
    } else if (currentHeight < vh * 0.35) {
      setSheetState('peek');
    } else {
      setSheetState('expanded');
    }
  }, [setSheetState]);

  const handleDragStart = useCallback((clientY: number) => {
    if (!sheetRef.current) return;
    dragRef.current = {
      startY: clientY,
      startHeight: sheetRef.current.getBoundingClientRect().height,
    };
    sheetRef.current.style.transition = 'none';
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    if (!dragRef.current || !sheetRef.current) return;
    const deltaY = dragRef.current.startY - clientY;
    const newHeight = Math.max(0, dragRef.current.startHeight + deltaY);
    sheetRef.current.style.height = `${newHeight}px`;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!sheetRef.current || !dragRef.current) return;
    const currentHeight = sheetRef.current.getBoundingClientRect().height;
    sheetRef.current.style.transition = '';
    sheetRef.current.style.height = '';
    dragRef.current = null;
    snapToNearest(currentHeight);
  }, [snapToNearest]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientY);

    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onMouseUp = () => {
      handleDragEnd();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [handleDragStart, handleDragMove, handleDragEnd]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    handleDragStart(touch.clientY);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    handleDragMove(touch.clientY);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleHandleClick = useCallback(() => {
    if (sheetState === 'collapsed') {
      setSheetState('peek');
    } else if (sheetState === 'peek') {
      setSheetState('expanded');
    } else if (sheetState === 'expanded') {
      setSheetState('peek');
    }
  }, [sheetState, setSheetState]);

  useEffect(() => {
    if (selectedProperty) {
      if (sheetState === 'hidden') {
        setSheetState('peek');
      }
    } else {
      setSheetState('hidden');
    }
  }, [selectedProperty]);

  if (sheetState === 'hidden') return null;

  return (
    <div
      ref={sheetRef}
      className="absolute bottom-0 left-0 right-0 z-30 bg-white border-t-2 sm:border-t-4 border-black flex flex-col transition-all duration-300 ease-out"
      style={{ height: SHEET_HEIGHTS[sheetState] }}
    >
      {/* Drag Handle */}
      <div
        className="flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleHandleClick}
      >
        <div className="flex items-center justify-center py-2">
          <GripHorizontal size={20} className="text-gray-400" />
        </div>
        {sheetState === 'collapsed' && selectedProperty && (
          <div className="px-4 pb-2 font-sans text-sm font-medium truncate">
            {selectedProperty.address}
          </div>
        )}
      </div>

      {/* Tab bar + Content (hidden when collapsed) */}
      {sheetState !== 'collapsed' && (
        <>
          <BottomSheetTabs />
          <div className="flex-1 overflow-y-auto">
            <BottomSheetContent />
          </div>
        </>
      )}
    </div>
  );
}
