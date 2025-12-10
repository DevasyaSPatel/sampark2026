import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './ParticipantProfileCard.module.css';

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
        participationType?: string; // New field from Sheet logic
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

    const getButtonText = () => {
        if (!isLoggedIn) return 'Connect';
        if (isLoading) return 'Sending...';
        if (connectionStatus === 'Accepted') return 'Connected';
        if (connectionStatus === 'Pending') return 'Request Sent';
        return 'Connect';
    };

    const isButtonDisabled = isLoggedIn && (
        connectionStatus === 'Accepted' ||
        connectionStatus === 'Pending' ||
        isLoading
    );

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>

                {/* Avatar */}
                <div className={styles.avatarPlaceholder}>
                    {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Username */}
                <h1 className={styles.username}>
                    {user.name}
                </h1>

                {/* Connections */}
                <div className={styles.connectionMeta}>
                    {user.connections} Connections
                </div>

                {/* Primary Action Button */}
                <button
                    onClick={handleMainAction}
                    disabled={isButtonDisabled}
                    className={styles.connectBtn}
                >
                    {getButtonText()}
                </button>

                {/* Divider */}
                <div className={styles.divider}></div>

                {/* Real Events List */}
                <div className={styles.eventsSection}>
                    <h2 className={styles.sectionHeader}>
                        Registered Events
                    </h2>

                    <ul className={styles.eventsList}>
                        {/* 1. Main Conference (All users are registered) */}
                        <li className={styles.eventItem}>
                            <span className={styles.eventIcon}>🚀</span>
                            Sampark 2026: The Future
                        </li>

                        {/* 2. Selected Theme/Track */}
                        {user.theme && (
                            <li className={styles.eventItem}>
                                <span className={styles.eventIcon}>🎟️</span>
                                {user.theme} Track
                            </li>
                        )}

                        {/* 3. Participation Type (e.g. Team, Solo, Workshop) */}
                        {user.participationType && (
                            <li className={styles.eventItem}>
                                <span className={styles.eventIcon}>🎤</span>
                                {user.participationType}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ParticipantProfileCard;
