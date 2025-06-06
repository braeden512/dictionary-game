import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import About from './pages/About';
import PageNotFound from './pages/PageNotFound';
import Home from './pages/Home';
import HostRoom from './pages/HostRoom';
import JoinRoom from './pages/JoinRoom';
import Room from './pages/Room';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* If the path is /, reroute to /home */}
          <Route path='/' element={<Navigate to="/home" />}></Route>
          <Route path='/home' element={<Home />}></Route>

          <Route path='/about' element={<About />}></Route>
          <Route path='/create_room/:id' element={<HostRoom />}></Route>
          <Route path='/join_room' element={<JoinRoom />}></Route>
          <Route path='/room/:roomCode/:userId' element={<Room />}></Route>
          

          {/* if the path is not a real path, reroute to /pagenotfound */}
          <Route path='/pagenotfound' element={<PageNotFound />}></Route>
          <Route path='/*' element={<Navigate to="/pagenotfound" />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
