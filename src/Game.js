  //Dependencies
import React, { useEffect, useState, useRef } from 'react';
import './Game.css';
import GameScreenshot from "./images/gameplay.gif"
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import {
  Container,
  Row,
  Col,
  ProgressBar,
  Image,
  OverlayTrigger,
  Tooltip
 } from "react-bootstrap";

 import { Code, InfoCircle, ArrowRepeat, ArrowLeftSquare, ArrowRightSquare, ArrowDownSquare, ArrowUpSquare } from 'react-bootstrap-icons';

  //Components
//import Navigation from './Navigation';
//import FooterBar from './FooterBar'

  //Items
import ArmourItem from "./images/armour-item.png"
import HelmetItem from "./images/helmet-item.png"
import ShieldItem from "./images/shield-item.png"
import DaggerItem from "./images/dagger-item.png"
import GreatswordItem from "./images/greatsword-item.png"
import SwordItem from "./images/sword-item.png"
import BootsItem from "./images/boots-item.png"
import RedPotion from "./images/red-potion.png"
import BluePotion from "./images/blue-potion.png"
import PurplePotion from "./images/purple-potion.png"

//Display

import Base from "./images/base.png"
import Boot from "./images/boot.png"
import Helmet from "./images/helmet.png"
import Sword from "./images/weapon.png"
import Dagger from "./images/dagger.png"
import Greatsword from "./images/greatsword.png"
import Shield from "./images/shield.png"
import Body from "./images/chest.png"
import PackImg from "./images/backpack.jpg"

//Map

import Tree from "./images/tree.jpg"
import Grass from "./images/grass.png"
import LongGrass from "./images/long-grass.jpg"
import TreasureChest from "./images/treasure-chest.png"

//Monsters
import DragonDown from "./images/dragon-front.png"
import DragonLeft from "./images/dragon-left.png"
import DragonRight from "./images/dragon-right.png"
import DragonUp from "./images/dragon-back.png"
import GoblinLeft from "./images/goblin-left.png"
import GoblinRight from "./images/goblin-right.png"
import GoblinUp from "./images/goblin-back.png"
import GoblinDown from "./images/goblin-front.png"
import BossUp from "./images/boss-up.png"
import BossDown from "./images/boss-down.png"
import BossLeft from "./images/boss-left.png"
import BossRight from "./images/boss-right.png"
import GolemUp from "./images/golem-up.png"
import GolemDown from "./images/golem-down.png"
import GolemLeft from "./images/golem-left.png"
import GolemRight from "./images/golem-right.png"


//Player

import PlayerDown from "./images/player-down.png"
import PlayerLeft from "./images/player-left.png"
import PlayerRight from "./images/player-right.png"
import PlayerUp from "./images/player-up.png"



  //image sources
  const playerSrc = [PlayerLeft, PlayerRight, PlayerUp, PlayerDown]
const gameSrc = {
    tree: Tree,
    grass: Grass,
    rock: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThgSEimd5MaTkOAINNklaxkAV4S9UlALQfTQ&usqp=CAU",
    "long grass": LongGrass,
}
const monstersSrc = {
    goblin: [GoblinLeft, GoblinRight, GoblinUp, GoblinDown],
    knight: [GoblinLeft, GoblinRight, GoblinUp, GoblinDown],
    wolf:[GoblinLeft, GoblinRight, GoblinUp, GoblinDown],
    golem: [GolemLeft, GolemRight, GolemUp, GolemDown],
    dragon: [DragonLeft, DragonRight, DragonUp, DragonDown],
    boss: [BossLeft, BossRight, BossUp, BossDown]  
}
const itemsSrc = {
    helmet: HelmetItem,
    shield: ShieldItem,
    chestplate: ArmourItem,
    boots: BootsItem,
    "small potion": RedPotion,
    "greater potion": BluePotion,
    "max potion": PurplePotion,
    sword: SwordItem,
    greatsword: GreatswordItem,
    dagger: DaggerItem,
    treasure: TreasureChest
}
  
