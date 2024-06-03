import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TargetPage from "../TargetPage/TargetPage.tsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './customToast.css';

export default function UpdateBet() {
    const location = useLocation();
    const game = location.state.game;
    const betId = location.state.betId;
    const [homeScore, setHomeScore] = useState(location.state.game.homeScore);
    const [awayScore, setAwayScore] = useState(location.state.game.awayScore);
    const navigate = useNavigate();
    const isGroupBet = location.state.isGroupBet;
    const groupName = location.state.groupName;
    const UpdateBet = async () => {
        try {
            if (homeScore < 0 || awayScore < 0 || homeScore == undefined || awayScore == undefined) {
                toast.error("Scores cannot be negative.");
                return;
            }
            if(isGroupBet)
            {
                const request = {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Id: betId,
                        PredictedHomeTeamScore: homeScore,
                        PredictedAwayTeamScore: awayScore
                    })
                };
                const response = await fetch('UpdateGroupBet', request);
                if (response.ok) {
                    navigate(-1);
                } else {
                    toast.error("Failed to update the bet. Please try again.");
                }
            }
            else{
                const request = {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Id: betId,
                        PredictedHomeTeamScore: homeScore,
                        PredictedAwayTeamScore: awayScore
                    })
                };
                const response = await fetch('UpdateBet', request);
                if (response.ok) {
                    toast.success("Bet updated successfully.");
                    navigate(-1);
                } else {
                    toast.error("Failed to update the bet. Please try again.");
                }
            }
        } catch (error) {
            toast.error("Failed to update the bet. Please try again.");
            console.error('Error fetching data:', error);
        }
    };
    
    return (
        <div className="h-5/6 w-full">
            <ToastContainer />
            <TargetPage></TargetPage>
            <div className="bg-gray-800 rounded-2xl w-1/2 gap-5 h-3/4 flex-col justify-center items-center mr-auto ml-auto mt-8">
                {isGroupBet && (
                    <h3 className="text-white text-2xl flex justify-center">{groupName}</h3>
                )}
                <div className="mb-4">
                    <h2 className="text-5xl font-bold text-center sm:mb-2 text-white">{game.teamHomeName} vs {game.teamAwayName}</h2>
                </div>
                <div className="flex justify-center align-middle">
                    <div className="away_team w-full h-full flex flex-col items-center justify-center">
                        <img className="h-30 w-30 mb-4" src={game.teamHomeLogo} alt={`${game.teamHomeName} logo`} />
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
                        <img className="h-30 w-30 mb-4" src={game.teamAwayLogo} alt={`${game.teamAwayName} logo`} />
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
                <div className="flex justify-center mt-5">
                    <button
                        className="flex w-1/2 justify-center rounded-md bg-indigo-600 px-24 py-1.5 text-2xl font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        type="submit" onClick={() => UpdateBet()}>
                        Update Prediction
                    </button>
                </div>
            </div>
        </div>
    );
}