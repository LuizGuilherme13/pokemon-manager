import createPokemonCard from "./poke-card.js"

export function populateFavorites() {
    const myFavorites = document.getElementById("my-favorites-content")
    myFavorites.innerHTML = ""

    const data = JSON.parse(localStorage.getItem("favorites")) || []
    const favorites = new Map(data)

    favorites.forEach((pokemon, key) => {
        const pokeCard = createPokemonCard(pokemon)
        const favoriteButton = pokeCard.getElementsByClassName("fav-btn")[0]

        favoriteButton.textContent = "favorite"
        favoriteButton.style.color = "red"
        favoriteButton.addEventListener("click", () => {
            unfavorite(key)
        })
        favoriteButton.addEventListener("mouseover", () => {
            favoriteButton.textContent = "favorite_border"
            favoriteButton.style.color = "black"
        })
        favoriteButton.addEventListener("mouseleave", () => {
            favoriteButton.textContent = "favorite"
            favoriteButton.style.color = "red"
        })

        myFavorites.appendChild(pokeCard)
    })
}

export function getFavorites() {
    const data = JSON.parse(localStorage.getItem("favorites")) || []

    return new Map(data)
}

export function favorite(pokemon) {
    const favorites = getFavorites()

    favorites.set(pokemon.name, pokemon)

    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)))

    populateFavorites()
}

export function unfavorite(pokemon) {
    const favorites = getFavorites()

    favorites.delete(pokemon)

    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)))

    populateFavorites()
}
