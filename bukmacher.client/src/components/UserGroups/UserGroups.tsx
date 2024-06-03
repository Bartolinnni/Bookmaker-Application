import "./UserGroups.css";
import { useEffect, useState } from 'react';
import {Group} from "../../Models/Group.ts";
import { useNavigate } from 'react-router-dom';

export default function UserGroups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/GetUserGroups?userName=${sessionStorage.getItem("username")}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                const Groups: Group[] = data.map((group: any) => ({
                    id: group.id,
                    groupBets: group.groupBets,
                    membersId: group.membersId,
                    ownerId: group.ownerId,
                    name: group.name,
                    description: group.description
                }));
                setGroups(Groups);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    function redirectToGroupDetails(groupId: Number) {
        navigate('/groupdetails', { state: { groupId } });
    }
    return (
        <div className="relative w-full sm:w-3/4 h-4/5 mx-auto flex flex-row">
            <div className="flex-grow overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
                <div className="flex flex-col gap-4 p-4">
                    {groups.length === 0 ? (
                        <div className="text-center text-xl text-gray-500">
                            You are not a member of any group
                        </div>
                    ) : (
                        groups.map((group) => (
                            <div key={group.id} className="flex justify-center flex-col items-center bg-gray-900 shadow-md sm:h-28 rounded-lg sm:h-50 p-4 cursor-pointer border border-violet-600 hover:neon-shadow transition-all duration-300 ease-in-out" onClick={() => redirectToGroupDetails(group.id)}>
                                <h1 className="text-2xl text-white text-center">{group.name}</h1>
                                <div className="text-xl text-white text-center">{group.description}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <button
                onClick={() => {window.location.href = '/groupCreation';}}
                className="ml-6 mt-6 h-14 w-1/4 bg-violet-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-violet-800 transition-all duration-300 ease-in-out">
                Create Group
            </button>
        </div>
    );
}