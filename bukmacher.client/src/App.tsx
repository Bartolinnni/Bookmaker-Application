import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/Authentication/SignIn.tsx';
import SignUp from './components/Authentication/SignUp.tsx';
import GamesList from "./components/GamesList/GamesList.tsx";
import Header from "./components/Header/Header.tsx";
import MyFooter from "./components/Footer/Footer.tsx";
import GameBet from "./components/GameBetComponent/GameBet.tsx";
import IndividualBetHistory from "./components/IndividualBetHistory/IndvidualBetHistory.tsx";
import Profile from "./components/Profile/Profile.tsx";
import UserGroups from './components/UserGroups/UserGroups.tsx';
import GroupCreation from "./components/GroupCreation/GroupCreation.tsx";
import GroupDetails from "./components/GroupDetails/GroupDetails.tsx";
import GroupStatistics from "./components/GroupStatistics/GroupStatistics.tsx";
import GroupBetHistory from "./components/GroupBetHistory/GroupBetHistory.tsx";
import GroupGamesToBet from "./components/GroupGamesToBet/GroupGamesToBet.tsx";
import UpdateBet from "./components/UpdateBet/UpdateBet.tsx";
export default function App() {
    return (
            <BrowserRouter>
                <Header></Header>
                <Routes>
                    <Route path="/gamelist" element={< GamesList />} />
                    <Route path="/userLogin" element={<SignIn />} />
                    <Route path="/userRegister" element={<SignUp />} />
                    <Route path="/gameBet" element={<GameBet />}></Route>
                    <Route path="/individualBetHistory" element={<IndividualBetHistory />}></Route>
                    <Route path='/' element={<Profile />}></Route>
                    <Route path='/userGroups' element={<UserGroups />}></Route>
                    <Route path='/groupCreation' element={<GroupCreation />}></Route>
                    <Route path='/groupdetails' element={<GroupDetails />}></Route>
                    <Route path='/groupstatistics' element={<GroupStatistics />}></Route>
                    <Route path='/groupbethistory' element={<GroupBetHistory />}></Route>
                    <Route path='/groupgamestobet' element={<GroupGamesToBet />}></Route>
                    <Route path='/updatebet' element={<UpdateBet />}></Route>
                </Routes>
                <MyFooter/>
            </BrowserRouter>
    );
}
