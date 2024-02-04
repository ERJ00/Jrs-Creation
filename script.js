document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("modalImg");
  const indexDisplay = document.getElementById("indexDisplay");
  const leftButton = document.getElementById("leftButton");
  const rightButton = document.getElementById("rightButton");
  let currentIndex = 0;
  let artPieces = [];

  leftButton.addEventListener("click", function (event) {
    event.stopPropagation();
    navigateImage(-1);
  });

  rightButton.addEventListener("click", function (event) {
    event.stopPropagation();
    navigateImage(1);
  });

  fetch((src = "assets/data/data.json"))
    .then((response) => response.json())
    .then((data) => {
      artPieces = data;
      artPieces.forEach((artPiece, index) => {
        const artPieceDiv = document.createElement("div");
        artPieceDiv.className = "art-piece";

        const img = document.createElement("img");
        img.src = `assets/images/${artPiece.fileName}`;
        img.alt = `Artwork ${artPiece.id}`;
        img.addEventListener("click", function () {
          modal.style.display = "flex";
          modalImg.src = this.src;
          currentIndex = index;
          updateIndexDisplay();
        });

        artPieceDiv.appendChild(img);
        document.querySelector("section").appendChild(artPieceDiv);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));

  modal.addEventListener("click", function (event) {
    if (!event.target.closest(".modal-btn")) {
      modal.style.display = "none";
    }
  });

  function navigateImage(direction) {
    currentIndex += direction;

    if (currentIndex < 0) {
      currentIndex = artPieces.length - 1;
    } else if (currentIndex >= artPieces.length) {
      currentIndex = 0;
    }

    modalImg.src = `assets/images/${artPieces[currentIndex].fileName}`;
    updateIndexDisplay();
  }

  function updateIndexDisplay() {
    indexDisplay.textContent = `${currentIndex + 1}/${artPieces.length}`;
  }

  document.addEventListener("keydown", function (event) {
    if (modal.style.display === "flex") {
      if (event.key === "ArrowLeft") {
        navigateImage(-1);
      } else if (event.key === "ArrowRight") {
        navigateImage(1);
      }
    }
  });
});
