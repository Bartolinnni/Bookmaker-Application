import { Game } from '../../Models/Game.ts'
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TargetPage from "../TargetPage/TargetPage.tsx";

export default function GroupGamesToBet() {
    const [games, setGames] = useState<Game[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const groupId = location.state.groupId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/GetGamesToBet?groupId=${groupId}&userName=${sessionStorage.getItem("username")}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                const newGames: Game[] = data.map((game: any) => ({
                    date: game.matchDate,
                    gameId: game.externalId,
                    teamAwayId: game.awayTeam.id,
                    teamAwayName: game.awayTeam.name,
                    teamAwayLogo: game.awayTeam.logo,
                    teamHomeId: game.homeTeam.id,
                    teamHomeName: game.homeTeam.name,
                    teamHomeLogo: game.homeTeam.logo
                }));
                setGames(newGames);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    
    function redirectToGameBet(game: Game) {
        const isGroupBet = true; 
        navigate('/gamebet', { state: { game, isGroupBet, groupId } });
    }

    return (
        <div className="w-full h-4/5">
            <TargetPage></TargetPage>
            
            <div className="w-full sm:w-3/4 h-4/5 overflow-y-scroll mx-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
                <div className="flex flex-col gap-4 p-4">
                    {games.length === 0 ? (
                        <div className="text-center text-gray-400 text-2xl">
                            No games available to bet on.
                        </div>
                    ) : (
                        games.map((game) => (
                            <div key={game.gameId} className="flex justify-between items-center bg-gray-900 shadow-md rounded-lg sm:h-60 p-4 cursor-pointer border border-violet-600 hover:neon-shadow transition-all duration-300 ease-in-out" onClick={() => redirectToGameBet(game)}>
                                <div className="flex flex-col items-center flex-grow">
                                    <img src={game.teamHomeLogo} alt={`${game.teamHomeName} logo`} className="sm:w-30 sm:h-30 sm:mr-4" />
                                    <span className="hidden sm:inline-block font-semibold text-4xl text-white">{game.teamHomeName}</span>
                                </div>
                                <div className="flex flex-col items-center flex-grow">
                                    <img src={game.teamAwayLogo} alt={`${game.teamAwayName} logo`} className="sm:w-30 sm:h-30 sm:mr-4" />
                                    <span className="hidden sm:inline-block font-semibold text-4xl text-white">{game.teamAwayName}</span>
                                </div>
                                <div className="text-2xl text-gray-400">{new Date(game.date).toLocaleDateString()}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
