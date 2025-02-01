import { createContext, PropsWithChildren, useState } from 'react';

export const UserContext = createContext<
    {
        user: User | null;
        setUser: (user: User | null) => void;
    }
>({
    user: null,
    setUser: (_user: User | null) => {}
});

export default function UserContextWrapper(props: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    );
}
