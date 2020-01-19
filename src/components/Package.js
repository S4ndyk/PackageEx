import React from 'react'
import { Link } from 'react-router-dom'

const Package = ({ packageInfo }) => {
  if (packageInfo === undefined) {
    return null
  }
  if (packageInfo.Package === 'python') {
    console.log(packageInfo)
  }
  return (
    <div>
      <h2>{packageInfo.Package}</h2>
      <Link to='/index' >back to menu</Link>
      <div>{packageInfo.Description.map((line, index) => <div key={index}>{line}</div>)}</div>
      {packageInfo.Depends ? <Dependencies depends={packageInfo.Depends} /> : null}
      {packageInfo['Pre-Depends'] ? <PreDependencies preDepends={packageInfo['Pre-Depends']} /> : null}
    </div>
  )
}

const Dependencies = (props) => {
  return (
    <div>
      Depends:
      {props.depends.map(dep => <Link key={dep.id} to={dep.id}>{dep.name} </Link>)}
    </div>
  )
}

const PreDependencies = (props) => {
  return (
    <div>
      Pre-Depends:
      {props.preDepends.map(dep => <Link key={dep.id} to={dep.id}>{dep.name} </Link>)}
    </div>
  )
}

export default Package
