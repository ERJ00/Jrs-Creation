document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("myModal");
  const modalContent = document.querySelector(".modal-content");
  const modalImgContainer = document.getElementById("modalImgContainer");
  const indexDisplay = document.getElementById("indexDisplay");
  const leftButton = document.getElementById("leftButton");
  const rightButton = document.getElementById("rightButton");
  const homeButton = document.getElementById("home-btn");
  const vexelButton = document.getElementById("vexel-btn");
  const chibiButton = document.getElementById("chibi-btn");
  const illustrationButton = document.getElementById("illustration-btn");
  const nftButton = document.getElementById("nft-btn");
  const nftOptions = document.querySelectorAll(".dropdown-content button");
  const loading = document.getElementById("loading-screen");

  let currentIndex = 0;
  let artPieces = [];
  let category = "gif";
  const imgCache = {};
  let isAnimating = false;
  let continueProcessing = true;
  let selectedNFTOption = "NFT";

  // Disable scrolling
  document.body.style.overflow = "hidden";
  document.body.style.height = "100vh";

  // Load data and enable scrolling when ready
  fetchAndFilterData();
  setActiveButton(homeButton);

  leftButton.addEventListener("click", handleNavigation.bind(null, -1));
  rightButton.addEventListener("click", handleNavigation.bind(null, 1));

  homeButton.addEventListener("click", handleCategoryChange.bind(null, "gif"));
  chibiButton.addEventListener(
    "click",
    handleCategoryChange.bind(null, "chibi")
  );
  vexelButton.addEventListener(
    "click",
    handleCategoryChange.bind(null, "vexel")
  );
  illustrationButton.addEventListener(
    "click",
    handleCategoryChange.bind(null, "illustration")
  );

  nftOptions.forEach((option) => {
    option.addEventListener("click", function (event) {
      event.stopPropagation();
      if (!isAnimating) {
        const selectedOptionText = option.textContent.trim();
        category = selectedOptionText;
        setActiveButton(nftButton);
        selectedNFTOption = selectedOptionText;
        nftButton.textContent = selectedNFTOption;
        fetchAndFilterData();
        document.body.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  });

  nftButton.addEventListener("click", resetNFTButton);

  function handleNavigation(direction, event) {
    event.stopPropagation();
    if (!isAnimating) {
      navigateImage(direction);
    }
  }

  function handleCategoryChange(newCategory, event) {
    event.stopPropagation();
    if (!isAnimating && category !== newCategory) {
      continueProcessing = false; // Stop the ongoing processing
      category = newCategory;
      setActiveButton(event.target);
      fetchAndFilterData();
      document.body.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function resetNFTButton(event) {
    event.stopPropagation();
    nftButton.textContent = "NFT";
  }

  function setActiveButton(button) {
    const navButtons = document.querySelectorAll(".navButton");
    navButtons.forEach((btn) => {
      btn.classList.toggle("active", btn === button);
    });

    nftButton.textContent = "NFT";
  }

  function handleLoaded() {
    if (!continueProcessing) return;
    this.parentElement.classList.add("loaded");
    this.parentElement.style.backgroundImage = "none";
    this.parentElement.style.height = "100%";
  }

  function checkLoadingCompletion() {
    console.log(continueProcessing);
    if (!continueProcessing) return;

    const blurDivs = document.querySelectorAll(".blur-load");
    blurDivs.forEach((div) => {
      const mediaElements = div.querySelectorAll("img, video");
      mediaElements.forEach((media) => {
        if (media.complete) {
          handleLoaded.call(media);
        } else {
          media.addEventListener("load", handleLoaded);
          media.addEventListener("loadeddata", handleLoaded);
        }
      });
    });
  }

  function fetchAndFilterData() {
    continueProcessing = true; // Reset the flag when starting a new processing
    loading.style.display = "flex";

    fetch("assets/data/data.json")
      .then((response) => response.json())
      .then((data) => {
        if (continueProcessing) {
          artPieces = data.filter((artPiece) => artPiece.category === category);
          preloadNextImage();
          renderArtPieces();
          setTimeout(checkLoadingCompletion, 500);
          setTimeout(() => {
            loading.style.display = "none"; // Hide loading screen after rendering
            // Enable scrolling
            document.body.style.overflow = "auto";
            document.body.style.height = "100vh";
          }, 3000);
        }
      })
      .catch((error) => {
        continueProcessing = true; // Reset the flag on error
        console.error("Error fetching data:", error);
      });
  }

  function renderArtPieces() {
    document.querySelector("section").innerHTML = "";
    const artPieceDiv = document.createElement("div");

    artPieceDiv.className = "art-piece";

    artPieces.forEach((artPiece, index) => {
      const blurDiv = document.createElement("div");
      blurDiv.className = "blur-load";
      blurDiv.style.height = "250px";
      if (artPiece.category === "gif") {
        let fileName = artPiece.fileName;
        // Remove the file extension
        let fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
        blurDiv.style.backgroundImage = `url(assets/templates/${artPiece.category}/${fileNameWithoutExtension}_thumbnail.jpg)`;
      } else {
        blurDiv.style.backgroundImage = `url(assets/templates/${artPiece.category}/${artPiece.fileName})`;
      }

      const img = imgCache[index] || new Image();
      img.className = "img-video";
      img.setAttribute("loading", "eager");
      img.setAttribute(
        "src",
        `assets/images/${artPiece.category}/${artPiece.fileName}`
      );
      img.alt = `Artwork ${artPiece.id}`;
      imgCache[index] = img;

      if (artPiece.type === "mp4") {
        const video = document.createElement("video");
        video.className = "img-video";
        video.setAttribute("loading", "eager");
        video.controls = false;
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.setAttribute(
          "src",
          `assets/images/${artPiece.category}/${artPiece.fileName}`
        );
        // imgCache[index] = video;

        const source = document.createElement("source");
        source.type = "video/mp4";

        video.addEventListener("click", function () {
          if (!isAnimating) {
            modalImgContainer.innerHTML = "";
            const modalvid = document.createElement("video");
            modalvid.id = "modalImg";
            modalvid.className = "modal-img";
            modalvid.alt = `Artwork ${artPiece.id}`;
            modalvid.controls = false;
            modalvid.autoplay = true;
            modalvid.loop = true;
            modalvid.setAttribute("src", video.getAttribute("src"));

            const source = document.createElement("source");
            source.type = "video/mp4";

            modalvid.appendChild(source);
            modalImgContainer.appendChild(modalvid);

            modal.style.display = "flex";
            currentIndex = index;
            updateIndexDisplay();
          }
        });

        video.appendChild(source);
        blurDiv.appendChild(video);
        artPieceDiv.appendChild(blurDiv);
      } else {
        img.addEventListener("click", function () {
          if (!isAnimating) {
            modalImgContainer.innerHTML = "";
            const modalImg = document.createElement("img");
            modalImg.id = "modalImg";
            modalImg.className = "modal-img";
            modalImg.alt = img.alt;
            modal.style.display = "flex";
            modalImg.src = img.src;
            currentIndex = index;
            modalImgContainer.appendChild(modalImg);
            updateIndexDisplay();
          }
        });

        blurDiv.appendChild(img);
        artPieceDiv.appendChild(blurDiv);
      }
    });
    document.querySelector("section").appendChild(artPieceDiv);
  }

  function closeModal() {
    if (!isAnimating) {
      isAnimating = true;
      modalContent.classList.add("zoom-out");

      setTimeout(() => {
        modalContent.classList.remove("zoom-out");
        modal.style.display = "none";
        modalContent.style.transform = "scale(1)";
        isAnimating = false;
        modalImgContainer.innerHTML = "";
      }, 800);
    }
  }

  modal.addEventListener("click", function (event) {
    if (!event.target.closest(".modal-btn")) {
      closeModal();
    }
  });

  function changeElement(type, data) {
    modalImgContainer.innerHTML = "";

    if (type === "mp4") {
      const dataSrc = data.getAttribute("src");

      const modalvid = document.createElement("video");
      modalvid.id = "modalImg";
      modalvid.className = "modal-img";
      modalvid.controls = false;
      modalvid.autoplay = true;
      modalvid.loop = true;

      const source = document.createElement("source");
      source.type = "video/mp4";
      source.src = dataSrc;

      modalvid.appendChild(source);
      modalImgContainer.appendChild(modalvid);
    } else {
      const modalImg = document.createElement("img");
      modalImg.id = "modalImg";
      modalImg.className = "modal-img lozad";
      modalImg.alt = data.alt;
      modalImg.src = data.src;
      modalImgContainer.appendChild(modalImg);
    }
  }

  function navigateImage(direction) {
    if (!isAnimating) {
      isAnimating = true;
      const currentData = artPieces[currentIndex];
      currentIndex += direction;

      if (currentIndex < 0) {
        currentIndex = artPieces.length - 1;
      } else if (currentIndex >= artPieces.length) {
        currentIndex = 0;
      }

      const modalImg = document.getElementById("modalImg");
      const currentImg = modalImg;
      const nextImg = imgCache[currentIndex];
      const nextData = artPieces[currentIndex];

      if (direction === 1) {
        currentImg.classList.add("slide-out-CenterToRight");

        currentImg.addEventListener(
          "animationend",
          function animationEndHandler() {
            if (currentImg) {
              if (currentData.type !== nextData.type) {
                changeElement(nextData.type, nextImg);
              } else {
                if (currentData.type === "mp4") {
                  const dataSrc = nextImg.getAttribute("src");
                  currentImg.src = dataSrc;
                } else {
                  currentImg.src = nextImg.src;
                }
              }
              currentImg.classList.remove("slide-out-CenterToRight");
              const modalImg = document.getElementById("modalImg");
              modalImg.classList.add("slide-in-leftToCenter");
              modalImg.addEventListener(
                "animationend",
                function () {
                  modalImg.classList.remove("slide-in-leftToCenter");
                  isAnimating = false;
                },
                { once: true }
              );
            }
          },
          { once: true }
        );
      } else {
        currentImg.classList.add("slide-out-CenterToLeft");

        currentImg.addEventListener(
          "animationend",
          function animationEndHandler() {
            if (currentImg) {
              if (currentData.type !== nextData.type) {
                changeElement(nextData.type, nextImg);
              } else {
                if (currentData.type === "mp4") {
                  const dataSrc = nextImg.getAttribute("src");
                  currentImg.src = dataSrc;
                } else {
                  currentImg.src = nextImg.src;
                }
              }
              currentImg.classList.remove("slide-out-CenterToLeft");
              const modalImg = document.getElementById("modalImg");
              modalImg.classList.add("slide-in-rightToCenter");
              modalImg.addEventListener(
                "animationend",
                function () {
                  modalImg.classList.remove("slide-in-rightToCenter");
                  isAnimating = false;
                },
                { once: true }
              );
            }
          },
          { once: true }
        );
      }
      preloadNextImage();
      updateIndexDisplay();
    }
  }

  function updateIndexDisplay() {
    indexDisplay.textContent = `${currentIndex + 1}/${artPieces.length}`;
  }

  function preloadNextImage() {
    const nextIndex =
      currentIndex + 1 < artPieces.length ? currentIndex + 1 : 0;
    const nextImg = imgCache[nextIndex] || new Image();
    nextImg.setAttribute(
      "data-src",
      `assets/images/${artPieces[nextIndex].category}/${artPieces[nextIndex].fileName}`
    );
    imgCache[nextIndex] = nextImg;
  }

  document.addEventListener("keydown", function (event) {
    if (modal.style.display === "flex" && !isAnimating) {
      if (event.key === "ArrowLeft") {
        navigateImage(-1);
      } else if (event.key === "ArrowRight") {
        navigateImage(1);
      }
    }
  });
});
