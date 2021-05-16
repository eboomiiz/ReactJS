import React from 'react'

import { Navbar, Nav, Button } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { AiOutlineCamera } from 'react-icons/ai'
import { BiImageAdd } from 'react-icons/bi'
import { FiLogOut } from 'react-icons/fi'
import '../styles/BgColor.css'
import '../styles/FontRoboto.css'

//redux
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile } from "../redux/action/authAction";

const NavBar = () => {
    const history = useHistory()

      //redux
  const profileRedux = useSelector((state) => state.authReducer.profile) //นำมาแสดง
  const dispatch = useDispatch()

     //redux
  const getProfile = () => {
    const profileValue = JSON.parse(localStorage.getItem('profile'))
    if (profileValue) {
      dispatch(updateProfile(profileValue))
    }
  }

  React.useEffect(() => {

    getProfile()
  },[])

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('profile')
        history.replace('/')
        dispatch(updateProfile(null))
      }

    return (
        <>
            <Navbar expand="lg" variant="dark" className="navbar-inverse bgnColor" style={{backgroundColor: ''}}>

            <NavLink className="navbar-brand" to="/" exact>
                <AiOutlineCamera className="mb-1"/> Album
        </NavLink>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
            <NavLink
                  className="nav-link mr-3 fontrobotoM"
                  style={{ marginTop: "5px" }}
                  to="/create"
                  activeClassName="active">
                  <BiImageAdd className="mb-1"/> Create album
                </NavLink>

            {
                profileRedux ? (
                    <span className="navbar-text text-light ml-1 fontrobotoM">
                        {profileRedux.name}
                        <Button className="btn btn-danger ml-3" size="sm" onClick={logout}>
                <FiLogOut className="mb-1"/> Log out
              </Button>
                    </span>
                ) : (
                    <>
                    <NavLink
                  className="nav-link fontrobotoM"
                  style={{ marginTop: "5px" }}
                  to="/register"
                  activeClassName="active">
                  Register
                </NavLink>
            <NavLink
                  className="nav-link fontrobotoM"
                  style={{ marginTop: "5px" }}
                  to="/login"
                  activeClassName="active">
                Login
                </NavLink>
                </>
                )
            }

            </Nav>
            </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default NavBar
