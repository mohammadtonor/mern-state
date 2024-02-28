import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { SignUp } from './page/SignUp'
import { SignIn } from './page/SignIn'
import { About } from './page/About'
import { Profile } from './page/Profile'
import { Home } from './page/Home'
import Header from './components/Header'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