//List of Items and Enemies - Use to change base values
const itemsList = [
  {name: "dagger", type: "weapon", damage: 1, location: "weapon", rarity: 1}, 
  {name: "sword", type: "weapon", damage: 5, location: "weapon", rarity: 0.8}, 
  {name: "greatsword", type: "weapon", damage: 10, location: "weapon", rarity: 0.3},
  {name: "small potion", type: "potion", healing: 5, rarity: 0.9},
  {name: "greater potion", type: "potion", healing: 10, rarity: 0.5},
  {name: "max potion", type: "potion", healing: 20, rarity: 0.1},
  {name: "helmet", type: "armour", defence: 2, location: "head", rarity: 0.8},
  {name: "shield", type: "armour", defence: 3, location: "shield", rarity: 0.7},
  {name: "chestplate", type: "armour", defence: 5, location: "body", rarity: 0.5},
  {name: "boots", type: "armour", defence: 1, location: "legs", rarity: 0.8}
]
const enemiesList = [
    {name: 'goblin', health: 30, attack: 10, experience: 30, level: 1},
    {name: 'wolf', health: 20, attack: 5, experience: 20, level: 2},
    {name: 'knight', health: 100, attack: 10, experience: 75, level: 3},
    {name: 'golem', health: 90, attack: 12, experience: 100, level: 3},
    {name: 'dragon', health: 150, attack: 20, experience: 150, level: 4},
    {name: 'boss', health: 100, attack: 25, experience: 500, level: 5}
]

//Sets number of squares in each room, and number of rooms for the entire game
let mapWidth = 20
let mapHeight = Math.floor(mapWidth*.75)
let numberOfRooms = 6
let playerStart = [Math.floor(mapWidth/2), Math.floor(mapHeight/2)]
let validLocations = []
let allValidLocations = []


//Pre-game random generators


//Path checking mutates. This resets "Checked" to empty
const regenerateRooms = room => {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (room[y][x] === "C") room[y][x] = "."
    }
  }
}

const generateAllRooms = () => {
  let allRooms = []
  for (let n = 0; n < numberOfRooms; n++) {
    let path = false
    let room = null
    while (!path) {
      room = generateRoom(n)
      addTrees(room)
      let start = null
      let end = null
      n === 0 ? start = playerStart : start = [0, Math.floor(mapHeight/2)]
      n === 5 ? end = start : end = [mapWidth-1, Math.floor(mapHeight/2)]
      path = checkPath(room, start, end)
      path ? console.log("room created successfully") : console.log("room creation failed")
    }
    allValidLocations.push(validLocations)
    addLongGrass(room)
    allRooms.push(room)

  }
  return allRooms
} 
const generateRoom = n => {
  console.log("generating room "+n)
  let room = []
  for (let i = 0; i < mapHeight; i++) {
    let row = []
    for (let j = 0; j < mapWidth; j++) {
      if (i === 0 || j === 0 || i === mapHeight-1 || j === mapWidth-1) {
        row.push("X")
      } else {
        row.push(".")
      }
    }
    room.push(row)
  }
  room[Math.floor(mapHeight/2)][0] = "."
  room[Math.floor(mapHeight/2)][mapWidth-1] = "."
  room[Math.floor(mapHeight/2)][1] = "."
  room[Math.floor(mapHeight/2)][mapWidth-2] = "."
  if (n === 0) {
    room[Math.floor(mapHeight/2)][0] = "X";

  } else if (n === 5) {
    room[Math.floor(mapHeight/2)][mapWidth-1] = "X"
  }
  return room
}
const addTrees = room => {
  console.log("adding trees to room")
  for (let y = 0; y < mapHeight; y++) {
     for (let x = 0; x < mapWidth; x++) {
       let rand = Math.floor(Math.random()*10)
       if (rand < 4 && y > 0 && y < mapHeight-1 && x > 0 && x < mapWidth-1) {
         room[y][x] = "X"
       }
    }
  }
  return room
}
const addLongGrass = room => {
  for (let i=0; i < numberOfRooms-1; i++) {
    let x = Math.floor(Math.random() * (mapWidth-3)) + 1
    let y = Math.floor(Math.random() * (mapHeight-3)) + 1
    room[y][x] = "G"
    room[y+1][x] = "G"
    room[y][x+1] = "G"
    room[y+1][x+1] = "G"
  }
}

