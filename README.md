# Developer Portfolio — Final Project

**Student:** Muratbek Ibrai  
**Group:** SE-2529  
**University:** Astana IT University  
**School:** School of Software Engineering  
**Course:** Web Technologies

## Project Description

This project is a personal Developer Portfolio website created as a continuation of the Midterm and Endterm assignments.

The website presents my background, programming skills, projects, and experience. The Final Project extends the previous version with advanced JavaScript features, API integration, Object-Oriented Programming, and LocalStorage.

## Live Website

https://studyaitu.github.io/muratbek_endterm_portfolio-/

## GitHub Repository

https://github.com/StudyAitu/muratbek_endterm_portfolio-

## Technologies

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6+)
- jQuery
- DOM Manipulation
- Fetch API
- GitHub REST API
- LocalStorage
- GitHub Pages

## Project Structure

```text
developer-portfolio/
│
├── index.html
├── about.html
├── projects.html
├── skills.html
├── experience.html
├── contact.html
│
├── css/
│   └── style.css
│
├── js/
│   └── main.js
│
├── images/
│   ├── profile.svg
│   ├── project-algorithms.svg
│   ├── project-java.svg
│   ├── project-library.svg
│   └── skills-chart.svg
│
└── README.md
```

## Website Pages

| Page | Description |
|---|---|
| `index.html` | Main page and introduction |
| `about.html` | Personal information and background |
| `projects.html` | Projects, search, filters, favorites, CRUD and GitHub repositories |
| `skills.html` | Programming skills and categories |
| `experience.html` | Education and development experience |
| `contact.html` | Contact information and validated contact form |

## Final Project Features

### 1. GitHub API Integration

The project uses the GitHub REST API to retrieve public repositories.

The implementation uses:

- `fetch()`
- `async/await`
- JSON response processing
- Dynamic DOM elements
- Loading, success, empty, and error states

No private API key is required for the public repository requests used in this project.

### 2. Object-Oriented Programming

The project contains two JavaScript classes:

- `PortfolioProject`
- `PortfolioStorage`

`PortfolioProject` represents project data and provides methods for searching and converting objects to JSON.

`PortfolioStorage` provides methods for reading, writing, and removing LocalStorage data.

### 3. LocalStorage

The website saves:

- Favorite projects.
- Custom projects.
- Selected theme.

Saved information is restored when the website is opened again.

The application also handles missing and invalid stored JSON values.

### 4. CRUD Operations

Users can:

- Create custom projects.
- View project cards.
- Edit their own projects.
- Delete custom projects.

### 5. Advanced Search and Filtering

Users can search projects and filter them by category or favorites.

### 6. Dashboard and Statistics

The project dashboard displays the total number of projects, favorites, and custom projects.

### 7. Advanced Form Validation

The contact form validates the name, email, topic, message, and consent checkbox.

### 8. Dark Mode

Users can switch between light and dark themes. The selected theme is saved in LocalStorage.

## Installation and Testing

The project is a static website and does not require a backend server.

1. Clone the repository:

```bash
git clone https://github.com/StudyAitu/muratbek_endterm_portfolio-.git
```

2. Open the project folder:

```bash
cd muratbek_endterm_portfolio-
```

3. Open `index.html` in a browser.

Alternatively, open the folder in Visual Studio Code and use the Live Server extension.

An internet connection is required for Bootstrap, jQuery, and GitHub API requests.

## API Information

The project uses the public GitHub REST API.

Organization endpoint:

```text
https://api.github.com/orgs/StudyAitu/repos?type=public&sort=updated&per_page=6
```

User endpoint fallback:

```text
https://api.github.com/users/StudyAitu/repos?type=owner&sort=updated&per_page=6
```

The application tries the organization endpoint first and then the user endpoint if the first request fails.

Official documentation:

https://docs.github.com/en/rest/repos/repos

## LocalStorage Keys

| Key | Stored information |
|---|---|
| `portfolioFavorites` | Favorite project IDs |
| `portfolioCustomProjects` | User-created and edited projects |
| `portfolioTheme` | Selected light or dark theme |

## Testing Checklist

- [ ] All six pages open correctly.
- [ ] Navigation links work.
- [ ] Project search works.
- [ ] Category filtering works.
- [ ] Favorites can be added and removed.
- [ ] Custom projects can be created, edited, and deleted.
- [ ] Project data remains after refreshing the page.
- [ ] Theme preference remains after refreshing the page.
- [ ] Contact form validation works.
- [ ] GitHub API data loads or displays an error state.
- [ ] Website layout works on desktop and mobile.
- [ ] Browser console has no unexpected errors.

## Author

**Muratbek Ibrai**  
Software Engineering Student  
Astana IT University  
Group SE-2529
