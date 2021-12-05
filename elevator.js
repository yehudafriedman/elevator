
function create() {
    let w = document.querySelector("#id_input_building").value
    for (let i = 0; i < w; i++) {
        let queues = {};
        let Orders = [];
        createFloors(i, queues, Orders)
        createElevator(i, queues, Orders)
    }

}

let SeveralFloors = 20
let SeveralElevators = 5
function createFloors(bildingNumber, queues, Orders) {

    let all_site = document.createElement("div");
    all_site.id = `all_site-${bildingNumber}`;
    all_site.style.display = "inline-block";
    main.appendChild(all_site);

    let floors = document.createElement("div");
    floors.id = `floors-${bildingNumber}`;
    floors.style.float = "left"
    document.getElementById(`all_site-${bildingNumber}`).appendChild(floors);

    for (let i = SeveralFloors; i > 0; i--) {
        let newDiv = document.createElement("div");
        newDiv.className = "floor";
        newDiv.id = `floor${i}-${bildingNumber}`;
        newDiv.style.height = "103px"
        floors.appendChild(newDiv);

        let tymer = document.createElement("div");
        tymer.className = "tymer";
        tymer.id = `tymer${i - 1}-${bildingNumber}`;
        document.getElementById(`floor${i}-${bildingNumber}`).appendChild(tymer);

        let newBut = document.createElement("button");
        newBut.className = "metal linear";
        newBut.innerHTML = i - 1;
        newBut.id = `button${i - 1}-${bildingNumber}`;

        newBut.onclick = (e) => { fillQueues(e, bildingNumber, queues, Orders) }
        document.getElementById(`floor${i}-${bildingNumber}`).appendChild(newBut);

    }
    document.getElementById(`floor${SeveralFloors}-${bildingNumber}`).style.borderTop = "none"

}



function createElevator(bildingNumber, queues, Orders) {

    let elevators = document.createElement("div");
    elevators.id = `elevators-${bildingNumber}`;
    elevators.style.float = "right"
    // elevators.style.top=" 0px"
    document.getElementById(`all_site-${bildingNumber}`).appendChild(elevators);

    for (let i = 0; i < SeveralElevators; i++) {

        queues[i] = [];
        let newElv = document.createElement("img");
        newElv.id = `elv${i}-${bildingNumber}`
        newElv.src = "elv.png";
        elevators.appendChild(newElv);
        newElv.style.top = (Math.abs(110 * (SeveralFloors - 1)) - 7) + "px";

    }
    setInterval(() => { qMng(bildingNumber, queues, Orders) }, 500)

}



function fillQueues(e, bildingNumber, queues, Orders) {
    if (Orders.indexOf(Number(e.target.innerText)) === -1) {
        let bestWaiting, bestElevator;
        let len = Object.keys(queues).length;

        for (let i = 0; i < len; i++) {
            let distens = 0.5 * Number(e.target.innerText);
            let waiting = 0;

            if (queues[i].length > 0) {
                waiting = queues[i].at(-1)[1];
                distens = Math.abs(queues[i].at(-1)[0] - Number(e.target.innerText)) * 0.5
            }
            if (bestWaiting == undefined || bestWaiting > distens + waiting) {
                bestWaiting = distens + waiting;
                bestElevator = i;
            }

        }
        Orders.push(Number(e.target.innerText))
        queues[bestElevator].push([e.target.innerText, bestWaiting + 2])
        e.target.style.color = "#b00";
        // document.getElementById(`button${[e.target.innerText]}`).style.color = "#b00";
    }
}

function qMng(bildingNumber, queues, Orders) {
    for (let i = 0; i < Object.keys(queues).length; i++) {

        if (queues[i].length > 0 && queues[i][0][1] == 2) {
            song();
        }

        if (queues[i].length > 1 && queues[i][0][1] == 0) {
            document.getElementById(`elv${i}-${bildingNumber}`).style.transition = `top ${queues[i][1][1] - 2}s linear`
            document.getElementById(`elv${i}-${bildingNumber}`).style.top = Math.abs(110 * (SeveralFloors - 1)) - 7 - (queues[i][1][0]) * 110 + "px"
 
            let remove = Orders.indexOf(Number(queues[i][0][0]))
            Orders.splice(remove, 1)
            queues[i].shift()
        }

        else if (queues[i].length == 1) {
            document.getElementById(`elv${i}-${bildingNumber}`).style.transition = `top ${queues[i][0][1] - 2}s linear`
            document.getElementById(`elv${i}-${bildingNumber}`).style.top = Math.abs(110 * (SeveralFloors - 1)) - 7 - (queues[i][0][0]) * 110 + "px"
        }

        for (let j = 0; j < queues[i].length; j++) {

            if (queues[i][j][1] >= 2) {
                document.getElementById(`tymer${[queues[i][j][0]]}-${bildingNumber}`).innerHTML = (queues[i][j][1] - 2);
            }
            if (queues[i][j][1] < 2) {
                document.getElementById(`tymer${[queues[i][j][0]]}-${bildingNumber}`).innerHTML = "";
                document.getElementById(`button${[queues[i][j][0]]}-${bildingNumber}`).style.color = "";
            }
            if (queues[i][j][1] > 0) {
                queues[i][j][1] = queues[i][j][1] - 0.5;
            }
        }
    }


}

function song() {
    let audio = new Audio();
    audio.src = 'ding.mp3';
    audio.play()
}


