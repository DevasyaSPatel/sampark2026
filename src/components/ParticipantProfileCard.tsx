import { useRouter } from 'next/navigation';

type User = {
    id: string;
    name: string;
    theme: string;
    connections: number;
    bio?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
};

type ConnectionStatus = 'None' | 'Pending' | 'Accepted';

type Props = {
    user: User;
    isLoggedIn: boolean;
    connectionStatus: ConnectionStatus;
    isLoading?: boolean;
    onConnect: () => void;
};

export default function ParticipantProfileCard({
    user,
    isLoggedIn,
    connectionStatus,
    isLoading = false,
    onConnect
}: Props) {
    const router = useRouter();

    const handleMainAction = () => {
        // Scenario A (Logged Out)
        // Strict Logic Requirement: Redirect or Alert if not logged in.
        if (!isLoggedIn) {
            // Option 1: Alert
            // alert("Please log in to connect.");

            // Option 2: Redirect (Smoother UX)
            router.push('/login');
            return;
        }

        // Scenario B (Logged In & Not Connected)
        // Only trigger API if status is 'None'
        if (connectionStatus === 'None') {
            onConnect();
        }

        // Scenario C (Logged In & Already Connected/Pending)
        // Do nothing (Button is likely disabled, but safety check here)
    };

    // Determine Button State
    const getButtonState = () => {
        if (!isLoggedIn) {
            return {
                text: "Connect",
                disabled: false,
                style: "bg-blue-600 hover:bg-blue-500 text-white"
            };
        }

        switch (connectionStatus) {
            case 'Accepted':
                return {
                    text: "Connected",
                    disabled: true,
                    style: "bg-green-500/20 text-green-400 border border-green-500/50 cursor-default"
                };
            case 'Pending':
                return {
                    text: "Pending",
                    disabled: true,
                    style: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 cursor-default"
                };
            case 'None':
            default:
                return {
                    text: isLoading ? "Sending..." : "Connect",
                    disabled: isLoading,
                    style: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                };
        }
    };

    const buttonState = getButtonState();

    return (
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col items-center text-center shadow-2xl animate-fade-in relative z-10 transition-all hover:border-white/20">

            {/* Avatar / Initial */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#9333ea] flex items-center justify-center text-5xl font-bold text-white mb-6 shadow-xl ring-4 ring-white/5">
                {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Typography: Username & Theme */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                {user.name}
            </h2>

            <div className="inline-block px-3 py-1 bg-white/10 rounded-full border border-white/5 mb-8">
                <span className="text-sm font-medium text-blue-200 uppercase tracking-wider">
                    {user.theme || 'Participant'}
                </span>
            </div>

            {/* Stats: Connection Count */}
            <div className="mb-10 flex flex-col items-center">
                <span className="text-4xl font-bold text-white tabular-nums tracking-tight">
                    {user.connections}
                </span>
                <span className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">
                    Connections
                </span>
            </div>

            {/* Strict Action Button */}
            <button
                onClick={handleMainAction}
                disabled={buttonState.disabled}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 active:scale-95 ${buttonState.style} disabled:opacity-80 disabled:active:scale-100 disabled:cursor-not-allowed`}
            >
                {buttonState.text}
            </button>

            {!isLoggedIn && (
                <p className="mt-4 text-xs text-gray-500">
                    Log in required to connect
                </p>
            )}

        </div>
    );
}
