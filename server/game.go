package main

import (
	"log"
)

// starts running when the player's game starts, processing their essages and adding them to the EventChannel
func handlePlayerMessages(player *Player, game *Game) {
	defer player.Conn.Close()

	for {
		var msg map[string]interface{}
		err := player.Conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("[DEBUG]: Player %s disconnected", player.ID)
			break
		}
		
		// Handle messages (moves, chat, etc.)
		log.Printf("[DEBUG]: Player %s: %v", player.ID, msg)

		// TODO: handle messages by type
	}
}

// starts the game for a given game object, starts processing player messages from the EventChannel, main game loop
func startGame(game *Game) {
	log.Println("[DEBUG]: Game started for", game.Player1.ID, "and", game.Player2.ID)

	go handlePlayerMessages(game.Player1, game)
	go handlePlayerMessages(game.Player2, game)

	for {
		event := <- game.EventChannel
		log.Println(event)
	}
}

// runs constantly, currently immediately matches pairs of players in the order they connect and starts a game
func matchmaker() {
	for {
		player1 := <- playerMatchmakingPool
		player2 := <- playerMatchmakingPool

		log.Println("[DEBUG]: Match found for players", player1.ID, "and", player2.ID)

		game := Game{
			Player1: player1,
			Player2: player2,
			EventChannel: make(chan GameEvent),
		}

		go startGame(&game)

	}
}
