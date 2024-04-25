import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function GameBet() {
    const location = useLocation();
    const game = location.state.game;
    const [homeScore, setHomeScore ] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const navigate = useNavigate();
    
    console.log(game);
    const PostBet = async () => {
        try{
            const request = {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({Game: game, homeScore: homeScore, awayScore: awayScore, userName: sessionStorage.getItem('username')})
            }
            
            const response = await fetch('PostIndividualBet', request);
            if (response.ok) {
                navigate('/individualBetHistory');
            }
            else {
                // Obsługa błędu
                console.error('Response error:', response.status);
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    return (
        <div className="bg-gray-800 mt-8 rounded-2xl sm:shadow-md sm:px-8 sm:pt-6 sm:pb-8 sm:mb-4 flex flex-col sm:justify-center w-full h-7/8 sm:w-1/2 sm:h-4/5 mx-auto gap-16">
            <div className="mb-4">
                <h2 className="text-5xl font-bold text-center sm:mb-2 text-white">{game.teamHomeName} vs {game.teamAwayName}</h2>
                <p className="text-white mb-4 text-center text-4xl">{new Date(game.date).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-center align-middle">
                <div className="away_team w-full h-full flex flex-col items-center justify-center">
                    <img className="h-60 w-60 mb-4 " src={game.teamHomeLogo} alt={`${game.teamHomeName} logo`} />
                    <input
                        id='home-score'
                        name='homeScore'
                        type='number'
                        min='0'
                        max='128'
                        placeholder={game.teamHomeName}
                        onChange={event => setHomeScore(parseInt(event.target.value))}
                        className='shadow bg-gray-800 appearance-none border rounded w-1/2 text-white leading-tight focus:outline-none focus:shadow-outline'
                    />
                    
                </div>
                <div className="away_team w-full h-full flex flex-col items-center justify-center">
                    <img className="h-60 w-60 mb-4" src={game.teamAwayLogo} alt={`${game.teamAwayName} logo`}/>
                    <input
                        id='away-score'
                        name='awayScore'
                        max='128'
                        type='number'
                        min='0'
                        placeholder={game.teamAwayName}
                        onChange={event => setAwayScore(parseInt(event.target.value))}
                        className='shadow bg-gray-800 appearance-none border rounded w-1/2 py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
                    />
                </div>

            </div>
            <div className="flex justify-center">
                <button
                    className="flex w-1/2 justify-center rounded-md bg-indigo-600 px-24 py-1.5 text-2xl font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    type="submit" onClick={() => PostBet()}>
                    Submit Prediction
                </button>
            </div>

        </div>
    );
}
