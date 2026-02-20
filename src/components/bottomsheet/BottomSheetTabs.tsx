import { useBottomSheetStore } from '@/stores/bottomSheetStore';
import type { BottomSheetTab } from '@/stores/bottomSheetStore';

const TABS: { id: BottomSheetTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'rent-vs-buy', label: 'Rent vs Buy' },
  { id: 'calculators', label: 'Calculators' },
  { id: 'compare', label: 'Compare' },
];

export default function BottomSheetTabs() {
  const { activeTab, setActiveTab } = useBottomSheetStore();

  return (
    <div className="flex-shrink-0 flex border-b-2 border-black">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 px-3 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-colors ${
            activeTab === tab.id
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-surface-secondary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
