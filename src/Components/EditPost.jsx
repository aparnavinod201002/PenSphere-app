import React, { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { updatePostAPI, deletePostAPI } from '../Services/allAPI'; 
import { server_url } from '../Services/server_url';
import { ToastContainer, toast } from 'react-toastify';

function EditPost({ posts,refreshPosts }) {
  const [show, setShow] = useState(false);
  const [preview, setPreview] = useState('');
  const [postData, setPostData] = useState({
    id: posts?._id,
    title: posts?.title,
    description: posts?.description,
    status: posts?.status,
    postImage: ''
  });

  useEffect(() => {
    if (postData.postImage) {
      setPreview(URL.createObjectURL(postData.postImage));
    } else {
      setPreview(`${server_url}/uploads/${posts?.postImage}`);
    }
  }, [postData.postImage, posts?.postImage]);

  const handleClose = () => {
    setShow(false);
    setPostData({
      title: posts?.title,
      description: posts?.description,
      status: posts?.status,
      postImage: ''
    });
    setPreview(`${server_url}/uploads/${posts?.postImage}`); 
  };

  const handleShow = () => setShow(true);

  const handleUpdate = async () => {
    const userEmail = posts?.userEmail;

    if (!userEmail) {
      toast.error('User email is missing!');
      return;
    }

    const { id, title, description, status, postImage } = postData;
    if (!title || !description || !status || !postImage) {
      toast.info('Please fill all the fields');
    } else {
      const reqBody = new FormData();
      reqBody.append('title', title);
      reqBody.append('description', description);
      reqBody.append('status', status);
      reqBody.append('userEmail', userEmail); 
      postImage && reqBody.append('postImage', postImage);

      const token = sessionStorage.getItem('token');
      if (token) {
        const reqHeader = {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`
        };
        try {
          const result = await updatePostAPI(id, reqBody, reqHeader);
          if (result.status === 200) {
            toast.success('Post updated successfully');
            handleClose();
            refreshPosts();
          } else {
            toast.warning(result.data.response);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

 
  
  return (
    <>
      <Button className="btn btn-light p-0 m-1" onClick={handleShow}>
        <i className="fa-solid fa-pen-to-square text-dark m-3 p-0"></i>
      </Button>

    

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
                  height={"200px"}
                  width={"100%"}
                  src={preview ? preview : `${server_url}/Uploads/${posts?.postImage}`}
                  alt="Post Preview"
                />
              </label>
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
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer autoClose={2000} position="top-center" theme="colored" />
    </>
  );
}

export default EditPost;
