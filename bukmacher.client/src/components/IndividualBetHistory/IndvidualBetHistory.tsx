import "./IndividualBetHistory.css";
import { Bet } from "../../Models/Bet.ts";
import { useEffect, useState } from 'react';

export default function IndividualBetHistory() {
    const [bets, setBets] = useState<Bet[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/GetUserBet?userName=${sessionStorage.getItem("username")}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log(data);
                const Bets: Bet[] = data.map((bet: any) => ({
                    betId: bet.id,
                    gameId: bet.match.id,
                    teamAwayId: bet.match.awayTeam.id,
                    teamAwayName: bet.match.awayTeam.name,
                    teamAwayLogo: bet.match.awayTeam.logo,
                    teamHomeId: bet.match.homeTeam.id,
                    teamHomeName: bet.match.homeTeam.name,
                    teamHomeLogo: bet.match.homeTeam.logo,
                    predictedHomeTeamScore: bet.predictedHomeTeamScore,
                    predictedAwayTeamScore: bet.predictedAwayTeamScore,
                    points: bet.points,
                    homeTeamScore: bet.match.homeTeamScore,
                    awayTeamScore: bet.match.awayTeamScore,
                }));
                setBets(Bets);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full sm:w-3/4 h-4/5 overflow-y-scroll mx-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
            <div className="flex flex-col gap-4 p-4">
                {bets.map((bet) => (
                    <div key={bet.betId} className="flex justify-between items-center bg-gray-900 shadow-md rounded-lg sm:h-60 p-4 cursor-pointer border border-violet-600 hover:neon-shadow transition-all duration-300 ease-in-out">
                        <div className="flex flex-col items-center flex-grow">
                            <img src={bet.teamHomeLogo} alt={`${bet.teamHomeName} logo`} className="sm:w-30 sm:h-30 sm:mr-4" />
                            <span className="hidden sm:inline-block font-semibold text-4xl text-white">{bet.teamHomeName}</span>
                        </div>
                        <div className="flex flex-col items-center flex-grow">
                            <img src={bet.teamAwayLogo} alt={`${bet.teamAwayName} logo`} className="sm:w-30 sm:h-30 sm:mr-4" />
                            <span className="hidden sm:inline-block font-semibold text-4xl text-white">{bet.teamAwayName}</span>
                        </div>
                        <div className="text-2xl text-gray-400">
                            <br />
                            Predicted: {bet.predictedHomeTeamScore} - {bet.predictedAwayTeamScore}
                            <br />
                            Actual: {bet.homeTeamScore} - {bet.awayTeamScore}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
