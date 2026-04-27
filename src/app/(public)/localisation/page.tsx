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
    <div className="bg-farewell-cream min-h-screen pb-40">
      {/* Header */}
      <header className="py-20 px-8 text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="p-1 bg-farewell-gold/20 rounded-full">
            <div className="p-4 bg-white rounded-full shadow-sm border border-farewell-stone">
              <MapPin className="text-farewell-gold" size={32} strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-farewell-charcoal uppercase tracking-widest leading-tight">Plan de Localisation</h2>
        <div className="w-12 h-[1px] bg-farewell-gold/40 mx-auto" />
        <p className="text-stone-500 font-serif italic text-lg leading-relaxed max-w-sm mx-auto">
          "Retrouvez les lieux importants liés aux cérémonies et à la famille."
        </p>
      </header>

      <FarewellSeparator />

      {/* Map + Liste */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-[500px] bg-white rounded-[2rem] border border-farewell-stone" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-32 bg-white rounded-2xl" />
              <div className="h-32 bg-white rounded-2xl" />
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Carte interactive */}
            {lieux.some(l => l.latitude && l.longitude) && (
              <div className="rounded-[2rem] overflow-hidden shadow-xl border-4 border-white" style={{ height: '500px' }}>
                <PublicLocalisationMap 
                  lieux={lieux}
                  userPosition={userPosition}
                  selectedLieu={selectedLieu}
                  route={route}
                  onGetRoute={getRoute}
                  getMapCenter={getMapCenter}
                />
              </div>
            )}

            {/* Actions globales */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/50 p-4 rounded-2xl border border-farewell-stone">
              <div className="flex items-center gap-2">
                <Navigation size={20} className="text-farewell-gold" />
                <span className="font-serif italic text-stone-600 text-sm">Itinéraires de l'hommage</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={getFullRoute}
                  disabled={routing || lieux.length < 2}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white bg-farewell-charcoal px-6 py-3 rounded-xl hover:bg-farewell-gold transition disabled:opacity-50 shadow-md"
                >
                  <Navigation size={14} />
                  {routing ? 'Calcul du circuit...' : 'Voir le circuit complet'}
                </button>
                {lieux.length >= 2 && (
                  <button
                    onClick={openFullDirections}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-farewell-charcoal bg-white border border-farewell-stone px-6 py-3 rounded-xl hover:border-farewell-gold transition shadow-sm"
                  >
                    <ExternalLink size={14} />
                    Google Maps (Multi-étapes)
                  </button>
                )}
              </div>
            </div>

            {/* Liste des lieux */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lieux.map(lieu => (
                <div
                  key={lieu.id}
                  className={`bg-white p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                    selectedLieu?.id === lieu.id ? 'border-farewell-gold shadow-lg' : 'border-farewell-stone hover:border-farewell-gold/40'
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
                      className="p-3 rounded-xl shrink-0"
                      style={{ backgroundColor: `${LIEU_TYPE_COLORS[lieu.type] || LIEU_TYPE_COLORS.autre}15` }}
                    >
                      <MapPin size={24} style={{ color: LIEU_TYPE_COLORS[lieu.type] || LIEU_TYPE_COLORS.autre }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-farewell-charcoal text-lg">{lieu.nom}</h3>
                        <span
                          className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${LIEU_TYPE_COLORS[lieu.type] || LIEU_TYPE_COLORS.autre}15`,
                            color: LIEU_TYPE_COLORS[lieu.type] || LIEU_TYPE_COLORS.autre,
                          }}
                        >
                          {LIEU_TYPE_LABELS[lieu.type] || lieu.type}
                        </span>
                      </div>
                      {lieu.adresse && (
                        <p className="text-stone-500 text-sm font-light">{lieu.adresse}</p>
                      )}
                      {lieu.description && (
                        <p className="text-stone-400 text-sm font-light mt-2 leading-relaxed">{lieu.description}</p>
                      )}

                      {/* Distance depuis l'utilisateur */}
                      {userPosition && lieu.latitude && lieu.longitude && (
                        <p className="text-[10px] uppercase tracking-widest font-bold text-farewell-gold mt-3">
                          <Navigation size={10} className="inline mr-1" />
                          À {calculateDistance(userPosition[0], userPosition[1], lieu.latitude, lieu.longitude)} de vous
                        </p>
                      )}

                      {/* Actions */}
                      {lieu.latitude && lieu.longitude && (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); getRoute(lieu); }}
                            disabled={routing}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white bg-farewell-gold px-4 py-2 rounded-xl hover:bg-farewell-charcoal transition disabled:opacity-50"
                          >
                            <Navigation size={12} />
                            {routing && selectedLieu?.id === lieu.id ? 'Calcul...' : 'Suivre sur le site'}
                          </button>
                          <a
                            href={`https://www.google.com/maps?q=${lieu.latitude},${lieu.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-farewell-charcoal px-4 py-2 rounded-xl transition"
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
              <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-farewell-stone shadow-inner">
                <MapPin className="mx-auto text-stone-200 mb-4" size={48} />
                <p className="text-stone-400 font-serif italic text-xl">Aucun lieu n'a été renseigné pour le moment.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <FarewellSeparator />
    </div>
  );
}
