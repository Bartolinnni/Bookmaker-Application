import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function TargetPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const stateData = location.state;

    console.log(stateData); // Access your passed state data here

    function goBack() {
        navigate(-1); // Navigate back to the previous page
    }

    return (
        <div className="absolute">
            <button onClick={goBack} className="flex items-center space-x-2 text-white bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition duration-300">
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Go Back</span>
            </button>
        </div>
    );
}
