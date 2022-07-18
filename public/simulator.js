/* eslint-disable no-restricted-globals */


let loopId = 0
let loopTimer
let speed = 1
let isPlay = true

const InitData = {
    length: 200,
    gravity: 9.8,
    angle: Math.PI / 4,
    weight: 100,
    
    origin: [0, -5],
}

const data = {
    length: InitData.length,
    gravity: InitData.gravity,
    weight: InitData.weight,

    angle: Math.PI / 4,
    angularVelocity: 0,
    angularAcceleration: 0,

    origin: InitData.origin,

    vector: [
      InitData.length * Math.sin(InitData.angle) + InitData.origin[0],
      InitData.length * Math.cos(InitData.angle) + InitData.origin[1] + 5,
    ]
}

let beforeAngularAcceleration = -1
let beforeTime = new Date()
let lastLoopId = 0
let lastCenterLoopId = 0
function simulationLoop() {
    loopId++

    // 계산
    data.angularAcceleration = -1 * data.gravity / 10 / data.length * Math.sin(data.angle);
    data.angularVelocity += data.angularAcceleration;
    data.angle += data.angularVelocity;
    data.vector = [
      data.length * Math.sin(data.angle) + data.origin[0],
      data.length * Math.cos(data.angle) + data.origin[1] + 5,
    ];

    if (data.angularAcceleration * beforeAngularAcceleration < 0 && lastLoopId !== loopId) {
        const now = new Date()
        const time = now - beforeTime
        
        self.postMessage({code: 'center', data: {
            time, 
            loopDiff: loopId - lastCenterLoopId
        }})
        
        lastLoopId = loopId
        beforeTime = now
        lastCenterLoopId= loopId
    } 

    beforeAngularAcceleration = data.angularAcceleration

    self.postMessage({code: 'result', data: {
        loopId,
        data
    }})
}

let updateRateCount = 0
let updateRateStartTime = new Date()
const loop = () => {
    if (updateRateCount === 0) updateRateStartTime = new Date()

    isPlay && simulationLoop()
    updateRateCount++ 

    if (updateRateCount === 60) {
        updateRateCount = 0
        const updateRate = Math.round(60 / (new Date() - updateRateStartTime) * 1000)
        self.postMessage({code: 'ups', data: updateRate})
    }
}

const reset = () => {
    data.angle =  Math.PI / 4
    data.angularAcceleration = 0
    data.angularVelocity = 0

    loopId = 0
    loopTimer && clearInterval(loopTimer)
    loopTimer = setInterval(loop, 16.6)
}
reset()

// IO
self.addEventListener('message', event => {
    switch (event.data.code) {
        case 'ping':
            reset()
            self.postMessage({code: 'pong'})
            break

        case 'pause':
            isPlay = false
            break

        case 'play':
            isPlay = true
            break

        case 'reset':
            reset()
            break

        case 'updateGravity':
            data.gravity = event.data.data
            break

        case 'updateLength':
            data.length = event.data.data
            break

        case 'updateWeight':
            data.weight = event.data.data
            break

        default:
            console.error(`Wrong Command: '${event.data.code}' `)
    }
})
