import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import Add from '../Components/Add';
import { getMyPostsAPI, getCommentsAPI, getUserAPI, deletePostAPI } from '../Services/allAPI';
import { server_url } from '../Services/server_url';
import EditPost from '../Components/EditPost';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function Dashboard() {
  const [myPosts, setMyPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
const [user,setUser]=useState([])
 


  const fetchComments = async (postId) => {
    setLoadingComments(true);
    try {
      const result = await getCommentsAPI(postId);
      if (result.status === 200) {
        setComments(result.data);
      } else {
        console.log("Error fetching comments:", result);
      }
    } catch (error) {
      console.log("Failed to fetch comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

 
  const handleShowComments = (postId) => {
    setSelectedPostId(postId);
    setShowModal(true);
    fetchComments(postId);
  };


  const getUser = async()=>{
    const token = sessionStorage.getItem('token')
    if(token)
    {
      const reqHeader = {
        "Content-Type":"multipart/form-data",
        "authorization":`Bearer ${token}`
      }
      try{
        const result= await getUserAPI(reqHeader)
        if(result.status==200){
          setUser(result.data)
         
        }else{
          console.log(result);
          
        }

        }catch(err){
          console.log(err);
          
        }
      }
    }
   


    const deletePost= async(id)=>{

      const token = sessionStorage.getItem("token")
      if(token){
    const reqHeader={
      
    "content-Type":"application/json",
    "authorization":`Bearer ${token}`
    }
   
    try{
    const result =await deletePostAPI(id,reqHeader)
    if(result.status==200){
      getMyPosts()
    }else{
      console.log(result.response.data);
      
    }
    }catch(err){
    console.log(err);
    
    }
      }
    }


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
          } else {
            console.log(result);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
  
    useEffect(() => {
      getMyPosts();
      getUser()
    }, []);
  
  return (
   <>
    <Container className="">
       <Header/>
   
      <Row className="mb-4">
       { user?user.map((users)=>(

      <Col className="text-center">
         
          <h4>{users.username}</h4>
          <p>{users.email}</p>
        </Col> )):<p>Not user Found</p>}
      </Row>

      <Add refreshPosts={getMyPosts}/>
     

     
      <Row>
        {myPosts.length > 0 ? (
          myPosts.map((posts) => (
            <Col key={posts._id} md={4} sm={6} xs={12} className="mb-4">
              <Card className='shadow'>
                <Card.Img
                  variant="top"
                  height={"450px"}
                  src={`${server_url}/uploads/${posts.postImage}`}
                  alt={posts.title}
                />
                <Card.Body>
                  <Card.Title>{posts.title}</Card.Title>
                  <Card.Text>{posts.description}</Card.Text>
                  <Card.Text className='text-danger text-justify'>{posts.status}</Card.Text>

                

<div className='d-flex'>
                  <EditPost posts={posts} refreshPosts={getMyPosts}/>


                 
                  <Button className='btn-light' onClick={()=>deletePost(posts?._id)}><i className="fa-solid fa-trash-can text-danger"></i></Button>

                 
                  <Button variant="danger" className="m-3 " onClick={() => handleShowComments(posts._id)}>
                    <i className="fa-regular fa-comment"></i> 
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

    
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Post Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingComments ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="border-bottom py-2">
                <strong>{c.name} :</strong> {comment.comment}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
    </Container>
    <Footer/>
    </>
  );
}

export default Dashboard;
