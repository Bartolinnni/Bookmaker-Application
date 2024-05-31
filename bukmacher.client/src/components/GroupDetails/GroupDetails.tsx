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
        <h1>Witam</h1>
    );
}