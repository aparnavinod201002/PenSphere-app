import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import Add from '../Components/Add';
import { 
  getMyPostsAPI, 
  getCommentsAPI, 
  getUserAPI, 
  deletePostAPI, 
  MostCommentedPostIdAPI, 
  MostCommentedPostAPI 
} from '../Services/allAPI';
import { server_url } from '../Services/server_url';
import EditPost from '../Components/EditPost';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
//new added
function Dashboard() {
  const [myPosts, setMyPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [user, setUser] = useState([]);
  const [postId, setPostId] = useState(null);
  const [mostCommentedPost, setMostCommentedPost] = useState(null);

 
  const fetchComments = async (postId) => {
    setLoadingComments(true);
    try {
      const result = await getCommentsAPI(postId);
      if (result.status === 200) {
        setComments(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleShowComments = async (postId) => {
    setSelectedPostId(postId);
    await fetchComments(postId); 
    setShowModal(true);
  };

  
  const getUser = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const reqHeader = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
      };
      try {
        const result = await getUserAPI(reqHeader);
        if (result.status === 200) {
          setUser(result.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

 
  const deletePost = async (id) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
      };
      try {
        const result = await deletePostAPI(id, reqHeader);
        if (result.status === 200) {
          getMyPosts();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

 //added
  const getMyPosts = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const reqHeader = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
      };
      try {
        const result = await getMyPostsAPI(reqHeader);
        if (result.status === 200) {
          setMyPosts(result.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

 
  const fetchMostCommentedPostId = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const reqHeader = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
      };
      try {
        const result = await MostCommentedPostIdAPI(reqHeader);
        if (result.status === 200) {
          setPostId(result.data.postId);
          fetchMostCommentedPost(result.data.postId);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

 
  const fetchMostCommentedPost = async (id) => {
    if (!id) return;
    
    const token = sessionStorage.getItem('token');
    if (token) {
      const reqHeader = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
      };
      try {
        const result = await MostCommentedPostAPI(id, reqHeader);
        if (result.status === 200) {
          setMostCommentedPost(result.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getMyPosts();
    getUser();
    fetchMostCommentedPostId();
  }, []);

  return (
    <>
      <Container>
        <Header />

     
        <Row className="mb-4">
          {user.length > 0 ? (
            user.map((users) => (
              <Col className="text-center" key={users._id}>
                <h4>{users.username}</h4>
                <p>{users.email}</p>
              </Col>
            ))
          ) : (
            <p>No user found</p>
          )}
        </Row>

        <Add refreshPosts={getMyPosts} />

       
        {mostCommentedPost && (
          <Row className="mb-4">
            <Col md={12}>
              <Card className="shadow border-danger">
                <Card.Header className="bg-danger text-white text-center">
                  Most Commented Post
                </Card.Header>
                <Card.Img 
                  variant="top" 
                  height="450px" 
                  src={`${server_url}/uploads/${mostCommentedPost.postImage}`} 
                  alt={mostCommentedPost.title} 
                />
                <Card.Body>
                  <Card.Title>{mostCommentedPost.title}</Card.Title>
                  <Card.Text>{mostCommentedPost.description}</Card.Text>
                  <Button variant="danger" onClick={() => handleShowComments(mostCommentedPost._id)}>
                    <i className="fa-regular fa-comment"></i> View Comments
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

      
        <Row>
          {myPosts.length > 0 ? (
            myPosts.map((posts) => (
              <Col key={posts._id} md={4} sm={6} xs={12} className="mb-4">
                <Card className="shadow">
                  <Card.Img 
                    variant="top" 
                    height="450px" 
                    src={`${server_url}/uploads/${posts.postImage}`} 
                    alt={posts.title} 
                  />
                  <Card.Body>
                    <Card.Title>{posts.title}</Card.Title>
                    <div className='d-flex'>
                    <Button variant="danger" onClick={() => handleShowComments(posts._id)}>
                      <i className="fa-regular fa-comment"></i>
                    </Button>
                    <EditPost posts={posts} refrehData={getMyPosts}/>
                    <Button className="btn btn-light p-0 m-1" onClick={()=>deletePost(posts._id)}>
                            <i className="fa-solid fa-trash text-dark m-3 p-0"></i>
                          </Button>
                          </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No posts added yet</p>
          )}
        </Row>

        
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Comments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingComments ? (
              <p>Loading comments...</p>
            ) : comments.length > 0 ? (
              comments.map(comment => <p key={comment._id}>{comment.name} : {comment.comment}</p>)
            ) : (
              <p>No comments available</p>
            )}
          </Modal.Body>
        </Modal>

        <Footer />
      </Container>
    </>
  );
}

export default Dashboard;