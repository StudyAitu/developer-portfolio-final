"use strict";

// Project-related data is stored in arrays and rendered dynamically.
const defaultProjects = [
    {
        id: 1,
        title: "Library Management System",
        category: "python",
        tags: ["Python", "OOP"],
        image: "images/project-library.svg",
        alt: "Library management system preview",
        description: "A practice project focused on managing books, users and basic library operations with clean Python structures.",
        details: ["Object-oriented design", "Data validation", "Readable command-line workflow"]
    },
    {
        id: 2,
        title: "Algorithm & Data Structure Benchmark",
        category: "java",
        tags: ["Java", "DSA", "Benchmarking"],
        image: "images/project-algorithms.svg",
        alt: "Algorithm benchmark chart preview",
        description: "A comparative study of common data structures and operations using controlled workloads and measurements.",
        details: ["Dynamic array vs linked list", "Heap operations", "Complexity analysis"]
    },
    {
        id: 3,
        title: "Java Coursework Collection",
        category: "java",
        tags: ["Java", "OOP"],
        image: "images/project-java.svg",
        alt: "Java coursework illustration",
        description: "Small exercises and implementations used to strengthen object-oriented programming and problem-solving skills.",
        details: ["Classes and objects", "Collections and algorithms", "Debugging in IntelliJ IDEA"]
    },
    {
        id: 4,
        title: "Developer Portfolio",
        category: "web",
        tags: ["HTML", "CSS", "Bootstrap", "JavaScript"],
        image: "images/skills-chart.svg",
        alt: "Skills chart",
        description: "A six-page responsive website extended with interactive JavaScript and jQuery features.",
        details: ["Bootstrap grid and utilities", "DOM manipulation", "Responsive breakpoints"]
    }
];


// A meaningful model class: every portfolio project is represented by an object.
class PortfolioProject {
    constructor({ id, title, category, tags = [], image = "images/project-java.svg",
        alt = "Project preview", description, details = [], source = "local" }) {
        this.id = Number(id);
        this.title = String(title || "").trim();
        this.category = category;
        this.tags = Array.isArray(tags) ? tags : [];
        this.image = image;
        this.alt = alt;
        this.description = String(description || "").trim();
        this.details = Array.isArray(details) ? details : [];
        this.source = source;
    }

    matches(query, category) {
        const searchable = `${this.title} ${this.description} ${this.tags.join(" ")}`.toLowerCase();
        return searchable.includes(query) && (category === "all" || this.category === category);
    }

    toJSON() {
        return {
            id: this.id, title: this.title, category: this.category, tags: this.tags,
            image: this.image, alt: this.alt, description: this.description,
            details: this.details, source: this.source
        };
    }
}


