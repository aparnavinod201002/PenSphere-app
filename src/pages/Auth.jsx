import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI, registerAPI } from '../Services/allAPI';
import { TokenAuthContext } from '../ContextAPI/TokenAuth';
import Footer from '../Components/Footer';
import { ToastContainer, toast } from 'react-toastify';

function Auth({ register }) {
  const isRegisterForm = register ? true : false;
  const navigate = useNavigate();
  const { isAuthorized, setIsAuthorized } = useContext(TokenAuthContext);

//conflict creation

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });
//other changes
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  //new commend added

  //another added
  //new 

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };
//new comment is added added
  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = userData;

    if (!username || !email || !password) {
      toast.info('Please fill in all the fields');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Invalid email format. Example: user@example.com');
      return;
    }

    if (!isValidPassword(password)) {
      toast.error('Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    try {
      const result = await registerAPI(userData);
      if (result.status === 200) {
        toast.success(`${result.data.username} has successfully registered`);
        navigate('/login');
        setUserData({ username: '', email: '', password: '' });
      } else {
        toast.warning(result.response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userData;

    if (!email || !password) {
      toast.info('Please fill in all the fields');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Invalid email format. Example: user@example.com');
      return;
    }

    if (!isValidPassword(password)) {
      toast.error('Invalid password format.');
      return;
    }

    try {
      const result = await loginAPI({ email, password });
      if (result.status === 200) {
        sessionStorage.setItem('username', result.data.existingUser.username);
        sessionStorage.setItem('userEmail', result.data.existingUser.email);
        sessionStorage.setItem('token', result.data.token);
        setIsAuthorized(true);
        navigate('/');
        setUserData({ email: '', password: '' });
      } else {
        toast.warning(result.response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div style={{ marginTop: '50px' }} className="d-flex justify-content-center align-items-center">
        <div className="container w-75 bg-danger">
          <Link to={'/'} style={{ textDecoration: 'none', color: 'white', fontWeight: 'bolder' }}>
            <i className="fa-solid fa-arrow-left"></i> Back To Home
          </Link>
          <div className="card shadow p-3 bg-danger">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <img src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7863.jpg" alt="" width={"100%"} />
              </div>
              <div className="col-lg-6">
                <div className="d-flex align-items-center flex-column">
                  <h1 className="fw-bolder text-light mt-2">
                    <img src="https://img.freepik.com/premium-vector/pen-logo-vector-simple-icon-illustration_683738-4644.jpg" width={"40px"} alt="" /> PenSphere
                  </h1>
                  <h5 className="fw-bolder text-warning" style={{ textAlign: 'center' }}>
                    {isRegisterForm ? 'Sign up for your account' : 'Sign in to your account'}
                    <Form className="mt-4 text-dark">
                      {isRegisterForm && (
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                          <Form.Control
                            size="lg"
                            type="text"
                            placeholder="Enter Your Username"
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                            value={userData.username}
                          />
                        </Form.Group>
                      )}
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Control
                          size="lg"
                          type="text"
                          placeholder="Enter Your Email"
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          value={userData.email}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                        <Form.Control
                          size="lg"
                          type="password"
                          placeholder="Enter Your Password"
                          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                          value={userData.password}
                        />
                      </Form.Group>
                      {isRegisterForm ? (
                        <div className="mt-3">
                          <button className="btn btn-warning" onClick={handleRegister}>
                            Register
                          </button>
                          <p className="text-light fw-bolder mt-2">
                            Already have an account? Click here to <Link to={'/login'} style={{ textDecoration: 'none', color: 'orange' }}>Login</Link>
                          </p>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <button className="btn btn-warning" onClick={handleLogin}>
                            Login
                          </button>
                          <p className="text-light fw-bolder mt-2">
                            New user? Click here to <Link to={'/register'} style={{ textDecoration: 'none', color: 'orange' }}>Register</Link>
                          </p>
                        </div>
                      )}
                    </Form>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer autoClose={2000} position="top-center" theme="colored" />
    </>
  );
}

export default Auth;
