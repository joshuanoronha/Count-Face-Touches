# Count-Face-Touches
Count the number of times you touch your face and change your habits.  
Made using JavaScript and implemented using <a href="https://github.com/justadudewhohacks/face-api.js/">face-api.js</a> and <a href="https://github.com/victordibia/handtrack.js/">handtrack.js<a> which are implemented on top of tensorflow.js.

## Getting Started
<ol>
  <li>Clone the project using : <br>
    <code>git clone https://github.com/joshua-noronha13/Count-Face-Touches.git</code>  
  </li>
  <li>Make sure python is installed and run : <br>
    <code>python -m SimpleHTTPServer</code>
  </li>
  <li>Open the application on localhost:8000
  </li>
</ol> 

## Demo
Here is a demo of the code in action, still a work in progress.


## Roadmap
<ul>
  <li>A few drawbacks need to be addressed, the code detects touches by checking individual images. So the number of touches depends on when the images are checked. So one long touch could be classified as multiple touches.</li>
  <li>To fix this a model would need to be trained (probably an LSTM), video data for the same would be needed, any help in this space is appreciated</li>
 </ul>

