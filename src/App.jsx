import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Debate from './pages/Debate'
import Login from './pages/Login'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="debate" element={<Debate />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  )
}
