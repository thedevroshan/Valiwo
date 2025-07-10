import React from 'react'

import { useUserStore } from '../stores/user-store'

const Navbar = () => {
  const user = useUserStore()

  return (
    <nav className=''>

    </nav>
  )
}

export default Navbar