// A storage service centralizes safe JSON parsing and browser persistence.
class PortfolioStorage {
    static read(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            const parsed = JSON.parse(raw);
            return parsed ?? fallback;
        } catch (error) {
            console.warn(`Invalid localStorage value for ${key}; using defaults.`, error);
            return fallback;
        }
    }

    static write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Could not save ${key}.`, error);
            return false;
        }
    }

    static remove(key) {
        localStorage.removeItem(key);
    }
}

let projects = defaultProjects.map(project => new PortfolioProject(project));

const skills = [
    { name: "Java", value: 80, category: "programming", purpose: "OOP, coursework and algorithms" },
    { name: "Python", value: 82, category: "programming", purpose: "Projects, automation and problem solving" },
    { name: "HTML / CSS", value: 78, category: "web", purpose: "Semantic structure and responsive UI" },
    { name: "Bootstrap", value: 75, category: "web", purpose: "Responsive grid and UI components" },
    { name: "Git / GitHub", value: 70, category: "tools", purpose: "Version control and deployment" },
    { name: "IntelliJ IDEA", value: 75, category: "tools", purpose: "Java development and debugging" }
];

let favorites = PortfolioStorage.read("portfolioFavorites", []);
if (!Array.isArray(favorites)) favorites = [];
favorites = favorites.map(Number).filter(Number.isFinite);

const customProjects = PortfolioStorage.read("portfolioCustomProjects", []);
if (Array.isArray(customProjects)) {
    projects.push(...customProjects.map(item => new PortfolioProject(item)));
}

let editingProjectId = null;
let favoritesOnly = false;

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
}

function saveCustomProjects() {
    PortfolioStorage.write("portfolioCustomProjects",
        projects.filter(project => project.source === "custom").map(project => project.toJSON()));
}

function updateDashboard() {
    const total = document.querySelector("#statTotalProjects");
    const saved = document.querySelector("#statFavorites");
    const custom = document.querySelector("#statCustomProjects");

    if (total) total.textContent = projects.length;
    if (saved) saved.textContent = favorites.length;
    if (custom) custom.textContent = projects.filter(project => project.source === "custom").length;
}

function createProjectCard(project) {
    const tags = project.tags
        .map(tag => `<span class="tag">${escapeHTML(tag)}</span>`)
        .join("");

    const details = project.details
        .map(detail => `<li>${escapeHTML(detail)}</li>`)
        .join("");

    const saved = favorites.includes(project.id);

    return `
        <div class="col-lg-6 project-item">
            <article class="card-soft hoverable p-3 h-100">
                <img src="${project.image}" class="project-img" alt="${escapeHTML(project.alt)}">
                <div class="p-3">
                    <div>${tags}</div>
                    <h2 class="h4 mt-2">${escapeHTML(project.title)}</h2>
                    <p class="text-secondary">${escapeHTML(project.description)}</p>
                    <ul>${details}</ul>
                    <button class="favorite-btn ${saved ? "is-favorite" : ""}"
                        data-favorite="${project.id}"
                        aria-pressed="${saved}">
                        ${saved ? "★ Saved" : "☆ Add to favorites"}
                    </button>
                    ${project.source === "custom" ? `
                    <div class="d-flex gap-2 mt-2">
                        <button class="btn btn-sm btn-outline-secondary" data-edit-project="${project.id}" type="button">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" data-delete-project="${project.id}" type="button">Delete</button>
                    </div>` : ""}
                </div>
            </article>
        </div>`;
}

// A for...of loop counts the project categories currently visible on the page.
function getProjectCategorySummary(projectList) {
    const categoryCounts = {};

    for (const project of projectList) {
        categoryCounts[project.category] =
            (categoryCounts[project.category] || 0) + 1;
    }

    const summary = Object.entries(categoryCounts)
        .map(([category, total]) => `${category}: ${total}`)
        .join(" · ");

    return summary;
}

function renderProjects(list = projects) {
    const grid = document.querySelector("#projectGrid");

    if (!grid) return;

    grid.innerHTML = list.map(createProjectCard).join("");

    const count = document.querySelector("#projectCount");

    if (count) {
        const categorySummary = getProjectCategorySummary(list);

        count.textContent = categorySummary
            ? `Showing ${list.length} of ${projects.length} projects · ${categorySummary}`
            : `Showing ${list.length} of ${projects.length} projects`;
    }

    const empty = document.querySelector("#emptyProjects");

    if (empty) {
        empty.hidden = list.length !== 0;
    }
}

function filterProjects() {
    const query = (
        document.querySelector("#projectSearch")?.value || ""
    ).trim().toLowerCase();

    const category =
        document.querySelector("#categoryFilter")?.value || "all";

    let filtered = projects.filter(project => project.matches(query, category));

    if (favoritesOnly) {
        filtered = filtered.filter(project =>
            favorites.includes(project.id)
        );
    }

    renderProjects(filtered);
    updateDashboard();
}

function saveFavorites() {
    PortfolioStorage.write("portfolioFavorites", favorites);
}

function toggleFavorite(projectId) {
    favorites = favorites.includes(projectId)
        ? favorites.filter(id => id !== projectId)
        : [...favorites, projectId];

    saveFavorites();
    filterProjects();
}

function renderSkillBars() {
    const list = document.querySelector("#skillsList");

    if (!list) return;

    list.innerHTML = skills.slice(0, 4).map(skill => `
        <div class="mt-4">
            <div class="d-flex justify-content-between">
                <strong>${skill.name}</strong>
                <span>${skill.value}%</span>
            </div>
            <div class="skill-bar mt-2"
                role="progressbar"
                aria-valuenow="${skill.value}"
                aria-valuemin="0"
                aria-valuemax="100">
                <span style="width:${skill.value}%"></span>
            </div>
        </div>
    `).join("");
}

function renderSkillDetails(category = "all") {
    const container = document.querySelector("#skillDetails");

    if (!container) return;

    const visibleSkills = skills.filter(skill =>
        category === "all" || skill.category === category
    );

    container.innerHTML = visibleSkills.map(skill => `
        <div class="col-md-6 col-lg-4">
            <article class="feature-panel h-100">
                <h3 class="h5">${skill.name}</h3>
                <p class="text-secondary mb-2">${skill.purpose}</p>
                <span class="tag">${skill.category}</span>
            </article>
        </div>
    `).join("");
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}Error`);

    if (!field || !error) return;

    field.classList.toggle("is-invalid", Boolean(message));
    error.textContent = message;
}

