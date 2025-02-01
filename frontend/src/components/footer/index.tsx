export default function Footer() {
    return (
        <footer className="bg-black text-gray-300 py-6 w-full mt-20">
            <div className="container mx-auto px-4 w-full">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full">
                    <div className="flex flex-col items-center lg:items-start gap-2 mb-8 lg:mb-0">
                        <div className="flex flex-wrap justify-center gap-4 lg:gap-12 text-sm">
                            <a
                                href="/about-us"
                                className="hover:opacity-80 font-instrument-sans"
                            >
                                About us
                            </a>

                            <a
                                href="/contact"
                                className="hover:opacity-80 font-instrument-sans"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    <div>
                        Made with ❤️ at SpartaHackX
                    </div>
                </div>
            </div>
        </footer>
    );
}

