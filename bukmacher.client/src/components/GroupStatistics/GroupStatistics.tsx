import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useLocation } from "react-router-dom";
import { GroupBetStatistics } from "../../Models/GroupBetStatistics.ts";
import TargetPage from "../TargetPage/TargetPage.tsx";

export default function GroupStatistics() {
    const [gamesPlayed, setGamesPlayed] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);
    const [chartData, setChartData] = useState<any>(null);
    const [barChartData, setBarChartData] = useState<any>(null);
    const location = useLocation();
    const groupId = location.state.groupId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/GetBetsByGroupId?groupId=${groupId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                
                const Bets: GroupBetStatistics[] = data.map((statistics: any) => ({
                    betId: statistics.id,
                    gameId: statistics.matchId,
                    username: statistics.userName,
                    points: statistics.points,
                    pointDate: new Date(statistics.pointDate).toLocaleDateString()
                }));
                const validBets = Bets.filter(bet => bet.points !== null);
                
                const userPoints: { [username: string]: number } = {};
                validBets.forEach(bet => {
                    userPoints[bet.username] = (userPoints[bet.username] || 0) + bet.points;
                });
                
                const userDatePoints: { [username: string]: { [date: string]: number } } = {};
                validBets.forEach(bet => {
                    if (!userDatePoints[bet.username]) {
                        userDatePoints[bet.username] = {};
                    }
                    userDatePoints[bet.username][bet.pointDate] = (userDatePoints[bet.username][bet.pointDate] || 0) + bet.points;
                });

                const barLabels = Object.keys(userPoints);
                const barData = barLabels.map(username => userPoints[username]);

                const barColors = barLabels.map(() => `hsl(${Math.random() * 360}, 100%, 50%)`);

                setBarChartData({
                    labels: barLabels,
                    datasets: [
                        {
                            label: 'Total Points per User',
                            data: barData,
                            backgroundColor: barColors,
                            borderColor: barColors,
                            borderWidth: 1
                        }
                    ]
                });
                
                const sortedDates = Array.from(new Set(validBets.map(bet => bet.pointDate))).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

                const datasets = Object.keys(userDatePoints).map(username => {
                    let cumulativePoints = 0;
                    const data = sortedDates.map(date => {
                        cumulativePoints += userDatePoints[username][date] || 0;
                        return cumulativePoints;
                    });
                    return {
                        label: username,
                        data: data,
                        fill: false,
                        borderColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                        borderWidth: 2
                    };
                });

                const totalPoints = Object.values(userPoints).reduce((acc, points) => acc + points, 0);

                setPoints(totalPoints);
                setGamesPlayed(sortedDates.length);
                
                setChartData({
                    labels: sortedDates,
                    datasets: datasets
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full h-4/5 mt-12">
            <TargetPage></TargetPage>
            
            <div className="flex justify-center w-full h-4/5 mb-4">
                <div className="h-full w-full gap-2 flex-col justify-center max-w-screen-2xl">
                        <div className="bg-gray-800 rounded-2xl shadow-2xl flex justify-between">
                            <div className="w-1/2 h-full">
                                <h3 className="text-white text-center mr-auto text-xl font-bold mb-4 mt-4">Bar Chart of Points per User</h3>
                                <div className="w-full h-full">
                                    {barChartData && <Bar
                                        data={barChartData}
                                        options={{
                                            responsive: true,
                                            scales: {
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: 'User',
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
                            <div className="w-1/2 h-full">
                                <h3 className="text-white text-center mr-auto text-xl font-bold mb-4 mt-4">Line Chart of Cumulative Points Over Time</h3>
                                <div className="w-full h-full bottom-0">
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
        </div>
    );
}
