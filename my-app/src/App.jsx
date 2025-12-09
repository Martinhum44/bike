import { useState } from 'react'
import Map from './Map.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Map></Map>
    </>
  )
}

export default App
