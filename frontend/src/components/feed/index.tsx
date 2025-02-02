import classes from './styles.module.css';

export default function Feed(props: { feed: any[] }) {
    if (props.feed.length == 0) return <p className={ classes.noDeposists }>No recent deposits avaliable...</p>;

    return (
        <ul role="list" className="divide-y divide-gray-100">
            {props.feed.map((person) => (
                <li
                    key={person.email}
                    className="flex justify-between gap-x-6 py-5"
                >
                    <div className="flex min-w-0 gap-x-4">
                        <img
                            alt=""
                            src={person.imageUrl}
                            className="size-12 flex-none rounded-full bg-gray-50"
                        />

                        <div className="min-w-0 flex-auto">
                            <p className="text-sm/6 font-semibold text-gray-900">
                                {person.name}
                            </p>
                            <p className="mt-1 truncate text-xs/5 text-gray-500">
                                {person.email}
                            </p>
                        </div>
                    </div>

                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <p className="text-sm/6 text-gray-900">{person.role}</p>
                        {person.lastSeen ? (
                            <p className="mt-1 text-xs/5 text-gray-500">
                                Last seen{' '}
                                <time dateTime={person.lastSeenDateTime}>
                                    {person.lastSeen}
                                </time>
                            </p>
                        ) : (
                            <div className="mt-1 flex items-center gap-x-1.5">
                                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                    <div className="size-1.5 rounded-full bg-emerald-500" />
                                </div>
                                <p className="text-xs/5 text-gray-500">
                                    Online
                                </p>
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}