function validateContactForm() {
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const topic = document.querySelector("#topic").value;
    const message = document.querySelector("#message").value.trim();
    const consent = document.querySelector("#consent").checked;

    const errors = {
        name: name.length < 2
            ? "Enter a name with at least 2 characters."
            : "",

        email: !validateEmail(email)
            ? "Enter a valid email address."
            : "",

        topic: !topic
            ? "Please choose a topic."
            : "",

        message: message.length < 10
            ? "Message must contain at least 10 characters."
            : "",

        consent: !consent
            ? "Please confirm the demo form notice."
            : ""
    };

    Object.entries(errors).forEach(([field, error]) => {
        setFieldError(field, error);
    });

    return Object.values(errors).every(error => error === "");
}

function showFormSuccess() {
    const status = document.querySelector("#formStatus");

    status.innerHTML = `
        <div class="success-box">
            Thank you! Your message passed validation.
            This demo does not send data to a server.
        </div>
    `;
}

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;

    // Keep the original Endterm plain-string storage format for compatibility.
    localStorage.setItem("portfolioTheme", theme);

    const button = document.querySelector("#themeToggle");

    if (button) {
        button.textContent = theme === "dark"
            ? "☀ Light"
            : "◐ Theme";
    }
}

function initializeTheme() {
    // The Endterm version stored the theme as a plain string; keep it compatible.
    const savedTheme = localStorage.getItem("portfolioTheme") || "light";
    setTheme(savedTheme === "dark" ? "dark" : "light");
}

function resetProjectForm() {
    const form = document.querySelector("#projectForm");
    if (!form) return;

    form.reset();
    editingProjectId = null;

    const heading = document.querySelector("#projectFormHeading");
    const submit = document.querySelector("#projectSubmit");

    if (heading) heading.textContent = "Add a personal project";
    if (submit) submit.textContent = "Save project";

    const cancel = document.querySelector("#cancelProjectEdit");
    if (cancel) cancel.hidden = true;
}

function handleProjectForm(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const title = form.elements.projectTitle.value.trim();
    const description = form.elements.projectDescription.value.trim();
    const category = form.elements.projectCategory.value;
    const tags = form.elements.projectTags.value.split(",").map(tag => tag.trim()).filter(Boolean);
    const details = form.elements.projectDetails.value.split("\n").map(item => item.trim()).filter(Boolean);

    if (editingProjectId !== null) {
        const target = projects.find(project => project.id === editingProjectId);

        if (target) {
            target.title = title;
            target.description = description;
            target.category = category;
            target.tags = tags;
            target.details = details;
        }
    } else {
        const nextId = Math.max(0, ...projects.map(project => project.id)) + 1;

        projects.push(new PortfolioProject({
            id: nextId,
            title,
            description,
            category,
            tags,
            details,
            image: category === "python" ? "images/project-library.svg" :
                category === "web" ? "images/skills-chart.svg" : "images/project-java.svg",
            alt: `${title} project preview`,
            source: "custom"
        }));
    }

    saveCustomProjects();
    resetProjectForm();
    favoritesOnly = false;
    filterProjects();

    const status = document.querySelector("#projectFormStatus");
    if (status) status.textContent = "Project saved in this browser.";
}

