import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Swap from './components/Swap'
import Liquidity from './components/Liquidity'
import Header from './components/Header'

function App () {
  return (
    <div className="App">
      <Header />

      <Router>
        <Routes>
          <Route path='/' element={<Swap />} />
          <Route path='/swap' element={<Swap />} />
          <Route path='/provide-liquidity' element={<Liquidity />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
