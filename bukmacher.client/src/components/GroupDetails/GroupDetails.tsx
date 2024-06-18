import { useLocation, useNavigate } from "react-router-dom";
import TargetPage from "../TargetPage/TargetPage.tsx";
export default function GroupDetails(){
    const location = useLocation();
    const groupId = location.state.groupId;
    const navigate = useNavigate();

    function groupStatistics(){
        navigate('/groupstatistics', { state: { groupId } });
    }
    function groupbethistory(){
        navigate('/groupbethistory', { state: { groupId } });
    }
    function groupgamestobet(){
        navigate('/groupgamestobet', { state: { groupId } });
    }
    return (
        <div className="h-5/6 w-full">
            <TargetPage></TargetPage>
            <div className="flex h-1/2 m-12 gap-2 justify-center">
                <div
                    className="w-1/4 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:shadow-gray-600 transition-shadow duration-500" onClick={() => groupStatistics()}>
                    <h3 className="text-white text-center text-4xl font-bold mb-4 mt-4">Statistics</h3>
                    <img alt="" className="w-1/2 mt-5"
                         src="https://www.chess.com/bundles/web/images/color-icons/leaderboard.98db1015.svg"/>
                </div>
                <div
                    className="w-1/4 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:shadow-gray-600 transition-shadow duration-500" onClick={() => groupgamestobet()}>
                    <h3 className="text-white text-center text-4xl font-bold mb-4 mt-4">Games to bet</h3>
                    <img alt="" className="w-1/2 mt-5"
                         src="https://www.chess.com/bundles/web/images/color-icons/vote.a3f7fcdb.svg"/>
                </div>
                <div
                    className="w-1/4 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:shadow-gray-600 transition-shadow duration-500" onClick={() => groupbethistory()}>
                    <h3 className="text-white text-center text-4xl font-bold mb-4 mt-4">Bets history</h3>
                    <img alt="" className="w-1/2 mt-5"
                         src="https://www.chess.com/bundles/web/images/color-icons/library.svg"/>
                </div>
            </div>
        </div>

    );
}