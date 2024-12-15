package main

import (
	"bufio"
	"fmt"
	"os"
	"path"
	"slices"
	"strconv"
	"strings"
)

func IAbs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func main() {
	if len(os.Args) != 2 {
		fmt.Println("Usage:", path.Base(os.Args[0]), "<input file>")
		os.Exit(1)
	}
	inFile, err := os.Open(os.Args[1]) //("day1-sample.txt")
	if err != nil {
		//log.Fatal(err)
		fmt.Println("Error: ", err)
		os.Exit(1)
	}
	defer inFile.Close()

	left := []int{}
	right := []int{}

	instances := make(map[int]int)

	// NOTE: Scanner has a 64k limit by default
	scanner := bufio.NewScanner(inFile)
	for scanner.Scan() {
		line := scanner.Text()
		//tokens := strings.Split(line, "   ")	// hacky solution which is correct (3 spaces), but I'd rather tokenize by any whitespace
		tokens := strings.Fields(line)  // I like this better, it tokenizes by any whitespace
		a, _ := strconv.Atoi(tokens[0]) // Boo, I wish this didn't need to be broken up over 2 lines
		left = append(left, a)
		b, _ := strconv.Atoi(tokens[1])
		right = append(right, b)
		//fmt.Println(tokens, len(tokens))
		instances[b] = instances[b] + 1 // In go, items that are not found in a map are the default value of the type (i.e. 0 for int)
	}
	//fmt.Println(left, right)
	slices.Sort(left)
	slices.Sort(right)
	//fmt.Println(left, right)

	totalDistance := 0
	totalSimilar := 0

	for i := 0; i < len(left); i++ {
		totalDistance += IAbs(right[i] - left[i])

		sim := left[i] * instances[left[i]]
		totalSimilar += sim
	}

	fmt.Println("Total Distance: ", totalDistance)
	fmt.Println("Total Similar: ", totalSimilar)
}
