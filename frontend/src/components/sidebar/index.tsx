import { PropsWithChildren } from 'react';
import { useNavigate, useLocation } from 'react-router';

import classes from './styles.module.css';

function SidebarElement(props: PropsWithChildren & { active: boolean }) {
    return (
        <div className={ `${classes.sidebarElement} ${ props.active && classes.active }` }>
            { props.children }
        </div>
    );
}

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className={ classes.sidebar }>
            <h1 onClick={ () => navigate('/dashboard') }>Compaist</h1>

            <div className={ classes.sidebarElements }>
                <div
                    onClick={
                        () => navigate('/dashboard')
                    }
                >
                    <SidebarElement
                        active={ location.pathname === '/dashboard' }
                    >
                        Compaists
                    </SidebarElement>
                </div>

                <div
                    onClick={
                        () => navigate('/dashboard/pins')
                    }
                >
                    <SidebarElement
                        active={ location.pathname === '/dashboard/pins' }
                    >
                        Your Pins
                    </SidebarElement>
                </div>
            </div>

            <div
                onClick={
                    () => navigate('/map')
                }
                className={ classes.bottom }
            >
                <SidebarElement
                    active={ true }
                >
                    Map
                </SidebarElement>
            </div>
        </div>
    );
}
