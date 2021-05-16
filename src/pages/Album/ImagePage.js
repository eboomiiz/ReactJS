import React, { useState, useCallback } from 'react';
import axios from 'axios'
import ImageViewer from 'react-simple-image-viewer';
import { useParams, useHistory } from 'react-router-dom'
import { MdAddAPhoto } from 'react-icons/md'
import { Spinner, Button, Card, CardColumns } from 'react-bootstrap'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import '../../styles/FontMali.css'
import { useToasts } from 'react-toast-notifications';

const ImagePage = () => {
  const {id, title} = useParams()
  const history = useHistory()
  const { addToast } = useToasts()

  const [photo, setPhoto] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const cancelToken = React.useRef(null)

  const getData = async (id) => {
    try {
      setLoading(true);
      const resp = await axios.get(
        "https://restful-api-album.herokuapp.com/albumphoto/" + id,
        {
          cancelToken: cancelToken.current.token,
        }
      );
      //console.log(resp.data.data.photos)
      setPhoto(resp.data.data.photos);
    } catch (error) {
      //console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const openImageViewer = useCallback((index) => {
      setCurrentImage(index);
      setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
      setCurrentImage(0);
      setIsViewerOpen(false);
    };

    React.useEffect(() => {
      cancelToken.current = axios.CancelToken.source();

      getData(id);

      return () => {
        cancelToken.current.cancel();
      };
    }, [id]);

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
        <div className="p-2 mb-5 text-center">

             <div className="mr-2">
             <Button className="float-left" size="sm" variant="secondary" onClick={() => {
                history.goBack()
            }}>Back</Button>
                 <Button variant="dark" size="sm" className="float-right" onClick={() => history.push(`/addphoto/${id}/${title}`)}>
                   <MdAddAPhoto className="mb-1"/> Add photo</Button>
                 </div>

                 <h1 class="text-left ml-2 mb-3 mt-5 fontrobotoML fontmColor">{title}</h1>

                 <CardColumns className="col-md-10 m-auto">
            {photo.map((p, index) => {
              return (
                <>

              {/* <img
                key={ p._id }
                className="col-md-5 p-2"
                style={{ width: "400px", height: "400px", objectFit: "cover"}}
                  src={ `https://storage.googleapis.com/album_photo_node/${p.photo}` }
                  onClick={ () => openImageViewer(index) }
                  alt=""/>
                  <Button size="sm" variant="outline-dark" style={{verticalAlign: "bottom", marginBottom: "8px"}} onClick={() => {
                history.goBack()
            }}><RiDeleteBin5Fill/></Button> */}

              <Card key={ p._id } border="light" >
                  <Card.Img variant="top" src={ `https://storage.googleapis.com/album_photo_node/${p.photo}` }
                  onClick={ () => openImageViewer(index) }/>
                  <Card.Body style={{padding: "0px", marginTop: "3px"}}>
                  <Button className="float-right" size="sm" variant="outline-dark" onClick={ async () => {
                const isConfirm = window.confirm(`Are you sure you want to delete the photo ?`)
                if (isConfirm === true) {
                  const resp = await axios.delete(`https://restful-api-album.herokuapp.com/photo/${p._id}`) //ลบข้อมูล
                  //alert(resp.data.message)
                  addToast(resp.data.message, { appearance: 'success' });
                  history.go(0) //refresh new
                }
              }}><RiDeleteBin5Fill/></Button>
                  </Card.Body>
                </Card>
                  </>
              )})
            }
            </CardColumns>
            {isViewerOpen && (
        <ImageViewer
          src={ photo.map((p) => {return (`https://storage.googleapis.com/album_photo_node/${p.photo}`)}) }
          currentIndex={ currentImage }
          onClose={ closeImageViewer }
        />
      )}
        </div>
    )
}

export default ImagePage
