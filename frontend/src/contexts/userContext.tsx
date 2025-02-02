import { createContext, PropsWithChildren, useState } from 'react';

export const UserContext = createContext<
    {
        user: User | null;
        profile: any;
        setUser: (user: User | null) => void;
        setProfile: (_profile: any) => void;
    }
>({
    user: null,
    profile: null,
    setUser: (_user: User | null) => {},
    setProfile: (_profile: any) => {}
});

export default function UserContextWrapper(props: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    
    const [profile, setProfile] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser, profile, setProfile }}>
            {props.children}
        </UserContext.Provider>
    );
}
