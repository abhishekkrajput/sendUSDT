import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Features from './components/Features'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
      </main>
    </div>
  )
}

export default App
