import Header from '@/components/header';
import LandingPage from '@/components/landingPage';
import Footer from '@/components/footer';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-[#f3f1ea]">
            <Header />
            <LandingPage />
            <Footer />
        </div>
    );
}
