import { randomIntFromInterval } from './utils';

export const newBoard = async (rows, columns, owner) => {
    let board = {
        grid: {},
        properties: {}
    }
    if (rows === columns) {
        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= columns; j++) {
                let gridValue = `${i},${j}`;
                board.grid[gridValue] = false
            }
        }
        board.properties['rows'] = rows
        board.properties['columns'] = columns
        board.properties['boats'] = []
        board.properties['owner'] = owner
    } else {
        return null
    }
    return board
}

export const newBoat = async (size, name, board) => {
    let boat = {}
    if (board.properties.rows < size || board.properties.columns < size) {
        //console.log('This Boat is too big for the board')
    }
    else {
        boat['name'] = name
        boat['size'] = size
        boat['position'] = []
        boat['state'] = 'afloat'
    }
    return boat
}

export const checkBoatSuperposition = async (rowLoc, columnLoc, layout, boat, board) => {
    if (layout == "vertical") {
        if (board.properties.rows - rowLoc >= boat.size) {
            //set the boat descending from the point where it was randomly set
            for (let i = 0; i < boat.size; i++) {
                let gridPosition = `${rowLoc + i},${columnLoc}`
                if (board.grid[gridPosition] == true) {
                    return false
                }
            }
        } else if (board.properties.rows - rowLoc <= boat.size) {
            //set the boat ascending from the point it was randomly set
            for (let i = 0; i < boat.size; i++) {
                let gridPosition = `${rowLoc - i},${columnLoc}`
                if (board.grid[gridPosition] == true) {
                    return false
                }
            }
        }
    } else {
        if (board.properties.columns - columnLoc >= boat.size) {
            //set the boat left to right from the point where it was randomly set
            for (let i = 0; i < boat.size; i++) {
                let gridPosition = `${rowLoc},${columnLoc + i}`
                if (board.grid[gridPosition] == true) {
                    return false
                }
            }
        } else if (board.properties.columns - columnLoc <= boat.size) {
            //set the boat right to left from the point it was randomly set
            for (let i = 0; i < boat.size; i++) {
                let gridPosition = `${rowLoc},${columnLoc - i}`
                if (board.grid[gridPosition] == true) {
                    return false
                }
            }
        }
    }
    return true
}

// TODO - Keep an in-memory record of the positions occupied by the boats so we are not gussing infinitely
export const randomiseBoatLocation = async (boat, board) => {
    let layout
    let x = (Math.floor(Math.random() * 2) == 0);
    if (x) {
        layout = "vertical";
    } else {
        layout = "horizontal";
    }

    let rowLoc = await randomIntFromInterval(1, board.properties.rows)
    let columnLoc = await randomIntFromInterval(1, board.properties.columns)
    board = await setBoatLocation(rowLoc, columnLoc, layout, boat, board, randomiseBoatLocation)

    return board
}

// TODO - Boat wont fit in this location
export const setBoatLocation = async (rowLoc, columnLoc, layout, boat, board, randomiserFunction) => {
    if (await checkBoatSuperposition(rowLoc, columnLoc, layout, boat, board)) {
        if (boat.position.length < boat.size) {
            if (layout == "vertical") {
                if (board.properties.rows - rowLoc >= boat.size) {
                    //set the boat descending from the point where it was randomly set
                    for (let i = 0; i < boat.size; i++) {
                        let gridPosition = `${rowLoc + i},${columnLoc}`
                        board.grid[gridPosition] = true
                        boat.position.push({ location: gridPosition, state: null })
                    }
                } else if (board.properties.rows - rowLoc < boat.size) {
                    //set the boat ascending from the point it was randomly set
                    for (let i = 0; i < boat.size; i++) {
                        let gridPosition = `${rowLoc - i},${columnLoc}`
                        board.grid[gridPosition] = true
                        boat.position.push({ location: gridPosition, state: null })
                    }
                }
            } else {
                if (board.properties.columns - columnLoc >= boat.size) {
                    //set the boat left to right from the point where it was randomly set
                    for (let i = 0; i < boat.size; i++) {
                        let gridPosition = `${rowLoc},${columnLoc + i}`
                        board.grid[gridPosition] = true
                        boat.position.push({ location: gridPosition, state: null })
                    }
                } else if (board.properties.columns - columnLoc <= boat.size) {
                    //set the boat right to left from the point it was randomly set
                    for (let i = 0; i < boat.size; i++) {
                        let gridPosition = `${rowLoc},${columnLoc - i}`
                        board.grid[gridPosition] = true
                        boat.position.push({ location: gridPosition, state: null })
                    }
                }
            }
            board.properties.boats.push(boat)
        } else {
            // console.log("This Boat is already positioned")
        }
    } else {
        if (randomiserFunction) {
            await randomiserFunction(boat, board)
        } else {
            // console.log("This position in the grid has already been taken")
        }
    }
    return board
}

