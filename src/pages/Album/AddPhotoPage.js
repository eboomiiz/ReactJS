import React from 'react'
import { Form, Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import { BiImageAdd } from 'react-icons/bi'
import axios from "axios";
import { useHistory, useParams } from 'react-router-dom'

import { useForm } from "react-hook-form";
import { useToasts } from 'react-toast-notifications';

  const SUPPORTED_IMAGE_FORMATS = ['image/jpg', 'image/jpeg']

const AddPhotoPage = () => {
    const history = useHistory()
    const { addToast } = useToasts()
    const [loading, setLoading] = React.useState(false)
    const {id, title} = useParams()

    const { register, handleSubmit, errors } = useForm();

      const onSubmit = (data) => {

        try {
            let fileUpload = data.photo[0]
            const reader = new FileReader()
            reader.readAsDataURL(fileUpload)
            reader.onload = async (e) => {
                let base64Image = e.target.result
                const urlAPI = 'https://restful-api-album.herokuapp.com/photo'
                setLoading(true);
                const resp = await axios.post(urlAPI, {
                    albumphoto: id,
                    photo: base64Image,
                })

                addToast(resp.data.message, { appearance: 'success' });
                history.goBack() //กลับไปหน้า image
            }
        } catch (error) {
            addToast(JSON.stringify(error), { appearance: 'error'});
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
        <>
        <Button className="ml-2 mt-2" size="sm" variant="secondary" onClick={() => {
                history.goBack()
            }}>Back</Button>
    <Container className="mt-2">
      <Row>
        <Col xs={12} md={5} className="m-auto">
            <div className="text-center mb-5">
            <h1><BiImageAdd/></h1>
            <h1>Add Photo</h1>
            <h6>to album {title}</h6></div>

    <Form onSubmit={handleSubmit(onSubmit)}>

        <Form.Group>
            <Form.File
                id="photo" label="Select a photo" name="photo"
                className={`form-control-file ${errors.photo ? "is-invalid" : ""}`}
                ref={register({
                    required: 'Please select a file',
                    validate: {
                        checkFileType: (value) => {
                            return value && SUPPORTED_IMAGE_FORMATS.includes(value[0].type)
                        }
                    }
                })}/>
                {
                  errors.photo && errors.photo.type === 'required' && (
                      <div className="invalid-feedback">
                          {errors.photo.message}
                      </div>
                  )
              }
              {
                  errors.photo && errors.photo.type === 'checkFileType' && (
                      <div className="invalid-feedback">
                          Image files are only supported with .jpg or jpeg extension.
                      </div>
                  )
              }
        </Form.Group>

        <Button type="submit" className="col center mt-3 mb-5" variant="dark">ADD</Button>

    </Form>
    </Col>
      </Row>
    </Container>
        </>
    )
}

export default AddPhotoPage