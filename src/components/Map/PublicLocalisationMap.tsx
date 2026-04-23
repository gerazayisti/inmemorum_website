'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapAutoCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface PublicMapProps {
  lieux: any[];
  userPosition: [number, number] | null;
  selectedLieu: any | null;
  route: [number, number][];
  onGetRoute: (lieu: any) => void;
  getMapCenter: () => [number, number];
}

export default function PublicLocalisationMap({ 
  lieux, 
  userPosition, 
  selectedLieu, 
  route, 
  onGetRoute, 
  getMapCenter 
}: PublicMapProps) {
  return (
    <MapContainer
      center={selectedLieu ? [selectedLieu.latitude, selectedLieu.longitude] : getMapCenter()}
      zoom={13}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapAutoCenter center={selectedLieu ? [selectedLieu.latitude, selectedLieu.longitude] : getMapCenter()} />
      
      {userPosition && (
        <Marker position={userPosition} icon={userIcon}>
          <Popup>Vous êtes ici</Popup>
        </Marker>
      )}

      {lieux.filter(l => l.latitude && l.longitude).map(lieu => (
        <Marker
          key={lieu.id}
          position={[lieu.latitude, lieu.longitude]}
          icon={icon}
        >
          <Popup>
            <div className="text-center space-y-1 p-1">
              <h4 className="font-bold text-sm">{lieu.nom}</h4>
              <p className="text-[10px] text-stone-500">
                {lieu.type === 'residence' ? 'Résidence' : lieu.type === 'ceremonie' ? 'Cérémonie' : 'Lieu'}
              </p>
              <button 
                onClick={() => onGetRoute(lieu)}
                className="text-[10px] text-farewell-gold font-bold uppercase mt-2 block mx-auto hover:underline"
              >
                Tracer l'itinéraire
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {route.length > 0 && (
        <Polyline positions={route} color="#A68B5B" weight={5} opacity={0.7} />
      )}
    </MapContainer>
  );
}
