import { GRID_SIZE } from "../const"

export const changeCoord = (matrix: number[][], type: string) => {
    const MAX_INDEX = GRID_SIZE - 1
    const MIN_INDEX = 0

    const newMatrix = matrix.map(row => [...row])

    const headIndex = newMatrix.length - 1
    const head = newMatrix[headIndex]

    if (type === 'right') {
        head[1] = head[1] + 1
    } else if (type === 'left') {
        head[1] = head[1] - 1
    } else if (type === 'down') {
        head[0] = head[0] + 1
    } else if (type === 'up') {
        head[0] = head[0] - 1
    }

    for (let i = headIndex - 1; i >= 0; i--) {
        newMatrix[i] = [...matrix[i + 1]]
    }

    for (let i = 0; i < newMatrix.length; i++) {
        if (newMatrix[i][0] < MIN_INDEX) newMatrix[i][0] = MAX_INDEX
        if (newMatrix[i][0] > MAX_INDEX) newMatrix[i][0] = MIN_INDEX
        if (newMatrix[i][1] < MIN_INDEX) newMatrix[i][1] = MAX_INDEX
        if (newMatrix[i][1] > MAX_INDEX) newMatrix[i][1] = MIN_INDEX
    }

    return newMatrix
}

export const randomCoord = () => Math.trunc(Math.random() * GRID_SIZE)