function editCustomProject(id) {
    const project = projects.find(item => item.id === id && item.source === "custom");
    if (!project) return;

    editingProjectId = id;

    const form = document.querySelector("#projectForm");
    form.elements.projectTitle.value = project.title;
    form.elements.projectDescription.value = project.description;
    form.elements.projectCategory.value = project.category;
    form.elements.projectTags.value = project.tags.join(", ");
    form.elements.projectDetails.value = project.details.join("\n");

    document.querySelector("#projectFormHeading").textContent = "Edit your project";
    document.querySelector("#projectSubmit").textContent = "Update project";
    document.querySelector("#cancelProjectEdit").hidden = false;

    form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteCustomProject(id) {
    const project = projects.find(item => item.id === id && item.source === "custom");
    if (!project) return;

    if (!window.confirm(`Delete "${project.title}" from this browser?`)) return;

    projects = projects.filter(item => item.id !== id);
    favorites = favorites.filter(favoriteId => favoriteId !== id);

    saveCustomProjects();
    saveFavorites();
    filterProjects();
}

async function loadGitHubRepositories() {
    const container = document.querySelector("#githubRepositories");
    const status = document.querySelector("#githubApiStatus");

    if (!container || !status) return;

    status.textContent = "Loading public repositories from GitHub…";
    container.innerHTML = "";

    // StudyAitu may be exposed as an organization or as a user account.
    // Try the organization endpoint first, then the user endpoint.
    const endpoints = [
        "https://api.github.com/orgs/StudyAitu/repos?type=public&sort=updated&per_page=6",
        "https://api.github.com/users/StudyAitu/repos?type=owner&sort=updated&per_page=6"
    ];

    let repositories = null;
    let lastError = null;

    for (const url of endpoints) {
        try {
            const response = await fetch(url, {
                headers: {
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            });

            if (!response.ok) {
                let message = "";

                try {
                    const body = await response.json();
                    message = body.message || "";
                } catch (_) {
                    // The response body may not be JSON.
                }

                throw new Error(`HTTP ${response.status}${message ? `: ${message}` : ""}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("GitHub returned an unexpected response format.");
            }

            repositories = data;
            break;
        } catch (error) {
            lastError = error;
            console.warn(`GitHub endpoint failed (${url}):`, error);
        }
    }

    if (repositories === null) {
        console.error("GitHub repository request failed:", lastError);

        status.textContent = `GitHub data could not be loaded. ${lastError?.message || "Check your internet connection."}`;

        const retry = document.createElement("button");
        retry.type = "button";
        retry.className = "btn btn-sm btn-outline-primary mt-2";
        retry.textContent = "Try again";
        retry.addEventListener("click", loadGitHubRepositories);

        container.append(retry);
        return;
    }

    if (repositories.length === 0) {
        status.textContent = "The GitHub API request succeeded, but no public repositories were found for StudyAitu.";
        return;
    }

    repositories.forEach(repository => {
        const card = document.createElement("article");
        card.className = "col-md-6 col-lg-4";

        const panel = document.createElement("div");
        panel.className = "feature-panel h-100";

        const title = document.createElement("h3");
        title.className = "h5";
        title.textContent = repository.name || "Untitled repository";

        const description = document.createElement("p");
        description.className = "text-secondary";
        description.textContent = repository.description || "No description provided.";

        const meta = document.createElement("p");
        meta.className = "small mb-3";
        meta.textContent = `★ ${repository.stargazers_count ?? 0} · ${repository.language || "Language not specified"}`;

        const link = document.createElement("a");
        link.className = "btn btn-sm btn-outline-primary";
        link.href = repository.html_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View on GitHub";

        panel.append(title, description, meta, link);
        card.append(panel);
        container.append(card);
    });

    status.textContent = `Successfully loaded ${repositories.length} public repositories from StudyAitu using the GitHub REST API.`;
}

function initializePortfolio() {
    document.querySelectorAll("[data-year]").forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    initializeTheme();
    renderProjects();
    renderSkillBars();
    renderSkillDetails();
    updateDashboard();
    loadGitHubRepositories();

    document.querySelector("#projectSearch")
        ?.addEventListener("input", filterProjects);

    document.querySelector("#categoryFilter")
        ?.addEventListener("change", filterProjects);

    document.querySelector("#projectGrid")
        ?.addEventListener("click", event => {
            const button = event.target.closest("[data-favorite]");

            if (button) {
                toggleFavorite(Number(button.dataset.favorite));
                return;
            }

            const editButton = event.target.closest("[data-edit-project]");

            if (editButton) {
                editCustomProject(Number(editButton.dataset.editProject));
                return;
            }

            const deleteButton = event.target.closest("[data-delete-project]");

            if (deleteButton) {
                deleteCustomProject(Number(deleteButton.dataset.deleteProject));
            }
        });

    document.querySelector("#showFavorites")
        ?.addEventListener("click", () => {
            favoritesOnly = true;
            filterProjects();
        });

    document.querySelector("#showAllProjects")
        ?.addEventListener("click", () => {
            favoritesOnly = false;
            filterProjects();
        });

    document.querySelector("#themeToggle")
        ?.addEventListener("click", () => {
            setTheme(
                document.documentElement.dataset.theme === "dark"
                    ? "light"
                    : "dark"
            );
        });

    document.querySelectorAll(".skill-tab").forEach(button => {
        button.addEventListener("click", () => {
            renderSkillDetails(button.dataset.category);

            document.querySelectorAll(".skill-tab").forEach(tab => {
                tab.classList.remove("active");
            });

            button.classList.add("active");
        });
    });

    document.querySelector("#projectForm")
        ?.addEventListener("submit", handleProjectForm);

    document.querySelector("#cancelProjectEdit")
        ?.addEventListener("click", resetProjectForm);

    document.querySelector("#contactForm")
        ?.addEventListener("submit", event => {
            event.preventDefault();

            document.querySelector("#formStatus").textContent = "";

            if (validateContactForm()) {
                showFormSuccess();
            }
        });

    document.querySelector("#contactForm")
        ?.addEventListener("reset", () => {
            setTimeout(() => {
                ["name", "email", "topic", "message", "consent"]
                    .forEach(id => setFieldError(id, ""));

                document.querySelector("#formStatus").textContent = "";
            }, 0);
        });

    // jQuery selectors, traversal, events and effects.
    if (window.jQuery) {
        $(".feature-panel")
            .on("mouseenter", function () {
                $(this).find("h2, h3")
                    .first()
                    .css("color", "var(--brand)");
            })
            .on("mouseleave", function () {
                $(this).find("h2, h3")
                    .first()
                    .css("color", "");
            });

        $("#workflowToggle").on("click", function () {
            const willOpen =
                !$("#workflowDetails").is(":visible");

            $("#workflowDetails")
                .stop(true, true)
                .slideToggle(180);

            $(this)
                .attr("aria-expanded", String(willOpen))
                .text(willOpen ? "Hide workflow" : "Show workflow");

            $(this)
                .closest(".feature-panel")
                .toggleClass("border-primary", willOpen);
        });

        $(".site-footer a").on("click", function () {
            $(this).parent()
                .fadeTo(120, 0.65)
                .fadeTo(120, 1);
        });
    }
}

document.addEventListener("DOMContentLoaded", initializePortfolio);