# Precision Sky Solutions - Drone Services Website

A modern, professional website for Precision Sky Solutions, showcasing drone services for commercial businesses, weddings, events, and industrial applications.

## Features

- **Modern Design**: Clean, contemporary layout with smooth animations and transitions
- **Foundation CSS Framework**: Built with Foundation 6.8.1 for responsive, mobile-first design
- **Brand Colors**: Custom color scheme using #3672cc (primary blue), white, and black
- **Video Hero Section**: Full-screen video background with overlay
- **Responsive Navigation**: Mobile-friendly menu with smooth scrolling
- **Service Showcase**: Six main service categories with detailed descriptions
- **Industry Coverage**: Visual showcase of industries served
- **Portfolio Gallery**: Dynamic grid layout for project showcases
- **Statistics Counter**: Animated counters for key metrics
- **Contact Form**: Functional contact form with validation
- **Smooth Animations**: AOS (Animate On Scroll) library integration

## Technologies Used

- HTML5
- CSS3 (Custom styles with CSS Grid and Flexbox)
- Foundation CSS 6.8.1
- JavaScript/jQuery
- Font Awesome 6.4.0 (Icons)
- Google Fonts (Montserrat & Roboto)
- AOS (Animate On Scroll)

## Services Offered

1. **Commercial Real Estate** - Aerial photography and videography for properties
2. **Weddings & Events** - Cinematic coverage of special occasions
3. **Construction & Inspection** - Aerial surveys and safety inspections
4. **Cinematic Production** - Professional-grade aerial cinematography
5. **Mapping & Surveying** - 3D mapping and topographic surveys
6. **Thermal Imaging** - Advanced thermal inspection services

## Industries Covered

- Construction
- Weddings & Events
- Real Estate
- Agriculture

## Getting Started

### Prerequisites

- Node.js (optional, for local development server)
- Modern web browser

### Installation

1. Clone or download the repository
2. Navigate to the project directory
3. Install dependencies (optional):
   ```bash
   npm install
   ```

### Running the Website

#### Option 1: Using npm (recommended)
```bash
npm start
```
This will start a local server at `http://localhost:8080`

#### Option 2: Direct file opening
Simply open `index.html` in your web browser

#### Option 3: Using Python
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

## Project Structure

```
precision-sky-solutions/
│
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Custom styles
├── js/
│   └── script.js          # JavaScript functionality
├── package.json           # Project dependencies
└── README.md             # This file
```

## Customization

### Replacing Placeholder Images

The website currently uses placeholder images from Unsplash and iStock. To replace them with your own:

1. Locate image URLs in `index.html`
2. Replace with your own image paths
3. Ensure images are optimized for web (compressed, appropriate dimensions)

### Replacing Video Background

1. Find the video element in the hero section
2. Replace the video source URL with your own video file
3. Recommended: Use MP4 format, 1080p resolution, compressed for web

### Updating Contact Information

Edit the contact section in `index.html`:
- Phone number
- Email address
- Location/service area
- Social media links

### Modifying Brand Colors

Update CSS variables in `styles.css`:
```css
:root {
    --primary-color: #3672cc;  /* Your primary brand color */
    --secondary-color: #ffffff; /* White */
    --dark-color: #000000;     /* Black */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Images are loaded from CDN sources
- CSS and JavaScript are minified in production
- Lazy loading implemented for images
- Smooth scroll behavior optimized

## Future Enhancements

- Blog section for industry insights
- Client testimonials carousel
- Live chat integration
- Booking/scheduling system
- Gallery with lightbox functionality
- Video portfolio section

## License

MIT License - Feel free to use and modify for your needs

## Contact

For questions or support regarding this website:
- Email: info@precisionskysolutions.com
- Phone: +1 (555) 123-4567

---

**Note**: Remember to replace all placeholder content (images, videos, contact information) with your actual company assets before deploying to production.
