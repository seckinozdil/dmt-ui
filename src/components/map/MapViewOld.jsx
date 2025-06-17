import { MapContainer, TileLayer, CircleMarker, Popup, Circle, Pane } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapView = ({ roadData = [] }) => {
    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'
        });
    }, []);

    const defaultPosition = [39.9, 32.8];

    return (
        <MapContainer center={defaultPosition} zoom={6} style={{ width: '100%', height: '750px' }}>
          
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {roadData.map((item, idx) => (
                <Circle key={idx} center={[item.latitude, item.longitude]} radius={4} pathOptions={{ color: 'blue', fillOpacity: 0.8 }} renderer={L.canvas()}>
                    <Popup>Route: {item.routeName}</Popup>
                </Circle>
            ))}
        </MapContainer>
    );
};

export default MapView;
