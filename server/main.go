package main

import (
	"fmt"
	"github.com/gorilla/websocket"
)

func main() {
	fmt.Println("Hello world!")
	upgrader := websocket.Upgrader{}
	fmt.Println(upgrader)
}