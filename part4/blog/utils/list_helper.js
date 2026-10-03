const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const maxLikesIdx = blogs.reduce(
        (maxIdx, item, index, array) =>
            item.likes > array[maxIdx].likes ? index : maxIdx,
        0
    );

    return blogs[maxLikesIdx]
}

const mostBlogs = (blogs) => {
    const contador = lodash.countBy(blogs, 'author')
    const [author, cantidad] = lodash.maxBy(
        lodash.toPairs(contador),
        ([, cantidad]) => cantidad
    )

    return {
        author,
        blogs: cantidad
    }
}

const mostLikes = (blogs) => {
    const likesByAuthor = lodash.map(
        lodash.toPairs(lodash.groupBy(blogs, 'author')),
        ([author, authorBlogs]) => ({
            author,
            likes: lodash.sumBy(authorBlogs, 'likes')
        })
    )

    return lodash.maxBy(likesByAuthor, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
