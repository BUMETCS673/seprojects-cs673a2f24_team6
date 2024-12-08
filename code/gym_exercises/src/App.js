import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ExerciseDetail from './pages/ExerciseDetail'
import Home from './pages/Home'

const App = () => {
  return (
    <div>
      <Box width="400px" sx={{ width: { xl: '1488px' } }} m="auto" >
        <Navbar />
        <Routes>
          <Route>
            <Route path="/" element={<Home />} />
            <Route path="/exercise/:id" element={<ExerciseDetail />} />
          </Route>
        </Routes>
        <Footer />
      </Box>
    </div>
  )
}

export default App
