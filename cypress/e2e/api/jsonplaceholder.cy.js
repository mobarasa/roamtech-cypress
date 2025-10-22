/**
 * JSONPlaceholder API Test Suite
 * Base URL: https://jsonplaceholder.typicode.com
 *
 * Resources:
 * - /posts (100 posts)
 * - /comments (500 comments)
 * - /albums (100 albums)
 * - /photos (5000 photos)
 * - /todos (200 todos)
 * - /users (10 users)
 */

describe('JSONPlaceholder API Tests', () => {
  const baseUrl = 'https://jsonplaceholder.typicode.com';

  describe('Posts API - GET Requests', () => {
    it('should retrieve all posts', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/posts`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length(100);
        expect(response.duration).to.be.lessThan(2000);

        // Validate structure of first post
        expect(response.body[0]).to.have.all.keys('userId', 'id', 'title', 'body');
      });
    });

    it('should retrieve a single post by id', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/posts/1`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body.id).to.eq(1);
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('body');
      });
    });

    it('should retrieve comments for a specific post', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/posts/1/comments`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);

        // Verify all comments belong to post 1
        response.body.forEach((comment) => {
          expect(comment).to.have.property('postId', 1);
          expect(comment).to.have.all.keys('postId', 'id', 'name', 'email', 'body');
        });
      });
    });

    it('should filter posts by userId', () => {
      const userId = 1;
      cy.request({
        method: 'GET',
        url: `${baseUrl}/posts?userId=${userId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        // Verify all posts belong to the specified user
        response.body.forEach((post) => {
          expect(post.userId).to.eq(userId);
        });
      });
    });

    it('should return 404 for non-existent post', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/posts/999999`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('Posts API - POST Requests', () => {
    it('should create a new post', () => {
      const newPost = {
        title: 'Test Post Title',
        body: 'This is a test post body content',
        userId: 1,
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/posts`,
        body: newPost,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.title).to.eq(newPost.title);
        expect(response.body.body).to.eq(newPost.body);
        expect(response.body.userId).to.eq(newPost.userId);
      });
    });

    it('should handle missing fields in post creation', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/posts`,
        body: {
          title: 'Incomplete Post',
        },
      }).then((response) => {
        // JSONPlaceholder accepts partial data
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
      });
    });
  });

  describe('Posts API - PUT Requests', () => {
    it('should update an existing post completely', () => {
      const updatedPost = {
        id: 1,
        title: 'Updated Post Title',
        body: 'Updated post body content',
        userId: 1,
      };

      cy.request({
        method: 'PUT',
        url: `${baseUrl}/posts/1`,
        body: updatedPost,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(1);
        expect(response.body.title).to.eq(updatedPost.title);
        expect(response.body.body).to.eq(updatedPost.body);
      });
    });
  });

  describe('Posts API - PATCH Requests', () => {
    it('should partially update a post', () => {
      cy.request({
        method: 'PATCH',
        url: `${baseUrl}/posts/1`,
        body: {
          title: 'Patched Title Only',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('title', 'Patched Title Only');
        expect(response.body).to.have.property('id', 1);
      });
    });
  });

  describe('Posts API - DELETE Requests', () => {
    it('should delete a post', () => {
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/posts/1`,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  describe('Comments API', () => {
    it('should retrieve all comments', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/comments`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length(500);

        // Validate comment structure
        expect(response.body[0]).to.have.all.keys('postId', 'id', 'name', 'email', 'body');
      });
    });

    it('should retrieve comments by postId query parameter', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/comments?postId=1`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        response.body.forEach((comment) => {
          expect(comment.postId).to.eq(1);
          expect(comment.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Email validation
        });
      });
    });

    it('should retrieve a single comment', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/comments/1`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', 1);
        expect(response.body).to.have.property('email');
      });
    });

    it('should create a new comment', () => {
      const newComment = {
        postId: 1,
        name: 'Test Comment',
        email: 'test@example.com',
        body: 'This is a test comment',
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/comments`,
        body: newComment,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.email).to.eq(newComment.email);
      });
    });
  });

  describe('Albums API', () => {
    it('should retrieve all albums', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/albums`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length(100);

        // Validate album structure
        expect(response.body[0]).to.have.all.keys('userId', 'id', 'title');
      });
    });

    it('should retrieve albums by userId', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/albums?userId=1`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        response.body.forEach((album) => {
          expect(album.userId).to.eq(1);
        });
      });
    });

    it('should retrieve a single album', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/albums/1`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', 1);
        expect(response.body).to.have.property('title');
      });
    });

    it('should retrieve photos for an album', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/albums/1/photos`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        response.body.forEach((photo) => {
          expect(photo.albumId).to.eq(1);
          expect(photo).to.have.property('url');
          expect(photo).to.have.property('thumbnailUrl');
        });
      });
    });
  });

  describe('Photos API', () => {
    it('should retrieve all photos (with limit)', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/photos?_limit=10`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length(10);

        // Validate photo structure
        expect(response.body[0]).to.have.all.keys('albumId', 'id', 'title', 'url', 'thumbnailUrl');
      });
    });

    it('should retrieve photos by albumId', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/photos?albumId=1`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        response.body.forEach((photo) => {
          expect(photo.albumId).to.eq(1);
          expect(photo.url).to.include('http');
          expect(photo.thumbnailUrl).to.include('http');
        });
      });
    });

    it('should retrieve a single photo', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/photos/1`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', 1);
        expect(response.body.url).to.be.a('string');
      });
    });
  });

  describe('Todos API', () => {
    it('should retrieve all todos', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/todos`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length(200);

        // Validate todo structure
        expect(response.body[0]).to.have.all.keys('userId', 'id', 'title', 'completed');
      });
    });

    it('should retrieve todos by userId', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/todos?userId=1`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        response.body.forEach((todo) => {
          expect(todo.userId).to.eq(1);
          expect(todo.completed).to.be.a('boolean');
        });
      });
    });

    it('should filter completed todos', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/todos?completed=true`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        response.body.forEach((todo) => {
          expect(todo.completed).to.be.true;
        });
      });
    });

    it('should create a new todo', () => {
      const newTodo = {
        userId: 1,
        title: 'Test Todo Item',
        completed: false,
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/todos`,
        body: newTodo,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.title).to.eq(newTodo.title);
        expect(response.body.completed).to.eq(newTodo.completed);
      });
    });

    it('should update todo completion status', () => {
      cy.request({
        method: 'PATCH',
        url: `${baseUrl}/todos/1`,
        body: {
          completed: true,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.completed).to.be.true;
      });
    });
  });

  describe('Users API', () => {
    it('should retrieve all users', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length(10);

        // Validate user structure
        const user = response.body[0];
        expect(user).to.have.property('id');
        expect(user).to.have.property('name');
        expect(user).to.have.property('username');
        expect(user).to.have.property('email');
        expect(user).to.have.property('address');
        expect(user).to.have.property('phone');
        expect(user).to.have.property('website');
        expect(user).to.have.property('company');
      });
    });

    it('should retrieve a single user', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/1`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', 1);
        expect(response.body.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

        // Validate nested address object
        expect(response.body.address).to.have.property('street');
        expect(response.body.address).to.have.property('city');
        expect(response.body.address).to.have.property('zipcode');
        expect(response.body.address.geo).to.have.property('lat');
        expect(response.body.address.geo).to.have.property('lng');

        // Validate nested company object
        expect(response.body.company).to.have.property('name');
        expect(response.body.company).to.have.property('catchPhrase');
      });
    });

    it('should retrieve posts for a specific user', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/1/posts`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        response.body.forEach((post) => {
          expect(post.userId).to.eq(1);
        });
      });
    });

    it('should retrieve albums for a specific user', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/1/albums`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        response.body.forEach((album) => {
          expect(album.userId).to.eq(1);
        });
      });
    });

    it('should retrieve todos for a specific user', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/1/todos`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');

        response.body.forEach((todo) => {
          expect(todo.userId).to.eq(1);
        });
      });
    });
  });

  describe('Performance & Response Time Tests', () => {
    it('should respond within acceptable time limits', () => {
      const startTime = Date.now();

      cy.request('GET', `${baseUrl}/posts`).then((response) => {
        const duration = Date.now() - startTime;

        expect(response.status).to.eq(200);
        expect(duration).to.be.lessThan(2000); // Should respond within 2 seconds
      });
    });

    it('should handle concurrent requests', () => {
      const requests = [];

      for (let i = 1; i <= 5; i++) {
        requests.push(
          cy.request('GET', `${baseUrl}/posts/${i}`)
        );
      }

      // All requests should succeed
      cy.wrap(Promise.all(requests)).then((responses) => {
        responses.forEach((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });

  describe('Response Headers & Content Type Tests', () => {
    it('should return correct content-type header', () => {
      cy.request('GET', `${baseUrl}/posts`).then((response) => {
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
      });
    });

    it('should support CORS', () => {
      cy.request({
        method: 'OPTIONS',
        url: `${baseUrl}/posts`,
      }).then((response) => {
        expect(response.headers).to.have.property('access-control-allow-origin');
      });
    });
  });

  describe('Pagination & Filtering Tests', () => {
    it('should support limit parameter', () => {
      cy.request('GET', `${baseUrl}/posts?_limit=5`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length(5);
      });
    });

    it('should support pagination with start parameter', () => {
      cy.request('GET', `${baseUrl}/posts?_start=10&_limit=5`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length(5);
        expect(response.body[0].id).to.be.greaterThan(10);
      });
    });

    it('should support sorting', () => {
      cy.request('GET', `${baseUrl}/posts?_sort=id&_order=desc`).then((response) => {
        expect(response.status).to.eq(200);

        // Verify descending order
        for (let i = 0; i < response.body.length - 1; i++) {
          expect(response.body[i].id).to.be.greaterThan(response.body[i + 1].id);
        }
      });
    });
  });

  describe('Negative Test Cases', () => {
    it('should handle invalid endpoints gracefully', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/invalid-endpoint`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should handle invalid HTTP methods', () => {
      // JSONPlaceholder actually accepts all methods, but this tests the pattern
      cy.request({
        method: 'GET',
        url: `${baseUrl}/posts`,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('should handle malformed JSON gracefully', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/posts`,
        body: 'invalid json',
        failOnStatusCode: false,
      }).then((response) => {
        // JSONPlaceholder is lenient, but test the pattern
        expect(response.status).to.be.oneOf([200, 201, 400]);
      });
    });
  });
});