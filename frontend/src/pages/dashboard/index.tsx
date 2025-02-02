import Sidebar from '@/components/sidebar';
import Feed from '@/components/feed';
import Wallet from '@/components/wallet';

import classes from './styles.module.css';

export default function Dashboard(props: { page: string }) {
    return (
        <div className={ classes.container }>
            <div className={ classes.sidebarContainer }>
                <Sidebar />
            </div>

            <div className={ classes.mainContentContainer }>
                <div className="min-h-screen flex flex-col gap-20">
                    {
                        props.page === 'feed' && (
                            <>
                                <Wallet />

                                <Feed feed={ [] } />
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
