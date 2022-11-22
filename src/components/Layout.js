import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet } from "react-router-dom"
import { auth, logout } from "../firebase-config"
import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

const Layout = () => {
  const [hasUser, setHasUser] = useState(false);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    setHasUser(user !== null)
  }, [user])

  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="#">Casperbot</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            {
              hasUser &&
              <Nav.Link onClick={logout}>
                LOGOUT
              </Nav.Link>
            }
            {
              !hasUser &&
              <Nav.Link href="/login">
                LOGIN
              </Nav.Link>
            }
          </Navbar.Collapse>
        </Container>

      </Navbar>

      <Outlet context={[user, loading]} />

      <footer className='container-fluid text-center' >
        <a href='#myPage' title='To Top'>
          <span className='glyphicon glyphicon-chevron-up'></span>
        </a>
        <p>Casperbot Made By <a href='https://github.com/ezequias2d'>ezequias2d</a></p>
      </footer>
    </>
  )
}

export default Layout