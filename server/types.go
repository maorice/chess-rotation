package main

import (
	"github.com/gorilla/websocket"
)

type Player struct {
	ID string
	Conn *websocket.Conn
}