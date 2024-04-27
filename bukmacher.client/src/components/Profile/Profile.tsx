import './Profile.css';
import { Statistics } from "../../Models/Statistics.ts";
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {Bet} from "../../Models/Bet.ts"; // Import the Bar component from react-chartjs-2

export default function Profile() {
    const [statistics, setStatistics] = useState<Statistics[]>([]);
    const [gamesPlayed, setGamesPlayed] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/GetUserBetsStatistics?userName=${sessionStorage.getItem("username")}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                
                const Bets: Statistics[] = data.map((statistics: any) => ({
                    betId: statistics.id,
                    gameId: statistics.matchId,
                    points: statistics.points,
                    dateBet: statistics.pointDate
                }));
                
                const totalPoints = Bets.reduce((acc, bet) => acc + bet.points, 0);
                
                setPoints(totalPoints)
                setGamesPlayed(Bets.length)
                setStatistics(Bets);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    console.log(points);
    return (
        <div
            className="bg-gray-800 mt-8 rounded-2xl sm:shadow-md sm:px-8 sm:pt-6 sm:pb-8 sm:mb-4 flex flex-col w-full h-7/8 sm:w-1/2 sm:h-4/5 mx-auto gap-16">
            <div className="mb-4 flex">
                <div className="flex-col">
                    <img />
                    <span className="text-3xl font-bold text-center sm:mb-2 text-white">User: {sessionStorage.getItem("username")} </span>
                </div>
                <div className="flex-col">
                    <span className="text-3xl font-bold text-center sm:mb-2 text-white">Points: {points} </span>
                    
                </div>
                <div className="flex-col">
                    <span className="text-white mb-4 text-center text-4xl">Bet Games: {gamesPlayed} </span>
                    
                </div>
            </div>
        </div>
    );
}
