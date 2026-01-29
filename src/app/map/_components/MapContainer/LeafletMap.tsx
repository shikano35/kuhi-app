import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { HaikuMonument } from '@/types/definitions/haiku';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const iconDefault = L.Icon.Default.prototype as {
  _getIconUrl?: () => void;
};
delete iconDefault._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type LeafletMapProps = {
  monuments: HaikuMonument[];
  onMarkerClick: (monument: HaikuMonument) => void;
};

export default function LeafletMap({
  monuments,
  onMarkerClick,
}: LeafletMapProps) {
  const center: [number, number] = [36.2048, 138.2529];
  const zoom = 6;

  return (
    <MapContainer
      center={center}
      className="h-full w-full"
      scrollWheelZoom={true}
      zoom={zoom}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {monuments.map((monument) => {
        const location = monument.locations[0];
        if (!location || !location.latitude || !location.longitude) {
          return null;
        }

        return (
          <Marker
            eventHandlers={{
              click: () => onMarkerClick(monument),
            }}
            key={monument.id}
            position={[location.latitude, location.longitude]}
          />
        );
      })}
    </MapContainer>
  );
}
