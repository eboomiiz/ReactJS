import React from 'react'
import axios from 'axios'

import { Card, CardColumns, Spinner, Button, ButtonGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdEdit, MdDelete } from 'react-icons/md'

import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications';
import '../styles/FontColor.css'

const CardImage = () => {

  const [card, setCard] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const cancelToken = React.useRef(null)

  const history = useHistory()
  const { addToast } = useToasts()

  const getData = async () => {
    try {
      setLoading(true);
      const resp = await axios.get('https://restful-api-album.herokuapp.com/albumphoto', {
        cancelToken: cancelToken.current.token
      })
      setCard(resp.data.data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    cancelToken.current = axios.CancelToken.source()
    getData()

    return () => {
      cancelToken.current.cancel()
    }
  },[])

  if (loading === true) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="dark" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center mt-4 text-danger">
        <p>An error occurred from the server. Please try again.</p>
      </div>
    )
  }

    return (
        <>
      <CardColumns className="col-md-8 m-auto">
      {
        card.map((c, index) => {
          return (
            <Card key={c.id} bg="light" className="mb-5">
              <Card.Img variant="top" src={c.photo} style={{ width: "100%", height: "300px", objectFit: "cover" }}/>
              <Card.Body>
              <Card.Title className="fontColor">{c.title}</Card.Title>
              <Card.Text>{c.subtitle}</Card.Text>
              <Link to={`/image/${c.id}/${c.title}`} className="btn btn-outline-dark btn-sm" role="button">
                View
              </Link>
              <ButtonGroup className="float-right">
              <Button variant="outline-dark" size="sm" onClick={() => history.push(`/edit/${c.id}/${c.title}`)}><MdEdit/></Button>
              <Button variant="outline-dark" size="sm" onClick={ async () => {
                const isConfirm = window.confirm(`Are you sure you want to delete the album ${c.title} ?`)
                if (isConfirm === true) {
                  const resp = await axios.delete(`https://restful-api-album.herokuapp.com/albumphoto/${c.id}`) //ลบข้อมูล
                  //alert(resp.data.message)
                  addToast(resp.data.message, { appearance: 'success' });
                  history.go(0) //refresh new
                }
              }}><MdDelete/></Button>
              </ButtonGroup>
              </Card.Body>
            </Card>
          )
        })
      }

</CardColumns>
        </>
    )
}

export default CardImage