export const turnControl = async (user) => {
    // turnProofs = [aliceSignatureProof, bobSignatureProof]
    // verify proof with sender of verification
    // generate a new proof with the other persons name
    // aliceSignatureProof
    // bobSignatureProof
    // currentTurn = aliceSignatureProof
    // verify == true
    // if currentTurn==aliceSignatureProof{currentTurn = bobSignatureProof}else{currentTurn = aliceSignatureProof}
}

// Generating proofs exclusively to verify a correct set up
export const baselineSetUp = async (board) => {
    // Single hash proof with the struct:
    //
    // initGame = {
    //    boardSize=2,2
    //    numberOfBoats=1
    //    sizeOfBoats=[]
    // }
    // 
    // Alice will generate a proof with the content above and bob will verify it, if they both agree they can submit it onchain?
    //
    // The size of the board (size of board and owner) 1 per board 
    // The number of boats on the board (number of boats, board, and owner) 1 per board
    // The size of the boat (size of the boat and board and owner)  1 per boat
}

export const gridProofs = async (board) => {
    // Generate a proof for each coordinate to know whether it contains a ship or not
    // Iterate throught the board.grid and generate a proof for water or ship at that location
    // Alice would take her board and iterate through the grid
    // let aliceProofArray= []
    // for(board.properties.rows){
    //     for(board.properties.columns){
    //         if(board.grid[row,column]==false)
    //             aliceProofArray.push(`${row},${column}`: generate coordinateProof state = water)
    //         else{
    //             aliceProofArray.push(`${row},${column}`: generate coordinateProof state = boat)
    //         }
    //     }
    // }
    //
    // Single hash proof with the struct:
    // coordinateProof = {
    //     row:1
    //     column:1
    //     state: 'hit'
    // }
    //
    // return proofArray
}

// we are passing our own board here
// TODO- request the opponent proof for coordinate through NATS
export const launchMisile = async (rowLoc, columnLoc, board) => {
    if (turnControl(board.owner)) {
        // Build hash
        // Request proof from Counterpart
        // requesOpponentProof(rowloc,columnLoc)
        // pass the proof and the hash to verify proof
        // if proof is verified keep track as hit other wise verify with miss
    }
}

export const checkGame = async (board) => {
    // Generate a proof for all coordinates containing a ship
    // Alice would take her board and iterate through the grid
    // let aliceProofArray= []
    // for(board.properties.rows){
    //     for(board.properties.columns){
    //         if(board.grid[row,column]==true)
    //            boatLocations.push(`${row},${column}`)
    //     }
    //  generate aliceGameProof
    // }
    //
    // Single hash proof with the struct:
    // gameProof = {
    //     boatCoordinates: boatLocations
    // }
    //
    // return proofArray
}

// Create a circuit
// circuit = await getApp().deployBaselineCircuit('mimc', `battleLineGrid${}`);

// Generate a Proof
// call proveBaselineCircuit with circuit ID... and store whats returned which is a proof

// Verify
// call verifyBaselineProof with circuit ID... and store whats returned which is a result