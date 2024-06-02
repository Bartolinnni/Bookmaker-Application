import "./GamesList.css";
import {Game} from '../../Models/Game.ts'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GamesList(){
    const [games, setGames] = useState<Game[]>([]); // State to hold the games array
    const navigate = useNavigate(); // Moved useNavigate here
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const leagueId = 39;
                const response = await fetch(`/DownloadFutureGames?leaugeId=${leagueId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                const newGames: Game[] = data.response.map((game: any) => ({
                    date: game.fixture.date,
                    gameId: game.fixture.id,
                    teamAwayId: game.teams.away.id,
                    teamAwayName: game.teams.away.name,
                    teamAwayLogo: game.teams.away.logo,
                    teamHomeId: game.teams.home.id,
                    teamHomeName: game.teams.home.name,
                    teamHomeLogo: game.teams.home.logo
                }));
                setGames(newGames);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        console.log(games);
    }, [games]);

    function redirectToGameBet(game: Game) {
        navigate('/gamebet', { state: { game } });
    }
    return (
        <div className="w-full sm:w-3/4 h-4/5 overflow-y-scroll mx-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
            <div className="flex flex-col gap-4 p-4">
                {games.map((game) => (
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
                ))}
            </div>
        </div>
    );





}
