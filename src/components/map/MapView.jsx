// MapView.jsx
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Map, Popup } from 'react-map-gl/maplibre';
import { ScatterplotLayer, PolygonLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react';
import { GridMapLegend, RoadMapLegend } from './Legend';
import { KPI_RANGES } from '../../helpers/kpi_range';
import api from '../../services/api';
import debounce from 'lodash/debounce';
import { Link, Navigate } from 'react-router-dom';
import { SingleRoadData } from '../road/SingleRoadData';
import { Dialog } from 'primereact/dialog';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { getOffsetCoordinates, findEdges, createSquarePolygonFromCenter, getColorFromValue, getGridColorFromValue, KPI_COLORS, createSectorPolygon } from '../../helpers/map';

export const RoadMapView = ({ roadData = [], selectedKpi, showCells }) => {
    const mapRef = useRef();
    const INITIAL_VIEW_STATE = {
        longitude: 34.942017,
        latitude: 39.121537,
        zoom: 6,
        pitch: 0,
        bearing: 0
    };
    const [popupInfo, setPopupInfo] = useState(null);
    const [hexPopupInfo, setHexPopupInfo] = useState(null);
    const [cellPopupInfo, setCellPopupInfo] = useState(null);
    const [zoom, setZoom] = useState(INITIAL_VIEW_STATE.zoom);
    const [selectedPoint, setSelectedPoint] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [bounds, setBounds] = useState(null);

    const [cellData, setCellData] = useState([]);

    useEffect(() => {
        const fetchCells = debounce(() => {
            if (showCells && zoom >= 12 && bounds) {
                const boundsString = encodeURIComponent(JSON.stringify(bounds));
                api.get(`/cells?bounds=${boundsString}`).then((res) => {
                    setCellData(res.data);
                });
            } else {
                setCellData([]);
            }
        }, 350); // 500ms bekle

        fetchCells();

        return () => fetchCells.cancel(); // cleanup
    }, [bounds, zoom, showCells]);

    const handleMoveEnd = () => {
        const map = mapRef.current?.getMap();
        if (!map) return;

        const b = map.getBounds();
        if (b) {
            const ne = b.getNorthEast();
            const sw = b.getSouthWest();
            setBounds({
                lat_max: ne.lat,
                lat_min: ne.lng,
                lon_max: sw.lat,
                lon_min: sw.lng
            });
        }
    };

    function getRadiusByZoom(zoom) {
        if (zoom < 6) return 8000;
        if (zoom < 8) return 4000;
        if (zoom < 10) return 2000;
        if (zoom < 12) return 1000;
        return 500;
    }

    useEffect(() => {
        if (zoom < 10) {
            setSelectedPoint(null);
            setPopupInfo(null);
            setCellPopupInfo(null);
        }
    }, [zoom]);

    // const getColorFromValue = (value, kpi) => {
    //     if (value === null || value === undefined) return [200, 200, 200];
    //     const colorHex = KPI_COLORS[kpi];
    //     if (!colorHex) return [200, 200, 200];
    //     let index = 3; // default kırmızı

    //     switch (kpi) {
    //         case 'rsrp':
    //             if (value >= -75) index = 0; // Yeşil
    //             else if (value >= -100) index = 1; // Sarı
    //             else if (value >= -120) index = 2; // Turuncu
    //             break;
    //         case 'rsrq':
    //             if (value >= -8) index = 0;
    //             else if (value >= -14) index = 1;
    //             else if (value >= -18) index = 2;
    //             break;
    //         case 'avg_dl_throughput':
    //             if (value >= 50000) index = 0;
    //             else if (value >= 10000) index = 1;
    //             else if (value >= 5000) index = 2;
    //             break;
    //         case 'block':
    //             if (value === 0) index = 0;
    //             else if (value <= 2) index = 1;
    //             else if (value <= 4) index = 2;
    //             break;
    //         default:
    //             index = 3;
    //     }
    //     const hex = colorHex[index] || '#cccccc';
    //     const rgb = hex.match(/[\da-f]{2}/gi)?.map((h) => parseInt(h, 16)) || [200, 200, 200];
    //     return rgb;
    // };

    // const getTooltip = ({ object }) => {
    //     if (!object || zoom < 12) return null;

    //     return {
    //         html: `
    //   <div>
    //     <strong>Date:</strong> ${object.date} <br/>
    //     <strong>Region:</strong> ${object.region_name} <br/>
    //     <strong>Route:</strong> ${object.route} <br/>
    //     <strong>Cell ID:</strong> ${object.siteid_cellid} <br/>
    //     <strong>RSRP:</strong> ${object.rsrp} <br/>
    //     <strong>RSRQ:</strong> ${object.rsrq} <br/>
    //     <strong>DL TP:</strong> ${object.avg_dl_throughput}
    //   </div>
    // `,
    //         style: {
    //             backgroundColor: 'white',
    //             color: 'black',
    //             fontSize: '13px',
    //             padding: '8px',
    //             borderRadius: '4px',
    //             boxShadow: '0 0 6px rgba(0,0,0,0.3)',
    //             zIndex: 9999
    //         }
    //     };
    // };

    const scatterplotLayer = useMemo(
        () =>
            new ScatterplotLayer({
                id: 'scatter-layer',
                data: roadData,
                visible: zoom >= 12,
                pickable: true,
                getPosition: (d) => [d.longitude, d.latitude],
                getFillColor: (d) => getColorFromValue(d[selectedKpi], selectedKpi),
                getLineColor: (d) => (d.siteid_cellid === selectedPoint?.siteid_cellid ? [0, 0, 255] : [255, 255, 255]),
                getRadius: (d) => (d.siteid_cellid === selectedPoint?.siteid_cellid ? 200 : 100),
                getLineWidth: 100,
                radiusMinPixels: 2,
                radiusMaxPixels: 10,
                onClick: (info) => {
                    if (info?.object) {
                        setSelectedPoint(info.object);
                        setPopupInfo({
                            longitude: info.object.longitude,
                            latitude: info.object.latitude,
                            screenX: info.x,
                            screenY: info.y,
                            object: info.object
                        });
                    } else {
                        setPopupInfo(null);
                        setSelectedPoint(null);
                    }
                },
                onHover: (info) => {
                    document.body.style.cursor = info.object ? 'pointer' : 'default';
                },
                updateTriggers: {
                    getFillColor: [selectedKpi],
                    getLineColor: [selectedPoint?.siteid_cellid],
                    getRadius: [selectedPoint?.siteid_cellid]
                }
            }),
        [roadData, zoom, selectedPoint, selectedKpi]
    );

    const hexagonLayer = useMemo(() => {
        const radius = getRadiusByZoom(zoom);
        return new HexagonLayer({
            id: 'hexagon-layer',
            data: roadData,
            visible: zoom < 12,
            pickable: true,
            getPosition: (d) => [d.longitude, d.latitude],
            radius: radius,
            opacity: 0.6,
            coverage: 0.9,
            upperPercentile: 100,
            extruded: false,
            // getColorValue: (points) => {
            //     const values = points.map((p) => p[selectedKpi]).filter((v) => typeof v === 'number');
            //     const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            //     return avg;
            // },
            // colorRange: KPI_COLORS[selectedKpi]?.map((hex) => hex.match(/[\da-f]{2}/gi)?.map((h) => parseInt(h, 16))) || [],
            getColorValue: (points) => {
                const values = points.map((p) => p[selectedKpi]).filter((v) => typeof v === 'number');
                const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
                return avg;
            },
            colorRange:
                KPI_COLORS[selectedKpi]?.map((hex) => {
                    const rgb = hex.match(/[\da-f]{2}/gi)?.map((h) => parseInt(h, 16));
                    return [...rgb, 255];
                }) || [],
            colorDomain: selectedKpi === 'rsrp' ? [-150, -75] : selectedKpi === 'rsrq' ? [-20, -8] : selectedKpi === 'avg_dl_throughput' ? [0, 50000] : selectedKpi === 'block' ? [0, 5] : [0, 1],
            onClick: (info) => {
                if (info?.object) {
                    const points = info.object.points;
                    const values = points.map((p) => p[selectedKpi]).filter((v) => typeof v === 'number');
                    const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
                    setHexPopupInfo({
                        longitude: info.coordinate[0],
                        latitude: info.coordinate[1],
                        screenX: info.x,
                        screenY: info.y,
                        count: info.object.count,
                        averageKpi: average.toFixed(2),
                        kpiLabel: selectedKpi
                    });
                }
            },
            updateTriggers: {
                getColorValue: [selectedKpi],
                colorRange: [selectedKpi]
            }
        });
    }, [roadData, zoom, selectedKpi]);

    // function createSectorPolygon(center, radiusInMeters, azimuth, beamwidth, steps = 30) {
    //     const [lon, lat] = center;
    //     const toRad = (deg) => (deg * Math.PI) / 180;
    //     const coords = [[lon, lat]];

    //     const latRad = toRad(lat);
    //     const degLatPerMeter = 1 / 110574;
    //     const degLonPerMeter = 1 / (111320 * Math.cos(latRad));

    //     const startAngle = azimuth - beamwidth / 2;
    //     const endAngle = azimuth + beamwidth / 2;

    //     for (let i = 0; i <= steps; i++) {
    //         const angle = toRad(startAngle + (i * (endAngle - startAngle)) / steps);
    //         const dx = Math.cos(angle) * radiusInMeters;
    //         const dy = Math.sin(angle) * radiusInMeters;
    //         const point = [lon + dx * degLonPerMeter, lat + dy * degLatPerMeter];
    //         coords.push(point);
    //     }

    //     coords.push([lon, lat]);
    //     return coords;
    // }
    const cellLayer = useMemo(() => {
        if (!showCells || !cellData.length) return null;

        const sectors = cellData.map((cell) => {
            const center = [cell.longitude, cell.latitude];
            const azimuth = cell.azimuth || 0;
            const beamwidth = cell.beamwidth || 60;
            const polygon = createSectorPolygon(center, 50, azimuth, beamwidth);
            return {
                ...cell,
                polygon
            };
        });

        return new PolygonLayer({
            id: 'cell-layer',
            data: sectors,
            getPolygon: (d) => d.polygon,
            getFillColor: [100, 100, 100, 90],
            getLineColor: [80, 80, 80],
            lineWidthMinPixels: 1,
            pickable: true,
            onClick: (info) => {
                if (info?.object) {
                    setCellPopupInfo({
                        longitude: info.object.longitude,
                        latitude: info.object.latitude,
                        screenX: info.x,
                        screenY: info.y,
                        object: info.object
                    });
                } else {
                    setCellPopupInfo(null);
                }
            }
        });
    }, [showCells, cellData]);

    const onHideEditModal = () => {
        setSelectedPoint(null);
        setModalOpen(false);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                // layers={[hexagonLayer, scatterplotLayer]}
                layers={[hexagonLayer, scatterplotLayer, cellLayer].filter(Boolean)}
                onViewStateChange={({ viewState }) => setZoom(viewState.zoom)}
                onClick={(e) => {
                    if (!e.object) setPopupInfo(null);
                    if (!e.object) setHexPopupInfo(null);
                    if (!e.object) setCellPopupInfo(null);
                }}
                onDragEnd={handleMoveEnd}
                // getTooltip={getTooltip}
            >
                <Map ref={mapRef} mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json">
                    {/* {popupInfo && (
                        <Popup longitude={popupInfo?.longitude} latitude={popupInfo?.latitude} anchor="top" closeOnClick={false} onClose={() => setPopupInfo(null)} style={{ zIndex: 9999 }}>
                            <div style={{ fontSize: '13px', color: 'black' }}>
                                <strong>Date:</strong> {popupInfo.object.date} <br />
                                <strong>Region:</strong> {popupInfo.object.region_name} <br />
                                <strong>Route:</strong> {popupInfo.object.route} <br />
                                <strong>Cell ID:</strong> {popupInfo.object.siteid_cellid} <br />
                                <strong>RSRP:</strong> {popupInfo.object.rsrp} <br />
                                <strong>RSRQ:</strong> {popupInfo.object.rsrq} <br />
                                <strong>DL TP:</strong> {popupInfo.object.avg_dl_throughput}
                            </div>
                        </Popup>
                    )}
                    {hexPopupInfo && (
                        <Popup longitude={hexPopupInfo?.longitude} latitude={hexPopupInfo?.latitude} anchor="top" closeOnClick={false} onClose={() => setPopupInfo(null)}>
                            <div style={{ fontSize: '13px', color: 'black' }}>
                                <strong>Points in Hex:</strong> {hexPopupInfo.count}
                                <br />
                                <strong>Avg {hexPopupInfo.kpiLabel}:</strong> {hexPopupInfo.averageKpi}
                            </div>
                        </Popup>
                    )} */}
                </Map>
                {popupInfo && (
                    <div
                        style={{
                            position: 'absolute',
                            left: `${popupInfo.screenX}px`,
                            top: `${popupInfo.screenY}px`,
                            backgroundColor: 'white',
                            padding: '8px',
                            borderRadius: '4px',
                            boxShadow: '0 0 6px rgba(0,0,0,0.3)',
                            fontSize: '13px',
                            color: 'black',
                            zIndex: 9999
                        }}
                    >
                        <strong>Date:</strong> {popupInfo.object.date}
                        <br />
                        <strong>Region:</strong> {popupInfo.object.region_name}
                        <br />
                        <strong>Route:</strong> {popupInfo.object.route}
                        <br />
                        <strong>Cell ID:</strong> {popupInfo.object.siteid_cellid}
                        <br />
                        <strong>RSRP:</strong> {popupInfo.object.rsrp}
                        <br />
                        <strong>RSRQ:</strong> {popupInfo.object.rsrq}
                        <br />
                        <strong>DL TP:</strong> {popupInfo.object.avg_dl_throughput}
                        <br />
                        <span
                            style={{
                                color: 'blue',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                display: 'inline-block',
                                marginTop: '6px'
                            }}
                            onMouseDown={() => {
                                setModalOpen(true); // modal'ı aç
                                setPopupInfo(null); // popup'ı kapat
                            }}
                        >
                            More Info
                        </span>
                    </div>
                )}
                {hexPopupInfo && (
                    <div
                        style={{
                            position: 'absolute',
                            left: `${hexPopupInfo.screenX}px`,
                            top: `${hexPopupInfo.screenY}px`,
                            backgroundColor: 'white',
                            padding: '8px',
                            borderRadius: '4px',
                            boxShadow: '0 0 6px rgba(0,0,0,0.3)',
                            fontSize: '13px',
                            color: 'black',
                            zIndex: 9999
                        }}
                    >
                        <strong>Points in Hex:</strong> {hexPopupInfo.count}
                        <br />
                        <strong>Avg {hexPopupInfo.kpiLabel}:</strong> {hexPopupInfo.averageKpi}
                    </div>
                )}
                {cellPopupInfo && (
                    <div
                        style={{
                            position: 'absolute',
                            left: `${cellPopupInfo.screenX}px`,
                            top: `${cellPopupInfo.screenY}px`,
                            backgroundColor: 'white',
                            padding: '8px',
                            borderRadius: '4px',
                            boxShadow: '0 0 6px rgba(0,0,0,0.3)',
                            fontSize: '13px',
                            color: 'black',
                            zIndex: 9999
                        }}
                    >
                        <strong>Cell Name:</strong> {cellPopupInfo.object.cellname}
                        <br />
                        <strong>SiteId:</strong> {cellPopupInfo.object.siteid}
                        <br />
                        <strong>City:</strong> {cellPopupInfo.object.city}
                        <br />
                        <strong>District:</strong> {cellPopupInfo.object.district}
                        <br />
                        <strong>Azimuth:</strong> {cellPopupInfo.object.azimuth}
                        <br />
                    </div>
                )}
                <RoadMapLegend selectedKPI={selectedKpi} position="bottom-right" />
            </DeckGL>
            {modalOpen && selectedPoint && <SingleRoadData isOpen={modalOpen} selectedRoadId={selectedPoint.id} siteid_cellid={selectedPoint.siteid_cellid} onHideEditModal={onHideEditModal} />}
        </div>
    );
};

export const GridMapView = ({ center, selectedKpi, showCells, range}) => {
    const [viewState, setViewState] = useState({
        longitude: 34.942017,
        latitude: 39.121537,
        zoom: 6,
        pitch: 0,
        bearing: 0
    });

    const [gridData, setGridData] = useState([]);
    const [gridPopup, setGridPopup] = useState(null);
    const [cellData, setCellData] = useState([]);
    const [zoom, setZoom] = useState(viewState.zoom);
    const [cellPopupInfo, setCellPopupInfo] = useState(null);

    useEffect(() => {
        if (!center) return;

        if (center) {
            setViewState((prev) => ({
                ...prev,
                longitude: center.lng,
                latitude: center.lat,
                zoom: 14
            }));

            const offsetCoords = findEdges(center.lng, center.lat, range);
            const offsetCoordsString = encodeURIComponent(JSON.stringify(offsetCoords.bounds));

            api.get(`/grid?offsetCoords=${offsetCoordsString}`).then((res) => {
                setGridData(res.data);
            });
        }
    }, [center]);

    useEffect(() => {
        if (!center) return;

        const fetchCells = debounce(() => {
            if (showCells && zoom >= 9) {
                const offsetCoords = findEdges(center.lng, center.lat);
                const offsetCoordsString = encodeURIComponent(JSON.stringify(offsetCoords.bounds));
                
                api.get(`/cells?bounds=${offsetCoordsString}`).then((res) => {
                    setCellData(res.data);
                });
            } else {
                setCellData([]);
            }
        }, 350); // 500ms bekle

        fetchCells();

        return () => fetchCells.cancel(); // cleanup
    }, [zoom, showCells]);

    const kpiRange = KPI_RANGES[selectedKpi];
    
    // İçeride render edilir:
    const centerMarker = useMemo(() => {
        if (!center) return null;
        return new ScatterplotLayer({
            id: 'center-marker',
            data: [center],
            getPosition: (d) => [d.lng, d.lat],
            getFillColor: [0, 0, 255, 200],
            getRadius: 30,
            radiusMinPixels: 5,
            pickable: false
        });
    }, [center, selectedKpi]);

    const polygonLayer = useMemo(() => {
        if (!gridData || !gridData.length || !selectedKpi) return null;

        return new PolygonLayer({
            id: 'polygon-grid',
            data: gridData.map((d) => ({
                polygon: createSquarePolygonFromCenter(d.latitude, d.longitude),
                kpi_name: selectedKpi,
                value: d[selectedKpi],
                lat: d.latitude,
                lon: d.longitude,
                siteid_cellid: d.siteid_cellid
            })),
            pickable: true,
            stroked: false,
            filled: true,
            extruded: false,
            getPolygon: (d) => d.polygon,
            getFillColor: (d) => getGridColorFromValue(selectedKpi, d.value),
            getLineColor: [0, 0, 0, 50],
            lineWidthMinPixels: 1,
            onClick: (info) => {
                if (info?.object) {
                    setGridPopup({
                        longitude: info.object.longitude,
                        latitude: info.object.latitude,
                        screenX: info.x,
                        screenY: info.y,
                        object: info.object
                    });
                } else {
                    setGridPopup(null);
                }
            }
        });
    }, [gridData, selectedKpi]);

    const cellLayer = useMemo(() => {
        if (!showCells || !cellData.length) return null;

        const sectors = cellData.map((cell) => {
            const center = [cell.longitude, cell.latitude];
            const azimuth = cell.azimuth || 0;
            const beamwidth = cell.beamwidth || 60;
            const polygon = createSectorPolygon(center, 50, azimuth, beamwidth);
            return {
                ...cell,
                polygon
            };
        });

        return new PolygonLayer({
            id: 'cell-layer',
            data: sectors,
            getPolygon: (d) => d.polygon,
            getFillColor: [100, 100, 100, 90],
            getLineColor: [80, 80, 80],
            lineWidthMinPixels: 1,
            pickable: true,
            onClick: (info) => {
                if (info?.object) {
                    setCellPopupInfo({
                        longitude: info.object.longitude,
                        latitude: info.object.latitude,
                        screenX: info.x,
                        screenY: info.y,
                        object: info.object
                    });
                } else {
                    setCellPopupInfo(null);
                }
            }
        });
    }, [showCells, cellData]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <DeckGL
                initialViewState={viewState}
                viewState={viewState}
                onViewStateChange={({ viewState }) => {
                    setViewState(viewState);
                    setZoom(viewState.zoom);
                }}
                controller={true}
                layers={[polygonLayer, cellLayer, centerMarker].filter(Boolean)}
                onClick={(e) => {
                    if (!e.object) setGridPopup(null);
                    if (!e.object) setCellPopupInfo(null);
                }}
            >
                <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"></Map>
            </DeckGL>
            {selectedKpi && kpiRange && <GridMapLegend min={kpiRange.min} max={kpiRange.max} gradient={kpiRange.gradient} />}
            {gridPopup && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${gridPopup.screenX}px`,
                        top: `${gridPopup.screenY}px`,
                        backgroundColor: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        boxShadow: '0 0 6px rgba(0,0,0,0.3)',
                        fontSize: '13px',
                        color: 'black',
                        zIndex: 9999
                    }}
                >
                    <strong>Kpi Name:</strong> {gridPopup.object.kpi_name}
                    <br />
                    <strong>Kpi Value:</strong> {gridPopup.object.value}
                    <br />
                    <strong>Site ID - Cell ID:</strong> {gridPopup.object.siteid_cellid}
                    <br />
                    <strong>Latitude:</strong> {gridPopup.object.lat}
                    <br />
                    <strong>longitude:</strong> {gridPopup.object.lon}
                    <br />
                </div>
            )}
            {cellPopupInfo && (
                    <div
                        style={{
                            position: 'absolute',
                            left: `${cellPopupInfo.screenX}px`,
                            top: `${cellPopupInfo.screenY}px`,
                            backgroundColor: 'white',
                            padding: '8px',
                            borderRadius: '4px',
                            boxShadow: '0 0 6px rgba(0,0,0,0.3)',
                            fontSize: '13px',
                            color: 'black',
                            zIndex: 9999
                        }}
                    >
                        <strong>Cell Name:</strong> {cellPopupInfo.object.cellname}
                        <br />
                        <strong>SiteId:</strong> {cellPopupInfo.object.siteid}
                        <br />
                        <strong>City:</strong> {cellPopupInfo.object.city}
                        <br />
                        <strong>District:</strong> {cellPopupInfo.object.district}
                        <br />
                        <strong>Azimuth:</strong> {cellPopupInfo.object.azimuth}
                        <br />
                    </div>
                )}
        </div>
    );
};
