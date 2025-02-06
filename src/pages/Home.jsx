import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, FormControl, Button, Pagination } from 'react-bootstrap';
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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
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
    setCurrentPage(1);
  };

  const handlePostPage = () => {
    if (sessionStorage.getItem('token')) {
      navigate('/postDetails');
    } else {
      toast.warning('Please Login To View Posts...');
    }
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <>
      {isLoggedIn ? <Header /> : null}
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
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <Col key={post._id} md={4} sm={6} xs={12} className="mb-4">
                <Card className="shadow">
                  <a href="/postDetails">
                    <Card.Img
                      variant="top"
                      width={"0px"}
                      height={"450px"}
                      src={`${server_url}/uploads/${post.postImage}`}
                      alt={post.title}
                      onClick={handlePostPage}
                    />
                  </a>
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.description.slice(0, 50)}...</Card.Text>
                    {isLoggedIn ? (
                      <PostDetails posts={post} />
                    ) : (
                      <p className='text-danger'>
                        Please click here to <Link to={'/login'} style={{ textDecoration: "none", color: "red" }}>Login</Link>
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No Posts Found</p>
          )}
        </Row>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          </Pagination>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default Home;
