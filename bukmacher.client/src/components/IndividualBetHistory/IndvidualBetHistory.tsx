import "./IndividualBetHistory.css";
import { Bet } from "../../Models/Bet.ts";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function IndividualBetHistory() {
    const [bets, setBets] = useState<Bet[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [betToDelete, setBetToDelete] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/GetUserBet?userName=${sessionStorage.getItem("username")}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                const Bets: Bet[] = data.map((bet: any) => ({
                    betId: bet.id,
                    gameId: bet.match.id,
                    teamAwayId: bet.match.awayTeam.id,
                    teamAwayName: bet.match.awayTeam.name,
                    teamAwayLogo: bet.match.awayTeam.logo,
                    teamHomeId: bet.match.homeTeam.id,
                    teamHomeName: bet.match.homeTeam.name,
                    teamHomeLogo: bet.match.homeTeam.logo,
                    predictedHomeTeamScore: bet.predictedHomeTeamScore,
                    predictedAwayTeamScore: bet.predictedAwayTeamScore,
                    points: bet.points,
                    homeTeamScore: bet.match.homeTeamScore,
                    awayTeamScore: bet.match.awayTeamScore,
                }));
                setBets(Bets);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (bet) => {
        const updateModel = {
            game: {
                gameId: bet.gameId,
                teamAwayId: bet.teamAwayId,
                teamAwayName: bet.teamAwayName,
                teamAwayLogo: bet.teamAwayLogo,
                teamHomeId: bet.teamHomeId,
                teamHomeName: bet.teamHomeName,
                teamHomeLogo: bet.teamHomeLogo,
                predictedHomeTeamScore: bet.predictedHomeTeamScore,
                predictedAwayTeamScore: bet.predictedAwayTeamScore,
            },
            betId: bet.betId,
            isGroupBet: false,
            groupName: ""
        }
        navigate('/updatebet', { state: updateModel });
    };

    function showModal(betId: number) {
        setOpenModal(true);
        setBetToDelete(betId);
    }

    const betDelete = async () => {
        try {
            const request = {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
            };
            const response = await fetch(`DeleteBet?betId=${betToDelete}`, request);
            if (response.ok) {
                setBets(prevBets => prevBets.filter(bet => bet.betId !== betToDelete));
                setOpenModal(false);
                toast.success("Bet deleted successfully.");
            } else {
                toast.error("Failed to delete the bet. Please try again later.");
                setOpenModal(false);
            }
        } catch (error) {
            toast.error("Failed to delete the bet. Please check your internet connection and try again.");
        }
    };

    return (
        <div className="w-full sm:w-3/4 h-4/5 overflow-y-scroll mx-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
            <ToastContainer />
            <div className="flex flex-col gap-4 p-4">
                {bets.map((bet) => (
                    <div key={bet.betId}
                         className="flex justify-between items-center bg-gray-900 shadow-md rounded-lg sm:h-60 p-4 border border-violet-600 hover:neon-shadow transition-all duration-300 ease-in-out">
                        <div className="flex flex-col items-center flex-grow">
                            <img src={bet.teamHomeLogo} alt={`${bet.teamHomeName} logo`}
                                 className="sm:w-30 sm:h-30 sm:mr-4" />
                            <span className="hidden sm:inline-block font-semibold text-4xl text-white">{bet.teamHomeName}</span>
                        </div>
                        <div className="flex flex-col items-center flex-grow">
                            <img src={bet.teamAwayLogo} alt={`${bet.teamAwayName} logo`}
                                 className="sm:w-30 sm:h-30 sm:mr-4" />
                            <span className="hidden sm:inline-block font-semibold text-4xl text-white">{bet.teamAwayName}</span>
                        </div>
                        <div className="text-2xl text-gray-400">
                            <br/>
                            Predicted: {bet.predictedHomeTeamScore} - {bet.predictedAwayTeamScore}
                            <br/>
                            Actual: {bet.homeTeamScore} - {bet.awayTeamScore}
                            <br/>
                            {bet.points == null && (
                                <>
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className="text-white mr-5 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                                        onClick={() => handleEdit(bet)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className="text-white cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                                        onClick={() => showModal(bet.betId)}
                                    />
                                </>
                            )}
                        </div>

                    </div>
                ))}
            </div>
            <Modal className="w-80 h-80 mx-auto" show={openModal} size="md" onClose={() => setOpenModal(false)}>
                <Modal.Header/>
                <Modal.Body id="deleteModalBody">
                    <div className="text-center">
                        <HiOutlineExclamationCircle
                            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this bet?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={betDelete}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