const checkPath = (room, start, end) => {
  validLocations = []
  let grid = room.slice()
  //create queue initialised to the start
  let currentLocation = {
    x: start[0],
    y: start[1],
    status: ""
  }
  let queue = [currentLocation]
  let newLocation = {}
  let times = 0

    //Assesses whether the explored square is valid
    //Takes coordinates, and returns an object with coordinates and status
  const checkLocation = (newX, newY) => {
    
    let newLocation = {
      x: newX,
      y: newY,
      status: ""
    }

    if (newX < 0 || newX > mapWidth-1 ||newY < 0 || newY > mapHeight-1) {
      newLocation.status = "Invalid"
    } else if (newX === end[0] && newY === end[1]) {
      newLocation.status = "Goal"
    } else if (grid[newY][newX] === ".") {
      newLocation.status = "Valid"
    } else if (grid[newY][newX] === "C") {
      newLocation.status = "Visited"
    } else if (grid[newY][newX] === "X") {
      newLocation.status = "Blocked"
    }

    return newLocation
  }

  const inQueue = () => {
    for (let i = 0; i < queue.length; i++) {
        if (queue[i] === newLocation) {
            return true;
        }
    }

    return false;
  }

  while (queue.length > 0) {
  validLocations.push([queue[0].x, queue[0].y])
  currentLocation = queue.shift()
  //Mark off current location:
  grid[currentLocation.y][currentLocation.x] = "C"
  //Check all adjacent locations:
    //Up
    newLocation = checkLocation(currentLocation.x, currentLocation.y+1)
    if (newLocation.status ==="Valid") {
      if (!inQueue(queue, newLocation)) queue.push(newLocation)
    }
    if (newLocation.status === "Goal") {

      return true
    }
    //Down
    newLocation = checkLocation(currentLocation.x, currentLocation.y-1)
    if (newLocation.status ==="Valid") {
      if (!inQueue(queue, newLocation)) queue.push(newLocation)
    }
    if (newLocation.status === "Goal") {

      return true
    }
    //Left
    newLocation = checkLocation(currentLocation.x-1, currentLocation.y)
    if (newLocation.status ==="Valid") {
      if (!inQueue(queue, newLocation)) queue.push(newLocation)
    }
    if (newLocation.status === "Goal") {

      return true
    }

    //Right
    newLocation = checkLocation(currentLocation.x+1, currentLocation.y)
    if (newLocation.status ==="Valid") {
      if (!inQueue(queue, newLocation)) queue.push(newLocation)
    }
    if (newLocation.status === "Goal") {

      return true
    }
    times += 1
  }

  return false
}

const findEmptySpace = (i) => {
  let tmp = []
  let filteredLocations = allValidLocations[i].filter(location => {
    if (tmp.indexOf(location.toString()) < 0) {
        tmp.push(location.toString());
        return location;
    }
  })
  return allValidLocations[i][Math.floor(Math.random()*allValidLocations[i].length)]
}

const addItems = () => {
  let items = []
  let availableItems = itemsList.filter(available => available.name !== "dagger")
  for (let i = 0; i < numberOfRooms; i++) {
    let room = []
    //numberArr is for number of items per room
    let numberArr = [4,1,1,1,3,0]
    for (let n = 0; n < numberArr[i]; n++) {
      let itemLocation = findEmptySpace(i)
      let weights = [].concat(...availableItems.map((obj) => Array(Math.ceil(obj.rarity * 100)).fill(obj)))
      let chosenItem = weights[Math.floor(Math.random() * weights.length)]
      let name = chosenItem.name;
      let type = chosenItem.type;

    if (i < 5) {
        if (type === "potion") {
          room.push({name: name, position: itemLocation})
        } else {
          room.push({name: name, position: itemLocation})
          availableItems = availableItems.filter(available => available.name !== name)
        }
      }
    }
    items.push(room) 
  }
  return items
}

const addEnemies = () => {
  let enemies = []
  for (let i = 0; i < numberOfRooms; i++) {
    let room = []
    //numberArr is for number of enemies per room
    let numberArr = [1,2,3,4,5,1]
    for (let n = 0; n < numberArr[i]; n++) {
      let enemyLocation = findEmptySpace(i)
      let enemyObject = enemiesList[Math.floor(Math.random()*(enemiesList.length-1))]
      i === 5 
      ? room.push({name: "boss", position: enemyLocation, direction: 1, hidden: false}) 
      : room.push({name: enemyObject.name, position: enemyLocation, direction: 1, hidden: false})
    }
    enemies.push(room)
  }
return enemies
}

let rooms = generateAllRooms()
let allEnemies = addEnemies()
let allItems = addItems()

console.log(validLocations)
console.log(allValidLocations)

