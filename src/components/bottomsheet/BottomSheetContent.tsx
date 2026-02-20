import { useBottomSheetStore } from '@/stores/bottomSheetStore';
import PropertyOverviewTab from './tabs/PropertyOverviewTab';
import RentVsBuyTab from './tabs/RentVsBuyTab';
import CalculatorsTab from './tabs/CalculatorsTab';
import CompareTab from './tabs/CompareTab';

export default function BottomSheetContent() {
  const { activeTab } = useBottomSheetStore();

  switch (activeTab) {
    case 'overview':
      return <PropertyOverviewTab />;
    case 'rent-vs-buy':
      return <RentVsBuyTab />;
    case 'calculators':
      return <CalculatorsTab />;
    case 'compare':
      return <CompareTab />;
  }
}
