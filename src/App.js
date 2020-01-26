import React, { useState, useEffect } from 'react'
import IndexView from './components/IndexView'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Package from './components/Package'

const App = () => {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    const storagedPackages = window.localStorage.getItem('packages')
    if (storagedPackages) {
      const jsonPackages = JSON.parse(storagedPackages)
      setPackages(jsonPackages)
    }
  }, [])

  const findById = id => packages.find(p => p.id === id)

  return (
    <div className='container'>
      <Router>
        <Route path='/index' render={() => <IndexView packages={packages} setPackages={setPackages} /> } />
        <Route exact path='/' render={() => <Redirect to='/index' />} />
        <Route path='/packages/:id' render={({ match }) => <Package pkg={findById(match.params.id)} packages={packages} />} />
      </Router>
    </div>
  )
}

export default App