function Game() {
  const didMountRef = useRef(false);
  const [dead, setDead] = useState(false)
  const [complete, setComplete] = useState(false)
   
  //Player Stats
  const [level, setLevel] = useState(1)
  const [exp, setExp] = useState(0)
  const [health, setHealth] = useState(100)
  const [attack, setAttack] = useState(10)
  const [armour, setArmour] = useState(0)
  
  
  //Base Stats
  const [maxHealth, setMaxHealth] = useState(100)
  const [baseAttack, setBaseAttack] = useState(10)
  
  //Location
  const [playerX, setPlayerX] = useState(Math.floor(mapWidth/2)-1)
  const [playerY, setPlayerY] = useState(Math.floor(mapHeight/2))
  const [playerDirection, setPlayerDirection] = useState(1)

  //Equipment  
  const [backpack, setBackpack] = useState(["dagger"]) 
  const [equipped, setEquipped] = useState({head: "", weapon: "", shield: "", body: "", legs: ""})

  
  //Map and Resources
  const [room, setRoom] = useState(0) //current room number
  const [map, setMap] = useState(rooms[room]) //2D array of strings
  const [items, setItems] = useState(allItems) //Array of Array of Objects rooms[room[item{}]]
  const [enemies, setEnemies] = useState(allEnemies) //Array of Array of Objects rooms[room[enemy{}]]
  
  const [info, setInfo] = useState(false)
  const toggleInfo = () => {
    setInfo(!info)
  }
  
  //Game Log and Helper
  const [log, setLog] = useState([])
  const addToLog = info  => {
    if (!dead) setLog(log => [info, ...log])
  }
  
  //Helper variable to shorten inline styles/positions.
  let mapWidthPercentage = 100/rooms[room][0].length+"%"
  
  const replay = () => {
    rooms = generateAllRooms ()
    allEnemies = addEnemies()
    allItems = addItems()
    setRoom(0);
    setPlayerX(playerStart[0])
    setPlayerY(playerStart[1])
    setItems(allItems)
    setEnemies(allEnemies)
    setMap(rooms[0])
    setLog([])
    setMaxHealth(100)
    setHealth(100)
    setLevel(1)
    setExp(0)
    setBaseAttack(10)
    setEquipped({head: "", weapon: "", shield: "", body: "", legs: ""})
    setBackpack(["dagger"])
    setDead(false)
    setComplete(false)
  }

 //Level and Exp tracking 
  useEffect(() => {
    if (exp >= level*100) {
      setExp(exp - level*100);
      addToLog("You are now level "+(level+1))
      setLevel(level+1);
    }
  },[exp]) 
  useEffect(() => {
    if (didMountRef.current) {
      setBaseAttack(baseAttack + 5)
      setHealth(health + 25)
      setMaxHealth(maxHealth + 25)
    }
  },[level])

  //movement
   //Custom keypress hook
   function useKeypress(key, action) {
    useEffect(() => {
      function onKeydown(e) {
        if (e.key === key) action()
      }
      window.addEventListener('keydown', onKeydown);
      return () => window.removeEventListener('keydown', onKeydown); 
    }, [playerX, playerY]);
    }
  const handleLeft = () => {
    if (playerX === 0) { 
      changeRoom(-1)
    } else if (map[playerY][playerX-1] !=="X") {
      setPlayerDirection(0)
      setPlayerX(playerX => playerX - 1)
    }
  }
  const handleRight = () => {
    if (playerX === rooms[room][0].length-1) {
      changeRoom(1)
    } else if (map[playerY][playerX+1] !=="X") {
      setPlayerDirection(1)
      setPlayerX(playerX => playerX + 1)
    }
  }
  const handleUp = () => {
    if (map[playerY-1][playerX] !=="X") {
      setPlayerDirection(2)
      setPlayerY(playerY => playerY - 1)
    }
  }
  const handleDown = () => {
    if (map[playerY+1][playerX] !=="X") {
      setPlayerDirection(3)
      setPlayerY(playerY => playerY + 1)
    }
    }
  const changeRoom = x => {
      x > 0 ? setPlayerX(1) : setPlayerX(mapWidth-2)
      addToLog("You moved to room "+(room+x))
    setMap(rooms[room+x])
    setRoom(room+x)
  }
  //Forces re-render of the map. Otherwise for the first move the map assumes the old setup despite displaying the new
  useEffect(() => {
    playerX === 1 ? setPlayerX(playerX-1) : setPlayerX(playerX+1) 
  }, [room])
  
  useKeypress("ArrowLeft", handleLeft);
  useKeypress("ArrowRight", handleRight);
  useKeypress("ArrowUp", handleUp);
  useKeypress("ArrowDown", handleDown);
  useKeypress("a", handleLeft);
  useKeypress("d", handleRight);
  useKeypress("w", handleUp);
  useKeypress("s", handleDown);


  //combat functions 
  const damage = atk => {
    let dmg = Math.floor(Math.random() * 3) - 1 + atk - armour
    return dmg < 1 ? 1 : dmg
  }
  const victory = (enemyId, enemyExp) => {
    addToLog("You beat "+enemies[room][enemyId].name)
    setExp(exp + enemyExp)
    let remainingEnemies = enemies[room].slice(0, enemyId).concat(enemies[room].slice(enemyId+1))
    setEnemies(enemies.map((r, i) => {
      if (i === room) {
        r = remainingEnemies
      }
      return r
    }))
  }
  const death = () => {
    addToLog("You Died")
    setDead(true)
  }
  const combat = enemyId => {
    let enemyStats = enemiesList.find(obj => {
     return obj.name === enemies[room][enemyId].name
    })
    let enemyName = enemies[room][enemyId].name
    let enemyHealth = enemyStats.health
    let enemyAttack = enemyStats.attack
    let enemyExp = enemyStats.experience
    addToLog("Enemy stats are: ")
    addToLog("Health: "+ enemyHealth)
    addToLog("Attack: "+ enemyAttack)
    let playerHealth = health
    while (enemyHealth > 0 && health > 0) {
      let playerHit = damage(attack)

      addToLog("You did " + playerHit + " damage to the " + enemyName)
      enemyHealth -= playerHit
      addToLog("The "+ enemyName + " now has " + enemyHealth + " health")
      if (enemyHealth <= 0) {
        setHealth(playerHealth)
        if (enemyName === "boss") {
          victory(enemyId, enemyExp)
          setComplete(true)
        } else {
        victory(enemyId, enemyExp);
        }
        break;
      }
      let enemyHit = damage(enemyAttack)
      
      addToLog("The "+ enemyName + " did " + enemyHit + " damage to you")
      playerHealth -= enemyHit
      addToLog("Your health is now " + playerHealth)
      
      if (playerHealth <= 0) {
        setHealth(playerHealth)
        death()
        break;
      }
    }
  }
   
  //Item Management
  const pickupItem = itemName => setBackpack(backpack.concat(itemName))
  const equipItem = e => {
    let itemObject = itemsList.find(obj => {
      return obj.name === e.target.id
    })
    addToLog("You equipped a "+itemObject.name)
    switch (itemObject.location) {
      case "head":
        setEquipped(prevState => ({
          ...prevState,
            head: itemObject.name
        }))
        break;
      case "weapon":
        if (equipped.shield !== "" && itemObject.name === "greatsword") {
          addToLog("The "+itemObject.name+" is too big to use with a shield. The shield has been removed")
          setEquipped(prevState => ({
                ...prevState,
                weapon: itemObject.name,
                shield: ""
            }));
        } else {
        setEquipped(prevState => ({
          ...prevState,
            weapon: itemObject.name
        }))}
        break;
        case "shield":
        if (equipped.weapon === "greatsword") {
          addToLog("The greatsword is too big to use with a shield. The greatsword has been removed")
          setEquipped(prevState => ({
                ...prevState,
                weapon: "",
                shield: itemObject.name
            }));
        } else {
        setEquipped(prevState => ({
          ...prevState,
            shield: itemObject.name
        }))}
        break;
      case "body":
        setEquipped(prevState => ({
          ...prevState,
            body: itemObject.name
        }))
        break;
      case "legs":
        setEquipped(prevState => ({
          ...prevState,
            legs: itemObject.name
        }))
        break;
      default:
        console.log("Error")
        break;
    }
  } 
  const unequipItem = e => {
        addToLog("Unequipped "+equipped[e.target.getAttribute("data")])
        setEquipped(prevState => ({
                ...prevState,
                [e.target.getAttribute("data")]: ""
            }));
  }
  //Healing
  const useItem = e => {
    let itemObject = itemsList.find(obj => {
      return obj.name === e.target.id
    })
    addToLog("Used a "+itemObject.name)
    addToLog("Recovered "+itemObject.healing+" health")
    if ((health + itemObject.healing) > maxHealth) {
      setHealth(maxHealth) 
    } else {
      setHealth(health + itemObject.healing)
    }
    let itemIndex = backpack.indexOf(itemObject.name)
    setBackpack(backpack.slice(0, itemIndex).concat(backpack.slice(itemIndex+1)))
  }
  
  //Attack and Armour tracking
  useEffect(() => {
    let attackMod = 0
    let armourMod = 0
    for (let key in equipped) {
      if (equipped[key]) {
      let itemObject = itemsList.find(obj => {
      return obj.name === equipped[key]
    })
      if (itemObject.type === "weapon") {
        attackMod += itemObject.damage
      }
      if (itemObject.type === "armour") {
        armourMod += itemObject.defence
      }
    }}
    setArmour(armourMod)
    setAttack(baseAttack + attackMod)
  }, [equipped, baseAttack]) 
  
  //Enemy Movement - ### Add a "hidden level" tag, so that if enemy is in bushes, level display is hidden
  useEffect(() => {
    const timer = setTimeout(() => {
      let updatedEnemies = []
      enemies[room].map((enemy, i) => {
        //Direction also changes image direction
      let direction = Math.floor(Math.random() * 4)
      let newX = enemy.position[0]
      let newY = enemy.position[1]
      switch (direction) {
        case 0:
          newX -= 1
          break;
        case 1:
          newX += 1
          break;
        case 2:
          newY -=1
          break;
        case 3: 
          newY += 1
        break;
        default:
          console.log("Error")
          break;
      }
      if (map[newY][newX] !== "X" && newX >= 0 && newX < mapWidth) {
        if (map[newY][newX] === "G" ) {
          enemy.hidden = true
        } else {
          enemy.hidden = false
        }
        enemy.position = [newX, newY]
        enemy.direction = direction
      }      
      updatedEnemies.push(enemy)
    })
    setEnemies(enemies.map((enemy, i) => {
      if (room === i) {
        return updatedEnemies
      } else {
        return enemy
      }
    }))
    }, 1000)
    return () => clearTimeout(timer)
  }, [enemies]) 
  
  //Encounters
  useEffect(() => {
    if (didMountRef) {
      //check for items
      items[room].map((item, i) => {
          if (playerX === item.position[0] && playerY === item.position[1]) {
            addToLog("Picked up: " + item.name)
            let remainingItems = items[room].slice(0, i).concat(items[room].slice(i+1))
            setItems(items.map((r, i) => {
              if (i === room) {
                r = remainingItems
              }
          return r
          }))
            pickupItem(item.name)
          }
        })
      //check for enemies
        enemies[room].map((enemy, i) => {
          if (playerX === enemy.position[0] && playerY === enemy.position[1]) {
            addToLog("Encountered a " + enemy.name + " at x: " + enemy.position[0] + " and y: " + enemy.position[1])
            combat(i)
          }
        })       
      }
  }, [playerY, playerX, enemies])

  //Tracks first render, so some hooks don't run on first render
  useEffect(() => {
    didMountRef.current = true;
    },[])

  return(
    <>
      <MobileView>
        <h1>Sorry!</h1>
        <p>This game isn't compatible with mobile. Please come back and check it out on your browser</p>
        <Image className="gameplay-gif" src={GameScreenshot} alt="Screenshot of Game" />
      </MobileView>
      <BrowserView> 
        <Container fluid className="d-md-none d-xs-block dark-background" style={{height: "100vh"}}>
          <h1 className="titles">Oops</h1>
          <p>Your screen is a little bit too small to play this game properly. Try it again on a bigger screen.</p>
          <Image className="gameplay-gif" src={GameScreenshot} alt="Screenshot of Game" />
        </Container>
    <Container fluid className="d-none d-md-block">
        <Row className="stats-row" noGutters>
        <Stats
                level={level} 
                health={health}
                maxHealth={maxHealth}
                exp={exp}
                />
        </Row>
        <Row noGutters className="map-row">
          <Col xs={3} className="backpack scroll">
          <Backpack className=""
              backpack={backpack} 
              equipItem={equipItem}
              useItem={useItem}
              equipped={equipped}
              unequipItem={unequipItem}
              />
          </Col>
          <Col xs={6} className="no-pad">
                <Map className="no-pad map" 
                  roomMap={map} 
                  playerX={playerX} 
                  playerY={playerY}
                  enemies={enemies} 
                  items={items}
                  dead={dead}
                  room={room}
                  mapWidthPercentage={mapWidthPercentage}
                  playerDirection={playerDirection}
                />
                {dead && <DeathScreen replay={replay}/>}
                {complete && <CreditsScreen replay={replay}/>}
            </Col>
          <Col xs={3} className="no-pad">
          <Equipment 
              equipment={equipped}
              attack={attack}
              armour={armour}
              
              />
          </Col>
            </Row>
            <Row noGutters >
              <Col xs={3} className="no-pad log scroll">
                <ArrowRepeat className="clickable" onClick={replay}/>
                <p>Restart</p>
              </Col>
              <Col xs={6} className="no-pad">
               {!info && <GameLog log={log} />}
                {info && <Info />}
              </Col>
              <Col xs={3} className="no-pad log scroll">
                {info ? <Code className="clickable" onClick={toggleInfo} style={{ fontSize: "30px"}}/> : <InfoCircle onClick={toggleInfo} style={{ fontSize: "40px"}}/>}
                {info ? <p>Game Log</p> : <p>About</p>}
              </Col>
            </Row>
    </Container>
    </BrowserView>

    </>
  )
}

