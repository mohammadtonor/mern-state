import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { SignUp } from './page/SignUp'
import SignIn from './page/SignIn'
import { About } from './page/About'
import { Profile } from './page/Profile'
import { Home } from './page/Home'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './page/CreateListing'
import { UpdateListing } from './page/UpdateListing'
import Listing from './page/listing'
import Search from './page/Search'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
