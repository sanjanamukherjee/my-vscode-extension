<script lang="ts">
  import { onMount } from "svelte";

    let userHH = 0;
    let userMM = 0;
    let userSS = 0;

    var timeElapsed = 0;
    var timeTotal = 0;
    var timeRemaining = 0;
    var interval: any;

    var pause = false;
    var start = false;

    var keyCount = 0;
    let displayTime = "00:00:00";

    let todos: Array<{text: string, completed: boolean}> = [];
    let todoText = "";

    onMount(() => {
        console.log('mounted');
        window.addEventListener('message', (e)=>{
            e.preventDefault();
            let msg = e.data;
            switch(msg.type){
                case 'onUpdateKeystrokeCount':
                    console.log('onUpdateKeystrokeCount data - ', msg.value);
                    if (timeRemaining > 0) {
                        keyCount++;
                    }
                    break;
            }
            // console.log('onUpdateKeystrokeCount data - ', e.data);
            });
    });

    function startTimer() {
        keyCount = 0;
        start = true;
        timeTotal = userHH * 3600 + userMM * 60 + userSS;
        timeRemaining = timeTotal;
        interval = setInterval(() => {
            timeElapsed++;
            timeRemaining--;
            if (timeElapsed > timeTotal) {
                clearInterval(interval);
                timeElapsed = 0;
                timeTotal = 0;
                timeRemaining = 0;
            }
            // drawPie();
            updateDisplayTime();
        }, 1000);
    }

    function updateDisplayTime() {
        let hours = Math.floor(timeRemaining / 3600);
        let minutes = Math.floor((timeRemaining % 3600) / 60);
        let seconds = timeRemaining % 60;
        displayTime = `${hours}:${minutes}:${seconds}`;
    }

    function pauseTimer() {
        clearInterval(interval);
    }

    function resumeTimer() {
        if (timeElapsed >= timeTotal) {
                clearInterval(interval);
        }
        else{
            interval = setInterval(() => {
            timeElapsed++;
            timeRemaining--;
            if (timeElapsed >= timeTotal) {
                clearInterval(interval);
            }
        updateDisplayTime();
        }, 1000);
        }
        
    }

    function stopTimer() {
        clearInterval(interval);
        timeElapsed = 0;
        timeTotal = 0;
        timeRemaining = 0;
        // drawPie();
        updateDisplayTime();
    }

    function handleRemove(i: number) {
        todos = todos.filter((_, index) => index !== i);
    }



    // function drawPie() {
    //     var canvas = document.createElement('canvas');
    //     canvas.width = 100;
    //     canvas.height = 100;
    //     var ctx = canvas.getContext('2d');
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     ctx.beginPath();
    //     ctx.moveTo(50, 50);
    //     ctx.arc(50, 50, 50, 0, 2 * Math.PI * (timeElapsed / timeTotal));
    //     ctx.fillStyle = '#007acc';
    //     ctx.fill();
    //     document.querySelector('.pie').innerHTML = '';
    //     document.querySelector('.pie').appendChild(canvas);
    // }

</script>

<style>
    div {
        /* background-color: #aeece9; */
        /* padding: 20px; */
        font-family: monospace;
        margin: 10px 0;
        color: whitesmoke;
    }
    .setTimer {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
    .button-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
    .time-input {
        width: 50px;
        height: 30px;
        margin: 0 10px;
        text-align: center;
    }

    .timer-btn {
        width: 100px;
        height: 30px;
        margin: 10px;
        color: whitesmoke;
        border: none;
        border-radius: 5px;
    }

    .progress-bar {
        width: 100%;
        height: 30px;
        background-color: #f2f2f2;
        position: relative;
    }

    .progress{
        height: 100%;
        background-color: #007acc;
        color: #1dbb64;
    }

    .input-box{
        height: 30px;
        align-self: center;
        /* margin: 20px; */
        border: #f2f2f2 1px solid;
        overflow: scroll;
        /* background-image: url("../../media/refresh.svg"); */
    }

    .checkbox-container{
        display: flex;
        align-items: center;
    }
    input[type="checkbox"] {
        margin-right: 10px; /* Adjust as needed */
    }

    .custom-button {
        margin-top: 20px;
        width: 150px;
        border-radius: 5px;
        cursor: pointer;
        background: none;
        color: #007acc;
        font-size: small;
        border: solid 1px #007acc;
    }

    .cancelButton {
        cursor: pointer;
        /* background-color: #ff0000; */
        background: none;
        color: #ff0000;
        border: none;
        /* border-radius: 5px; */
        margin-left: 10px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
    }
    /* .canvas {
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    } */
</style>
<div>Set Your Timer : </div>
<div class="setTimer">
    <input class="time-input" type="number" min="0" max="23" bind:value={userHH} />:
    <input class="time-input" type="number" min="0" max="59" bind:value={userMM} />:
    <input class="time-input" type="number" min="0" max="59" bind:value={userSS} />
</div>


<div class="button-section">
{#if timeRemaining==0}
<button class="timer-btn" on:click={() => {
    console.log('start timer', userHH, userMM, userSS);
    startTimer();   
}}>Start Timer</button>
{/if}

{#if pause&&timeRemaining>0}
    <button class="timer-btn" style="background-color: #1dbb64;" on:click={() => {
        console.log('resume timer', timeRemaining, timeElapsed, timeTotal);
        resumeTimer();
        pause = false;
    }}>Resume</button>
{/if}

{#if !pause&&timeRemaining>0}
<button class="timer-btn" style="background-color: #ffa600;" on:click={() => {
        console.log('pause timer', timeRemaining, timeElapsed, timeTotal);
        pauseTimer();
        pause = true;
}}>Pause Timer</button>
{/if}

<button class="timer-btn" style="background-color: brown;" on:click={() => {
    console.log('stop timer', timeRemaining, timeElapsed, timeTotal);
    pause = false;
    stopTimer();
}}>Stop Timer</button>
</div>
<!-- when we press start timer, we draw a pie showing the time lapsed-->
<!-- <div class="pie">
    <canvas width="100" height="100"></canvas>
</div> -->

{#if start==true}
<div class="time-remaining">Total Time Set : {userHH}h {userMM}m {userSS}s</div>
<div class="progress-bar">
    <div class="progress" style="width: {timeElapsed / timeTotal * 100}%"></div>
</div>

    <div class="time-remaining">Time remaining - <span style="color: #ff0000; font-size: 26px">{timeRemaining>0? displayTime:"Timer has Stopped"}</span></div>
    
{/if}
<span style="font-family: monospace;">What do you want to accomplish in this time?</span>
    <form on:submit={(e)=>{
        e.preventDefault();
        todos = [...todos, {text: todoText, completed: false}];
        todoText = "";
    }}><input class= "input-box" bind:value={todoText}/></form>

    <button class="custom-button" on:click={()=>{todos= []}}>Clear All Todos </button>

    <div style="display: flex; flex-direction: column;">
        {#each todos as todo, i}
        <div class="checkbox-container">
            <input type="checkbox" bind:checked={todo.completed} on:change={()=>{!todo.completed}}>
            <label for="checkbox">{todo.text}</label>
            <button class="cancelButton" on:click={() => handleRemove(i)}>x</button>
        </div>
        
        {/each}
    </div>
{#if start==true && timeRemaining==0}
<div><span style="color: #1dbb64;">Keystroke count :</span> {keyCount}</div>
{/if}



