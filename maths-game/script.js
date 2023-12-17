let pages = document.querySelectorAll(".page");
function OpenPage(number) {
    for (let i = 0 ; i < pages.length ; i++) {
        if (i === parseInt(number)) {
            pages[i].style.display = "block";
        } else {
            pages[i].style.display = "none";
        }
    }
}

let score;
let score_div = document.getElementById("score");

let time;
let time_div = document.getElementById("seconds_remaining");

let buttons = document.querySelectorAll(".control_button");
buttons[0].disabled = false;
buttons[1].disabled = true;

let first_number_div = document.getElementById("first_number");
let second_number_div = document.getElementById("second_number");
let answer_input = document.getElementById("answer_input");

let playing = false;
let interval;

let modes_list;
let scores = [];
function Start() {
    playing = true;
    
    answer_input.focus();
    ClearInput();
    
    time = 59;
    time_div.innerHTML = time;
    
    score = 0;
    score_div.innerHTML = score;
    
    buttons[0].disabled = true;
    buttons[1].disabled = false;
    
    modes_list = SetModes();
    GenerateQuestion();
    
    interval = setInterval(function() {
        time_div.innerHTML = time;
        
        if (--time < 0) {
            Stop();
        }
    }, 1000);
}

let first_number, second_number, answer;

let min = 1;
let max = 12;

function GenerateQuestion() {
    first_number = RandomInteger(min, max);
    second_number = RandomInteger(min, max);
    
    let random_mode = modes_list[Math.floor(Math.random() * modes_list.length)];
    
    answer = random_mode == "plus"  ? first_number + second_number :
             random_mode == "minus" ? first_number - second_number :
             random_mode == "times" ? first_number * second_number :
             first_number;
    if (random_mode == "divide") {
        first_number = first_number * second_number;
    }
    
    let operator = document.getElementById("operator");
    operator.innerHTML = random_mode == "plus"   ? "+" :
                         random_mode == "minus"  ? "-" :
                         random_mode == "times"  ? "&times;":
                         "&divide;";
    
    first_number_div.innerHTML = first_number;
    second_number_div.innerHTML = second_number;
    
    answer_input.addEventListener("input", function() {
        if ((parseInt(answer_input.value) === parseInt(answer)) && (playing === true)) {
            score += 1;
            score_div.innerHTML = score;
            
            ClearInput();
            
            GenerateQuestion();
        }
    });
}

function RandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function ClearInput() {
    answer_input.value = "";
}

function Stop() {
    clearInterval(interval);
    
    first_number_div.innerHTML = "Time";
    second_number_div.innerHTML = "Up";
    
    playing = false;
    
    ClearInput();
    
    buttons[0].disabled = false;
    buttons[1].disabled = true;
    
    let today = new Date();
    
    let year = today.getFullYear();
    let month = today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
    let day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    let hour = today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
    let minute = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    let second = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
    
    let date = year + "-" + month + "-" + day + " at " + hour + ":" + minute + ":" + second;
    
    let leaderboard_mode_list = modes_list.join(" | ");
    
    let next_score = new Score(date, score, leaderboard_mode_list, min, max);
    scores.push(next_score);
    UpdateLeaderboard(scores);
}

function ChangeMin() {
    let min_input = document.getElementById("min_number").value;
    min = min_input;
}
function ChangeMax() {
    let max_input = document.getElementById("max_number").value;
    max = max_input;
}

function SetModes() {
    let checkboxes = document.getElementsByClassName("checkbox");
    let checked = [];
    for (let i = 0 ; i < checkboxes.length ; i++) {
        if (checkboxes[i].checked == true) {
            checked.push(checkboxes[i].value);
        }
    }
    return checked;
}

function Score(date, score, operations, min, max) {
    this.date = date;
    this.score = score;
    this.operations = operations;
    this.min = min;
    this.max = max;
}

function UpdateLeaderboard(scores) {
    scores.sort((first, second) => second.score - first.score);
    let top_ten_scores = scores.slice(0, 10);
    
    let table = document.getElementById("stats_table");
    let table_row_count = table.rows.length;
    
    if (table_row_count > 1) {
        for (let i = 1 ; i < table_row_count ; i++) {
            table.deleteRow(1);
        }
    }
    
    for (let i = 1 ; i < top_ten_scores.length + 1; i++) {
        let new_row = table.insertRow(i);
        
        let new_column = [];
        new_column.push(scores[i - 1].date, scores[i - 1].score, scores[i - 1].operations, scores[i - 1].min, scores[i - 1].max)
        
        for (let j = 0 ; j < 5 ; j++) {
            let new_cell = new_row.insertCell(j);
            new_cell.innerHTML = new_column[j];
        }
    }
}

/*
Ability to choose negative numbers
Shop
Setting to remove negative answers
Seperate leaderboard for variants (?)
Replace operations text with symbol
More stats => average speed, total correct, total incorrect
Improve CSS
*/
