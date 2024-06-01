import {Statistics} from "../../Models/Statistics.ts";
import {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';

export default function GroupDetails(){
    const location = useLocation();
    const groupId = location.state.groupId;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/GetUserGroupById?groupId=${groupId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log(response)
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    return (
        <div className="flex h-1/2 m-12 gap-2 justify-center">
            <div
                className="w-1/4 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:shadow-gray-600 transition-shadow duration-500">
                <h3 className="text-white text-center text-4xl font-bold mb-4 mt-4">Statistics</h3>
                <img alt="" className="w-1/2 mt-5"
                     src="https://www.chess.com/bundles/web/images/color-icons/leaderboard.98db1015.svg"/>
            </div>
            <div
                className="w-1/4 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:shadow-gray-600 transition-shadow duration-500">
                <h3 className="text-white text-center text-4xl font-bold mb-4 mt-4">Games to bet</h3>
                <img alt="" className="w-1/2 mt-5"
                     src="https://www.chess.com/bundles/web/images/color-icons/vote.a3f7fcdb.svg"/>
            </div>
            <div
                className="w-1/4 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:shadow-gray-600 transition-shadow duration-500">
                <h3 className="text-white text-center text-4xl font-bold mb-4 mt-4">Bets history</h3>
                <img alt="" className="w-1/2 mt-5"
                     src="https://www.chess.com/bundles/web/images/color-icons/library.svg"/>
            </div>
        </div>
        

    );
}