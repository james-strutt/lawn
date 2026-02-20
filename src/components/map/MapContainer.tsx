import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapStore } from '@/stores/mapStore';
import { usePropertyStore } from '@/stores/propertyStore';
import LayerToggle from './LayerToggle';
import MapLayers from './MapLayers';

// Note: You'll need to set your Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.YOUR_MAPBOX_TOKEN_HERE';

export default function MapContainer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { map, setMap, setMapLoaded } = useMapStore();
  const { selectedProperty } = usePropertyStore();

  useEffect(() => {
    if (!mapContainerRef.current || map) return;

    // Suppress Mapbox GL image decoding errors in console
    const originalConsoleError = console.error;
    const errorFilter = (...args: any[]) => {
      const errorString = args.join(' ').toLowerCase();
      if (
        errorString.includes('could not load image') ||
        errorString.includes('source image could not be decoded') ||
        errorString.includes('svg') ||
        errorString.includes('not supported')
      ) {
        // Suppress image decoding errors
        return;
      }
      originalConsoleError.apply(console, args);
    };
    console.error = errorFilter;

    // Initialize Mapbox map
    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Can be customized to brutalist style
      center: [151.2093, -33.8688], // Sydney coordinates
      zoom: 11,
      pitch: 0,
      bearing: 0,
    });

    // Add navigation controls (brutalist styled via CSS)
    newMap.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      'top-right'
    );

    // Add scale control
    newMap.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 200,
        unit: 'metric',
      }),
      'bottom-left'
    );

    // Add geolocate control
    newMap.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right'
    );

    // Handle image loading errors (suppress SVG/unsupported format errors)
    newMap.on('error', (e) => {
      if (e.error && e.error.message) {
        const errorMessage = e.error.message.toLowerCase();
        // Suppress image decoding errors - these occur when tiles return unsupported formats
        if (
          errorMessage.includes('could not load image') ||
          errorMessage.includes('source image could not be decoded') ||
          errorMessage.includes('svg')
        ) {
          // Silently ignore - tiles may not be available or may return unsupported formats
          return;
        }
        // Log other errors
        console.warn('Map error:', e.error);
      }
    });

    newMap.on('load', () => {
      setMapLoaded(true);
      console.log('Map loaded successfully');
    });

    setMap(newMap);

    // Cleanup
    return () => {
      // Restore original console.error
      console.error = originalConsoleError;
      newMap.remove();
      setMap(null);
      setMapLoaded(false);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Map Badge */}
      <div className="absolute top-4 left-4 z-10 bg-black text-white px-4 py-2 border-brutal border-black shadow-brutal font-mono text-xs font-bold uppercase">
        MAP VIEW
      </div>

      {/* Layer Toggle */}
      <div className="absolute top-4 right-20 z-10">
        <LayerToggle />
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full border-brutal border-black"
        style={{ minHeight: '500px' }}
      />

      {/* Map Layers */}
      <MapLayers />

      {/* Instructions Overlay (shows when no property selected) */}
      {!selectedProperty && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white border-brutal border-black shadow-brutal-lg px-6 py-4 font-mono text-sm">
            <div className="text-center">
              <div className="font-bold uppercase mb-2">Welcome to LAWN</div>
              <div className="text-gray-600">
                Search for an address or click any property on the map
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
