import { useState, useEffect } from 'react';
import MapView from '../map/MapView';
import api from '../../services/api';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

export const Road = () => {
    const [routeNames, setRouteNames] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState();
    const [kpiData, setKpiData] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [machineData, setMachineData] = useState([]);

    useEffect(() => {
        // Dummy fetch for unique route names from KPI
        api.get('/kpi/routeNames').then((res) => {
            setRouteNames(res.data);
        });
    }, []);

    useEffect(() => {
        if (selectedRoute) {
            api.get(`/kpi?routeName=${selectedRoute}`).then((res) => {
                setKpiData(res.data);
            });

            api.get('/machines/cities').then((res) => {
                setCities(res.data);
            });
        }
    }, [selectedRoute]);

    useEffect(() => {
        if (selectedCity) {
            api.get(`/machines?city=${selectedCity}`).then((res) => {
                setMachineData(res.data);
            });
        }
    }, [selectedCity]);

    const fillRoutes = routeNames?.map((e) => ({ name: e, value: e }));
    const fillCellCities = cities?.map((e) => ({ name: e, value: e }));

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div style={{ padding: '10px' }}>
                    <Dropdown id="routeNameDropdown" value={selectedRoute} onChange={(e) => setSelectedRoute(e.value)} options={fillRoutes} optionLabel="name" placeholder="Select Route" />
                    {selectedRoute && <Dropdown id="cityNameDropdown" value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={fillCellCities} optionLabel="name" placeholder="Select City" />}
                </div>
            </div>
            <div style={{ display: 'flex',  height: '1000px' }}>
                <MapView kpiData={kpiData} machineData={machineData} />
            </div>
        </>
    );
};
