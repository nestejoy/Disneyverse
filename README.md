# 🏰 DisneyVerse

A magical Disney character explorer web application built with HTML, CSS, and JavaScript. Browse, search, and quiz yourself on your favorite Disney characters!

## ✨ Features

### 🏠 Homepage
- **Random Character Display** - Every visit shows different Disney characters from a randomized API page
- **Character Carousel** - Beautiful 3D scrolling carousel with character cards
- **Smart Search** - Search dropdown with all Disney characters for quick navigation
- **Character Details** - Click any character to view detailed information

### 🖼️ Gallery
- **Browse All Characters** - Paginated gallery of all Disney characters
- **Page Navigation** - Jump to specific pages (25, 50, 75, 100, 125, 150)
- **Default Images** - Graceful fallback for characters without images

### 🎮 Quiz
- **4 Difficulty Levels:**
  | Difficulty | Questions | Lives | Points Multiplier |
  |------------|-----------|-------|-------------------|
  | Easy | 10 | ∞ | 1x |
  | Intermediate | 20 | 5 | 1.5x |
  | Advanced | 30 | 3 | 2x |
  | Hard | 40 | 1 | 3x |

- **Lives System** - Limited lives based on difficulty (game over when you run out!)
- **Points System** - Earn more points on harder difficulties
- **Lives Bonus** - Remaining lives converted to bonus points at the end
- **Leaderboard** - Top 10 scores saved locally with player names

### 📊 Leaderboard
- Persistent score storage using localStorage
- Rankings sorted by total points
- Displays rank, name, points, score, difficulty, and date
- Medal icons for top 3 players (🥇🥈🥉)

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox, Grid, animations
- **JavaScript (ES6+)** - Async/await, Fetch API, DOM manipulation
- **[Disney API](https://disneyapi.dev/)** - Character data source
- **localStorage** - Client-side data persistence
- **GSAP** - Smooth scroll animations on homepage

## 📁 Project Structure

```
DisneyVerse/
├── index.html              # Homepage
├── README.md               # This file
├── css/
│   ├── style.css          # Homepage styles
│   ├── gallery.css        # Gallery page styles
│   ├── quiz.css           # Quiz page styles
│   └── details.css        # Character details styles
├── html/
│   ├── gallery.html       # Character gallery page
│   ├── quiz.html          # Quiz game page
│   └── details.html       # Character details page
├── js/
│   ├── script.js          # Homepage functionality
│   ├── gallery.js         # Gallery functionality
│   ├── quiz.js            # Quiz game logic
│   └── details.js         # Character details functionality
└── images/
    ├── D.png              # Favicon
    ├── search.gif         # Search icon
    └── default.jfif       # Default character image
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DisneyVerse.git
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server like Live Server in VS Code

3. **Start exploring!**
   - Browse characters on the homepage
   - Visit the Gallery for all characters
   - Test your knowledge in the Quiz

## 🎯 How to Play the Quiz

1. Select a difficulty level
2. Look at the character image
3. Choose the correct name from 4 options
4. Earn points for correct answers (10 × multiplier)
5. Don't run out of lives!
6. Enter your name to save your score to the leaderboard

## 🌐 API Reference

This project uses the [Disney API](https://disneyapi.dev/) to fetch character data.

**Endpoints used:**
- `GET /character?page={page}&pageSize=50` - Fetch characters by page
- `GET /character/{id}` - Fetch single character details

## 📱 Responsive Design

The application is designed for desktop viewing with a fixed width of 1100px for optimal character display.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is for educational purposes. Disney characters and related content are property of The Walt Disney Company.

## 👨‍💻 Author

Created as a final project for **Client Server Technologies and Architectures** course.

---

*"All our dreams can come true, if we have the courage to pursue them." - Walt Disney* ✨
