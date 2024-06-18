import { useEffect, useState } from 'react';
import './GroupCreation.css';
import Select from 'react-select';
import TargetPage from "../TargetPage/TargetPage.tsx";
import { CSSObject } from '@emotion/react';
import { GroupBase, StylesConfig } from 'react-select';

export default function GroupCreation() {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [users, setUsers] = useState([]);

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
        fetch('/GetUsers')
            .then(response => response.json())
            .then(data => {
                const userOptions = data.map(user => ({ value: user.id, label: user.userName }));
                setUsers(userOptions);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const membersArray = selectedMembers.map(member => member.value);
        const model = {
            Name: groupName,
            OwnerName: sessionStorage.getItem("username"),
            MembersIds: membersArray
        };

        fetch('AddGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    Name: groupName,
                    OwnerName: sessionStorage.getItem("username"),
                    MembersIds: membersArray,
                    Description: groupDescription
                }
            )
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                window.location.href = '/userGroups';
            })
            .catch(error => {
                console.error('There was a problem creating the group:', error);
            });
    };

    return (
        <div className="h-4/5 w-full">
            <TargetPage></TargetPage>
            <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-lg m-10">
                <h1 className="text-4xl text-white text-center mb-6">Create a New Group</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="groupName" className="block text-white mb-2">Group Name:</label>
                        <input
                            type="text"
                            id="groupName"
                            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="groupDescription" className="block text-white mb-2">Group Description:</label>
                        <input
                            type="text"
                            id="groupDescription"
                            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="membersId" className="block text-white mb-2">Members:</label>
                        <Select
                            id="membersId"
                            isMulti
                            options={users}
                            className="text-black"
                            classNamePrefix="select"
                            styles={customStyles}
                            onChange={setSelectedMembers}
                            value={selectedMembers}
                        />
                    </div>
                    <button type="submit"
                            className="w-full p-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 transition">
                        Create Group
                    </button>
                </form>
            </div>
        </div>
    );
}
