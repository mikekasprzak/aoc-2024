package main

import (
	"bufio"
	"fmt"
	"os"
	"path"
	"strings"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Println("Usage:", path.Base(os.Args[0]), "<input file>")
		os.Exit(1)
	}
	fileBytes, err := os.ReadFile(os.Args[1])
	if err != nil {
		fmt.Println("Error: ", err)
		os.Exit(1)
	}
	lines := string(fileBytes)

	scanner := bufio.NewScanner(strings.NewReader(lines))

	for scanner.Scan() {
		line := strings.Fields(scanner.Text())
		fmt.Println(line)
	}

	//fmt.Println(lines)
}
