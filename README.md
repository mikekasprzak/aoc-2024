# My Advent of Code 2024 entries

<https://adventofcode.com/>

I intended to use AOC 2024 to practice using Go, the kind folks at Deno offered free stickers....
soooo I'm doing my entries in TypeScript. Frankly I'm a lot faster in JavaScript, so to get competitive
scores I'm writing my entries in TypeScript then later (when I have time) rewriting them in Go.

## Usage

Until I see a need to change it, I'm running my dailies as follows.

### Typescript (Deno)

```bash
deno day1.ts input.txt
```

### Go

```bash
go run day1.go input.txt
```

----

## SPOILERS

### Log

```lua
      --------Part 1--------   --------Part 2--------
Day       Time   Rank  Score       Time   Rank  Score
  5   00:54:55  10343      0   01:08:34   7830      0  -- Late start, 00:25:00
  4   01:56:20  16020      0   02:13:43  14067      0  -- Sample was correct, but real data failed. 5 minute timeout per invalid answer
  3   00:21:49   8679      0   00:29:54   5982      0
  2   00:15:19   5133      0   00:44:27   6689      0
  1   02:07:08  14091      0   02:17:39  13579      0  -- Late start, 02:00:00
```

#### Day 1

Ah oops, I forgot about AOC, so I didn't get started until 2 AM. So here I am in bed, mashing
away at the keyboard, as my wife winds down for the night. I finished coding part 2 moments before kissing
them goodnight... heh.

The unusual spacing between sample data is what delayed me initially. Doing a `String.split(" ")` wasn't
going to work, I needed an actual string tokenizer... or so I thought. The sample data all used the same
spacing between the data, so I could have lazily done `String.split("   ")`, but I ended up hacking a regex
that omitted whitespace tokens.

In a hurry I also added some code to ignore entirely blank lines from the inputs. This wasn't actually needed
by the real data, just my sample data, as I wanted my samples to be formatted cleanly. After the submission,
I realized I could use a combination backtick and \ to give me the clean formatting without a wasted 1st line.

Solving the problems were otherwise straightforward. Sorting the arrays, counting the number of each item, etc.
I could have used tighter data structure for storing the counts, but using an array worked. I'll fix that in
the Go version.

Given how late I started, y rank was lousy: 14000'ish. I've set an alarm now for 11:45 PM. Here's hoping we
can break the top 1000 tonight.

##### Go Version

December 5th: I finally started on my Go versions.

After Googling how to read lines of text from a file, I decided to go with `bufio.Scanner` to stream lines of
text in directly from the file. This is in contrast to my TS version, that reads the whole file in.

I love that Go has `string.Fields`, a function that splits strings at whitespace. I'll need something better
to tokenize Day 3, but for simple whitespace delimited files this is perfect.

I hate that I had to split up `strconv.Atoi` over two lines. Yes I totally understand why, but I'd imagine using
a `_` is rather common, so it'd be nice if there was a single line syntax for this (there may be, but TBD). Or
not, I dunno. Pondering that this does force me to drop an artifact in my code (i.e. the _) my eyes can see
to give me a hint that maybe I'm not handling an error properly.

That doesn't mean I can't still dislike it. ;)

I dislike that there are no terniary operators (i.e. `?:`, `??`), but I will admit that it does force the code
to be broken up in a more readable way. I wanted to use `??`, but a side effect of `map` is that the default
value of the type is returned when a key isn't found, which was perfect for my `instances` counting code.

Also WUT, there is no integer "absolute value" function (according to Stack Overflow peeps). The justifications
are that the function is "easy to write", which yes it is, or that generics didn't exist when the standard
library was cretaed, but then folks say `fabs` isn't a simple less-than check. ¯\_(ツ)_/¯

If you ask me, I think it's dumb to need an `IAbs` function in every module. But anyway, this seems to be an
ongoing discussion: <https://www.reddit.com/r/golang/comments/152jmch/why_is_there_no_function_to_get_the_absolute_or/>

I was torn between `fmt.Println` and `log.Println`. Same general idea, but logs include timestamps. To be
consistent with ts, I stuck with `fmt.Println`. `log.Fatal` is a handy way to `os.Exit` in one line, but it
seemed a better idea that if I wasn't going to use `log` anywhere else, to not use it here.

`defer` is awesome.

#### Day 2

Ah oops! You're not supposed to share the puzzle data in your repos. So after a bit of shuffling, I've created
separate public and private repos. I've also decided to wait ~2 hours until before publishing my public answers.

#### Day 5

Midnight shift, so I wasn't able to start until I got home (i.e. 12:25 AM).

#### Day 6

Another midnight shift.