function DeathScreen(props) {
  return (
    <div className="death-message">
      <h1>You Died</h1>
      <h1 className="replay-button" onClick={props.replay}>Play Again?</h1>
    </div>
  )
}

function CreditsScreen(props) {
  return (
    <div className="credits death-message">
      <h1>Congratulations! You Survived</h1>
      <h1 className="replay-button" onClick={props.replay}>Play Again?</h1>
    </div>
  )
}


function Map(props) {
  let rows = []
  props.roomMap.map(data => {
    let row = []
    data.map(location => {
      if (location === "X") {
        row.push(<Image src={gameSrc.tree} style={{ width: props.mapWidthPercentage, zIndex: 40 }}/>);
      } else if (location === "G") {
        row.push(<Image src={gameSrc["long grass"]} style={{ width: props.mapWidthPercentage, zIndex: 40 }}/>);
      } else {
        row.push(<Image src={gameSrc.grass} style={{ width: props.mapWidthPercentage, zIndex: 1}}/>)
      }
    })
    rows.push(row)
  })
  return (
      <>
        {!props.dead && <Player 
        x={props.playerX} 
        y={props.playerY} 
        playerDirection={props.playerDirection}
        room={props.room}
        mapWidthPercentage={props.mapWidthPercentage}/>}
        {props.items[props.room].map(item => {
          return <Item 
                   iX={item.position[0]} 
                   iY={item.position[1]} 
                   itemName={item.name}
                   mapWidthPercentage={props.mapWidthPercentage}
                   room={props.room} />
        })}  
      {props.enemies[props.room].map(en => {
          return <Enemy 
                   type={en.name}
                   eX={en.position[0]} 
                   eY={en.position[1]}
                   enemies = {props.enemies}
                   direction={en.direction}
                   mapWidthPercentage={props.mapWidthPercentage}
                   room={props.room} />
        })}
      {rows.map(row => {
        return <Row className="no-pad" noGutters>{row.map(item => {
          return item
        })}</Row>
      })}  
            
      </>

  )
}

