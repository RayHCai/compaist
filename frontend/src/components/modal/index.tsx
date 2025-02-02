import { PropsWithChildren } from 'react';

import classes from './styles.module.css';

export default function Modal({ children, onClose }: PropsWithChildren & {onClose: () => void }) {
    return (
        <div className={classes.modal}>
            <div className={classes.modalContent}>
                {children}

                <div style={ {alignSelf: 'center'} }>
                    <button className={classes.closeButton} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
