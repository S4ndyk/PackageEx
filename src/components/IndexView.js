import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import UploadView from './UploadView'

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

  return (
    <div>
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
