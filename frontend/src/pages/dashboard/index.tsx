import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Sidebar from '@/components/sidebar';
import Wallet from '@/components/wallet';
import Modal from '@/components/modal';

import { UserContext } from '@/contexts/userContext';

import { BACKEND_URL } from '@/settings';
import classes from './styles.module.css';

export default function Dashboard(props: { page: string }) {
    const navigate = useNavigate();
    const { user, profile } = useContext(UserContext);
    const [pins, updatePins] = useState([]);

    const [qrCode, updateQrCode] = useState('');

    const [balance, updateBalance] = useState(0);

    useEffect(() => {
        (async function () {
            const mapResponse = await fetch(`${BACKEND_URL}/map/getPin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user!.id,
                }),
            });

            const pin = await mapResponse.json();
            updatePins(pin);

            const response = await fetch(`${BACKEND_URL}/blockchain/balance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderPublic: profile!.publicKey,
                }),
            });
    
            const json = await response.json();
            updateBalance(json);
        })();
    }, []);

    if (!pins) return <>Loading.....</>;

    async function viewQRCode(id: number) {
        const response = await fetch(`${BACKEND_URL}/map/getQR`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pinId: id,
            }),
        });

        const json = await response.json();
        
        updateQrCode(json);
    }

    return (
        <>
            {
                qrCode.length !== 0 && (
                    <Modal onClose={() => updateQrCode('')} >
                        <img src={ qrCode } />
                    </Modal>
                )
            }

            <div className={classes.container}>
                <div className={classes.sidebarContainer}>
                    <Sidebar />
                </div>

                <div className={classes.mainContentContainer}>
                    <div className="min-h-screen flex flex-col gap-20">
                        {props.page === 'feed' && (
                            <>
                                <Wallet balance={ balance } original={ profile.firstAmount } />

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
                                                key={pin.id}
                                                className="cursor-pointer bg-black p-4 rounded-md shadow-md text-white flex justify-between items-center"
                                            >
                                                <div
                                                    onClick={() => {
                                                        navigate(
                                                            `/map/${pin.lat}/${pin.lng}`
                                                        );
                                                    }}
                                                >
                                                    <h1 className="text-xl font-bold">
                                                        {pin.name}
                                                    </h1>

                                                    <p className="text-sm text-gray-200">
                                                        Num Visits:{' '}
                                                        {pin.numVisits}
                                                    </p>
                                                </div>

                                                <div>
                                                    <button
                                                        className={
                                                            classes.qrButton
                                                        }
                                                        onClick={() => viewQRCode(pin.id)}
                                                    >
                                                        View QR Code
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
