import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, FileText, Loader2, X } from 'lucide-react';
import { BrutalInput } from '@/components/brutal';
import { usePropertyStore } from '@/stores/propertyStore';
import { NSW_API_ENDPOINTS } from '@/constants/apiEndpoints';
import { proxyFetch } from '@/services/nsw/proxyFetch';
import arcgisService from '@/services/nsw/arcgisService';

const PLANNING_API = NSW_API_ENDPOINTS.NSW_PLANNING_API_BASE;
const CADASTRE_LOT = NSW_API_ENDPOINTS.CADASTRE_LOT;

interface AddressSuggestion {
  address: string;
  propId: string | number;
}

interface LotSuggestion {
  lot: string;
  cadId?: string | number;
}

type SearchMode = 'address' | 'lot';

export default function PropertySearch() {
  const [searchMode, setSearchMode] = useState<SearchMode>('address');
  const [searchQuery, setSearchQuery] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [lotSuggestions, setLotSuggestions] = useState<LotSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { setSelectedProperty } = usePropertyStore();

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (query: string, mode: SearchMode) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setLotSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsSearching(true);
    setError(null);

    try {
      const param = mode === 'address' ? 'a' : 'l';
      const endpoint = mode === 'address' ? 'address' : 'lot';
      const url = `${PLANNING_API}/${endpoint}?${param}=${encodeURIComponent(query)}&noOfRecords=10`;

      const results = await proxyFetch<unknown>(url, { signal: abortRef.current.signal });

      if (Array.isArray(results)) {
        if (mode === 'address') {
          setAddressSuggestions(results as AddressSuggestion[]);
          setLotSuggestions([]);
        } else {
          setLotSuggestions(results as LotSuggestion[]);
          setAddressSuggestions([]);
        }
        setShowSuggestions(true);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Search error:', err);
        setError('Failed to fetch suggestions');
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setAddressSuggestions([]);
      setLotSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value, searchMode);
    }, 300);
  };

  const handleTabChange = (mode: SearchMode) => {
    setSearchMode(mode);
    setSearchQuery('');
    setAddressSuggestions([]);
    setLotSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    abortRef.current?.abort();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setAddressSuggestions([]);
    setLotSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    abortRef.current?.abort();
  };

  const handleAddressSelect = async (suggestion: AddressSuggestion) => {
    setShowSuggestions(false);
    setSearchQuery(suggestion.address);
    setIsLoading(true);
    setError(null);

    try {
      const boundaryUrl = `${PLANNING_API}/boundary?id=${encodeURIComponent(String(suggestion.propId))}&Type=property`;
      const lotsUrl = `${PLANNING_API}/lot?propId=${encodeURIComponent(String(suggestion.propId))}`;

      const [boundaryResponse, lotsResponse] = await Promise.all([
        proxyFetch<Array<{ geometry?: any; [key: string]: unknown }>>(boundaryUrl),
        proxyFetch<Array<{ attributes?: { LotDescription?: string } }>>(lotsUrl),
      ]);

      const boundaryArray = Array.isArray(boundaryResponse) ? boundaryResponse : [];
      const boundary = boundaryArray[0];
      if (!boundary?.geometry) {
        setError('No boundary data found for this property');
        return;
      }

      // Get centroid from geometry rings for enrichment queries
      const geom = boundary.geometry as { rings?: number[][][]; area?: number };
      const rings = geom.rings;
      if (rings?.[0]?.length) {
        const ring = rings[0];
        const avgLon = ring.reduce((s, p) => s + p[0], 0) / ring.length;
        const avgLat = ring.reduce((s, p) => s + p[1], 0) / ring.length;

        const [zoning, flood, bushfire] = await Promise.all([
          arcgisService.getZoning(avgLon, avgLat),
          arcgisService.checkFloodRisk(avgLon, avgLat),
          arcgisService.checkBushfireRisk(avgLon, avgLat),
        ]);

        const lots = Array.isArray(lotsResponse) ? lotsResponse : [];
        const lotDp = lots[0]?.attributes?.LotDescription;

        setSelectedProperty({
          id: String(suggestion.propId),
          address: suggestion.address,
          lotDp: lotDp || undefined,
          zone: zoning?.attributes?.ZONE_CODE || undefined,
          area: geom.area || undefined,
          flood,
          bushfire,
          geometry: boundary.geometry as GeoJSON.Geometry,
        });
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Failed to load property details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLotSelect = async (suggestion: LotSuggestion) => {
    setShowSuggestions(false);
    setSearchQuery(suggestion.lot);
    setIsLoading(true);
    setError(null);

    try {
      // Format lot ID for cadastre query
      let formattedLotId = suggestion.lot.trim();
      formattedLotId = formattedLotId.replace(/-\//g, '//');
      if (/^\d+\/[A-Z]+\d+/.test(formattedLotId) && !formattedLotId.includes('//')) {
        formattedLotId = formattedLotId.replace('/', '//');
      }

      const escapedLotId = formattedLotId.replace(/'/g, "''");
      const whereClause = `lotidstring='${escapedLotId}'`;
      const encodedWhere = encodeURIComponent(whereClause).replace(/%2F/g, '/');
      const cadastreUrl = `${CADASTRE_LOT}/query?where=${encodedWhere}&outFields=*&returnGeometry=true&f=json`;

      let data = await proxyFetch<any>(cadastreUrl);

      // Handle double-stringified responses
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch { /* ignore */ }
      }

      if (!data?.features?.[0]?.geometry) {
        setError(`No geometry found for "${suggestion.lot}". Try a different format (e.g., "1/DP123456").`);
        return;
      }

      const feature = data.features[0];
      const geometry = {
        rings: feature.geometry.rings,
        spatialReference: feature.geometry.spatialReference ?? { wkid: 3857 },
      };

      // Get centroid for enrichment
      const ring = geometry.rings?.[0];
      if (ring?.length > 0) {
        const avgX = ring.reduce((s: number, p: number[]) => s + p[0], 0) / ring.length;
        const avgY = ring.reduce((s: number, p: number[]) => s + p[1], 0) / ring.length;

        // Cadastre geometry may be in Web Mercator (3857), convert to WGS84 if needed
        let lon = avgX;
        let lat = avgY;
        if (geometry.spatialReference?.wkid === 3857 || Math.abs(avgX) > 180) {
          lon = (avgX * 180) / 20037508.34;
          lat = (Math.atan(Math.exp((avgY * Math.PI) / 20037508.34)) * 360) / Math.PI - 90;
        }

        const [zoning, flood, bushfire] = await Promise.all([
          arcgisService.getZoning(lon, lat),
          arcgisService.checkFloodRisk(lon, lat),
          arcgisService.checkBushfireRisk(lon, lat),
        ]);

        setSelectedProperty({
          id: suggestion.lot,
          address: suggestion.lot,
          lotDp: suggestion.lot,
          zone: zoning?.attributes?.ZONE_CODE || undefined,
          area: feature.attributes?.planlotarea || undefined,
          flood,
          bushfire,
          geometry: geometry as unknown as GeoJSON.Geometry,
        });
      }
    } catch (err) {
      console.error('Error loading lot:', err);
      setError('Failed to load lot details');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = searchMode === 'address' ? addressSuggestions : lotSuggestions;
  const hasSuggestions = showSuggestions && suggestions.length > 0;
  const noResults = showSuggestions && suggestions.length === 0 && searchQuery.length >= 3 && !isSearching && !error;

  return (
    <div ref={containerRef} className="relative">
      {/* Tabs */}
      <div className="flex mb-2">
        <button
          onClick={() => handleTabChange('address')}
          className={`flex-1 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider border-2 border-black transition-colors ${
            searchMode === 'address'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-surface-secondary'
          }`}
        >
          Address
        </button>
        <button
          onClick={() => handleTabChange('lot')}
          className={`flex-1 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider border-2 border-l-0 border-black transition-colors ${
            searchMode === 'lot'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-surface-secondary'
          }`}
        >
          Lot / DP
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <BrutalInput
          placeholder={searchMode === 'address' ? 'SEARCH ADDRESS...' : 'SEARCH LOT (E.G. 1/DP123456)...'}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isSearching || isLoading ? (
            <Loader2 size={16} className="animate-spin text-gray-500" />
          ) : searchQuery ? (
            <button onClick={clearSearch} className="p-1 hover:bg-surface-secondary rounded">
              <X size={14} />
            </button>
          ) : (
            <Search size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-2 px-3 py-2 bg-red-50 border-2 border-red-300 font-mono text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {hasSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-brutal border-black shadow-brutal-lg z-50 max-h-60 overflow-y-auto">
          {searchMode === 'address'
            ? addressSuggestions.map((s, idx) => (
                <button
                  key={`addr-${idx}-${s.propId}`}
                  onClick={() => handleAddressSelect(s)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="w-full text-left px-4 py-3 font-mono text-sm border-b-2 border-black last:border-b-0 hover:bg-surface-secondary transition-colors flex items-center gap-3"
                >
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  {s.address}
                </button>
              ))
            : lotSuggestions.map((s, idx) => (
                <button
                  key={`lot-${idx}-${s.cadId ?? s.lot}`}
                  onClick={() => handleLotSelect(s)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="w-full text-left px-4 py-3 font-mono text-sm border-b-2 border-black last:border-b-0 hover:bg-surface-secondary transition-colors flex items-center gap-3"
                >
                  <FileText size={14} className="text-gray-400 flex-shrink-0" />
                  {s.lot}
                </button>
              ))}
        </div>
      )}

      {/* No Results */}
      {noResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-brutal border-black shadow-brutal-lg z-50 px-4 py-3 font-mono text-sm text-gray-500 text-center">
          No {searchMode === 'address' ? 'addresses' : 'lots'} found matching "{searchQuery}"
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-brutal border-black shadow-brutal-lg z-50 px-4 py-4 flex items-center justify-center gap-3">
          <Loader2 size={16} className="animate-spin" />
          <span className="font-mono text-sm">
            {searchMode === 'address' ? 'Loading property...' : 'Loading lot geometry...'}
          </span>
        </div>
      )}
    </div>
  );
}
