import { useBottomSheetStore } from '@/stores/bottomSheetStore';
import QuickMode from './rentvsbuy/QuickMode';
import DetailedMode from './rentvsbuy/DetailedMode';

export default function RentVsBuyTab() {
  const { rentVsBuyMode } = useBottomSheetStore();

  if (rentVsBuyMode === 'detailed') {
    return <DetailedMode />;
  }

  return <QuickMode />;
}
