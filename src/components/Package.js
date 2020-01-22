import React from 'react'
import { Link } from 'react-router-dom'

const Package = ({ pkg, packages }) => {
  if (pkg === undefined || packages === undefined) {
    return null
  }

  const findByName = (name) => packages.find(p => p.package === name)
  const namesToList = names => names.map(name => findByName(name))
  const depends = () => namesToList(pkg.depends)
  const reverse = () => namesToList(pkg.reversedepends)
  const ListToElements = p => p ? <Link key={p.id} to={`/packages/${p.id}`}>{p.package}</Link> : null

  return (
    <div>
      <h2>{pkg.package}</h2>
      {pkg.description.map((line, index) => <div key={index}>{line}</div>)}
      <div>
        Dependencies:
        { pkg.depends ? depends().map(ListToElements) : null }

      </div>
      <div>
        Reverse dependecies:
        { pkg.reversedepends ? reverse().map(ListToElements) : null }
      </div>
    </div>
  )
}

export default Package
