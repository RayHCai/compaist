import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Sidebar from '@/components/sidebar';
import Wallet from '@/components/wallet';

import { UserContext } from '@/contexts/userContext';

import { BACKEND_URL } from '@/settings';
import classes from './styles.module.css';

export default function Dashboard(props: { page: string }) {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [pins, updatePins] = useState([]);

    useEffect(() => {
        (async function () {
            const response = await fetch(`${BACKEND_URL}/map/getPin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user!.id,
                }),
            });

            const json = await response.json();

            updatePins(json.Success);
        })();
    }, []);
    
    return (
        <div className={classes.container}>
            <div className={classes.sidebarContainer}>
                <Sidebar />
            </div>

            <div className={classes.mainContentContainer}>
                <div className="min-h-screen flex flex-col gap-20">
                    {props.page === 'feed' && (
                        <>
                            <Wallet />

                            {/* <Feed feed={ [] } noContentString="No recent deposits avaliable..." /> */}
                        </>
                    )}

                    {props.page === 'pins' && (
                        <>
                            {pins.length === 0 && (
                                <p className={classes.noDeposists}>
                                    No pins avaliable...
                                </p>
                            )}

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                }}
                            >
                                {pins.map((pin: any) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                navigate(`/map/${pin.lat}/${pin.lng}`);
                                            }}
                                            key={pin.id}
                                            className="cursor-pointer bg-black p-4 rounded-md shadow-md text-white"
                                        >
                                            <h1 className="text-xl font-bold">
                                                {pin.name}
                                            </h1>

                                            <p className="text-sm text-gray-200">
                                                Num Visits: {pin.numVisits}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
