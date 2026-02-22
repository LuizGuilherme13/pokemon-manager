async function getPokemon() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=60&offset=0"

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`response status: ${response.status}`)
    }

    const result = await response.json()

    await populateList(result)

  } catch (error) {
    console.error(error.message)
  }
}

async function detailPokemon(url) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`response status: ${response.status}`)
    }

    const result = await response.json()

    return result

  } catch (error) {
    console.error(error.message)
  }
}

async function populateList(pokemon) {
  const list = document.getElementById("list")

  for (let i = 0; i < pokemon.results.length; i++) {
    const li = document.createElement("li")
    const name = document.createElement("div")
    name.classList.add("name")

    const details = await detailPokemon(pokemon.results[i].url)
    // console.log(details.types)

    //#${pokemon.results[i].url.substring(34, pokemon.results[i].url.length - 1)}
    name.appendChild(document.createTextNode(`${pokemon.results[i].name}`))
    li.appendChild(name)

    const types = document.createElement("div")
    types.classList.add("types")

    for (let j = 0; j < details.types.length; j++) {
      const type = document.createElement("div")
      type.classList.add("type")

      type.appendChild(document.createTextNode(details.types[j].type.name))
      types.appendChild(type)
    }

    li.appendChild(types)
    list.appendChild(li)
  }
}

function filterByName() {
  const pokemon = document.querySelectorAll("#list li")
  const input = document.getElementById("search")

  for (let i = 0; i < pokemon.length; i++) {
    console.log(pokemon[i].getElementsByClassName("name")[0].textContent)

    if (!pokemon[i].getElementsByClassName("name")[0].textContent.includes(input.value)) {
      pokemon[i].classList.add("hidden")
    } else {
      pokemon[i].classList.remove("hidden")
    }
  }

}

document.getElementById("search").addEventListener("keyup", (e) => {
  filterByName()
})

async function getTypes() {
  const url = "https://pokeapi.co/api/v2/type/?limit=21"

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`response status: ${response.status}`)
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
    opt.innerText = types[i].name

    dropdown.appendChild(opt)
  }
}

function filterByType() {
  const dropdown = document.getElementById("types")
  const pokemon = document.querySelectorAll("#list li")

  loop1: for (let i = 0; i < pokemon.length; i++) {
    const types = pokemon[i].getElementsByClassName("types")

    let same = false
    loop2: for (let j = 0; j < types[0].children.length; j++) {
      if (types[0].children[j].textContent != dropdown.value && dropdown.value != "all" && !same) {
        pokemon[i].style.display = "none"
      } else {
        pokemon[i].style.display = ""
        same = true
        break loop2
      }
    }
  }
}

document.getElementById("types").addEventListener("change", () => {
  filterByType()
})

getPokemon()
getTypes()

