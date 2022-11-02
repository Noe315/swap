import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Swap from './pages/Swap'
import Liquidity from './pages/Liquidity'
import Header from './components/Header'
import Position from './pages/Position'

function App () {
  return (
    <div className="App">
      <Header />

      <Router>
        <Routes>
          <Route path='/' element={<Swap />} />
          <Route path='/swap' element={<Swap />} />
          <Route path='/provide-liquidity' element={<Liquidity />} />
          <Route path='/view-liquidity' element={<Position />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
