import React from 'react'
import { Form, Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import { RiLoginBoxLine } from 'react-icons/ri'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

import { Link, useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications';
import '../styles/BgColor.css'
import '../styles/FontColor.css'

//redux
import { useDispatch } from 'react-redux'
import { updateProfile } from '../redux/action/authAction';

const schema = yup.object().shape({
  email: yup.string().required("Please enter your email.").email('The email format is invalid.'),
  password: yup.string().required("Please enter password.").min(8, 'Password is at least 8 characters.'),
});

const LoginPage = () => {

  const history = useHistory()
  const { addToast } = useToasts()
  const [loading, setLoading] = React.useState(false)

  //call redux action
  const dispatch = useDispatch()

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    //console.log(data);
     try {
        setLoading(true);
        const apiUrl = "https://restful-api-album.herokuapp.com/user/login";
        const resp = await axios.post(apiUrl, {
           email: data.email,
           password: data.password,
        }); //log in

        localStorage.setItem('token', JSON.stringify(resp.data)) //เก็บค่า token

        //get profile
        const urlProfile = 'https://restful-api-album.herokuapp.com/user/me'
        const respProfile = await axios.get(urlProfile, {
            headers: {
                Authorization: 'Bearer ' + resp.data.access_token
            }
        })

        localStorage.setItem('profile', JSON.stringify(respProfile.data.user))

      addToast('Successfully entered the system.', { appearance: 'success'});

      const profileValue = JSON.parse(localStorage.getItem('profile'))

      //call redux action
      dispatch(updateProfile(profileValue))
      history.replace("/")

     } catch (error) {
        addToast('Incorrect email or password', { appearance: 'error'});
        
     } finally {
      setLoading(false);
    }
  };

  if (loading === true) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="dark" />
      </div>
    )
  }

    return (
      <Container className="mt-5 mb-5">
      <div className="bgLColor p-2">
      <Row>
        <Col xs={12} md={5} className="m-auto">
            <div className="text-center mb-5">
            <h1><RiLoginBoxLine/></h1>
            <h1>Log In</h1></div>

         <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" ref={register}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}/>
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" ref={register}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}/>
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button className="col center mt-3" variant="dark" type="submit">LOGIN</Button>
            <div className="float-right mt-3 mb-2">
            <span className="mr-2">No account ?</span><Link to="/register" className="fontColor">register</Link>
            </div>
        </Form>
        </Col>
      </Row>
      </div>
    </Container>
    )
}

export default LoginPage

