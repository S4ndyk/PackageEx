import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { parse } from '../parser'

const UploadView = (props) => {
  const upload = async event => {
    const file = event.target.files[0]
    const text = await file.text()
    const parsed = parse(text)
    props.setPackages(parsed)
    window.localStorage.setItem('packages', JSON.stringify(parsed))
    props.history.push('/')
  }

  return (
    <div>
      <input id='input' type='file' onChange={upload} style={{ display: 'none' }} />
      <Button className='upload' >
        <label htmlFor='input' >upload</label>
      </Button>
    </div>
  )
}

export default withRouter(UploadView)
