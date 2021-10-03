let slider;
let bubble_button;
let insertion_button;
let start_button;
let pause_button;
let shuffle_button;
let selection_button;
let next_button;
let bottom_section_y = -1;
let bottom_section_x = -1;
let r;
let g;
let b;
let randomValues;
let numValues;
let selectObj = {finished: true, idx1: -1, idx: -1};
let generator = null;
let paused = true;

function setup(){
    createCanvas(window.innerWidth - 20, window.innerHeight - 20);
    r = g = b = 150;
    background(r, g, b);
    // GUI COMPONENT ----------------------------------------
    bottom_section_x = 0;
    bottom_section_y = height - height / 12;
    slider = createSlider(10, 50, 20, 5);
    bubble_button = createButton("Bubble");
    insertion_button = createButton("Insertion");
    selection_button = createButton("Selection");
    start_button = createButton("Start");
    pause_button = createButton("Pause");
    next_button = createButton("Step");
    shuffle_button = createButton("Shuffle");
    shuffle_button.position(250, 27);
    bubble_button.position(250, 77);
    insertion_button.position(375, 77);
    selection_button.position(500, 77);
    slider.position(100, 35);
    start_button.position(375, 27);
    pause_button.position(500, 27);
    next_button.position(625, 27);
    bubble_button.mousePressed(startBubble);
    insertion_button.mousePressed(startInsertion);
    start_button.mousePressed(startButton);
    pause_button.mousePressed(pauseButton);
    shuffle_button.mousePressed(shuffleButton);
    next_button.mousePressed(nextButton);
    selection_button.mousePressed(startSelection);
    // VARIABLE COMPONENT ------------------------------------
    randomValues = [];
    numValues = slider.value();
    for(let i = 0; i < numValues; i++){
        randomValues.push(i);
    }
}

function showBars(selectObj){
    for(let i = 0; i < randomValues.length; i++){
        if(i == selectObj.idx1 || i == selectObj.idx2){
            strokeWeight(1);
            stroke(255, 0, 0);
            fill(255, 0, 0);
        }else{
            strokeWeight(1);
            stroke(255);
            fill(255);
        }
        let x = map(i, 0, randomValues.length, 50, width - 50);
        let y = bottom_section_y - 100;
        let rect_height = map(randomValues[i], 0, randomValues.length, 10, bottom_section_y - 250);
        rect(x + 25, y - rect_height, (width - 50 - 50) / randomValues.length - 5, rect_height);
    }
}

function startBubble(){
    console.log("-START BUBBLE");
    generator = bubble_sort_algo();
    selectObj = generator.next().value;
    paused = false;
}

function startInsertion(){
    console.log("-START INSERTION");
    generator = insertion_sort_algo();
    selectObj = generator.next().value;
    paused = false;
}

function startSelection(){
    console.log("-START SELECTION");
    generator = selection_sort_algo();
    selectObj = generator.next().value;
    paused = false;
}

function nextButton(){
    selectObj = generator.next().value;
}

function startButton(){
    console.log("-START");
    paused = false;
}

function pauseButton(){
    console.log("-PAUSE");
    paused = true;
}

// Generator expressions

function* bubble_sort_algo(){
    let sorted = false;
    while(sorted == false){
        sorted = true;
        for(let i = 0; i < randomValues.length - 1; i++){
            yield {finished: false, idx1 : i, idx2 : i + 1};
            if(randomValues[i] > randomValues[i + 1]){
                sorted = false;
                let temp = randomValues[i];
                randomValues[i] = randomValues[i+1];
                randomValues[i+1] = temp;
                yield {finished: false, idx1 : i, idx2 : i + 1};
            }
        }
    }
    yield {finished: true, idx1 : -1, idx2 : -1};
}

function* insertion_sort_algo(){
    for(let i = 1; i < randomValues.length; i++){
        let loc = i;
        yield {finished : false, idx1 : loc, idx2 : loc - 1};
        while(loc > 0 && randomValues[loc] < randomValues[loc - 1]){
            // Swap loc and loc -1
            // Set loc to loc - 1
            yield {finished : false, idx1 : loc, idx2 : loc - 1};
            let temp = randomValues[loc];
            randomValues[loc] = randomValues[loc - 1];
            randomValues[loc - 1] = temp;
            loc = loc - 1;
        }
    }
    yield {finished : true, idx1 : -1, idx2 : -1};
}

function* selection_sort_algo(){
    for(let i = 0; i < randomValues.length - 1; i++){
        let smallest = i;
        for(let j = i + 1; j < randomValues.length; j++){
            yield {finished : false, idx1 : smallest, idx2 : j};
            if(randomValues[smallest] > randomValues[j]){
                smallest = j;
            }
        }
        let temp = randomValues[i];
        randomValues[i] = randomValues[smallest];
        randomValues[smallest] = temp;
    }
    yield {finished : true, idx1 : -1, idx2 : -1};
}

function shuffleButton(){
    // TODO pause simulation
    console.log("-SHUFFLE");
    for(let i = 0; i < 1000; i++){
        let idx1 = int(random(randomValues));
        let idx2 = int(random(randomValues));
        while(idx1 == idx2){
            idx2 = int(random(randomValues));
        }
        let temp = randomValues[idx1];
        randomValues[idx1] = randomValues[idx2];
        randomValues[idx2] = temp;
    }
}

function createMenu(){
    strokeWeight(1);
    stroke(0);
    fill(0);
    rect(bottom_section_x, bottom_section_y, width, height - bottom_section_y);
    strokeWeight(0);
    stroke(255);
    fill(255);
    text(`Elements: ${slider.value()}`, 100, 65);
}

function draw(){
    background(r, g, b);
    if(numValues != slider.value()){
        randomValues = [];
        numValues = slider.value();
        for(let i = 0; i < numValues; i++){
            randomValues.push(i);
        }  
    }
    // If generator is on auto-pilot... check for when it finishes...
    if(generator != null && paused != true){
        selectObj = generator.next().value;
        console.log(selectObj);
        if(selectObj.finished == true){
            generator = null;
            console.log("-STOPPED SIMULATION");
        }
    }
    // If generator is on manual... check for when it finishes...
    else if(generator != null && paused == true){
        if(selectObj.finished == true){
            generator = null;
            console.log("-STOPPED STIMULATION");
        }
    }
    createMenu();
    showBars(selectObj);
}