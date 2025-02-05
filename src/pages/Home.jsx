import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getPublicPostsAPI } from '../Services/allAPI';
import { server_url } from '../Services/server_url';
import PostDetails from './PostDetails';
import Footer from '../Components/Footer';
import Header from '../Components/Header';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicPosts, setPublicPosts] = useState([]); 
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  

  useEffect(() => {
    getPublicPosts();
    if (sessionStorage.getItem('token')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  
  const getPublicPosts = async () => {
    const result = await getPublicPostsAPI();
    if (result.status === 200) {
      setPublicPosts(result.data);
      setFilteredPosts(result.data); 
    } else {
      console.log(result);
    }
  };

  
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
   
    const filtered = publicPosts.filter((post) =>
      post.title.toLowerCase().includes(value) || post.description.toLowerCase().includes(value)
    );
    
    setFilteredPosts(filtered);
  };

  const handlePostPage = () => {
    if (sessionStorage.getItem('token')) {
      navigate('/postDetails');
    } else {
      toast.warning('Please Login To Our Projects...');
    }
  };


    
  return (
    <>
    {isLoggedIn? <Header/>:null}
    <Container className="mt-4">
    
      <Row className="mb-3">
        <Col md={{ span: 6, offset: 3 }}>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search blogs..."
              className="me-2"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button variant="danger">Search</Button>
          </Form>
        </Col>
      </Row>

   
      <Row>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((posts) => (
            <Col key={posts._id} md={4} sm={6} xs={12} className="mb-4">
              <Card className="shadow">
                
                  <a href="/postDetails">
                    <Card.Img
                      variant="top"
                      width={"0px"}
                      height={"450px"}
                      src={`${server_url}/uploads/${posts.postImage}`}
                      alt={posts.title}
                      onClick={handlePostPage}
                    />
                  </a>
              

                <Card.Body>
                  <Card.Title>{posts.title}</Card.Title>
                  <Card.Text>{posts.description.slice(0, 50)}...</Card.Text>
                 {isLoggedIn? <PostDetails posts={posts} />:<p className='text-danger'>Please click here to <Link to={'/login'} style={{textDecoration:"none",color:"red"}}>Login</Link></p>}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No Posts Found</p>
        )}
      </Row>
    
    </Container>
      <Footer/>
      </>
  );
}

export default Home;
