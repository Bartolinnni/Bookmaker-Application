import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch.tsx';
import Select from 'react-select';
import TargetPage from "../TargetPage/TargetPage.tsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSObject } from '@emotion/react';
import { GroupBase, StylesConfig } from 'react-select';

export default function GameBet() {
    const location = useLocation();
    const game = location.state.game;
    const [homeScore, setHomeScore] = useState('');
    const [awayScore, setAwayScore] = useState('');
    const [isGroupBet, setIsGroupBet] = useState(location.state && location.state.isGroupBet !== undefined ? location.state.isGroupBet : false);
    const groupId = location.state && location.state.groupId !== undefined ? location.state.groupId : null;
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);


    const customStyles: StylesConfig<YourOptionType, IsMultiType, GroupBase<YourOptionType>> = {
        control: (provided: CSSObject) => ({
            ...provided,
            backgroundColor: '#374151',
            color: '#FFFFFF',
            borderColor: '#4B5563',
            padding: '0.5rem',
            borderRadius: '0.25rem',
        }),
        input: (provided: CSSObject) => ({
            ...provided,
            color: '#FFFFFF',
        }),
        menu: (provided: CSSObject) => ({
            ...provided,
            backgroundColor: '#374151',
            color: '#FFFFFF',
        }),
        option: (provided: CSSObject, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#2563EB' : state.isFocused ? '#1a202c' : '#374151',
            color: state.isSelected || state.isFocused ? '#FFFFFF' : '#D1D5DB',
        }),
        multiValue: (provided: CSSObject) => ({
            ...provided,
            backgroundColor: '#4B5563',
            color: '#FFFFFF',
        }),
        multiValueLabel: (provided: CSSObject) => ({
            ...provided,
            color: '#FFFFFF',
        }),
        multiValueRemove: (provided: CSSObject) => ({
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
                const initialGroup = userOptions.find(group => group.value === groupId);
                setSelectedMembers(initialGroup ? [initialGroup] : []);
            });
    }, [groupId]);

    const PostBet = async () => {
        try {
            // Validate the scores
            if (homeScore.trim() === '' || awayScore.trim() === '' || isNaN(parseInt(homeScore)) || isNaN(parseInt(awayScore)) || parseInt(homeScore) < 0 || parseInt(awayScore) < 0) {
                toast.error("Scores have to be positive numbers.");
                return;
            }

            const homeScoreInt = parseInt(homeScore);
            const awayScoreInt = parseInt(awayScore);

            if (!isGroupBet) {
                const request = {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Game: game,
                        homeScore: homeScoreInt,
                        awayScore: awayScoreInt,
                        userName: sessionStorage.getItem('username'),
                    })
                };

                const response = await fetch('PostIndividualBet', request);
                if (response.ok) {
                    toast.success("Bet posted successfully.");
                    navigate('/individualBetHistory');
                } else {
                    toast.error("Failed to post the bet.");
                    console.error('Response error:', response.status);
                }
            } else {
                const membersArray = selectedMembers.map(member => member.value);
                const request = {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Game: game,
                        homeScore: homeScoreInt,
                        awayScore: awayScoreInt,
                        userName: sessionStorage.getItem('username'),
                        groupsId: membersArray
                    })
                };

                const response = await fetch('PostGroupBet', request);
                if (response.ok) {
                    toast.success("Group bet posted successfully.");
                    navigate('/userGroups');
                } else {
                    toast.error("Failed to post the group bet.", response.text());
                    console.error('Response error:', response.status);
                }
            }
        } catch (error) {
            toast.error("An error occurred while posting the bet.");
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="h-full w-full">
            <TargetPage />
            <ToastContainer />
            <div className="bg-gray-800 rounded-2xl w-1/2 gap-5 h-3/4 flex-col justify-center items-center mr-auto ml-auto mt-8">
                <div className="w-full ml-auto">
                    <ToggleSwitch isOn={isGroupBet} handleToggle={() => setIsGroupBet(!isGroupBet)} />
                </div>
                <div className="mb-4">
                    <h2 className="text-5xl font-bold text-center sm:mb-2 text-white">{game.teamHomeName} vs {game.teamAwayName}</h2>
                    <p className="text-white mb-4 text-center text-4xl">{new Date(game.date).toLocaleDateString()}</p>
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
                            value={homeScore}
                            onChange={event => setHomeScore(event.target.value)}
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
                            value={awayScore}
                            onChange={event => setAwayScore(event.target.value)}
                            className='shadow bg-gray-800 appearance-none border rounded w-1/2 py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
                        />
                    </div>
                </div>
                {isGroupBet && (
                    <div className="mb-6 mt-5 flex justify-center">
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
                <div className="flex justify-center mt-5">
                    <button
                        className="flex w-1/2 justify-center rounded-md bg-indigo-600 px-24 py-1.5 text-2xl font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        type="submit" onClick={PostBet}>
                        Submit Prediction
                    </button>
                </div>
            </div>
        </div>
    );
}
