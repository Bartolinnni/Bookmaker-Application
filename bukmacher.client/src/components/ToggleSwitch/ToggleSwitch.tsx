import {FC, ChangeEventHandler } from 'react';

interface ToggleSwitchProps {
    isOn: boolean;
    handleToggle: ChangeEventHandler<HTMLInputElement>;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ isOn, handleToggle }) => {
    return (
        <div className="flex items-center justify-center w-full mb-4">
            <p className="text-2xl text-white mr-3">Group Betting</p>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={isOn}
                    onChange={handleToggle}
                />
                <div className={`w-11 h-6 rounded-full ${isOn ? 'dark:bg-violet-900' : 'dark:bg-violet-700'} peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isOn ? 'after:translate-x-full after:bg-white' : 'after:translate-x-0 after:bg-gray-300'} dark:border-gray-600 peer-checked:bg-blue-600`}></div>
            </label>
        </div>
    );
};

export default ToggleSwitch;
