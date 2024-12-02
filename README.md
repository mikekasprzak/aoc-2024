My advent-of-code 2024 entries.

EDIT: Now without data, per the rules. 😓

<https://adventofcode.com/>

While I intended to use AOC 2024 to practice using Go, the kind folks at Deno offered free stickers....
soooo I'm doing my entries in TypeScript. Frankly I can write things a lot quicker in JavaScript, so
for the sake of getting on the scoreboard, using Deno is better for me anyway.

I still want to get Go practice, so chances are I'll be porting my code to Go after the fact.

## Usage
Until I see a need to change it, I'm running my dailies as follows.

### Typescript (Deno)
```
deno day1.ts
```

### Go


----

# SPOILERS!
## Log
```
      --------Part 1--------   --------Part 2--------
Day       Time   Rank  Score       Time   Rank  Score
  1   02:07:08  14091      0   02:17:39  13579      0
```

### Day 1
Ah oops, I forgot about AOC, so I didn't get started until roughly 2 AM. So here I am in bed, mashing 
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

### Day 2
TODO
