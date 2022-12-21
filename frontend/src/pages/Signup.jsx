import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Signup.css'
import { useSignupUserMutation } from '../services/appApi'

const Signup = () => {

   const [email, setEmail] = useState();
   const [password, setPassword] = useState();
   const [name, setName] = useState();
   const [image, setImage] = useState(null);
   const [uploadingImg, setUploadingImg] = useState(false);
   const [imagePreview, setImagePreview] = useState(null);
   const [fileError, setFileError] = useState(false);

   const [signupUser, { isLoading, error }] = useSignupUserMutation()
   const navigate = useNavigate()

   function validateImg(e) {
      const file = e.target.files[0];
      if (file.size >= 1048576) {
         return alert("Max file size is 1mb");
      } else {
         setImage(file);
         setImagePreview(URL.createObjectURL(file));
      }
   }

   async function uploadImage() {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "iChat-mern");
      try {
         setUploadingImg(true);
         let res = await fetch("https://api.cloudinary.com/v1_1/dxmddtyga/image/upload", {
            method: "post",
            body: data,
         });
         const urlData = await res.json();
         setUploadingImg(false);
         return urlData.url;
      } catch (error) {
         setUploadingImg(false);
         console.log(error);
      }
   }

   async function handleSignup(e) {
      e.preventDefault();
      if (!image) return alert("Please upload your profile picture");
      const url = await uploadImage(image);
      console.log(url);
      // signup the user
      signupUser({ name, email, password, picture: url }).then(({ data }) => {
         if (data) {
            console.log(data);
            navigate("/chat");
         }
      });
   }


   return (
      <Container fluid>
         <Row>
            <Col md={5} className="d-flex flex-direction-column align-items-center
         justify-content-center flex-direction-column">
               <Form style={{ width: '80%', maxWidth: 500 }} onSubmit={handleSignup}>
                  <h1 className='text-center py-3'>Welcome to our Family.</h1>
                  <div className="signup-profile-pic__container my-3">
                     <img src={imagePreview || "https://media.tenor.com/CigpzapemsoAAAAj/hi-robot.gif"}
                        alt="" className='signup-profile-pic' />
                     <label htmlFor="image-upload" className='image-upload-label'>
                        <i className='fas fa-plus-circle add-picture-icon'></i>
                     </label>
                     <input type="file" id="image-upload" hidden accept='image/*' onChange={validateImg} />
                     {fileError && <span style={{ fontSize: '3px', color: 'coral' }} className='text- 
                      muted'>The file is too large</span>}
                  </div>
                  <Form.Group className="mb-3" controlId="formName">
                     <Form.Label>Name</Form.Label>
                     <Form.Control type="text" placeholder="Enter Name" onChange={(e) =>
                        setName(e.target.value)} value={name} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                     <Form.Label>Email address</Form.Label>
                     <Form.Control type="email" placeholder="Enter email" onChange={(e) =>
                        setEmail(e.target.value)} value={email} />
                     <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                     </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                     <Form.Label>Password</Form.Label>
                     <Form.Control type="password" placeholder="Password" onChange={(e) =>
                        setPassword(e.target.value)} value={password} />
                  </Form.Group>
                  {uploadingImg ? (<Button variant="primary" disabled>
                     <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                     />
                     Registering...
                  </Button>)
                     :
                     (<Button variant="primary" type="submit">Register</Button>)}

                  <div className='py-3'>
                     <p className='text-center'>Already have an account?<Link to='/login'>Login</Link> </p>
                  </div>
               </Form>
            </Col>
            <Col md={7} className='register__bg'></Col>
         </Row>
      </Container >
   )
}

export default Signup