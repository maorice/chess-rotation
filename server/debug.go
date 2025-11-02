package main

import (
	"fmt"
	"log"
)

func echoMessages(player *Player) {
	fmt.Println("[DEBUG]: Logging player messages")
	for {
		var msg map[string]interface{}
		err := player.Conn.ReadJSON(&msg)
		if err != nil {
				log.Printf("Player %s disconnected", player.ID)
				break
		}
		
		// Handle messages (moves, chat, etc.)
		log.Printf("Player %s: %v", player.ID, msg)
	}
}
