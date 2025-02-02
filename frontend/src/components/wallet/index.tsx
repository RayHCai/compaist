import { PropsWithChildren } from 'react';
import classes from './styles.module.css';

function Card(props: PropsWithChildren & { title: string; stat: string }) {
    return (
        <div className={ classes.cardContainer }>
            <h2>{ props.title }</h2>

            <h1>{ props.stat }</h1>
        </div>
    );
}

type WalletProps = {
    balance: number;
};

export default function Wallet(props: WalletProps) {
    return (
        <div className={ classes.container }>
            <div className={ classes.headerContainer }>
                <h1>Overview</h1>
                <p>Aug 13, 2023 - Aug 18, 2023</p>
            </div>

            <div className={ classes.cardsContainer }>
                <Card title="Your Balance" stat={`$${props.balance}`} />
                {/* <Card title="Your Deposits" stat="33" />
                <Card title="Pounds Donated" stat="33 lbs" /> */}
            </div>

        </div>
    );
}
