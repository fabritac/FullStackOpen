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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}
