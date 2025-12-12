import React from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Clock, Check, Calendar, Star, Hash } from 'lucide-react';

type ConnectionStatus = 'None' | 'Pending' | 'Accepted';

interface ParticipantProfileCardProps {
    user: {
        id: string;
        name: string;
        theme: string;
        connections: number;
        bio?: string;
        linkedin?: string;
        instagram?: string;
        github?: string;
        participationType?: string;
    };
    isLoggedIn: boolean;
    connectionStatus: ConnectionStatus;
    isLoading?: boolean;
    onConnect: () => void;
}

const ParticipantProfileCard: React.FC<ParticipantProfileCardProps> = ({
    user,
    isLoggedIn,
    connectionStatus,
    isLoading = false,
    onConnect,
}) => {
    const router = useRouter();

    const handleMainAction = () => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        if (connectionStatus === 'None') {
            onConnect();
        }
    };

    const getButtonContent = () => {
        if (!isLoggedIn) return <><UserPlus size={18} /> Connect</>;
        if (isLoading) return <span className="animate-pulse">Sending...</span>;
        if (connectionStatus === 'Accepted') return <><Check size={18} /> Connected</>;
        if (connectionStatus === 'Pending') return <><Clock size={18} /> Request Sent</>;
        return <><UserPlus size={18} /> Connect</>;
    };

    const isButtonDisabled = isLoggedIn && (
        connectionStatus === 'Accepted' ||
        connectionStatus === 'Pending' ||
        isLoading
    );

    // Dynamic Button Styles based on state
    const getButtonStyle = () => {
        if (connectionStatus === 'Accepted') {
            return "bg-green-50 text-green-700 border border-green-200 cursor-default";
        }
        if (connectionStatus === 'Pending') {
            return "bg-gray-100 text-ieee-navy border border-gray-200 cursor-default";
        }
        // Default Connect State
        return "bg-ieee-blue hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95";
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            <div className="p-6 flex flex-col items-center text-center flex-grow">
                {/* Avatar */}
                <div className="w-24 h-24 mb-4 rounded-full bg-gray-50 border-2 border-ieee-blue p-1 flex items-center justify-center text-3xl font-bold text-ieee-blue shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Username */}
                <h3 className="text-xl font-bold text-ieee-navy mb-2 line-clamp-1">
                    {user.name}
                </h3>

                {/* Connections Pill */}
                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-ieee-blue px-3 py-1 rounded-full text-xs font-semibold mb-6">
                    <span className="w-2 h-2 rounded-full bg-ieee-sky"></span>
                    {user.connections} Connections
                </div>

                {/* Primary Action Button */}
                <button
                    onClick={handleMainAction}
                    disabled={isButtonDisabled}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 mb-6 ${getButtonStyle()}`}
                >
                    {getButtonContent()}
                </button>

                <div className="w-full border-t border-gray-100 my-2"></div>

                {/* Events List */}
                <div className="w-full text-left mt-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Activities</p>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="p-1.5 bg-blue-50 text-ieee-blue rounded-md shrink-0">
                            <Calendar size={14} />
                        </div>
                        <span className="line-clamp-1">Sampark 2026: Future</span>
                    </div>

                    {user.theme && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md shrink-0">
                                <Hash size={14} />
                            </div>
                            <span className="line-clamp-1">{user.theme} Track</span>
                        </div>
                    )}

                    {user.participationType && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md shrink-0">
                                <Star size={14} />
                            </div>
                            <span className="line-clamp-1">{user.participationType}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParticipantProfileCard;
