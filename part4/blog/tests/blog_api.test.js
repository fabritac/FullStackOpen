const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

const loginUser = async (username, password) => {
    const response = await api
        .post('/api/login')
        .send({ username, password })
        .expect(200)

    return response.body.token
}

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    },
    {
        title: 'Python for beginners',
        author: 'John Doe',
        url: 'https://pythonforbeginners.com/',
        likes: 10
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)
        assert(titles.includes('Go To Statement Considered Harmful'))
    })

    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        assert.ok(blog.id)
    })
})

describe('POST /api/blogs', () => {
    test('a valid blog can be added with a valid token', async () => {
        await helper.populateUsers()
        const token = await loginUser(helper.initialUsers[0].username, helper.initialUsers[0].password)

        const newBlog = {
            title: 'New Blog Post',
            author: 'John Doe',
            url: 'https://newblogpost.com/',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length + 1)
    })

    test('if likes property is missing, it will default to 0', async () => {
        await helper.populateUsers()
        const token = await loginUser(helper.initialUsers[0].username, helper.initialUsers[0].password)

        const newBlog = {
            title: 'Blog Without Likes',
            author: 'John Doe',
            url: 'https://blogwithoutlikes.com/'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body[response.body.length - 1].likes, 0)
    })

    test('a blog is associated with the authenticated user', async () => {
        await helper.populateUsers()
        const token = await loginUser(helper.initialUsers[0].username, helper.initialUsers[0].password)

        const newBlog = {
            title: 'Blog With User',
            url: 'https://blogwithuser.com/'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        assert.strictEqual(response.body.user.username, helper.initialUsers[0].username)

        const usersResponse = await api.get('/api/users')
        const associatedUser = usersResponse.body.find(
            user => user.username === helper.initialUsers[0].username
        )
        assert.ok(associatedUser.blogs.some(blog => blog.id === response.body.id))
    })

    test('blog creation fails without a token', async () => {
        const newBlog = {
            title: 'Blog Without Token',
            author: 'John Doe',
            url: 'https://blogwithouttoken.com/'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('blog creation fails with an invalid token', async () => {
        const newBlog = {
            title: 'Blog With Invalid Token',
            author: 'John Doe',
            url: 'https://blogwithinvalidtoken.com/'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer invalid-token')
            .send(newBlog)
            .expect(401)
    })

    test('blog without title and url is not added', async () => {
        await helper.populateUsers()
        const token = await loginUser(helper.initialUsers[0].username, helper.initialUsers[0].password)

        const newBlog = {
            author: 'John Doe',
            url: 'https://blogwithouttitleandurl.com/'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })
})

describe('DELETE /api/blogs/:id', () => {
    test('a blog can be deleted by the authenticated user', async () => {
        await helper.populateUsers()
        const token = await loginUser(helper.initialUsers[0].username, helper.initialUsers[0].password)

        const newBlog = {
            title: 'Blog To Delete',
            author: 'John Doe',
            url: 'https://blogtodelete.com/'
        }

        const createdBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        await api
            .delete(`/api/blogs/${createdBlog.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await api.get('/api/blogs')
        assert.ok(!blogsAtEnd.body.some(blog => blog.id === createdBlog.body.id))
    })

    test('an unauthorized user cannot delete a blog', async () => {
        await helper.populateUsers()
        const token = await loginUser(helper.initialUsers[0].username, helper.initialUsers[0].password)
        const otherUserToken = await loginUser(helper.initialUsers[1].username, helper.initialUsers[1].password)

        const newBlog = {
            title: 'Blog Owned by Another User',
            author: 'Jane Doe',
            url: 'https://blogownedbyanotheruser.com/'
        }

        const createdBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        await api
            .delete(`/api/blogs/${createdBlog.body.id}`)
            .set('Authorization', `Bearer ${otherUserToken}`)
            .expect(401)

        const blogsAtEnd = await api.get('/api/blogs')
        assert.ok(blogsAtEnd.body.some(blog => blog.id === createdBlog.body.id))
    })
})

describe('PUT /api/blogs/:id', () => {
    test('a blog can be updated', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToUpdate = blogsAtStart.body[0]

        const updatedBlogData = {
            likes: blogToUpdate.likes + 1
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlogData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await api.get('/api/blogs')
        const updatedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id)
        assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
    })
})

describe('when the initial users are loaded', () => {
    beforeEach(async () => {
        await helper.populateUsers()
    })

    test('all initial users are loaded', async () => {
        const response = await api.get('/api/users').expect(200)
        const usernames = response.body.map(user => user.username)

        assert.strictEqual(response.body.length, helper.initialUsers.length)
        assert.deepStrictEqual(
            usernames.sort(),
            helper.initialUsers.map(user => user.username).sort()
        )
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'newuser',
            name: 'New User',
            password: 'password123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert.ok(usernames.includes(newUser.username))
    })

    test('creation fails with an existing username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: helper.initialUsers[0].username,
            name: 'New User',
            password: 'password123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
