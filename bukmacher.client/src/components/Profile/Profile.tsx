import './Profile.css';
import { Statistics } from "../../Models/Statistics.ts";
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Import the Line component from react-chartjs-2
import 'chart.js/auto'; // Import this to avoid errors with Chart.js

export default function Profile() {
    const [gamesPlayed, setGamesPlayed] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);
    const [chartData, setChartData] = useState<any>(null); // Initialize chartData as null

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
                    dateBet: new Date(statistics.pointDate).toLocaleDateString() // Convert to date string
                }));

                // Aggregate points for each day
                const aggregatedData: { [key: string]: number } = {};
                Bets.forEach(bet => {
                    aggregatedData[bet.dateBet] = (aggregatedData[bet.dateBet] || 0) + bet.points;
                });

                // Sort aggregated data by date
                const sortedDates = Object.keys(aggregatedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

                // Calculate cumulative points
                let cumulativePoints = 0;
                const cumulativePointsData = sortedDates.map(date => {
                    cumulativePoints += aggregatedData[date];
                    return cumulativePoints;
                });

                const totalPoints = cumulativePointsData[cumulativePointsData.length - 1];

                setPoints(totalPoints);
                setGamesPlayed(sortedDates.length);
    
                setChartData({
                    labels: sortedDates,
                    datasets: [
                        {
                            label: 'Cumulative Points Over Time',
                            data: cumulativePointsData,
                            fill: false,
                            borderColor: 'rgb(109 40 217)',
                            borderWidth: 3
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex justify-center w-full mb-4">
            <div className="h-1/2 w-full gap-2 flex-col justify-center max-w-screen-2xl">
                <div className="flex flex-wrap h-1/2 mt-2 gap-2 justify-center">
                    <div
                        className="w-full md:w-1/4 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:shadow-gray-600 transition-shadow duration-500">
                        <h3 className="text-white text-center text-3xl font-bold mb-4 mt-4">{sessionStorage.getItem("username")}</h3>
                        <img alt="" className="w-1/2 mt-5"
                             src="https://www.chess.com/bundles/web/images/color-icons/coaches.e4e9d916.svg"/>
                    </div>
                    <div
                        className="w-full md:w-1/4 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:shadow-gray-600 transition-shadow duration-500">
                        <h3 className="text-white text-center text-3xl font-bold mb-4 mt-4">Points: {points}</h3>
                        <img alt="" className="w-1/2 mt-5"
                             src="https://www.chess.com/bundles/web/images/color-icons/tournaments.d5eac419.svg"/>
                    </div>
                    <div
                        className="w-full md:w-1/4 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:shadow-gray-600 transition-shadow duration-500">
                        <h3 className="text-white text-center text-4xl font-bold mb-4 mt-4">Bet
                            games: {gamesPlayed}</h3>
                        <img alt="" className="w-1/2 mt-5"
                             src="https://www.chess.com/bundles/web/images/color-icons/vote.a3f7fcdb.svg"/>
                    </div>
                </div>
                <div className="flex flex-wrap h-1/2 mt-4 mb-4 justify-center">
                    <div
                        className="w-full md:w-3/4 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:shadow-gray-600 transition-shadow duration-500">
                        <h3 className="text-white text-center mr-auto text-4xl font-bold mb-4 mt-4">Chart of points
                            history</h3>
                        <div className="w-3/5 flex justify-center">
                            {chartData && <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Date',
                                                color: 'white'
                                            },
                                            ticks: {
                                                color: 'white'
                                            },
                                            grid: {
                                                color: 'gray'
                                            },
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: 'Points',
                                                color: 'white'
                                            },
                                            ticks: {
                                                color: 'white'
                                            },
                                            grid: {
                                                color: 'gray'
                                            },
                                        }
                                    }
                                }}
                            />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
