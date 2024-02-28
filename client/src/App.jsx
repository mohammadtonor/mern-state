import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { SignUp } from './page/SignUp'
import { SignIn } from './page/SignIn'
import { About } from './page/About'
import { Profile } from './page/Profile'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
