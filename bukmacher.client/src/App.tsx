import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/Authentication/SignIn.tsx';
import SignUp from './components/Authentication/SignUp.tsx';
import Index from './pages/Index.tsx';
import Header from "./components/Header/Header.tsx";
import MyFooter from "./components/Footer/Footer.tsx";
import GameBet from "./components/GameBetComponent/GameBet.tsx";
import IndividualBetHistory from "./components/IndividualBetHistory/IndvidualBetHistory.tsx";
import Profile from "./components/Profile/Profile.tsx";
export default function App() {
    return (
            <BrowserRouter>
                <Header></Header>
                <Routes>
                    <Route path="/" element={< Index />} />
                    <Route path="/userLogin" element={<SignIn />} />
                    <Route path="/userRegister" element={<SignUp />} />
                    <Route path="/gameBet" element={<GameBet />}></Route>
                    <Route path="/individualBetHistory" element={<IndividualBetHistory />}></Route>
                    <Route path='/profile' element={<Profile />}></Route>
                </Routes>
                <MyFooter/>
            </BrowserRouter>
    );
}
