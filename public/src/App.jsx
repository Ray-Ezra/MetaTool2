import { Routes ,Route } from 'react-router-dom'
import WelcomePage from './pages/Home/home'
import FormDisplay from './pages/Transaction/FormDisplay'
import TransactionDetailsPage from './pages/Download/Download'
import DownloadPage from './components/Table/DownP'
import LoginForm from './pages/Authentification/page'
import Form6 from './pages/Transaction/Form6/Form6'
import CsvDownload from './pages/Transaction/CsvDownload'
import Navbar from './components/Navbar/Navbar'
import SignUp from './pages/signup/signup'
import './App.css'



const App = () => {
  return (
    <>
      <Navbar />
    <Routes>
      <Route path='/' element={<LoginForm/>}></Route>
      <Route path='/signup' element={<SignUp/>}></Route>
      <Route path='/home' element={<WelcomePage/>}></Route>
      <Route path='/form-display' element={<FormDisplay/>}></Route>
      <Route path='/generate' element={<TransactionDetailsPage/>}></Route>
      <Route path='/form6' element={<Form6/>}></Route>
      <Route path='/download/:index' element={<DownloadPage/>}></Route>
      <Route path='/downloadcsv' element={<CsvDownload/>}></Route>
    </Routes> 
    </>

  )
}

export default App