function Stats(props) {
  let health = Math.max(props.health, 0)
  return (
  <>
    <Col xs={3} className="titles" >
      <h1>Backpack</h1>
    </Col>
      <Col md={6}>
      <p className="text-center">{health+"/"+props.maxHealth}</p>
          <ProgressBar variant="danger" now={Math.max(((health/props.maxHealth)*100), 0.1)} className="stats-bars"/>
      <p className="text-center">Level {props.level}</p>
          <ProgressBar variant="warning" now={(props.exp/(props.level*100))*100} className="stats-bars"/>
      </Col>
      <Col xs={3} className="titles">
      <h1>Equipment</h1>
    </Col>
  </>
  )

}
function Backpack(props) {
  return (
    <div>
      <Row noGutters className="no-pad">
        <Image className="background-overlay" src={PackImg} />
      {props.backpack.map(item => {
      let itemObj = itemsList.find(obj => obj.name === item)
      let isEquipped = Object.values(props.equipped).includes(item)
      return (
      <Col xs={4} className="align-content-center transparent" style={{ padding: "5px"}}>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 100 }}
            overlay={<Tooltip className="capitalise">
              <p>{item[0].toUpperCase()+item.slice(1)}</p>
              {itemObj.type === "weapon" ? <p>Damage: {itemObj.damage}</p> : itemObj.type === "armour" ? <p>Defence: {itemObj.defence}</p> : <p>Healing: {itemObj.healing}</p>}
            </Tooltip>}
          >       
            <Image id={item} className="clickable" data={itemObj.location} src={itemsSrc[itemObj.name]} style={isEquipped ? {backgroundColor: "rgba(87, 65, 31, 0.8)", borderRadius: "10px"} : {}} onClick={isEquipped ? props.unequipItem : itemObj.type === "potion" ? props.useItem : props.equipItem}/>
          </OverlayTrigger>
        
      </Col>
      )
      })}
      </Row>
    </div>
  )
}

