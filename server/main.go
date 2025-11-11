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
	CheckOrigin: func(r *http.Request) bool {
		return true
	}, // for now, allow connection from any website
}

// pool of connected players waiting for a match
var playerMatchmakingPool = make(chan *Player)

// all connected clients, map of player name -> player. players are added as they connect to the server
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
		"",
		conn,
	}

	// go echoMessages(&player) // for debugging

	connMutex.Lock()
	connections[player.ID] = &player
	connMutex.Unlock()

	go handlePlayerConfigurationMessages(&player)

	log.Println("[DEBUG]: Player", player.ID, "connected")
}

// handle player messages BEFORE they get in game, player messages are sent after client connection. currently client connection and JOIN_QUEUE
// message are paired
func handlePlayerConfigurationMessages(player *Player) {
	for {
		var msg WSMessage
		err := player.Conn.ReadJSON(&msg)
		if err != nil {
			delete(connections, player.ID)
			log.Printf("[DEBUG]: Player %s disconnected", player.ID)
			return
		}
		
		log.Printf("[DEBUG]: Player %s: %v", player.ID, msg)

		switch msg.Type {
			case "JOIN_QUEUE":
				handleJoinQueue(player, msg.Args)

			case "LEAVE_QUEUE":
				handleLeaveQueue(player)
			
			default:
				fmt.Println("[ERROR]: Unmatched message type")
			
		}
	}
}

// handler for JOIN_QUEUE message, sets the player's username and adds the player to the matchmaking pool, then sends an ack back to the client
func handleJoinQueue(player *Player, args map[string]string) {
	if username, ok := args["username"]; ok {
		connMutex.Lock()
		player.Username = username
		connMutex.Unlock()
	}
	playerMatchmakingPool <- player
	player.Username = args["username"]
	log.Println("[DEBUG]: Player", player.ID, "added to matchmaking")
	defer sendQueueJoined(player)
}

// handler for the LEAVE_QUEUE message, currently not implemented as there is no button for leaving queue
func handleLeaveQueue(player *Player) {
	// TODO: add button to the waiting page, sends a LEAVE_QUEUE message to the server, server removes the player from the matchmaking pool.
	// NOTE: eventually will have to unpair the connect and JOIN_QUEUE messages for this to work.
	log.Println("[ERROR]: Not implemented!")
}

// helper to send messages to a player
func sendMessage(player *Player, msgType string, args map[string]string) error {
	msg := WSMessage{
		Type: msgType,
		Args: args,
	}
	return player.Conn.WriteJSON(msg)
}

func sendQueueJoined(player *Player) {
	sendMessage(player, "QUEUE_JOINED", map[string]string{"username": player.Username})
	log.Printf("[DEBUG] QUEUE_JOINED message sent to %s\n", player.Username)
}

func sendGameFound(player *Player, enemy *Player, gameID string) {
	sendMessage(player, "MATCH_FOUND", map[string]string{"username": player.Username, "enemy_username": enemy.Username, "gameID": gameID})
	log.Printf("[DEBUG] GAME_FOUND message sent to %s\n", player.Username)

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
	fmt.Printf("[DEBUG]: Server starting on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}