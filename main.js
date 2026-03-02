document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem("current_count", 0)

    fetchPokemon()
    getTypes()
    loadFavorites()
})

document.getElementById("search").addEventListener("keyup", () => {
    filter()
})

document.getElementById("types").addEventListener("change", () => {
    filter()
})

async function fetchPokemon() {
    const currentCount = localStorage.getItem("current_count")

    const url = `https://pokeapi.co/api/v2/pokemon?limit=60&offset=${currentCount}`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`response status: ${response.status}`)
        }

        const result = await response.json()

        localStorage.setItem("total_count", result.count)
        await populateList(result.results)

    } catch (error) {
        console.error(error.message)
    }
}

async function populateList(data) {
    const list = document.getElementById("list")
    const cc = document.getElementById("current_count")
    const tc = document.getElementById("total_count")

    cc.innerText = parseInt(localStorage.getItem("current_count"), 10) + 60
    tc.innerText = localStorage.getItem("total_count")

    const promisses = []
    data.forEach((p) => {
        promisses.push(fetch(p.url).then(r => r.json()))
    })

    const pokemon = await Promise.all(promisses)

    pokemon.forEach((p) => {
        const pokeCard = createPokemonCard(p)

        pokeCard.getElementsByClassName("fav-btn")[0].textContent = "favorite_border"
        pokeCard.getElementsByClassName("fav-btn")[0].style.color = "black"
        pokeCard.getElementsByClassName("fav-btn")[0].addEventListener("click", () => {
            localStorage.setItem(p.id, JSON.stringify(p))
            loadFavorites()
        })
        pokeCard.getElementsByClassName("fav-btn")[0].addEventListener("mouseover", () => {
            pokeCard.getElementsByClassName("fav-btn")[0].textContent = "favorite"
            pokeCard.getElementsByClassName("fav-btn")[0].style.color = "red"
        })
        pokeCard.getElementsByClassName("fav-btn")[0].addEventListener("mouseleave", () => {
            pokeCard.getElementsByClassName("fav-btn")[0].textContent = "favorite_border"
            pokeCard.getElementsByClassName("fav-btn")[0].style.color = "black"
        })

        list.appendChild(pokeCard)
    })
}

function filter() {
    const pokemon = document.querySelectorAll("#list .li")
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

async function getTypes() {
    const url = "https://pokeapi.co/api/v2/type/?limit=21"

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`response status: ${response.status} `)
        }

        const result = await response.json()

        populateDropdown(result.results)

    } catch (error) {
        console.error(error.message)
    }
}

function populateDropdown(types) {
    const dropdown = document.getElementById("types")

    for (let i = 0; i < types.length; i++) {
        const opt = document.createElement("option")
        opt.value = types[i].name
        opt.innerText = types[i].name[0].toUpperCase() + types[i].name.slice(1)

        dropdown.appendChild(opt)
    }
}

function loadFavorites() {
    if (localStorage.length > 0) {
        const favorites = document.getElementById("favs")
        favorites.innerHTML = ""

        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) == "current_count" || localStorage.key(i) == "total_count") {
                continue
            }

            const pokemon = localStorage.getItem(localStorage.key(i))

            const pokeCard = createPokemonCard(JSON.parse(pokemon))

            pokeCard.getElementsByClassName("fav-btn")[0].textContent = "favorite"
            pokeCard.getElementsByClassName("fav-btn")[0].style.color = "red"
            pokeCard.getElementsByClassName("fav-btn")[0].addEventListener("click", () => {
                localStorage.removeItem(localStorage.key(i))
                loadFavorites()
            })
            pokeCard.getElementsByClassName("fav-btn")[0].addEventListener("mouseover", () => {
                pokeCard.getElementsByClassName("fav-btn")[0].textContent = "favorite_border"
                pokeCard.getElementsByClassName("fav-btn")[0].style.color = "black"
            })
            pokeCard.getElementsByClassName("fav-btn")[0].addEventListener("mouseleave", () => {
                pokeCard.getElementsByClassName("fav-btn")[0].textContent = "favorite"
                pokeCard.getElementsByClassName("fav-btn")[0].style.color = "red"
            })

            favorites.appendChild(pokeCard)
        }
    }
}

function createPokemonCard(pokemon) {
    const pokeCard = document.createElement("div")
    const title = document.createElement("div")
    const pokeID = document.createElement("div")
    const favBtn = document.createElement("i")
    const img = document.createElement("img")
    const name = document.createElement("div")
    const types = document.createElement("div")

    pokeID.classList.add("poke-id")
    pokeID.appendChild(document.createTextNode(`#${String(pokemon.id).padStart(4, "0")}`))
    title.appendChild(pokeID)

    favBtn.classList.add("material-icons", "fav-btn")
    title.appendChild(favBtn)

    img.setAttribute("src", pokemon.sprites.front_default)

    name.classList.add("name")
    name.appendChild(document.createTextNode(`${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}`))


    types.classList.add("types")
    name.classList.add("name")
    pokeID.classList.add("poke-id")
    title.classList.add("title")
    pokeCard.classList.add("li")

    for (let i = 0; i < pokemon.types.length; i++) {
        const type = document.createElement("div")
        type.classList.add("type")
        type.classList.add(`${pokemon.types[i].type.name}`)
        type.appendChild(document.createTextNode(pokemon.types[i].type.name.toUpperCase()))

        types.appendChild(type)
    }

    pokeCard.appendChild(title)
    pokeCard.appendChild(img)
    pokeCard.appendChild(name)
    pokeCard.appendChild(types)

    return pokeCard
}

function nextPage() {
    localStorage.setItem("current_count", parseInt(localStorage.getItem("current_count"), 10) + 60)

    fetchPokemon()
}