function Equipment(props) {
  let source = null
  if (props.equipment.weapon === "dagger") {
    source = Dagger
  } else if (props.equipment.weapon === "sword") {
    source = Sword
  } else if (props.equipment.weapon === "greatsword") {
    source = Greatsword
  }
  return (
    <div className="equip">
      <Image src={Base} className="equipment base"/>
      {props.equipment.legs && <Image src={Boot} className="equipment overlay"/>}
      {props.equipment.head && <Image src={Helmet} className="equipment overlay"/>}
      {props.equipment.weapon && <Image src={source} className="equipment overlay sword"/>}
      {props.equipment.shield && <Image src={Shield} className="equipment overlay"/>}
      {props.equipment.body && <Image src={Body} className="equipment overlay boots"/>}
      <p>Attack: {props.attack}</p>
      <p>Armour: {props.armour}</p>
    </div>
    )
}
function GameLog(props) {
  return (
    <div className="log scroll">
      {props.log.map(action => {
        return (<p style={{ padding: "0"}}>{"> "+action}</p>)
      })}
    </div>
  )
}

//Map Components
function Player(props) {
  return <Image 
           src={playerSrc[props.playerDirection]} 
           className="entity player"
           alt="player"
           style={{ width: props.mapWidthPercentage, left: ((props.x*(100 / rooms[props.room][0].length))+"%"), top: ((props.y*(100 / rooms[props.room].length))+"%")}} 
           />
}
function Enemy(props) {
  let enemyObject = enemiesList.find(en => en.name === props.type)
  let level = enemiesList.find(en => en.name === props.type).level
  let hidden = props.enemies[props.room].find(en => en.name === props.type).hidden
  return (
  <div className="">
  {!hidden && <p className="entity index"
  style={{marginTop: "-20px",  width: props.mapWidthPercentage, left: ((props.eX*(100 / rooms[props.room][0].length))+"%"), top: ((props.eY*(100 / rooms[props.room].length))+"%")}}
  >Lv: {level}</p>}
  <Image 
           src={monstersSrc[props.type][props.direction]}  
           className="entity" 
           style={{width: props.mapWidthPercentage, left: ((props.eX*(100 / rooms[props.room][0].length))+"%"), top: ((props.eY*(100 / rooms[props.room].length))+"%")}}
           />
           </div>
           );
}
function Item(props) {
    return <Image 
             src={itemsSrc["treasure"]}
             id={props.itemName} 
             className="entity"
             style={{ width: props.mapWidthPercentage, left: ((props.iX*(100 / rooms[props.room][0].length))+"%"), top: ((props.iY*(100 / rooms[props.room].length))+"%")}} 
             />
}

function Info(props) {
  return (
    <div className="log scroll">
    <p><span style={{ fontSize: "15px" }}><ArrowLeftSquare /><ArrowUpSquare /><ArrowRightSquare /><ArrowDownSquare /></span> to move</p>
    <p>This game was put together in an effort to complete and polish a larger project</p>
    <p>During the development, I learned a great deal about state management, data structures, and abstracting functionality. I also got to delve into basic pathing algorithms, which then forced me to work on optimisation</p>
    <p>So what next? \n I plan to continuously upgrade this game over time. Balancing the gameplay (I am no game designer) is first up, and then a scoring system of some kind. I also wish to implement a feature for users to sign in and save their progress.</p>
  <p>Settings such as map size and mobile/touchscreen friendly are also on the cards</p>
    </div>
  )
}

export default Game;
