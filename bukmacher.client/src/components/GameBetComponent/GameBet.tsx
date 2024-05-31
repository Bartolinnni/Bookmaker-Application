import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch.tsx'; // import the ToggleSwitch component
import Select from 'react-select';

export default function GameBet() {
    const location = useLocation();
    const game = location.state.game;
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [isGroupBet, setIsGroupBet] = useState(false); // state to handle the toggle switch
    const [groupId, setGroupId] = useState(''); // state to handle the group id input
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    
    console.log(game);
    
    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#374151',
            color: '#FFFFFF',
            borderColor: '#4B5563',
            padding: '0.5rem',
            borderRadius: '0.25rem',
        }),
        input: (provided) => ({
            ...provided,
            color: '#FFFFFF',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#374151',
            color: '#FFFFFF',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#2563EB' : state.isFocused ? '#1a202c' : '#374151',
            color: state.isSelected || state.isFocused ? '#FFFFFF' : '#D1D5DB',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#4B5563',
            color: '#FFFFFF',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#FFFFFF',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#FFFFFF',
            ':hover': {
                backgroundColor: '#2d3748',
                color: '#FFFFFF',
            },
        }),
    };
    useEffect(() => {
        fetch(`/GetUserGroups?userName=${sessionStorage.getItem("username")}`)
            .then(response => response.json())
            .then(data => {
                const userOptions = data.map(group => ({ value: group.id, label: group.name }));
                setUsers(userOptions);
            });
    }, []);
    const PostBet = async () => {
        try {
            if (!isGroupBet) {
                const request = {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Game: game,
                        homeScore: homeScore,
                        awayScore: awayScore,
                        userName: sessionStorage.getItem('username'),
                    })
                };
                
                const response = await fetch('PostIndividualBet', request);
                if (response.ok) {
                    navigate('/individualBetHistory');
                } else {
                    console.error('Response error:', response.status);
                }
            } else {
                const membersArray = selectedMembers.map(member => member.value);
                const request = {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Game: game,
                        homeScore: homeScore,
                        awayScore: awayScore,
                        userName: sessionStorage.getItem('username'),
                        groupsId: membersArray
                    })
                };
                
                const response = await fetch('PostGroupBet', request);
                if (response.ok) {
                    navigate('/individualBetHistory');
                } else {
                    console.error('Response error:', response.status);
                }
            };
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="bg-gray-800 mt-8 rounded-2xl sm:shadow-md sm:px-8 sm:pt-6 sm:pb-8 flex sm:mt-12 sm:mb-12 flex-col sm:justify-center w-full h-5/6 sm:w-1/2 sm:h-4/5 mx-auto gap-16">
            <div className="ml-auto">
                <ToggleSwitch isOn={isGroupBet} handleToggle={() => setIsGroupBet(!isGroupBet)} />
            </div>
            <div className="mb-4">
                <h2 className="text-5xl font-bold text-center sm:mb-2 text-white">{game.teamHomeName} vs {game.teamAwayName}</h2>
                <p className="text-white mb-4 text-center text-4xl">{new Date(game.date).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-center align-middle">
                <div className="away_team w-full h-full flex flex-col items-center justify-center">
                    <img className="h-60 w-60 mb-4" src={game.teamHomeLogo} alt={`${game.teamHomeName} logo`} />
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
                    <img className="h-60 w-60 mb-4" src={game.teamAwayLogo} alt={`${game.teamAwayName} logo`} />
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
            {isGroupBet && (
                <div className="mb-6 flex justify-center">
                    <Select
                        id="membersId"
                        isMulti
                        options={users}
                        className="text-black w-1/2"
                        classNamePrefix="select"
                        styles={customStyles}
                        onChange={setSelectedMembers}
                        value={selectedMembers}
                    />
                </div>
            )}
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
