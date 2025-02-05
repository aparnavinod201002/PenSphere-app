import React, { useState, useEffect } from 'react';
import { Container, Card, Form, FormControl, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { server_url } from '../Services/server_url';
import { addCommentAPI, getCommentsAPI } from '../Services/allAPI';
import Header from '../Components/Header';


function PostDetails({ posts }) {
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]); 
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false); 

  
  const handleClose = () => setShow(false);

  
  const handleShow = async () => {
    setShow(true);
    if (posts?._id) {
      fetchComments(posts._id);
    }
  };

  
  useEffect(() => {
    if (posts?._id && showComments) {
      fetchComments(posts._id);
    }
  }, [posts, showComments]);

  
  const fetchComments = async (postId) => {
    try {
      const result = await getCommentsAPI(postId);
      if (result.status === 200) {
        setComments(result.data); 
      } else {
        console.error('Error fetching comments:', result);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

 
  const handleAddComment = async (e) => {
    e.preventDefault();
  
    if (!posts || !posts._id) {
      toast.error('Invalid post data');
      return;
    }
  
    if (!comment.trim()) {
      toast.info('Please enter a comment');
      return;
    }
  
    const postId = posts._id; 
    console.log("Adding comment:", comment, "to post ID:", postId);
    const name = sessionStorage.getItem('username');
  
    const reqBody = { comment, postId ,name};
  
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('User is not authenticated.');
      return;
    }
  
    const reqHeader = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const result = await addCommentAPI(reqBody, reqHeader);
      if (result.status === 200) {
        toast.success('Comment added successfully!');
        setComment('');
  
        
        fetchComments(postId);
      } else {
        toast.warning(result.response.data);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };
  
 
  const handleLike = () => {
    setLiked(!liked);
  };

 
  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  return (
    <>
    
    <Container className="mt-5" >
    
      <Button variant="danger" onClick={handleShow}>
        Read More
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Post Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {posts ? (
            <Card className="shadow">
              <Card.Img
                variant="top"
                src={`${server_url}/uploads/${posts.postImage}`}
                alt={posts.title}
              />+
              <Card.Body>
                <Card.Title>{posts.title}</Card.Title>
                <Card.Text>{posts.description}</Card.Text>

              
                <div className="d-flex align-items-center gap-3">
                  <i
                    className={`fa-${liked ? 'solid' : 'regular'} fa-heart text-danger fs-4`}
                    style={{ cursor: 'pointer' }}
                    onClick={handleLike}
                  ></i>
              

               
                <Button
                  variant="danger"
                  className="mt-3"
                  onClick={handleShowComments}
                >
                  {showComments ? <i class="fa-solid fa-comment"></i> : <i class="fa-regular fa-comment"></i>}
                </Button>
</div>
 
  <Form className="mt-2" onSubmit={handleAddComment}>
                      <FormControl
                        type="text"
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button className="mt-2" variant="success" type="submit">
                        Post
                      </Button>
                    </Form>
              
                {showComments && (
                  <div className="mt-3">
                    <h5>Comments</h5>
                    <div className="comments-container border rounded p-3 bg-light">
                      {comments.length > 0 ? (
                        comments.map((c, index) => (
                          <div key={index} className="comment-item border-bottom py-2">
                            <strong>{c.name} :</strong> {c.comment}
                          </div>
                        ))
                      ) : (
                        <p>No comments yet.</p>
                      )}
                    </div>

                  
                  </div>
                )}
              </Card.Body>
            </Card>
          ) : (
            <p>No post details available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
   
    </>
  );
}

export default PostDetails;
