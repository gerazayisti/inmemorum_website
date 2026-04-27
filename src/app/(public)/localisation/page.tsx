'use client';

import { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { FarewellSeparator } from '@/components/FarewellSeparator';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';

const PublicLocalisationMap = dynamic(() => import('@/components/Map/PublicLocalisationMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400">Chargement de la carte...</div>
});

const LIEU_TYPE_COLORS: Record<string, string> = {
  residence: '#A68B5B',
  ceremonie: '#8B5CF6',
  reception: '#10B981',
  autre: '#6B7280',
};

const LIEU_TYPE_LABELS: Record<string, string> = {
  residence: 'Résidence',
  ceremonie: 'Cérémonie',
  reception: 'Réception',
  autre: 'Autre',
};

export default function PublicLocalisation() {
  const [lieux, setLieux] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [selectedLieu, setSelectedLieu] = useState<any | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [routing, setRouting] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchLieux();

    // Géolocalisation du visiteur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
        () => {} // Silencieux si refusé
      );
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data?.show_localisation === false) {
        window.location.href = '/accueil';
      }
    } catch (e) {}
  };

  const fetchLieux = async () => {
    try {
      const res = await fetch('/api/lieux');
      const data = await res.json();
      setLieux(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getMapCenter = (): [number, number] => {
    const lieuxWithCoords = lieux.filter(l => l.latitude && l.longitude);
    if (lieuxWithCoords.length > 0) {
      return [lieuxWithCoords[0].latitude, lieuxWithCoords[0].longitude];
    }
    if (userPosition) return userPosition;
    return [5.9631, 10.1591]; // Default: Cameroun
  };

  const openDirections = (lieu: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lieu.latitude},${lieu.longitude}`;
    window.open(url, '_blank');
  };

  const getRoute = async (lieu: any) => {
    if (!userPosition) {
      toast.error("Géolocalisation requise pour l'itinéraire");
      return;
    }
    setRouting(true);
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${userPosition[1]},${userPosition[0]};${lieu.longitude},${lieu.latitude}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
        setRoute(coords);
        setSelectedLieu(lieu);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRouting(false);
    }
  };

  const getFullRoute = async () => {
    const points = lieux.filter(l => l.latitude && l.longitude);
    if (points.length < 2) {
      toast.error("Il faut au moins deux points pour tracer un itinéraire");
      return;
    }

    setRouting(true);
    try {
      const waypoints = points.map(p => `${p.longitude},${p.latitude}`).join(';');
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
        setRoute(coords);
        setSelectedLieu(null); // Deselect individual lieu when showing full route
      } else {
        toast.error("Impossible de calculer l'itinéraire complet");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors du calcul de l'itinéraire");
    } finally {
      setRouting(false);
    }
  };

  const openFullDirections = () => {
    const points = lieux.filter(l => l.latitude && l.longitude);
    if (points.length === 0) return;
    
    const baseUrl = "https://www.google.com/maps/dir/";
    const stops = points.map(p => `${p.latitude},${p.longitude}`).join('/');
    window.open(baseUrl + stops, '_blank');
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-farewell-cream overflow-hidden">
      {/* Map Area - First on mobile, last on PC */}
      <div className="flex-1 h-[50vh] md:h-full relative z-0 order-first md:order-last border-b md:border-b-0 border-farewell-stone">
        {loading ? (
          <div className="w-full h-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400">Chargement de la carte...</div>
        ) : lieux.some(l => l.latitude && l.longitude) ? (
          <div className="w-full h-full">
            <PublicLocalisationMap 
              lieux={lieux}
              userPosition={userPosition}
              selectedLieu={selectedLieu}
              route={route}
              onGetRoute={getRoute}
              getMapCenter={getMapCenter}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 font-serif italic">
            Aucun lieu défini sur la carte.
          </div>
        )}
      </div>

      {/* Sidebar / Bottom Sheet */}
      <div className="w-full md:w-[400px] lg:w-[450px] h-[50vh] md:h-full flex flex-col bg-white shadow-xl z-10 shrink-0 border-r-0 md:border-r border-farewell-stone">
        {/* Header inside sidebar */}
        <div className="p-6 border-b border-farewell-stone bg-white shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-farewell-gold/10 rounded-2xl">
              <MapPin className="text-farewell-gold" size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl font-serif text-farewell-charcoal uppercase tracking-widest leading-tight">Plan & Itinéraires</h2>
              <p className="text-stone-400 font-serif italic text-xs mt-1">Lieux des cérémonies</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-6 animate-pulse">
            <div className="h-24 bg-stone-100 rounded-2xl" />
            <div className="h-32 bg-stone-100 rounded-2xl" />
            <div className="h-32 bg-stone-100 rounded-2xl" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50 pb-20">
            {/* Actions globales */}
            {lieux.length >= 2 && (
              <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-farewell-stone shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation size={16} className="text-farewell-gold" />
                  <span className="font-serif italic text-stone-600 text-sm">Circuit de l'hommage</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={getFullRoute}
                    disabled={routing}
                    className="flex-1 flex justify-center items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white bg-farewell-charcoal px-3 py-3 rounded-xl hover:bg-farewell-gold transition disabled:opacity-50"
                  >
                    {routing ? 'Calcul...' : 'Tracer'}
                  </button>
                  <button
                    onClick={openFullDirections}
                    className="flex-1 flex justify-center items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-farewell-charcoal bg-white border border-farewell-stone px-3 py-3 rounded-xl hover:border-farewell-gold transition"
                  >
                    <ExternalLink size={14} />
                    Maps
                  </button>
                </div>
              </div>
            )}

            {/* Liste des lieux */}
            <div className="space-y-4">
              {lieux.map(lieu => (
                <div
                  key={lieu.id}
                  className={`bg-white p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    selectedLieu?.id === lieu.id 
                      ? 'border-farewell-gold shadow-md ring-1 ring-farewell-gold/20' 
                      : 'border-farewell-stone hover:border-farewell-gold/40 hover:shadow-sm'
                  }`}
                  onClick={() => {
                    if (selectedLieu?.id === lieu.id) {
                      setSelectedLieu(null);
                      setRoute([]);
                    } else {
                      setSelectedLieu(lieu);
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-2.5 rounded-xl shrink-0"
                      style={{ backgroundColor: `${LIEU_TYPE_COLORS[lieu.type] || LIEU_TYPE_COLORS.autre}15` }}
                    >
                      <MapPin size={20} style={{ color: LIEU_TYPE_COLORS[lieu.type] || LIEU_TYPE_COLORS.autre }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1 mb-1">
                        <h3 className="font-bold text-farewell-charcoal text-base">{lieu.nom}</h3>
                        <span
                          className="text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full inline-block w-fit"
                          style={{
                            backgroundColor: `${LIEU_TYPE_COLORS[lieu.type] || LIEU_TYPE_COLORS.autre}15`,
                            color: LIEU_TYPE_COLORS[lieu.type] || LIEU_TYPE_COLORS.autre,
                          }}
                        >
                          {LIEU_TYPE_LABELS[lieu.type] || lieu.type}
                        </span>
                      </div>
                      
                      {lieu.adresse && (
                        <p className="text-stone-500 text-xs font-light mt-2">{lieu.adresse}</p>
                      )}
                      
                      {lieu.description && (
                        <p className="text-stone-400 text-xs font-light mt-1.5 leading-relaxed line-clamp-2">{lieu.description}</p>
                      )}

                      {/* Distance depuis l'utilisateur */}
                      {userPosition && lieu.latitude && lieu.longitude && (
                        <p className="text-[9px] uppercase tracking-widest font-bold text-farewell-gold mt-3">
                          <Navigation size={10} className="inline mr-1" />
                          À {calculateDistance(userPosition[0], userPosition[1], lieu.latitude, lieu.longitude)}
                        </p>
                      )}

                      {/* Actions */}
                      {lieu.latitude && lieu.longitude && (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); getRoute(lieu); }}
                            disabled={routing}
                            className="flex-1 flex justify-center items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-white bg-farewell-gold py-2 rounded-lg hover:bg-farewell-charcoal transition disabled:opacity-50"
                          >
                            <Navigation size={12} />
                            Itinéraire
                          </button>
                          <a
                            href={`https://www.google.com/maps?q=${lieu.latitude},${lieu.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex justify-center items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-stone-500 bg-stone-100 py-2 rounded-lg hover:bg-stone-200 transition"
                          >
                            <ExternalLink size={12} />
                            Google Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lieux.length === 0 && (
              <div className="py-12 text-center bg-white rounded-2xl border border-farewell-stone">
                <MapPin className="mx-auto text-stone-200 mb-3" size={32} />
                <p className="text-stone-400 font-serif italic text-sm">Aucun lieu n'a été renseigné.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
