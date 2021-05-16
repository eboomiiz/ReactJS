import React from "react";
//import axios from 'axios'
import { useQuery } from "react-query";

import { Carousel, Spinner } from 'react-bootstrap'

const SlideShowImage = () => {

  const query = useQuery("getData", () => {
    const controller = new AbortController()
    const signal = controller.signal

    const promise = fetch(
      "https://restful-api-album.herokuapp.com/introduction",{
        method: 'get',
        signal: signal
      }
    ).then((res) => res.json())

    //cancel request
    promise.cancel = () => controller.abort()

    return promise
  });

  const { isLoading, error, data, isFetching } = query

  // const [slideImage, setSlideImage] = React.useState([])
  // const [loading, setLoading] = React.useState(false)
  // const [error, setError] = React.useState(null)
  // const cancelToken = React.useRef(null)

  // const getData = async () => {
  //   try {
  //     setLoading(true)

  //     const resp = await axios.get('https://restful-api-album.herokuapp.com/introduction', {
  //       cancelToken: cancelToken.current.token
  //     })
  //     setSlideImage(resp.data.data)
  //   } catch (error) {
  //     setError(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // React.useEffect(() => {
  //   cancelToken.current = axios.CancelToken.source()
  //   getData()

  //   return () => {
  //     cancelToken.current.cancel()
  //   }
  // },[])

  if (isLoading === true) {
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
        <p>{JSON.stringify(error)}</p>
        {/* <p>{error.response.data.message}</p> */}
      </div>
    )
  }

  return (
    <>
      <Carousel fade className="mb-4">
        {
          data.data.map((s, index) => {
            return (
              <Carousel.Item key={s.id}>
                <img
                  className="d-block w-100"
                  src={s.photo}
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h1 className="mb-5">{s.title}</h1>
                  <p className="mb-5">{s.subtitle}</p>
                </Carousel.Caption>
              </Carousel.Item>
            )
          })
        }
</Carousel>
    </>
  );
};

export default SlideShowImage;
