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

interface MapPickerProps {
    latitude: number;
    longitude: number;
    onLocationSelect: (lat: number, lng: number) => void;
    height?: string;
}

export default function MapPicker({
    latitude,
    longitude,
    onLocationSelect,
    height = '400px',
}: MapPickerProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize map centered on Kosovo
        const defaultLat = latitude || 42.6026;
        const defaultLng = longitude || 20.903;

        const map = L.map(mapContainerRef.current).setView(
            [defaultLat, defaultLng],
            latitude && longitude ? 13 : 8,
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        // Add initial marker if coordinates exist
        let marker: L.Marker | null = null;
        if (latitude && longitude) {
            marker = L.marker([latitude, longitude], {
                draggable: true,
            }).addTo(map);

            marker.on('dragend', (e) => {
                const position = e.target.getLatLng();
                onLocationSelect(position.lat, position.lng);
            });
        }

        // Add click handler to set/move marker
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;

            if (marker) {
                marker.setLatLng([lat, lng]);
            } else {
                marker = L.marker([lat, lng], {
                    draggable: true,
                }).addTo(map);

                marker.on('dragend', (e) => {
                    const position = e.target.getLatLng();
                    onLocationSelect(position.lat, position.lng);
                });
            }

            onLocationSelect(lat, lng);
        });

        mapRef.current = map;
        markerRef.current = marker;

        return () => {
            map.remove();
        };
    }, []);

    // Update marker position when props change
    useEffect(() => {
        if (markerRef.current && latitude && longitude) {
            markerRef.current.setLatLng([latitude, longitude]);
            mapRef.current?.setView([latitude, longitude], 13);
        }
    }, [latitude, longitude]);

    return (
        <div>
            <div
                ref={mapContainerRef}
                style={{
                    height,
                    width: '100%',
                    borderRadius: '0.5rem',
                    border: '2px solid #74C69D40',
                }}
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Click on the map to set the farm location, or drag the marker to
                adjust
            </p>
        </div>
    );
}
