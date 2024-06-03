import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { GroupBetStatistics } from "../../Models/GroupBetStatistics.ts";
import TargetPage from "../TargetPage/TargetPage.tsx";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import './GroupBetHistory.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function GroupBetHistory() {
    const [bets, setBets] = useState<GroupBetStatistics[]>([]);
    const location = useLocation();
    const groupId = location.state.groupId;
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [betToDelete, setbetToDelete] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/GetBetsByGroupId?groupId=${groupId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();

                console.log("Data", data);

                const Bets: GroupBetStatistics[] = data.map((bet: any) => ({
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
                    username: bet.userName
                }));

                setBets(Bets);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [groupId]);

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
            isGroupBet: true,
            groupName: "Updating group bet."
        }
        //console.log(updateModel);
        navigate('/updatebet', {state: updateModel});
    };
    function ShowModal(betId:number){
        setOpenModal(true);
        setbetToDelete(betId);
    }
    const BetDelete = async () => {
        try {
            const request = {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
            };
            const response = await fetch(`DeleteGroupBet?groupBetId=${betToDelete}`, request);
            if (response.ok) {
                toast.success("Bet deleted successfully.");
                setOpenModal(false);
                window.location.reload();
            } else {
                toast.error("Failed to delete the bet. Please try again later.");
                setOpenModal(false);
            }
        } catch (error) {
            toast.error("Failed to delete the bet. Please check your internet connection and try again.");
        }
    };
    return (
        <div className="w-full h-5/6 mt-5 mb-5">
            <TargetPage />
            <ToastContainer />
            <div className="w-full sm:w-3/4 h-full overflow-y-scroll mx-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
                <div className="flex flex-col gap-4 p-4">
                    {bets.map((bet) => (
                        <div key={bet.betId}
                             className="flex justify-between items-center bg-gray-900 shadow-md rounded-lg sm:h-60 p-4 border border-violet-600 hover:neon-shadow transition-all duration-300 ease-in-out">
                            <div className="flex flex-col items-center flex-grow">
                                <img src={bet.teamHomeLogo} alt={`${bet.teamHomeName} logo`}
                                     className="sm:w-30 sm:h-30 sm:mr-4"/>
                                <span className="hidden sm:inline-block font-semibold text-4xl text-white">
                                    {bet.teamHomeName}
                                </span>
                            </div>
                            <div className="flex flex-col items-center flex-grow">
                                <img src={bet.teamAwayLogo} alt={`${bet.teamAwayName} logo`}
                                     className="sm:w-30 sm:h-30 sm:mr-4"/>
                                <span className="hidden sm:inline-block font-semibold text-4xl text-white">
                                    {bet.teamAwayName}
                                </span>
                            </div>
                            <div className="text-2xl text-gray-400">
                                Author: {bet.username}
                                <br/>
                                Points: {bet.points}
                                <br/>
                                Predicted: {bet.predictedHomeTeamScore} - {bet.predictedAwayTeamScore}
                                <br/>
                                Actual: {bet.homeTeamScore} - {bet.awayTeamScore}
                            </div>
                            {bet.username == sessionStorage.getItem("username") && (
                            <div className="flex items-center space-x-4">
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className="text-white cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                                    onClick={() => handleEdit(bet)}
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="text-white cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                                    onClick={() => ShowModal(bet.betId)}
                                />
                            </div>)
                            }
                        </div>
                    ))}
                </div>
            </div>
            <Modal className = "w-80 h-80 mx-auto" show={openModal} size="md" onClose={() => setOpenModal(false)}>
                <Modal.Header />
                <Modal.Body id ="deleteModalBody">
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this bet?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => BetDelete()}>
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
