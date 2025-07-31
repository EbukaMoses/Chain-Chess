interface TournamentCardProps {
    id: number;
    name: string;
    description: string;
    prizePool: string;
    registeredPlayers: number;
    maxPlayers: number;
    status: 'registration' | 'in-progress' | 'completed';
    startDate: string;
    endDate: string;
    onRegister?: (id: number) => void;
    onView?: (id: number) => void;
}

export function TournamentCard({
    id,
    name,
    description,
    prizePool,
    registeredPlayers,
    maxPlayers,
    status,
    startDate,
    endDate,
    onRegister,
    onView
}: TournamentCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'registration':
                return 'status-registration';
            case 'in-progress':
                return 'status-progress';
            case 'completed':
                return 'status-completed';
            default:
                return 'bg-white/10 text-white/60 border border-white/20';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'registration':
                return 'Registration Open';
            case 'in-progress':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            default:
                return 'Unknown';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'registration':
                return '📝';
            case 'in-progress':
                return '⚡';
            case 'completed':
                return '🏆';
            default:
                return '❓';
        }
    };

    return (
        <div className="card-hover group relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6D9A4C]/5 to-[#8BB563]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Status indicator line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${status === 'registration' ? 'bg-gradient-to-r from-[#6D9A4C] to-[#8BB563]' :
                status === 'in-progress' ? 'bg-gradient-to-r from-[#8BB563] to-[#9BC573]' :
                    'bg-gradient-to-r from-white/40 to-white/20'
                }`}></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{getStatusIcon(status)}</span>
                            <h3 className="text-xl font-bold text-white group-hover:text-[#8BB563] transition-colors duration-300">
                                {name}
                            </h3>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">{description}</p>
                    </div>
                    <span className={`status-badge ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                    </span>
                </div>

                {/* Tournament Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">
                            Prize Pool
                        </p>
                        <p className="text-xl font-bold text-white">{prizePool} USDC</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">
                            Players
                        </p>
                        <p className="text-xl font-bold text-white">
                            {registeredPlayers}/{maxPlayers}
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">
                            Start Date
                        </p>
                        <p className="font-semibold text-white">{startDate}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">
                            End Date
                        </p>
                        <p className="font-semibold text-white">{endDate}</p>
                    </div>
                </div>

                {/* Progress bar for registration */}
                {status === 'registration' && (
                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                            <span>Registration Progress</span>
                            <span>{Math.round((registeredPlayers / maxPlayers) * 100)}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(registeredPlayers / maxPlayers) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                        {status === 'registration' && onRegister && (
                            <button
                                onClick={() => onRegister(id)}
                                className={`text-sm px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${registeredPlayers >= maxPlayers
                                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                    : 'btn-success'
                                    }`}
                                disabled={registeredPlayers >= maxPlayers}
                            >
                                {registeredPlayers >= maxPlayers ? 'Full' : 'Register'}
                            </button>
                        )}
                        {onView && (
                            <button
                                onClick={() => onView(id)}
                                className="btn-secondary text-sm px-4 py-2"
                            >
                                View Details
                            </button>
                        )}
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-white/40 font-mono">#{id}</div>
                    </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6D9A4C]/10 to-[#8BB563]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
        </div>
    );
} 