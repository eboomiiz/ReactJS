import React from 'react'
import { Form, Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import { FaRegUser } from 'react-icons/fa'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

import { Link, useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications';

import '../styles/FontColor.css'

const schema = yup.object().shape({
  name: yup.string().required("Please enter your first name."),
  email: yup.string().required("Please enter your email.").email('The email format is invalid.'),
  password: yup.string().required("Please set a password.").min(8, 'Password is at least 8 characters.'),
});

const RegisterPage = () => {

  const history = useHistory()
  const { addToast } = useToasts()
  const [loading, setLoading] = React.useState(false)

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
     try {
        setLoading(true);
        const apiUrl = "https://restful-api-album.herokuapp.com/user/register";
        const resp = await axios.post(apiUrl, {
           name: data.name,
           email: data.email,
           password: data.password,
        }); //เพิ่มข้อมูล
   
      addToast(resp.data.message, { appearance: 'success'}); //แจ้งเตือนจาก sever
       history.replace('/login') //ไปหน้า login
     } catch (error) {
        addToast(error.response.data.error.message, { appearance: 'error'});
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
                <h1><FaRegUser/></h1>
                <h1>Register</h1></div>

         <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="name">
              <Form.Label>First name</Form.Label>
              <Form.Control type="text" name="name" ref={register}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}/>
              {errors.name && (
                <Form.Control.Feedback type="invalid">
                  {errors.name.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

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

            <Button className="col center mt-3" variant="dark" type="submit">REGISTER</Button>

            <div className="float-right mt-3 mb-2">
            <span className="mr-2">Have a account ?</span><Link to="/login" className="fontColor">login</Link>
            </div>
        </Form>
        </Col>
      </Row>
      </div>
    </Container>
    )
}

export default RegisterPage
