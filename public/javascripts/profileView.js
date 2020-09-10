const myPlacesViewBtn = document.querySelector("#show-places")
const myCommentsViewBtn = document.querySelector("#show-comments")
const myPlaces = document.querySelector(".my-places")
const myComments = document.querySelector(".my-comments")

myPlacesViewBtn.addEventListener("click", () => {
    if (myPlaces.classList.contains("invisible")) {
        myPlaces.classList.remove("invisible")
        myComments.classList.add("invisible")
        myPlacesViewBtn.innerText = "Hide my places"
        myCommentsViewBtn.innerText = "See my comments"
    } else {
        myPlaces.classList.add("invisible")
        myPlacesViewBtn.innerText = "See my places"
    }
})

myCommentsViewBtn.addEventListener("click", () => {
    if (myComments.classList.contains("invisible")) {
        myComments.classList.remove("invisible")
        myPlaces.classList.add("invisible")
        myCommentsViewBtn.innerText = "Hide my comments"
        myPlacesViewBtn.innerText = "See my places"
    } else {
        myComments.classList.add("invisible")
        myCommentsViewBtn.innerText = "See my comments"
    }
})