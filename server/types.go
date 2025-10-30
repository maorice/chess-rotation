package main

import (
	"github.com/gorilla/websocket"
)

type Player struct {
	ID string
	Conn *websocket.Conn
}


type GameEvent struct {
	Player *Player
	Type string
}

type Game struct {
	Player1 *Player
	Player2 *Player
	EventChannel chan GameEvent
}
