'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TUNISIA_CENTER } from '../utils/constants';

// Fix pour les icônes manquantes dans Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface MapSelectorProps {
  onPositionChange: (position: [number, number]) => void;
  initialPosition?: [number, number];
}

export default function MapSelector({ onPositionChange, initialPosition }: MapSelectorProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    // Initialiser la carte
    const map = L.map(mapContainerRef.current).setView(
      initialPosition || TUNISIA_CENTER,
      7
    );

    // Ajouter la couche de tuiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Créer un marqueur initial
    const marker = L.marker(initialPosition || TUNISIA_CENTER).addTo(map);
    markerRef.current = marker;

    // Gestionnaire d'événements pour les clics sur la carte
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      
      // Mettre à jour le marqueur
      if (markerRef.current) {
        markerRef.current.setLatLng(newPosition);
      } else {
        markerRef.current = L.marker(newPosition).addTo(map);
      }
      
      // Mettre à jour l'état
      onPositionChange(newPosition);
    };

    map.on('click', handleMapClick);

    mapRef.current = map;

    // Nettoyage
    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient, onPositionChange]);

  // Mettre à jour la position si elle change depuis l'extérieur
  useEffect(() => {
    if (mapRef.current && initialPosition && markerRef.current) {
      markerRef.current.setLatLng(initialPosition);
      mapRef.current.setView(initialPosition, mapRef.current.getZoom());
    }
  }, [initialPosition]);

  if (!isClient) {
    return <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />;
  }

  return <div ref={mapContainerRef} className="h-64 w-full rounded-lg" />;
}