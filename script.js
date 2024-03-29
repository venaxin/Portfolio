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
    isLink: true,
    link: "https://github.com/sdrahmath/Intellibot",
    imagename: "2.jpeg",
  },
  {
    title: "WeatherWiz",
    desc: "WeatherWiz is a weather forecast website that provides users with accurate and up-to-date weather information for any location around the world. The website offers a user-friendly interface and a range of features to help users plan their activities and stay prepared for changing weather conditions",
    isLink: true,
    link: "https://github.com/venaxin/weatherwiz",
    imagename: "2.jpeg",
  },
  {
    title: "CodeLab",
    desc: "Codelab is an online code editor that allows users to write, edit, and execute code in various programming languages directly in the browser. With its intuitive interface and powerful features, Codelab aims to provide developers and learners with a seamless coding experience.",
    isLink: true,
    link: "https://github.com/venaxin/codelab",
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

document.querySelector(".menu-toggle").addEventListener("click", function () {
  document.querySelector("#navbar ul").classList.toggle("active");
});

//scroll spy
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");

  const observerOptions = {
    rootMargin: "-50px 0px -50px 0px", // Adjust as needed
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const targetId = entry.target.id;
        navLinks.forEach((navLink) => {
          navLink.classList.remove("active");
          if (navLink.getAttribute("href") === `#${targetId}`) {
            navLink.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
});
window.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section[id]");
  const scrollSpy = document.querySelector(".scrollspy");

  window.addEventListener("scroll", function () {
    let scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (
        scrollY > sectionTop - sectionHeight / 3 &&
        scrollY <= sectionTop + sectionHeight - sectionHeight / 3
      ) {
        scrollSpy
          .querySelector('a[href="#' + section.id + '"]')
          .classList.add("active");
      } else {
        scrollSpy
          .querySelector('a[href="#' + section.id + '"]')
          .classList.remove("active");
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const scrollSpyToggle = document.querySelector(".scrollspy-toggle");
  const scrollSpy = document.querySelector(".scrollspy");

  scrollSpyToggle.addEventListener("click", function () {
    if (scrollSpy.style.right === "-300px") {
      scrollSpy.style.right = "20px"; // Show scroll spy
    } else {
      scrollSpy.style.right = "-300px"; // Hide scroll spy
    }
  });
});
