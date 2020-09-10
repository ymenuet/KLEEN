const myPlacesViewBtn = document.querySelector("#show-places")
const myCommentsViewBtn = document.querySelector("#show-comments")
const myPlaces = document.querySelector(".my-places")
const myComments = document.querySelector(".my-comments")

myPlacesViewBtn.addEventListener("click", () => {
    if (myPlaces.classList.contains("invisible")) {
        myPlaces.classList.remove("invisible")
        myPlacesViewBtn.innerHTML = "Close my places view"
        myCommentsViewBtn.classList.add("invisible")
    } else {
        myPlaces.classList.add("invisible")
        myCommentsViewBtn.classList.remove("invisible")
    }
})

myCommentsViewBtn.addEventListener("click", () => {
    if (myComments.classList.contains("invisible")) {
        myComments.classList.remove("invisible")
        myCommentsViewBtn.innerHTML = "Close my comments view"
        myPlacesViewBtn.classList.add("invisible")
    } else {
        myComments.classList.add("invisible")
        myPlacesViewBtn.classList.remove("invisible")
    }
})