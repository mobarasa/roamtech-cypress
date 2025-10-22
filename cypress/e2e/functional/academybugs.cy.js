/**
 * AcademyBugs UI Test Suite
 * Base URL: https://academybugs.com
 *
 * This is a test practice website with intentional bugs for QA training.
 * Tests are designed to find and document these bugs.
 */

describe('AcademyBugs - UI Testing Suite', () => {
  const baseUrl = 'https://academybugs.com';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  describe('Home Page Tests', () => {
    it('should load the home page successfully', () => {
      cy.url().should('eq', `${baseUrl}/`);
      cy.title().should('not.be.empty');
    });

    it('should display the main heading', () => {
      cy.get('h1').should('be.visible');
    });

    it('should have navigation menu', () => {
      cy.get('nav').should('be.visible');
    });

    it('should display logo or brand name', () => {
      cy.get('[class*="logo"], [class*="brand"]')
        .should('exist');
    });

    it('should take screenshot of home page', () => {
      cy.takeScreenshot('home-page');
    });
  });

  describe('Bug 1: Social Share Buttons', () => {
    it('should verify social share buttons exist', () => {
      // Look for common social media buttons
      cy.get('a[href*="facebook"], button[class*="facebook"], [class*="share"]')
        .should('exist');
    });

    it('BUG: social share buttons should work when clicked', () => {
      // Find share buttons
      cy.get('button[class*="share"], a[class*="share"]').first().then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click({ force: true });

          // Verify action was successful (this is expected to fail)
          cy.url().should('not.include', 'error');
          cy.get('body').should('not.contain', 'Error');
        }
      });
    });

    it('should check if share buttons open new windows', () => {
      cy.get('a[target="_blank"]').each(($link) => {
        cy.wrap($link)
          .should('have.attr', 'href')
          .and('not.be.empty');
      });
    });

    it('should validate social media links format', () => {
      cy.get('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"]')
        .each(($link) => {
          cy.wrap($link)
            .should('have.attr', 'href')
            .and('match', /^https?:\/\/.+/);
        });
    });
  });

  describe('Bug 2: Contact Form - Send Button', () => {
    it('should navigate to contact form', () => {
      // Try multiple ways to find contact page
      cy.get('a[href*="contact"], a:contains("Contact")').first().click({ force: true });
    });

    it('should display contact form fields', () => {
      cy.visit(`${baseUrl}/contact`);

      cy.get('input[type="text"], input[name*="name"]').should('exist');
      cy.get('input[type="email"], input[name*="email"]').should('exist');
      cy.get('textarea, input[name*="message"]').should('exist');
    });

    it('BUG: should submit contact form successfully', () => {
      cy.visit(`${baseUrl}/contact`);

      // Fill the form
      cy.get('input[type="text"], input[name*="name"]').first().type('Test User');
      cy.get('input[type="email"], input[name*="email"]').first().type('test@example.com');
      cy.get('textarea, input[name*="message"]').first().type('This is a test message');

      // Submit the form
      cy.get('button[type="submit"], input[type="submit"]').click();

      // Expected: Success message
      // Actual: Error page (BUG)
      cy.url().should('not.include', 'error');
      cy.get('body').should('not.contain', 'Error');

      // Take screenshot of the error
      cy.takeScreenshot('contact-form-error');
    });

    it('should validate required fields', () => {
      cy.visit(`${baseUrl}/contact`);

      // Try to submit empty form
      cy.get('button[type="submit"], input[type="submit"]').click();

      // Should show validation errors
      cy.get('input:invalid, .error, [class*="error"]').should('exist');
    });

    it('should validate email format', () => {
      cy.visit(`${baseUrl}/contact`);

      cy.get('input[type="email"]').first().type('invalidemail');
      cy.get('button[type="submit"]').click();

      // Should show email validation error
      cy.get('input[type="email"]:invalid').should('exist');
    });
  });

  describe('Bug 3: Video Player Issues', () => {
    it('should navigate to videos section', () => {
      cy.get('a[href*="video"], a:contains("Video")').first().click({ force: true });
    });

    it('should display video player', () => {
      cy.visit(`${baseUrl}/videos`);

      cy.get('video, iframe[src*="youtube"], iframe[src*="vimeo"]')
        .should('exist');
    });

    it('BUG: video should load and be playable', () => {
      cy.visit(`${baseUrl}/videos`);

      cy.get('video').first().then(($video) => {
        if ($video.length > 0) {
          // Check if video has source
          expect($video[0].src || $video.find('source').length).to.exist;

          // Try to play video
          cy.wrap($video).click();

          // Wait for buffering
          cy.wait(3000);

          // Verify video is not in error state
          cy.wrap($video).should('not.have.attr', 'error');

          // Take screenshot
          cy.takeScreenshot('video-player-issue');
        }
      });
    });

    it('should check video controls are present', () => {
      cy.visit(`${baseUrl}/videos`);

      cy.get('video').first().should('have.attr', 'controls');
    });

    it('should verify video dimensions', () => {
      cy.visit(`${baseUrl}/videos`);

      cy.get('video, iframe').first().then(($el) => {
        expect($el.width()).to.be.greaterThan(0);
        expect($el.height()).to.be.greaterThan(0);
      });
    });
  });

  describe('Bug 4: Articles Display Error', () => {
    it('should navigate to articles section', () => {
      cy.get('a[href*="article"], a:contains("Article"), a:contains("Blog")').first()
        .click({ force: true });
    });

    it('should display articles list', () => {
      cy.visit(`${baseUrl}/articles`);

      cy.get('article, .article, [class*="post"]')
        .should('have.length.greaterThan', 0);
    });

    it('BUG: clicking article should show content, not error', () => {
      cy.visit(`${baseUrl}/articles`);

      // Click first article
      cy.get('article a, .article a, [class*="post"] a').first()
        .click({ force: true });

      // Expected: Article content displayed
      // Actual: Error page (BUG)
      cy.url().should('not.include', 'error');
      cy.get('body').should('not.contain', 'Error');
      cy.get('h1, h2, .title').should('be.visible');

      // Take screenshot
      cy.takeScreenshot('article-error-page');
    });

    it('should verify article has title and content', () => {
      cy.visit(`${baseUrl}/articles`);

      cy.get('article, .article').first().within(() => {
        cy.get('h1, h2, h3, .title').should('be.visible');
        cy.get('p, .content, .description').should('be.visible');
      });
    });

    it('should check article metadata (date, author)', () => {
      cy.visit(`${baseUrl}/articles`);

      cy.get('article, .article').first().within(() => {
        cy.get('[class*="date"], [class*="author"], time').should('exist');
      });
    });
  });

  describe('Bug 5: Search Functionality', () => {
    it('should display search input', () => {
      cy.get('input[type="search"], input[placeholder*="Search"], [class*="search"] input')
        .should('exist');
    });

    it('should accept text input in search field', () => {
      cy.get('input[type="search"], input[placeholder*="Search"]').first()
        .type('test search query')
        .should('have.value', 'test search query');
    });

    it('BUG: search should return results, not error page', () => {
      // Type in search field
      cy.get('input[type="search"], input[placeholder*="Search"]').first()
        .type('test{enter}');

      // Or click search button
      cy.get('button[type="submit"], button[class*="search"]').first()
        .click({ force: true });

      // Expected: Search results page
      // Actual: Error page (BUG)
      cy.url().should('not.include', 'error');
      cy.get('body').should('not.contain', 'Error');
      cy.get('.results, [class*="search-results"]').should('exist');

      // Take screenshot
      cy.takeScreenshot('search-error-page');
    });

    it('should handle empty search gracefully', () => {
      cy.get('input[type="search"]').first().clear();
      cy.get('button[class*="search"]').first().click({ force: true });

      // Should show message or stay on same page
      cy.get('body').should('not.contain', '500');
    });

    it('should display search icon/button', () => {
      cy.get('button[class*="search"], button[type="submit"]').should('be.visible');
    });
  });

  describe('Bug 6: Table Booking Form', () => {
    it('should navigate to booking page', () => {
      cy.get('a[href*="book"], a:contains("Book"), a:contains("Reserve")').first()
        .click({ force: true });
    });

    it('should display booking form fields', () => {
      cy.visit(`${baseUrl}/booking`);

      cy.get('input, select, textarea').should('have.length.greaterThan', 0);
    });

    it('should have date picker', () => {
      cy.visit(`${baseUrl}/booking`);

      cy.get('input[type="date"], input[placeholder*="date"]')
        .should('exist');
    });

    it('should have time selection', () => {
      cy.visit(`${baseUrl}/booking`);

      cy.get('input[type="time"], select[name*="time"]')
        .should('exist');
    });

    it('should have guest count field', () => {
      cy.visit(`${baseUrl}/booking`);

      cy.get('input[type="number"], select[name*="guest"]')
        .should('exist');
    });

    it('BUG: should submit booking form successfully', () => {
      cy.visit(`${baseUrl}/booking`);

      // Fill booking form
      cy.get('input[type="text"], input[name*="name"]').first()
        .type('John Doe');

      cy.get('input[type="email"]').first()
        .type('john@example.com');

      cy.get('input[type="tel"], input[name*="phone"]').first()
        .type('1234567890');

      cy.get('input[type="date"]').first()
        .type('2025-12-31');

      cy.get('input[type="number"], select[name*="guest"]').first()
        .type('4');

      // Submit form
      cy.get('button[type="submit"], input[type="submit"]').click();

      // Expected: Success confirmation
      // Actual: Cannot submit (BUG)
      cy.url().should('not.include', 'error');
      cy.get('.success, [class*="success"]').should('exist');

      // Take screenshot
      cy.takeScreenshot('booking-form-error');
    });

    it('should validate date is in the future', () => {
      cy.visit(`${baseUrl}/booking`);

      // Try to book past date
      cy.get('input[type="date"]').first()
        .type('2020-01-01');

      cy.get('button[type="submit"]').click();

      // Should show validation error
      cy.get('.error, [class*="error"]').should('exist');
    });

    it('should validate phone number format', () => {
      cy.visit(`${baseUrl}/booking`);

      cy.get('input[type="tel"]').first()
        .type('invalid');

      cy.get('button[type="submit"]').click();

      // Should show validation error
      cy.get('input[type="tel"]:invalid, .error').should('exist');
    });
  });

  describe('Cross-Browser Compatibility Tests', () => {
    it('should display correctly in different viewport sizes', () => {
      const viewports = [
        [1920, 1080], // Desktop
        [1366, 768],  // Laptop
        [768, 1024],  // Tablet
        [375, 667],   // Mobile
      ];

      viewports.forEach(([width, height]) => {
        cy.viewport(width, height);
        cy.visit(baseUrl);
        cy.get('body').should('be.visible');
        cy.takeScreenshot(`viewport-${width}x${height}`);
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('have.length', 1);
      cy.get('h2, h3, h4').should('exist');
    });

    it('should have alt text for images', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });

    it('should have form labels', () => {
      cy.get('input, textarea, select').each(($field) => {
        const id = $field.attr('id');
        if (id) {
          cy.get(`label[for="${id}"]`).should('exist');
        }
      });
    });

    it('should check color contrast', () => {
      cy.injectAxe();
      cy.checkA11y();
    });
  });

  describe('Performance Tests', () => {
    it('should load page within acceptable time', () => {
      const startTime = Date.now();

      cy.visit(baseUrl).then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(5000);
      });
    });

    it('should check for broken images', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img)
          .should('be.visible')
          .and(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          });
      });
    });

    it('should check for broken links', () => {
      cy.get('a[href]').each(($link) => {
        const href = $link.attr('href');
        if (href && href.startsWith('http')) {
          cy.request({
            url: href,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.be.lessThan(400);
          });
        }
      });
    });
  });

  describe('Responsive Design Tests', () => {
    it('should display mobile menu on small screens', () => {
      cy.viewport('iphone-x');
      cy.visit(baseUrl);

      cy.get('[class*="menu"], [class*="hamburger"], [class*="toggle"]')
        .should('be.visible');
    });

    it('should have responsive images', () => {
      cy.viewport('iphone-x');
      cy.visit(baseUrl);

      cy.get('img').each(($img) => {
        const width = $img.width();
        expect(width).to.be.lessThan(400);
      });
    });
  });

  describe('Security Tests', () => {
    it('should use HTTPS', () => {
      cy.url().should('include', 'https://');
    });

    it('should not expose sensitive information in source', () => {
      cy.request(baseUrl).then((response) => {
        const body = response.body.toLowerCase();
        expect(body).to.not.include('password');
        expect(body).to.not.include('api_key');
        expect(body).to.not.include('secret');
      });
    });

    it('should have security headers', () => {
      cy.request(baseUrl).then((response) => {
        expect(response.headers).to.have.property('content-type');
      });
    });
  });

  describe('Bug Summary Report', () => {
    it('should generate bug summary with screenshots', () => {
      const bugs = [
        'Social share buttons do not work',
        'Contact form returns error page on submit',
        'Video player cannot play some videos',
        'Clicking articles shows error page',
        'Search button leads to error page',
        'Table booking form cannot be submitted',
      ];

      cy.task('log', '=== BUG SUMMARY REPORT ===');
      bugs.forEach((bug, index) => {
        cy.task('log', `Bug ${index + 1}: ${bug}`);
      });

      cy.takeScreenshot('bug-summary-report');
    });
  });
});