package main

import (
	"github.com/gorilla/websocket"
)

type WSMessage struct {
	Type string            `json:"type"`
	Args map[string]string `json:"args"`
}

type Player struct {
	ID string
	Username string
	Conn *websocket.Conn
}


type GameEvent struct {
	Player *Player
	Type string
	Msg string
}

type Game struct {
	Player1 *Player
	Player2 *Player
	EventChannel chan GameEvent
	GameID string
}
