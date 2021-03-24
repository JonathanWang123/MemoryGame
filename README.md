# Pre-work - _Memory Game_

**Memory Game** is a Light & Sound Memory game to apply for CodePath's SITE Program.

Submitted by: **Jonathan Wang**

Time spent: **6** hours spent in total

Link to project: (insert your link here, should start with https://glitch.com...)

## Required Functionality

The following **required** functionality is complete:

- [X] Game interface has a heading (h1 tag), a line of body text (p tag), and four buttons that match the demo app
- [X] "Start" button toggles between "Start" and "Stop" when clicked.
- [X] Game buttons each light up and play a sound when clicked.
- [X] Computer plays back sequence of clues including sound and visual cue for each button
- [X] Play progresses to the next turn (the user gets the next step in the pattern) after a correct guess.
- [X] User wins the game after guessing a complete pattern
- [X] User loses the game after an incorrect guess

The following **optional** features are implemented:

- [X] Any HTML page elements (including game buttons) has been styled differently than in the tutorial
- [X] Buttons use a pitch (frequency) other than the ones in the tutorial
- [X] More than 4 functional game buttons
- [X] Playback speeds up on each turn
- [X] Computer picks a different pattern each time the game is played
- [X] Player only loses after 3 mistakes (instead of on the first mistake)
- [X] Game button appearance change goes beyond color (e.g. add an image)
- [X] Game button sound is more complex than a single tone (e.g. an audio file, a chord, a sequence of multiple tones)
- [X] User has a limited amount of time to enter their guess on each turn

The following **additional** features are implemented:

- [X] List anything else that you can get done to improve the app!
- [X] Multiple options for number of buttons, number of rounds, lives, and speed.
- [X] The option to have the buttons randomely shuffle after the pattern is shown
- [X] An endless mode that generates random patterns and adds to the pattern at each iteration
- [X] Counter that keeps track of score in endless mode
- [X] A rhythm mode that holds buttons down for a random span of time and requires the user to hold down for the same time.


## Video Walkthrough

Here's a walkthrough of implemented user stories:

Basic button functionality:
![Button Functionality](https://cdn.glitch.com/048acf4c-8575-4416-a5ca-7a61bb4f3ffc%2FbuttonFunctionality.gif?v=1616581053510)

Normal mode functionality:
![Button Functionality](https://cdn.glitch.com/048acf4c-8575-4416-a5ca-7a61bb4f3ffc%2FnormalMode.gif?v=1616580932303)

Shuffling functionality:
![Button Functionality](https://cdn.glitch.com/048acf4c-8575-4416-a5ca-7a61bb4f3ffc%2FshuffleMode.gif?v=1616580939723)


Endless mode functionality:
![Button Functionality](https://cdn.glitch.com/048acf4c-8575-4416-a5ca-7a61bb4f3ffc%2FendlessMode.gif?v=1616580926718)

Rhythm mode functionality:
![Button Functionality](https://cdn.glitch.com/048acf4c-8575-4416-a5ca-7a61bb4f3ffc%2FrhythmMode.gif?v=1616580936606)

## Reflection Questions

1. If you used any outside resources to help complete your submission (websites, books, people, etc) list them here.
   - W3Schools.com for syntax questions
   - stackoverflow.com for syntax questions and fisher-yates shuffling algorithm
   - SFXBuzz.com for wrong sound effect
   - OpenGameArt.com for heart image
   - clker.com for hand image

2. What was a challenge you encountered in creating this submission (be specific)? How did you overcome it? (recommended 200 - 400 words)
	
  &nbsp;&nbsp;&nbsp;&nbsp;One thing that I found tricky working with were JavaScripts native asynchronous functions, setTimeout and setInterval. In the standard programming I usually do, the program is meant to execute line by line. Even with the advanced concepts like threading, functions execute as they go and are joined when they are needed. However, with setTimeout and setInterval, you must keep track of all function calls and their finishing times. I used these functions often when developing the timer feature for guessing, refactoring some of the given code to fit the different game modes I implemented, and settings timers for the rhythm mode. However, I occasionally ran into issues with certain processes not ending in time or ending too late, timers not being reset properly, synchronous operations getting stuck, etc. Whenever this happened, I had to take a step back and map out all the processes to see what the issue was with.
  Since multiple functions running at the same time leads to a lot going on at the same time, whenever I ran into these issues, I found it easiest to solve if I just slowed down and visualized everything (for example sketching timelines) to see where things could have gone wrong. Usually with simpler logical problems I like to deduce issues as I code, but for more complicated program structures like this one, I found it helped a lot more to put all my effort into visualizing the program and working backwards in order to find the bug. For example, when implementing my timer for guesses I ran into an issue where the lives counter would just keep going down until losing, and the timer bar would fluctuate seemingly randomly. Since so many problems seemed to be happening at once it was difficult for me to deduce what the issue was. It was only after I sketched the program timeline and visualized what the set timers were doing that I was able to figure out the issue.
  It turned out that in some cases, the timers weren’t being closed properly and that led to multiple timers running in tandem while conflicting with one another. Issues like this were the most challenging to deal with since a small error can lead to wildly different and unexpected results. 

3. What questions about web development do you have after completing your submission? (recommended 100 - 300 words)

  &nbsp;&nbsp;&nbsp;&nbsp;Up until now, I have done web development as a fun hobby and am completely self taught. Everything I’ve learned working with tools like HTML/CSS/JS, React.js, and Vue.js has been learned by picking up a project and searching how to do things along the way. While this method is a fun way to learn new things, I feel that it’s also fairly inefficient and doesn’t teach me the best practices. I would love to get to know what working as a web and full stack developer is like in comparison. A lot of the things I do unintentionally stray away from common convention and I want to familiarize myself with these common practices. I want to know how professional developers plan and execute their work, how full stack development works in group settings considering how many moving parts there are, and how I would have to change the way I work to fit this mold. Additionally, I would like to learn more about the culture surrounding full stack development.
  I feel like front end and back end programmers often differ in their thinking and environment due to the differing natures of their work so I would like to see how full stack developers fit into these cultures or establish their own culture. 


4. If you had a few more hours to work on this project, what would you spend them doing (for example: refactoring certain functions, adding additional features, etc). Be specific. (recommended 100 - 300 words)

  &nbsp;&nbsp;&nbsp;&nbsp;At the time of writing this, I am happy with the functionality of the project and implemented all of the features I wanted. However, the main feature that I feel lacks the most would definitely be the front end. While the UI is intuitive enough, it doesn't look the way I would like. I would probably spend more time properly formatting the game area, making the settings section more intuitive and polished, adding css styling to text, selectors, and buttons, and making the page scalable to different screen sizes. I typically use css libraries like bootstrap for styling, as creating your own css for a page from scratch can be time consuming. That being said, this page is nowhere near what I would like it to be appearance wise so, if I had the time, the first thing I would do is go back and stylize everything.
  
  &nbsp;&nbsp;&nbsp;&nbsp;The next thing I would work on are just a few minor bugs that I ran into along the way. For example, there is a bug in the game buttons where, if you click and drag off the button before releasing, it never actually runs the onmouseup functions. I tried working around this with button ondragend functions but to no avail, so first I would look into fixing this, perhaps with a boolean that indicates whether the cursor is still within the button area. Also, there is the issue with the built in frequencies on Google Chrome, where the browser does not allow the sounds to play, so I would go through and add appropriate <audio> tags for button sounds.

## License

    Copyright Jonathan Wang

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
