import { useState, useEffect } from 'react';
import { GridMapView } from '../map/MapView';
import api from '../../services/api';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';

export const Grid = () => {
    const [inputText, setInputText] = useState('');
    const [center, setCenter] = useState(null);
    const [selectedKpi, setSelectedKpi] = useState(null);
    const [showCells, setShowCells] = useState(false);

    const kpiOptions = [
        { label: 'RSRP', value: 'rsrp' },
        { label: 'RSRQ', value: 'rsrq' },
        { label: 'SINR', value: 'rssinr' },
        { label: 'Block', value: 'block' },
        { label: 'DL TP', value: 'dl_throughput' },
        { label: 'UL TP', value: 'ul_throughput_mb' }
    ];
    const rangeoptions = [
        { label: '1 KM', value: 1 },
        { label: '2 KM', value: 2 },
        { label: '3 KM', value: 3 }
    ];
    const [selectedRange, setSelectedRange] = useState(rangeoptions[0].value);
    const handleGoClick = async () => {
        const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
        if (coordRegex.test(inputText.trim())) {
            // Koordinat girilmiş
            const [lat, lng] = inputText.split(',').map(Number);
            setCenter({ lat, lng });
        } else {
            // Adres girilmiş - geocoding yapılmalı
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputText)}&format=json`);
                const data = await res.json();
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
                } else {
                    alert('Adres bulunamadı');
                }
            } catch (err) {
                console.error('Adres çözümleme hatası:', err);
            }
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', gap: '10px' }}>
                <InputTextarea autoResize rows={1} cols={40} placeholder="Adres ya da 'lat,lng' girin" value={inputText} onChange={(e) => setInputText(e.target.value)} />
                <Button label="Git" icon="pi pi-search" onClick={handleGoClick} />
                <Dropdown value={selectedRange} options={rangeoptions} onChange={(e) => setSelectedRange(e.value)} placeholder="Mesafe Secin" className="ml-2" />
                <ToggleButton onLabel="Cell Göster" offLabel="Cell Kapat" onIcon="pi pi-check" offIcon="pi pi-times" checked={showCells} onChange={(e) => setShowCells(e.value)} className="ml-3" />
                <Dropdown value={selectedKpi} options={kpiOptions} onChange={(e) => setSelectedKpi(e.value)} placeholder="KPI seçin" className="ml-2" />
            </div>
            <GridMapView center={center} selectedKpi={selectedKpi} showCells={showCells} range={selectedRange} />
        </>
    );
};
