<script lang="ts">
    let userHH = 0;
    let userMM = 0;
    let userSS = 0;

    var timeElapsed = 0;
    var timeTotal = 0;
    var timeRemaining = 0;
    var interval: any;

    var pause = false;
    var start = false;

    function startTimer() {
        start = true;
        timeTotal = userHH * 3600 + userMM * 60 + userSS;
        timeRemaining = timeTotal;
        interval = setInterval(() => {
            timeElapsed++;
            timeRemaining--;
            if (timeElapsed >= timeTotal) {
                clearInterval(interval);
            }
            // drawPie();
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(interval);
        pause = true;
    }

    function resumeTimer() {
        pause = false;
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
        }, 1000);
        }
        
    }

    function stopTimer() {
        clearInterval(interval);
        timeElapsed = 0;
        timeTotal = 0;
        timeRemaining = 0;
        // drawPie();
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
    input {
        width: 50px;
        height: 30px;
        margin: 0 10px;
        text-align: center;
    }

    button {
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
    <input type="number" min="0" max="23" bind:value={userHH} />:
    <input type="number" min="0" max="59" bind:value={userMM} />:
    <input type="number" min="0" max="59" bind:value={userSS} />
</div>
<div class="button-section">
<button on:click={() => {
    console.log('start timer', userHH, userMM, userSS);
    startTimer();   
}}>Start Timer</button>

{#if pause}
    <button style="background-color: #1dbb64;" on:click={() => {
        console.log('resume timer', timeRemaining, timeElapsed, timeTotal);
        resumeTimer();
    }}>Resume</button>
{/if}

{#if !pause}
<button style="background-color: #ffa600;" on:click={() => {
        console.log('pause timer', timeRemaining, timeElapsed, timeTotal);
        pauseTimer();
}}>Pause Timer</button>
{/if}

<button style="background-color: brown;" on:click={() => {
    console.log('stop timer', timeRemaining, timeElapsed, timeTotal);
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
    <div class="time-remaining">Time Remaining : {timeRemaining>0? timeRemaining:"Timer has Stopped"}</div>
</div> 
{/if}
