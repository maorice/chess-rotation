package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)



var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	}, // for now, allow connection from any website
}

func handler(w http.ResponseWriter, r *http.Request) {
  conn, err := upgrader.Upgrade(w, r, nil)
  if err != nil {
		log.Println(err)
		return
  }
  defer conn.Close()

	log.Println("Connection opened!")

	// simple echo server
	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}
			
		log.Printf("Received: %s", message)
			
		// Echo back
		err = conn.WriteMessage(messageType, message)
		if err != nil {
			log.Println("Write error:", err)
			break
		}
	}
}

func main() {
	http.HandleFunc("/ws", handler)
	
	port := ":8080"
	fmt.Printf("Server starting on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}