import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewerProps {
    latitude: number;
    longitude: number;
    farmName?: string;
    height?: string;
}

export default function MapViewer({
    latitude,
    longitude,
    farmName,
    height = '400px',
}: MapViewerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainerRef.current || !latitude || !longitude) return;

        const map = L.map(mapContainerRef.current).setView(
            [latitude, longitude],
            13,
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([latitude, longitude]).addTo(map);

        if (farmName) {
            marker.bindPopup(`<b>${farmName}</b>`).openPopup();
        }

        return () => {
            map.remove();
        };
    }, [latitude, longitude, farmName]);

    return (
        <div
            ref={mapContainerRef}
            style={{
                height,
                width: '100%',
                borderRadius: '0.5rem',
                border: '2px solid #74C69D40',
            }}
        />
    );
}
