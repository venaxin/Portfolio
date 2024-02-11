//Projects Section
const projects = [
  {
    title: "CampusClubHouse",
    desc: "A student-focused social media platform connecting students and facilitating in-person and virtual activities, gatherings, and events. It provides insights for organizers to analyze responses, design effectiveness, performance, and attendee reviews.",
    isLink: true,
    link: "https://campusclubhouse.web.app/",
    imagename: "2.jpeg",
  },
  {
    title: "Intellibot",
    desc: "This project is a system that combines AI-driven chat functionality, image generation, voice interaction, and a user-friendly interface. The system should be capable of engaging in dynamic conversations, generating unique images based on text prompts, listening to user input, synthesizing speech, and providing an intuitive user experience.",
    isLink: false,
    link: "https://campusclubhouse.web.app/",
    imagename: "2.jpeg",
  },
  {
    title: "WeatherWiz",
    desc: "WeatherWiz is a weather forecast website that provides users with accurate and up-to-date weather information for any location around the world. The website offers a user-friendly interface and a range of features to help users plan their activities and stay prepared for changing weather conditions",
    isLink: false,
    link: "https://campusclubhouse.web.app/",
    imagename: "2.jpeg",
  },
  {
    title: "BaymaxBot",
    desc: "Users can simply input their mathematical expressions, and the bot responds with accurate results in real-time. With its user- friendly interface and seamless integration into Discord, BaymaxBot makes math fun and convenient for everyone in the community.",
    isLink: false,
    link: "https://campusclubhouse.web.app/",
    imagename: "2.jpeg",
  },
];

function createProjectCard(project) {
  const projectCard = document.createElement("div");
  projectCard.classList.add("project-card");

  const link = document.createElement("a");
  if (project.isLink) {
    link.classList.add("linkable-project");
    link.href = project.link;
    link.target = "_blank";
  }

  const projectImage = document.createElement("div");
  projectImage.classList.add("project-image");

  const projectMatter = document.createElement("div");
  projectMatter.classList.add("project-matter");

  const projectTitle = document.createElement("div");
  projectTitle.classList.add("project-title");
  projectTitle.innerHTML = `<strong>${project.title}</strong>`;

  const projectDesc = document.createElement("div");
  projectDesc.classList.add("project-desc");
  projectDesc.textContent = project.desc;

  projectMatter.appendChild(projectTitle);
  projectMatter.appendChild(projectDesc);

  link.appendChild(projectImage);
  link.appendChild(projectMatter);

  projectCard.appendChild(link);

  return projectCard;
}

function addProjectsToDOM() {
  const projectBoard = document.querySelector(".project-board");

  if (projectBoard) {
    projects.forEach((project) => {
      const projectElement = createProjectCard(project);
      projectBoard.appendChild(projectElement);
    });
  } else {
    console.error("No element found with class 'project-board'");
  }
}

addProjectsToDOM();

//Top scroll completion bar
window.onscroll = function () {
  scrollIndi();
};

function scrollIndi() {
  var winScroll = document.documentElement.scrollTop;
  var height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;

  document.getElementById("myBar").style.width = scrolled + "%";
}

//Certi Carousel
const container = document.querySelector(".carousel-container");
const slides = document.querySelectorAll(".carousel-slide");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
let currentIndex = 0;

const imageUrls = [
  "Certis/DSA.png",
  "Certis/Webdev.png",
  "Certis/Postman.png",
  "Certis/Cloud.jpg",
  "Certis/React.png",
];

function createImageElements(startIndex) {
  slides.forEach((slide, index) => {
    const imgIndex = (startIndex + index) % imageUrls.length;
    const img = document.createElement("img");
    img.src = imageUrls[imgIndex];
    img.alt = `Slide ${imgIndex + 1}`;
    img.classList.add("show");
    img.style.opacity = 0;
    slide.innerHTML = "";
    slide.appendChild(img);

    setTimeout(() => {
      img.style.opacity = 1;
    }, 50);
  });
}

createImageElements(currentIndex);

function nextSlide() {
  currentIndex = (currentIndex + 1) % imageUrls.length;
  createImageElements(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
  createImageElements(currentIndex);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

setInterval(nextSlide, 3000);
