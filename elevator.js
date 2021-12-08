
function createInput() {
    let TotalBuildings = document.querySelector("#id_input_building").value

    if (TotalBuildings <= 0) {
        alert("אנא הכנס מספר בניינים גדול מ 0")
    }

    let i = 0;
    while (document.getElementById(`div_build-${i}`)) {
        document.getElementById(`div_build-${i++}`).remove();
    }
    let x = document.createElement("p")
    main.appendChild(x)
    for (let i = 0; i < TotalBuildings; i++) {
        let div_build = document.createElement("div");
        div_build.id = `div_build-${i}`
        div_build.style = "display: inline-block"

        let SeveralFloorsInput = document.createElement("input");
        SeveralFloorsInput.id = `SeveralFloorsInput-${i}`;

        let SeveralFloorsButton = document.createElement("button");
        SeveralFloorsButton.id = `SeveralFloorsButton-${i}`;
        SeveralFloorsButton.innerHTML = `Enter several floors in building ${i + 1}`;
        let queues = {};
        let Orders = [];
        SeveralFloorsButton.onclick = () => { create(i, queues, Orders) }

        main.appendChild(div_build)
        div_build.appendChild(SeveralFloorsInput)
        div_build.appendChild(SeveralFloorsButton)
    }
}

function create(buildingNumber, queues, Orders) {
    if (document.getElementById(`all_site-${buildingNumber}`)) {
        document.getElementById(`all_site-${buildingNumber}`).remove();
    }
    let SeveralF = document.getElementById(`SeveralFloorsInput-${buildingNumber}`).value
    if (SeveralF <= 0) {
        alert("אנא הכנס מספר קומות גדול מ 0")
    }

    createFloors(SeveralF, buildingNumber, queues, Orders)
    createElevator(SeveralF, buildingNumber, queues, Orders)
}


let SeveralElevators = 3
function createFloors(SeveralF, buildingNumber, queues, Orders) {

    let all_site = document.createElement("div");
    all_site.id = `all_site-${buildingNumber}`;

    document.getElementById(`div_build-${buildingNumber}`).appendChild(all_site);

    let floors = document.createElement("div");
    floors.id = `floors-${buildingNumber}`;
    floors.style.float = "left"
    document.getElementById(`all_site-${buildingNumber}`).appendChild(floors);

    for (let i = SeveralF; i > 0; i--) {
        let newDiv = document.createElement("div");
        newDiv.className = "floor";
        newDiv.id = `floor${i}-${buildingNumber}`;
        newDiv.style.height = "103px"
        floors.appendChild(newDiv);

        let time = document.createElement("div");
        time.className = "time";
        time.id = `time${i - 1}-${buildingNumber}`;
        document.getElementById(`floor${i}-${buildingNumber}`).appendChild(time);

        let newBut = document.createElement("button");
        newBut.className = "metal linear";
        newBut.innerHTML = i - 1;
        newBut.id = `button${i - 1}-${buildingNumber}`;

        newBut.onclick = (e) => { fillQueues(e, buildingNumber, queues, Orders) }
        document.getElementById(`floor${i}-${buildingNumber}`).appendChild(newBut);

    }
    document.getElementById(`floor${SeveralF}-${buildingNumber}`).style.borderTop = "none"

}



function createElevator(SeveralF, buildingNumber, queues, Orders) {

    let elevators = document.createElement("div");
    elevators.id = `elevators-${buildingNumber}`;
    elevators.style.float = "right"
    document.getElementById(`all_site-${buildingNumber}`).appendChild(elevators);

    for (let i = 0; i < SeveralElevators; i++) {

        queues[i] = [];
        let newElv = document.createElement("img");
        newElv.id = `elv${i}-${buildingNumber}`
        newElv.src = "elv.png";
        elevators.appendChild(newElv);
        newElv.style.top = (Math.abs(110 * (SeveralF - 1)) - 7) + "px";

    }
    setInterval(() => { qMng(SeveralF, buildingNumber, queues, Orders) }, 500)

}



function fillQueues(e, buildingNumber, queues, Orders) {
    if (Orders.indexOf(Number(e.target.innerText)) === -1) {
        let bestWaiting, bestElevator;
        let len = Object.keys(queues).length;

        for (let i = 0; i < len; i++) {
            let distance = 0.5 * Number(e.target.innerText);
            let waiting = 0;

            if (queues[i].length > 0) {
                waiting = queues[i].at(-1)[1];
                distance = Math.abs(queues[i].at(-1)[0] - Number(e.target.innerText)) * 0.5
            }
            if (bestWaiting == undefined || bestWaiting > distance + waiting) {
                bestWaiting = distance + waiting;
                bestElevator = i;
            }

        }
        Orders.push(Number(e.target.innerText))
        queues[bestElevator].push([e.target.innerText, bestWaiting + 2])
        e.target.style.color = "#b00";
    }
}

function qMng(SeveralF, buildingNumber, queues, Orders) {
    for (let i = 0; i < Object.keys(queues).length; i++) {

        if (queues[i].length > 0 && queues[i][0][1] == 2) {
            song();
        }

        if (queues[i].length > 1 && queues[i][0][1] == 0) {
            document.getElementById(`elv${i}-${buildingNumber}`).style.transition = `top ${queues[i][1][1] - 2}s linear`
            document.getElementById(`elv${i}-${buildingNumber}`).style.top = Math.abs(110 * (SeveralF - 1)) - 7 - (queues[i][1][0]) * 110 + "px"

            let remove = Orders.indexOf(Number(queues[i][0][0]))
            Orders.splice(remove, 1)
            queues[i].shift()
        }

        else if (queues[i].length == 1) {
            document.getElementById(`elv${i}-${buildingNumber}`).style.transition = `top ${queues[i][0][1] - 2}s linear`
            document.getElementById(`elv${i}-${buildingNumber}`).style.top = Math.abs(110 * (SeveralF - 1)) - 7 - (queues[i][0][0]) * 110 + "px"
        }

        for (let j = 0; j < queues[i].length; j++) {

            if (queues[i][j][1] >= 2) {
                document.getElementById(`time${[queues[i][j][0]]}-${buildingNumber}`).innerHTML = (queues[i][j][1] - 2);
            }
            if (queues[i][j][1] < 2) {
                document.getElementById(`time${[queues[i][j][0]]}-${buildingNumber}`).innerHTML = "";
                document.getElementById(`button${[queues[i][j][0]]}-${buildingNumber}`).style.color = "";
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


