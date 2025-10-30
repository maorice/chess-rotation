package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"strconv" //may replace this
	"sync"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	}, // for now, allow connection from any website
}

// pool of connected players waiting for a match
var playerMatchmakingPool = make(chan *Player)

// all connected clients
var connections = make(map[string]*Player)
var connMutex = sync.Mutex{}

// runs when the server receives an HTTP message from a client, upgrades that connection to websocket, 
// makes a player for that connection and stores them in the connections map. adds the player to the matchmaking pool
func connectionHandler(w http.ResponseWriter, r *http.Request) {
  conn, err := upgrader.Upgrade(w, r, nil)
  if err != nil {
		log.Println(err)
		return
  }

	player := Player{
		generateID(), 
		conn,
	}

	connMutex.Lock()
	connections[player.ID] = &player
	connMutex.Unlock()

	log.Println("Player", player.ID, "connected")

	playerMatchmakingPool <- &player

	log.Println("Player", player.ID, "added to matchmaking pool")
}

// generates a unique id for a player
func generateID() string {
	connMutex.Lock()
	defer connMutex.Unlock()
	for i := 1; ; i++ {
		_, ok := connections["player_" + strconv.Itoa(i)]
		if !ok {
			return "player_" + strconv.Itoa(i)
		}
	}
}

func main() {
	go matchmaker()

	http.HandleFunc("/ws", connectionHandler)
	
	port := ":8080"
	fmt.Printf("Server starting on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}