import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import UploadView from './UploadView'
import { parse } from '../parser'

const IndexView = (props) => {
  const packages = props.packages
  if (packages === undefined) {
    return (
      <div>
        It seems you havent uploaded your config file yet!
        <UploadView />
      </div>
    )
  }

  const upload = async event => {
    const file = event.target.files[0]
    const text = await file.text()
    const parsed = parse(text)
    props.setPackages(parsed)
    window.localStorage.setItem('packages', JSON.stringify(parsed))
  }

  return (
    <div>
      <input id='input' type='file' onChange={upload} style={{ display: 'none' }} />
      <Button className='upload' >
        <label htmlFor='input' >upload</label>
      </Button>
      <ListGroup>
        {packages.map(p => {
          return (
            <ListGroup.Item key={p.id}>
              <Link key={p.id} to={`/packages/${p.id}`}>{p.Package}</Link>
            </ListGroup.Item>
          )
        })}
      </ListGroup>

    </div>
  )
}

export default IndexView
