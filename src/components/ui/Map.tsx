// File: src/components/ui/Map.tsx

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { getDistance } from 'geolib';
import Routing from './Routing'; 

// Tentukan tipe data untuk posisi
type Position = { lat: number; lng: number };

const Map = () => {
  // Koordinat lokasi Teh Solo OCHA
  const sellerPosition: Position = { lat: -6.2268088, lng: 106.8710144 }; // Contoh: Pedati, Jakarta Timur

  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    // Minta lokasi pengguna saat komponen dimuat
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentUserPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPosition(currentUserPosition);

        // Hitung jarak setelah mendapatkan lokasi pengguna
        const dist = getDistance(
          { latitude: currentUserPosition.lat, longitude: currentUserPosition.lng },
          { latitude: sellerPosition.lat, longitude: sellerPosition.lng }
        );
        setDistance(dist / 1000); // Konversi ke kilometer
      },
      () => {
        console.error("Gagal mendapatkan lokasi pengguna.");
        // Set default user position jika izin ditolak (contoh: sekitar Tebet)
        setUserPosition({ lat: -6.2268088, lng: 106.8710144 }); 
      }
    );
  }, []); // Dependensi kosong agar hanya berjalan sekali

  if (!userPosition) {
    return <div className="text-center p-8">Memuat peta dan lokasi...</div>;
  }

  return (
    <section className="container mx-auto p-4 md:p-8">
      <div className="bg-[#1A202C] rounded-xl p-6 text-center mb-4">
        <h3 className="text-2xl font-bold font-sora mb-2">Temukan Kami</h3>
        {distance !== null ? (
          <p className="text-xl text-teal-400">
            Anda Berada <span className="font-bold">{distance.toFixed(2)} km</span> dari Teh Solo OCHA.
          </p>
        ) : (
          <p className="text-lg text-gray-400">Menghitung jarak...</p>
        )}
      </div>
      
      <div className="h-[400px] w-full rounded-xl overflow-hidden z-0">
        <MapContainer center={userPosition} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* LANGKAH 2: Ganti Marker dengan komponen Routing */}
          <Routing start={userPosition} end={sellerPosition} />
          
        </MapContainer>
      </div>
    </section>
  );
};

export default Map;