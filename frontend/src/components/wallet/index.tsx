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
    original: number;
};

export default function Wallet(props: WalletProps) {
    const difference = Number(String(props.balance - props.original).substring(0, 9));
    console.log(difference);
    return (
        <div className={ classes.container }>
            <div className={ classes.headerContainer }>
                <h1>Overview</h1>
                <p>Aug 13, 2023 - Aug 18, 2023</p>
            </div>

            <div className={ classes.cardsContainer }>
                <Card title="Your Balance" stat={`${String(props.balance).substring(0, 8)} ETH`} />
                <Card title="Your Earnings" stat={`+${difference} ETH`} />
                <Card title="You've donated" stat={`${Math.ceil(difference / 0.05) * 10} lbs`} />
            </div>
        </div>
    );
}
