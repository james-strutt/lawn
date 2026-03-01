import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopNav from '@/components/nav/TopNav';
import MapContainer from '@/components/map/MapContainer';
import PropertySearch from '@/components/property/PropertySearch';
import { BottomSheet } from '@/components/bottomsheet';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';
import { useInvestmentStore } from '@/stores/investmentStore';

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const { openSheet, setActiveTab } = useBottomSheetStore();
  const { setAcquisition } = useInvestmentStore();

  useEffect(() => {
    const tool = searchParams.get('tool');
    const fhb = searchParams.get('fhb');

    if (tool === 'rent-vs-buy') {
      openSheet('rent-vs-buy');
    }

    if (fhb === 'true') {
      setAcquisition({ isFirstHomeBuyer: true });
    }
  }, [searchParams, openSheet, setActiveTab, setAcquisition]);

  return (
    <div className="h-screen flex flex-col">
      <TopNav />

      <div className="flex-1 relative overflow-hidden">
        {/* Map */}
        <MapContainer />

        {/* Search Bar (top left) */}
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-96 z-20">
          <PropertySearch />
        </div>

        {/* Bottom Sheet */}
        <BottomSheet />
      </div>
    </div>
  );
}
