export default function createPokemonCard(pokemon) {
    const pokeCard = document.createElement("div")
    pokeCard.classList.add("poke-card")

    const pokeID = document.createElement("div")
    pokeID.classList.add("poke-id")
    pokeID.textContent = `#${String(pokemon.id).padStart(4, "0")}`

    const favBtn = document.createElement("i")
    favBtn.classList.add("material-icons", "fav-btn")

    const title = document.createElement("div")
    title.classList.add("title")
    title.appendChild(pokeID)
    title.appendChild(favBtn)
    pokeCard.appendChild(title)

    const img = document.createElement("img")
    img.src = pokemon.sprites.front_default
    img.loading = "lazy"
    pokeCard.appendChild(img)

    const name = document.createElement("div")
    name.classList.add("name")
    name.textContent = `${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}`
    pokeCard.appendChild(name)

    const types = document.createElement("div")
    types.classList.add("types")

    pokemon.types.forEach((t) => {
        const type = document.createElement("div")
        type.classList.add("type")
        type.classList.add(`${t.type.name}`)
        type.textContent = t.type.name.toUpperCase()

        types.appendChild(type)
    })

    pokeCard.appendChild(types)

    return pokeCard
}

