export const growSnake = (snake: number[][]) => {
    const newSnake = [...snake]
    const head = newSnake[newSnake.length - 1]
    newSnake.push([...head])
    return newSnake
}

export const selfEatSnake = (snake: number[][]) => {
    const newSnake = [...snake]
    const head = newSnake[newSnake.length - 1]

    const collisionIndex = newSnake.slice(0, -1).findIndex(body => {
        return body[0] === head[0] && body[1] === head[1]
    })

    if (collisionIndex !== -1) return newSnake.slice(collisionIndex, -1)

    return newSnake
}