import React, { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { addPostAPI } from '../Services/allAPI';
import { ToastContainer, toast } from 'react-toastify';

function Add({refreshPosts}) {
  const [show, setShow] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    status: 'Public', 
    userEmail: '',
    postImage: null,
  });

  const [fileStatus, setFileStatus] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (show) {
      
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setPostData((prev) => ({ ...prev, userEmail: storedEmail }));
      }
    }
  }, [show]);

  useEffect(() => {
    if (postData.postImage) {
      if (postData.postImage.type?.match(/image\/(png|jpeg|jpg)/)) {
        setPreview(URL.createObjectURL(postData.postImage));
        setFileStatus(false);
      } else {
        toast.error('Please upload an image in PNG, JPG, or JPEG format.');
        setFileStatus(true);
        setPostData({ ...postData, postImage: null });
      }
    }
  }, [postData.postImage]);

  const handleClose = () => {
    setShow(false);
    setPostData({
      title: '',
      description: '',
      status: 'Public',
      userEmail: localStorage.getItem('email') || '',
      postImage: null,
    });
    setPreview('');
  };

  const handleShow = () => setShow(true);

  const handleAddPost = async () => {
    const { title, description, status, postImage, userEmail } = postData;

  
    if (!title || !description || !status || !postImage || !userEmail) {
      toast.info('Please fill in all fields');
      return;
    }

    const reqBody = new FormData();
    reqBody.append('title', title);
    reqBody.append('description', description);
    reqBody.append('status', status);
    reqBody.append('userEmail', userEmail);
    reqBody.append('postImage', postImage);

    const token = sessionStorage.getItem('token');
    if (token) {
      const reqHeader = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      };

      try {
        const result = await addPostAPI(reqBody, reqHeader);
        if (result.status === 200) {
         
          refreshPosts();
          toast.success('Post added successfully!');
          handleClose();
        } else {
          toast.warning(result.response.data);
        }
      } catch (err) {
        console.log(err);
        toast.error('Something went wrong. Please try again.');
      }
    } else {
      toast.error('User is not authenticated.');
    }
  };

  return (
    <>
      
      <Button variant="transparent" style={{ fontSize: '40px' }} className="ms-2" onClick={handleShow}>
        <i className="fa-solid fa-arrow-up-from-bracket fa-bounce text-dark"></i>
      </Button>
      <div className='mb-5'>Upload Blogs</div>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Post Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <label>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => setPostData({ ...postData, postImage: e.target.files[0] })}
                />
                <img
                  height="200px"
                  width="100%"
                  src={preview ? preview : 'https://static.vecteezy.com/system/resources/previews/008/018/058/non_2x/icon-add-image-upload-image-file-photo-outline-design-free-vector.jpg'}
                  alt="Upload Preview"
                />
              </label>
              {fileStatus && <div className="mt-3 text-danger">Please upload an image in PNG, JPG, or JPEG format.</div>}
            </div>
            <div className="col-6">
              <Form>
                <FloatingLabel controlId="floatingInput1" label="Post Title" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Post Title"
                    value={postData.title}
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput2" label="Description" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Description"
                    value={postData.description}
                    onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                  />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput3" label="Status" className="mb-3">
                  <Form.Select
                    value={postData.status}
                    onChange={(e) => setPostData({ ...postData, status: e.target.value })}
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </Form.Select>
                </FloatingLabel>
              </Form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddPost}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer autoClose={2000} position="top-center" theme="colored" />
    </>
  );
}

export default Add;
