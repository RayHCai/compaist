export default function LandingPage() {
    return (
        <main className="flex-1 flex flex-col items-center bg-[#f3f1ea]">
            <div className="w-full" style={{ height: '285px' }}>
                <p
                    className="font-instrument-sans uppercase tracking-[0.51em] leading-[133%] text-center text-[19px]"
                    style={{ paddingTop: '249px', marginBottom: '32px' }}
                >
                    INTRODUCING COMPAIST
                </p>
            </div>

            <h1
                className="text-[64px] leading-[83px] text-center px-4 lg:px-[314px]"
                style={{ marginTop: '0px', marginBottom: '0px' }}
            >
                <div className="whitespace-nowrap">
                    <span className="font-instrument-serif font-normal">
                        Automate{' '}
                    </span>

                    <span className="font-instrument-serif font-normal italic">
                        high quality{' '}
                    </span>

                    <span className="font-instrument-serif font-normal">
                        account research
                    </span>
                </div>

                <div className="font-instrument-serif font-normal">
                    to speed up your pipeline generation
                </div>
            </h1>

            <p className="text-[28px] text-center font-instrument-sans font-light px-4 lg:px-[314px] mt-[25px] mb-[48px] leading-[133%]">
                Compaist analyzes your accounts & surfaces insights
                <br className="hidden md:inline" />
                you'd normally spend hours uncovering.
            </p>

            <a href="/waitlist" style={{ marginTop: '-2px' }}>
                <div
                    className="inline-flex items-center bg-black text-white rounded-[10px] hover:bg-black/90 transition-colors font-instrument-sans"
                    style={{ width: '227px', height: '49px' }}
                >
                    <div className="flex items-center justify-center gap-5 w-full pl-[22px] pr-[17px]">
                        <span className="text-[19px] whitespace-nowrap">
                            Try it out
                        </span>

                        <div className="flex items-center gap-[14px]">
                            <div className="w-[36px] h-[15px] relative">
                                <img
                                    src="https://res.cloudinary.com/ducqjmtlk/image/upload/v1737918196/Arrow_1_tacbar.svg"
                                    alt="Arrow"
                                    width={36}
                                    height={15}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </main>
    );
}
