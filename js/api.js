export async function fetchPokemon(offset) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=60&offset=${offset}`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`response status: ${response.status}`)
        }

        const result = await response.json()

        return [result.results, result.count]

    } catch (error) {
        console.error(error.message)
    }
}

export async function fetchTypes() {
    const url = "https://pokeapi.co/api/v2/type/?limit=21"

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`response status: ${response.status} `)
        }

        const result = await response.json()

        return result.results

    } catch (error) {
        console.error(error.message)
    }
}