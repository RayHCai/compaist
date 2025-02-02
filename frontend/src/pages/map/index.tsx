import { useState, useRef, useCallback, useEffect, useContext } from 'react';

import {
    APIProvider,
    Map,
    useMap,
    AdvancedMarker,
    MapCameraChangedEvent,
    Pin,
} from '@vis.gl/react-google-maps';

import Modal from '@/components/modal';
import { distanceBetweenPoints } from '@googlemaps/markerclusterer';
import { useNavigate } from 'react-router';

import { BACKEND_URL } from '@/settings';
import { UserContext } from '@/contexts/userContext';

import classes from './styles.module.css';

type Poi = { key: string; location: google.maps.LatLngLiteral };

export default function MapContainer() {
    const { user } = useContext(UserContext);

    const navigate = useNavigate();
    
    const [locations, setLocations] = useState<Poi[]>([]);

    const [currentLocation, setCurrentLocation] = useState<
        google.maps.LatLngLiteral | undefined
    >(undefined);

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [newLat, setNewLat] = useState(0);
    const [newLng, setNewLng] = useState(0);

    const locationName = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setCurrentLocation(pos);
            });
        }

        setLocations([
            { key: 'operaHouse', location: { lat: 42.73698, lng: -84.483864 } },
            { key: 'tarongaZoo', location: { lat: 42.93698, lng: -84.483164 } },
        ]);
    }, []);

    function createModal(lat: number, lng: number) {
        setCreateModalOpen(true);
        setNewLat(lat);
        setNewLng(lng);
    }

    async function createPin() {
        console.log(user);

        if (locationName.current) {
            const response = await fetch(`${BACKEND_URL}/map/pin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user!.id,
                    name: locationName.current.value,
                    lat: newLat,
                    lng: newLng,
                }),
            });

            const json = await response.json();

            console.log(json);

            setLocations([
                ...locations,
                {
                    key: locationName.current.value,
                    location: { lat: newLat, lng: newLng },
                },
            ]);
        }

        setCreateModalOpen(false);
    }

    return (
        <>
            {createModalOpen && (
                <Modal onClose={() => setCreateModalOpen(false)}>
                    <div className={classes.modalContent}>
                        <div className={classes.inputContainer}>
                            <label
                                htmlFor="price"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Location Name
                            </label>

                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-black-600">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        ref={locationName}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ alignSelf: 'center' }}>
                        <button
                            className={classes.closeButton}
                            onClick={createPin}
                        >
                            Create
                        </button>
                    </div>
                </Modal>
            )}

            <div style={{ height: '100vh', width: '100%' }}>
                <APIProvider
                    apiKey="AIzaSyBkj9JYHrTI5l4e9RMlgsDWdNsnjF0-Qc4"
                    onLoad={() => console.log('Maps API has loaded.')}
                >
                    <Map
                        defaultZoom={13}
                        defaultCenter={currentLocation}
                        onCameraChanged={(_ev: MapCameraChangedEvent) => {}}
                        mapId="da37f3254c6a6d1c"
                        onClick={(ev) => {
                            createModal(
                                ev.detail.latLng!.lat,
                                ev.detail.latLng!.lng
                            );
                        }}
                    >
                        <PoiMarkers
                            pois={locations}
                            currentLocation={currentLocation}
                        />
                    </Map>
                </APIProvider>
            </div>

            <button className={ classes.returnHomeButton } onClick={ () => navigate('/dashboard') }>Return home</button>
        </>
    );
}

function PoiMarkers(props: {
    pois: Poi[];
    currentLocation: google.maps.LatLngLiteral | undefined;
}) {
    const map = useMap();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [key, setKey] = useState('');

    const handleClick = useCallback(
        (ev: google.maps.MapMouseEvent, poi: Poi) => {
            if (!map) return;
            if (!ev.latLng) return;

            map.panTo(ev.latLng);

            setKey(poi.key);
            setDetailsOpen(true);
        },
        []
    );

    async function join() {
        setDetailsOpen(false);
    }

    return (
        <>
            {detailsOpen && (
                <Modal onClose={() => setDetailsOpen(false)}>
                    <div className={classes.poiModalContent}>
                        <h1>{key}</h1>

                        <p>
                            {Math.round(distanceBetweenPoints(
                                props.currentLocation!,
                                props.pois.filter((p) => p.key === key)[0]
                                    .location
                            ))} miles away
                        </p>
                    </div>

                    <div style={{ alignSelf: 'center' }}>
                        <button className={classes.closeButton} onClick={join}>
                            Join
                        </button>
                    </div>
                </Modal>
            )}

            {props.pois.map((poi: Poi) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}
                    clickable={true}
                    onClick={(ev) => handleClick(ev, poi)}
                >
                    <Pin
                        background={'#FBBC04'}
                        glyphColor={'#000'}
                        borderColor={'#000'}
                    />
                </AdvancedMarker>
            ))}
        </>
    );
}
