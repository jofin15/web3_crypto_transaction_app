
import React from 'react'


import {Navbar,Transactions,Welcome,Services,Footer,Loader} from "./components/index"
function App() {


  return (
    <div className="min-h-screen">
      <div className='gradient-bg-welcome'>
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer /> 
    </div>
  )
}

export default App
