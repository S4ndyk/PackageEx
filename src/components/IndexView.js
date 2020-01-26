import React from 'react'
import { Link } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import { parse } from '../simple-parser'

const IndexView = (props) => {
  const packages = props.packages
  if (packages === undefined) {
    return null
  }

  const upload = async event => {
    const file = event.target.files[0]
    const text = await file.text()
    const parsed = parse(text)
    props.setPackages(parsed)
    window.localStorage.setItem('packages', JSON.stringify(parsed))
  }

  const sortAndMap = packages
    .sort((a, b) => a.package.localeCompare(b.package))
    .map(pkg =>
      <ListGroup.Item key={pkg.id}>
        <Link to={`/packages/${pkg.id}`} >
          {pkg.package}
        </Link>
      </ListGroup.Item>
    )

  return (
    <div>
      <h2>Click upload and navigate to /var/lib/dpkg/status</h2>
      <input id='input' type='file' onChange={upload} style={{ display: 'none' }} />
      <Button className='upload' >
        <label htmlFor='input' >upload</label>
      </Button>
      <ListGroup>
        {sortAndMap}
      </ListGroup>
    </div>
  )
}

export default IndexView
