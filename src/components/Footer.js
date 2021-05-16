import React from 'react'
import PropTypes from 'prop-types'
import '../styles/BgColor.css'
import '../styles/FontRoboto.css'
import { AiFillFacebook } from 'react-icons/ai'
import { MdEmail } from 'react-icons/md'
import { FaPhoneSquareAlt } from 'react-icons/fa'

//redux thunk
import { getVersion } from '../redux/action/authAction'
import { useDispatch, useSelector } from 'react-redux'

const Footer = ({title}) => {

    const dispatch = useDispatch()
    const version = useSelector((state) => state.authReducer.version);

  React.useEffect(() => {
      dispatch(getVersion())
      // eslint-disable-next-line react-hooks/exhaustive-deps
  })

    return (
        <>
        <div className="row bgnColor p-3">
        <footer className="container col-md-5 fontrobotoM">
            <p class="float-right mr-5" style={{color: "white"}}>{title}{new Date().getFullYear()} Backend API Version : {version}</p>
        </footer>
        <div className="col-md-6 ml-5 fontrobotoM">
            <p style={{color: "white"}}><MdEmail/> thanakornph.boom@gmail.com<br/><AiFillFacebook/> Thanakorn Phanthuwech<br/><FaPhoneSquareAlt/> 0937303253</p>
            </div>
        </div>
        </>
    )
}

Footer.propTypes = {
    title: PropTypes.string
}


export default Footer
