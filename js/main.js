import { fetchPokemon, fetchTypes } from "./api.js"
import { favorite, populateFavorites } from "./favorites.js"
import createPokemonCard from "./poke-card.js"

let currentOffset = 0
let totalCount = 0

document.addEventListener("DOMContentLoaded", async () => {
    populateFavorites()

    const [pokemon, count] = await fetchPokemon(currentOffset)
    totalCount = count

    await populateList(pokemon)

    const types = await fetchTypes()
    populateDropdown(types)
})

document.getElementById("search").addEventListener("keyup", () => {
    filter()
})

document.getElementById("types").addEventListener("change", () => {
    filter()
})

document.getElementById("next-page").addEventListener("click", async () => {
    currentOffset += 60
    const [pokemon,] = await fetchPokemon(currentOffset)
    await populateList(pokemon)
})

async function populateList(data) {
    const list = document.getElementById("global-database-content")
    const cc = document.getElementById("current_count")
    const tc = document.getElementById("total_count")

    cc.innerText = currentOffset + 60
    tc.innerText = totalCount

    const promises = []
    data.forEach((p) => {
        promises.push(fetch(p.url).then(r => r.json()))
    })

    const pokemon = await Promise.all(promises)

    pokemon.forEach((p) => {
        const pokeCard = createPokemonCard(p)
        const favoriteButton = pokeCard.getElementsByClassName("fav-btn")[0]

        favoriteButton.textContent = "favorite_border"
        favoriteButton.style.color = "black"
        favoriteButton.addEventListener("click", () => {
            favorite(p)
        })
        favoriteButton.addEventListener("mouseover", () => {
            favoriteButton.textContent = "favorite"
            favoriteButton.style.color = "red"
        })
        favoriteButton.addEventListener("mouseleave", () => {
            favoriteButton.textContent = "favorite_border"
            favoriteButton.style.color = "black"
        })

        list.appendChild(pokeCard)
    })
}

function populateDropdown(types) {
    const dropdown = document.getElementById("types")

    types.forEach((type) => {
        const opt = document.createElement("option")
        opt.value = type.name
        opt.innerText = type.name[0].toUpperCase() + type.name.slice(1)

        dropdown.appendChild(opt)
    })
}

function filter() {
    const pokemon = document.querySelectorAll("#global-database-content .poke-card")
    const input = document.getElementById("search")
    const dropdown = document.getElementById("types")

    pokemon.forEach(poke => {
        const name = poke.getElementsByClassName("name")[0].textContent.toLowerCase()
        let types = []
        poke.getElementsByClassName("types")[0].querySelectorAll(".type").forEach(el => types.push(el.textContent.toLowerCase()))

        if (!name.includes(input.value.toLowerCase()) || (dropdown.value.toLowerCase() != "all" && !types.includes(dropdown.value.toLowerCase()))) {
            poke.style.display = "none"
        } else {
            poke.style.display = ""
        }
    });
}
