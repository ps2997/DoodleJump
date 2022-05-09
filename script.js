document.addEventListener('DOMContentLoaded', () => {   // After all the HTML content is loaded
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');  // Creates a div element doodler
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 4;    
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;  // To check if the doodle is jumping or not (so that we dont jump in the middle of a jump)
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let RightTimerId;
    let score = 0;



    function createDoodler()
    {
        grid.appendChild(doodler)   // div 'doodler' is placed inside the div grid (child of grid)
        doodler.classList.add('doodler') // Adds the CSS class 'doodler' to the div 'doodeler'
        // doodler.style.left =  '50'         +   'px' 
        doodlerLeftSpace = platforms[0].left   // doodler starts on top of platform 1(bottom most)
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }


    class Platform
    {

        constructor(newPlatBottom)
        {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315 // will return a value b/w 0 - 315 (315 because the widht of the grid is 400 and of the platform is 85 so (400-85))
            this.visual = document.createElement('div') // Create a div for each platform

            const visual = this.visual
            visual.classList.add('platform')   // CSS class 'platform' to visual
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)   // child of grid
        }
    }


    function createPlatforms()
    {
        for(let i=0; i<platformCount; i++)
        {
            let platGap = 600 / platformCount // so that there is even spacing b/w the platforms (600 is the height of the grid)
            let newPlatBottom = 100 + i*platGap   // To increment the gap
            let newPlatform = new Platform(newPlatBottom)  // class 'Platform'
            platforms.push(newPlatform)
            console.log(platforms);
        }
         
    }



    function movePlatforms()
    { 
        if(doodlerBottomSpace>200)
        {
            platforms.forEach(platform => {
               platform.bottom -= 4        // reduces the value of each platform
               let visual = platform.visual     //  visual = every platforms 'visual' (in the class Platforms)
               visual.style.bottom = platform.bottom + 'px'  // the reduction is done by this line 

               if(platform.bottom < 10){
                   let firstPlatform = platforms[0].visual  // grabs the first element of the array
                   firstPlatform.classList.remove('platform') // visually removes the platform
                   platforms.shift()  // actually removes the platform
                   score++;
                   console.log(platforms);

                   let newPlatform = new Platform(600) // 600 because it is the height of the grid and we want he platform to be added from the top

                   platforms.push(newPlatform) // newPlatform is 'appended' to the array

               }

            })
        }
        


    }



    


    function jump()
    {
        clearInterval(downTimerId) 
        isJumping = true  // The doodler is jumping
        upTimerId = setInterval(function() {
            doodlerBottomSpace += 20      // For the doodler to jump
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200)   // If the doodler's heights goes above 350 then call the 'fall()' function (as start point is 150 at the beginning)
            {
                fall()   // When doodle goes over 350 px then the doodle goes down (downTimerId)
            }

            

        }, 30)
        

    }




    function fall()
    {
        clearInterval(upTimerId)  // clear the uptimerId 
        isJumping = false // doodler is not jumping

        downTimerId = setInterval( function() {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
        

        console.log("hi");
        if(doodlerBottomSpace <= 0)
        {
            GameOver()
            console.log("Check game over");
        }

       platforms.forEach(platform => {         // checking for each platform
           if( // to check if the doodler has landed on the platform or not
               (doodlerBottomSpace >= platform.bottom) && 
               (doodlerBottomSpace <= platform.bottom + 15) && // 15 is the height of the platform
               ((doodlerLeftSpace + 60) >= platform.left) && // 60 is the width of the doodler
               (doodlerLeftSpace <= (platform.left + 85))  && //85 is the width of the platform
               !isJumping
           ){
               console.log("Landed");
               startPoint = doodlerBottomSpace; // start point is reset to the doodlerBottom space value
               jump();
           }
       })
       


    },30)

      
    }




    function GameOver()
    {
        console.log("Game over");
        isGameOver = true         // isGameOver functions stops running in the "start()" function 

        while(grid.firstChild) {  // if the firstChild of the child exists
            grid.removeChild(grid.firstChild)  // then remove the first child
        }   // doing this because the doodler was glitching at the game over interval, so we basically remove the doodler if it reaches the bottom

        grid.innerHTML = score 
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(RightTimerId)

    }
    

    function control(e)       // for keyboard control (e is the event)
    {
        if(e.key === "ArrowLeft")
        {
            MoveLeft()
        }

        else if(e.key === "ArrowRight")
        {
            MoveRight()
        }

        else if(e.key === "ArrowUp")
        {
            MoveStraight()
        }
    }



    function MoveLeft()
    {
        
        if(isGoingRight)  // Basically to clear the move left function
        {
            clearInterval(RightTimerId);
            isGoingRight = false;
        }

        isGoingLeft = true;
        leftTimerId = setInterval( function()  {
            if(doodlerLeftSpace>=0){  // So that the doodler does not go outside the grid

                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }
            else MoveRight()
        },20)

    }



    function MoveRight()
    {
        if(isGoingLeft)  // Basically to clear the move left function
        {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }

        isGoingRight = true
        RightTimerId = setInterval( function ()  {
            if(doodlerLeftSpace <= 313)  // 313 because 400 - 313 = 340 (87 is the width of the doodler)
          {
            doodlerLeftSpace += 5
            doodler.style.left = doodlerLeftSpace + 'px'
          } else MoveLeft()

        },20)

    }



    

    function MoveStraight()    // Removes all the events generated by the 'MoveLeft()' and 'MoveRight()' 
    {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(RightTimerId)
    }


    function start()
    {
        if(!isGameOver)               // when is GameOver is false then run the following if statement, which is 'create a doodler'
        {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms,30)  
            jump()  
            document.addEventListener('keyup', control)  
        
        }
    }
    // attach a button to the function

    start()
    
    
    



})