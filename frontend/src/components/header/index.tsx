import { useContext } from 'react';
import { UserContext } from '@/contexts/userContext';

export default function Header() {
    const { user } = useContext(UserContext);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#F2F1EA]/80 backdrop-blur-lg border-b-2 border-[#E8E8E8] h-[66px] flex items-center">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="lg:absolute lg:left-[271px]">
                    <a href="/" className="w-[72px] h-[20px] relative">
                        COMPAIST
                    </a>
                </div>

                <div className="lg:absolute lg:right-[271px] flex items-center gap-[40px]">
                    <a
                        href="/map"
                        className="text-[13px] font-medium text-gray-700 hover:text-gray-900 transition-colors font-instrument-sans"
                    >
                        Map
                    </a>
                    
                    <a
                        href={  user ? '/dashboard' : '/login' }
                        className="text-[13px] font-medium bg-black text-white px-[13px] pt-[8px] pb-[8px] rounded-[7px] hover:bg-gray-800 transition-colors font-instrument-sans"
                    >
                        { user ? 'Dashboard' : 'Login' }
                    </a>
                </div>
            </div>
        </header>
    );
}
