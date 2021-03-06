import './Click.css';
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import {
  Container,
  Row,
  Col,
  Button,
  Form
 } from "react-bootstrap";

 import {
   House,
   InfoCircle,
   Trophy
 } from "react-bootstrap-icons";

 const playTime = 10

function Click() {

  const mountedRef = useRef(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [viewScores, setViewScores] = useState(false)
  const [viewInfo, setViewInfo] = useState(false)

  const toggleViewScores = () => {
    setViewScores(!viewScores)
    setViewInfo(false)
  }

  const toggleViewInfo = () => {
    setViewInfo(!viewInfo)
    setViewScores(false)
  }

  const play = () => {
    setPlaying(true)
    setGameOver(false)
    setScore(0)
    setSubmitted(false)
    setViewScores(false)
    setViewInfo(false)
  }

  const end = () => {
    setPlaying(false)
    setGameOver(true)
    if (score > highScore) setHighScore(score)

  }

  const handleHit = e => {
    setScore(score + 1)
    e.stopPropagation();
  }

  const handleMiss = e => {
    if (playing) setScore(score - 1)
  }

  useEffect(() => {
    mountedRef.current = true
  }, [])

  return (
    <Container fluid className="dark-background">
      <Row style={{height: "15vh", alignItems: "center"}}>
        <Col className="scores display" xs={4} >
          <h3>Score: {score}</h3>
          <h3>Highscore: {highScore}</h3>
        </Col>
        <Col className="title" xs={4} >
          <h1 className="text-center">M{targetSvg}USE TRAINING </h1>          
        </Col>
        <Col className="display" xs={4}>
          <Counter mounted={mountedRef.current} playing={playing} end={end}/>
        </Col>
      </Row>
      <Row> 
        <GameField 
        hit={handleHit} 
        miss={handleMiss}
        play={play}
        highScore={highScore}
        submitted={submitted}
        setSubmitted={setSubmitted} 
        playing={playing} 
        gameOver={gameOver}
        viewScores={viewScores}
        viewInfo={viewInfo}/>          
      </Row>
      <Row className="buttons" style={{height: "15vh", alignItems: "center"}}>
        <Col xs={3}>
          <a href="https://portfolio-brencoulter.vercel.app" target="_blank" ><House className="icon" /></a>
          <h4>Home</h4>
        </Col>
        <Col xs={6}>
          <Trophy className="icon" onClick={toggleViewScores}/>
          <h4>High Scores</h4>
        </Col>
        <Col xs={3}>
          <InfoCircle className="icon" onClick={toggleViewInfo}/>
          <h4>About</h4>
        </Col>
      </Row>     
    </Container>
  );
};

function GameField(props) {
  let positionX = Math.floor(Math.random()*100);
  if (positionX > 95) positionX -= 5
  let positionY = Math.floor(Math.random()*100);
  if (positionY > 87.5) positionY -= 12.5
    return (
      <div className='field' onClick={props.miss}>
        {props.playing && <Target click={props.hit} className="target" x={positionX+"%"} y={positionY+"%"}/>}
        <Container className="info-container">
          <Row className="justify-content-center" style={{minHeight: "35vh", maxHeight: "55vh"}}>
            <Col>
              {props.viewScores && <ViewHighScores submitted={props.submitted}/>}
              {props.viewInfo && <Info />}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col className="text-center">
            
              {props.gameOver && <p className="game-over" >Game Over</p>}
              {(props.gameOver && !props.submitted) && <SubmitScore highScore={props.highScore} setSubmitted={props.setSubmitted}/>}
              {!props.playing && <Button className="play" onClick={props.play}>Play{props.gameOver? " again" : ""}</Button>}
            </Col>
          </Row>
          <Row className="justify-content-center" style={{height: "100%"}}>
            
          </Row>
        </Container>
      </div>    
    )
};


function SubmitScore(props) {
  const [input, setInput] = useState("")

  const handleSubmit = event => {
    event.preventDefault()
    axios.post('http://localhost:8080/api/highscores', {
      name: input,
      score: props.highScore
    })
    .then(function (response) {
      console.log(response.data);
      props.setSubmitted(true)
    })
    .catch(function (error) {
      console.log(error);
      props.setSubmitted(true)
    });
  }
 
  return (
    <Form onSubmit={handleSubmit} className="submit-form">
      <Form.Label>Submit High Score</Form.Label>
      <Row>
        <Col  >
      <Form.Control  style={{ dispaly: "inline", width: "200px", marginLeft: "auto", marginRight: "0px"}} type="text" placeholder="name" onChange={e => setInput(e.target.value)} value={input}></Form.Control>
      </Col>
      <Col>
      <Button type="submit" style={{backgroundColor: "blue", fontSize: "20px", float: "left", marginRight: "auto", marginLeft: "0px" }}>Submit High Score?</Button>
      </Col>
      </Row>
    </Form>
  )
};

function ViewHighScores(props) {
  const [highScores, setHighScores] = useState([])

  useEffect(() => {
    getHighScores()
  },[props.submitted])

  const getHighScores = () => {
    axios.get('http://localhost:8080/api/highscores')
    .then(response => {
      setHighScores(response.data.scoresArray.slice(0,10))
    })
    .catch(err => {
      console.log(err)
    })
  }
  return(
    <div className="high-scores">
      <h2>High Scores</h2>
      {highScores.length === 0 && <p>Loading High Scores</p>}
      {highScores && <ol>{highScores.map(score => {
        return <li>{score.name + ": " + score.score}</li>
      })}</ol>}
    </div>
  )
}

function Info(props) {
  return(
    <div className="info">
      <h2>Info</h2>
      <p>Info about the game etc.</p>
    </div>
  )
}

function Target(props) { 
  return (
  <svg onClick={props.click} className="target" style={{top: props.x, left: props.y}}>
  <circle cx="25" cy="25" r="20" stroke="black" stroke-width="0" fill="red" />
  <circle cx="25" cy="25" r="15" stroke="black" stroke-width="0" fill="white" />
  <circle cx="25" cy="25" r="10" stroke="black" stroke-width="0" fill="red" />
  <circle cx="25" cy="25" r="5" stroke="black" stroke-width="0" fill="white" />
  </svg>
  )
}

const targetSvg = 
    <svg className="target-svg title" style={{width: "40px", height: "40px"}}>
    <circle cx="20" cy="20" r="18" stroke="black" stroke-width="0" fill="red" />
    <circle cx="20" cy="20" r="15" stroke="black" stroke-width="0" fill="white" />
    <circle cx="20" cy="20" r="10" stroke="black" stroke-width="0" fill="red" />
    <circle cx="20" cy="20" r="5" stroke="black" stroke-width="0" fill="white" />
    </svg>

function Counter(props) {
  const [counter, setCounter] = useState(playTime*100)
  let playing = props.playing
  let mounted = props.mounted
  let end = props.end
  useEffect(() => {
    if (mounted && playing) {
      const countDown = setTimeout(() => {
        setCounter(counter - 1)
      }, 10)
      if (counter === 0) {
        end()
        setCounter(playTime*100)
      }
      return () => clearTimeout(countDown)
    }
  }, [playing, counter])

  return (
    <div className="counter">
      <h3 >Time Remaining</h3> 
      <h3 >{props.playing ? counter.toString().charAt(0)+":"+counter.toString().charAt(1)+counter.toString().charAt(2) : "0:00"}</h3>
    </div>
  )

}

export default Click;