// File: src/components/ui/Routing.tsx

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';

interface RoutingProps {
  start: { lat: number, lng: number };
  end: { lat: number, lng: number };
}

// Definisikan ikon kustom
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const Routing = ({ start, end }: RoutingProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      routeWhileDragging: false,
      show: false, 
      addWaypoints: false,
      
      // @ts-ignore 
      draggableWaypoints: false,

      createMarker: function(i: number, waypoint: L.Routing.Waypoint, _n: number) {
        // Cek jika ini adalah titik poin pertama (pengguna)
        if (i === 0) {
          return L.marker(waypoint.latLng, {
            draggable: false,
            icon: blueIcon
          }).bindPopup("Lokasi Anda");
        } else {
          // Jika ini titik poin terakhir (kedai)
          
          // 1. Buat URL Google Maps
          const googleMapsUrl = `https://maps.app.goo.gl/81Ybuichp9CzszDk9`;
          
          // 2. Buat konten popup dengan link HTML
          const popupContent = `<b>Teh Solo OCHA</b><br/><a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #00F5D4;">Buka di Google Maps</a>`;

          return L.marker(waypoint.latLng, {
            draggable: false,
            icon: redIcon
          }).bindPopup(popupContent);
        }
      },

      lineOptions: {
        styles: [{ color: '#00F5D4', opacity: 0.8, weight: 6 }]
      } as L.Routing.LineOptions

    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
};

export default Routing;