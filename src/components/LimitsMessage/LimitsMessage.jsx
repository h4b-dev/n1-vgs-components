
import React from 'react'
import { styles }from './LimitsMessage.module.css'

const LimitsMessage = ({ message }) => {
  return (
    <div className={styles}>
      <p>{message}</p>
    </div>
  )
}

export default LimitsMessage
