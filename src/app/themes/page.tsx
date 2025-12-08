import Link from "next/link";

export default function Themes() {
    const themes = [
        {
            title: "Artificial Intelligence & Agents",
            icon: "🤖",
            scope: "Large Language Models, Autonomous Agents, Computer Vision, and Ethical AI.",
            color: "border-blue-500"
        },
        {
            title: "Sustainable Tech & Green Energy",
            icon: "🌱",
            scope: "Renewable Energy Solutions, Smart Grids, Waste Management, and Eco-friendly Materials.",
            color: "border-green-500"
        },
        {
            title: "Blockchain & Web3",
            icon: "🔗",
            scope: "DeFi, NFTs, Smart Contracts, Decentralized Identity, and Cross-chain protocols.",
            color: "border-purple-500"
        },
        {
            title: "IoT & Smart Cities",
            icon: "📡",
            scope: "Connected Devices, Smart Home Automation, Urban Planning, and Sensor Networks.",
            color: "border-orange-500"
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <nav className="glass fixed top-0 left-0 w-full z-50 px-6 py-4">
                <div className="container flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        Sampark 2026
                    </Link>
                    <Link href="/" className="text-gray-400 hover:text-white">
                        Back to Home
                    </Link>
                </div>
            </nav>

            <div className="container">
                <h1 className="text-4xl md:text-6xl font-bold mb-10 text-center">
                    Event <span className="gradient-text">Themes</span>
                </h1>
                <p className="text-xl text-center text-gray-400 max-w-3xl mx-auto mb-20">
                    Explore the cutting-edge tracks defined for Sampark 2026. Choose your arena and innovate for the future.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {themes.map((theme, index) => (
                        <div key={index} className={`glass p-8 border-l-4 ${theme.color} hover:bg-white/5 transition-colors`}>
                            <div className="text-4xl mb-4">{theme.icon}</div>
                            <h2 className="text-2xl font-bold mb-3">{theme.title}</h2>
                            <p className="text-gray-400 leading-relaxed">
                                {theme.scope}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-20">
                    <Link href="/register" className="btn btn-primary text-lg px-8 py-3">
                        Register for a Theme
                    </Link>
                </div>
            </div>
        </div>
    );
}
