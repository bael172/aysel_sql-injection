import axios from 'axios'
import './App.css';
import {$host,$auth} from "./API/index"
import {Container, Form, Button, Alert} from 'react-bootstrap'
import React, {useState, useEffect} from "react"

function Login() {
  const [userData, setUserData] = useState({
    login:"",
    password:""
  })
  const [response, setResponse] = useState(null)

  const handleChange = (event) => {
    setUserData({...userData, [event.target.name]:event.target.value})
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let query = event.target.name
    axios.post(`${$host}/user/${query}`,userData)
    .then((otvet)=>setResponse(otvet))
    .catch((error)=>{console.log(error)})
  }
  localStorage.setItem('token',userData.token)

  return (
    <div className="App">
      <Container className="Container">
        <Form onSubmit = {handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control
             type="text"
             name="login"
              value = {userData.login}
             placeholder="Введите логин"
             onChange={handleChange}
             >
             </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
             type="password"
             name="password"
              value = {userData.password}
             placeholder="Введите пароль"
             onChange={handleChange}
             >
             </Form.Control>
          </Form.Group>
          <div style={{display:'inline-block'}}>
            <Button
              name="login_old"
              type="submit"
              variant = "outline-success"
            >
              Войти (с поддержкой SQL-инъекции)
            </Button>
            <Button
            name="login_new"
            type="submit"
            variant = "outline-success"
          >
            Войти (с защитой от SQL-инъекции)
          </Button>
          </div>

        </Form>
        {response && (
          <Alert variant="success" className="mb-5">
            Данные успешно отрпавлены: {JSON.stringify(response)}
          </Alert>
        )}
      </Container>
    </div>
  );
}

export default Login;
