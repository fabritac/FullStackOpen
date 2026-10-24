import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography
} from '@mui/material'

const Blog = ({ blog, user, onLike, onRemove }) => {
  return (
    <Card className="blog" variant="outlined">
      <CardContent>
        <Typography component="h2" variant="h5" className="blog-title" gutterBottom>
          {blog.title}
        </Typography>
        <Stack spacing={1}>
          <Typography className="blog-author">{blog.author}</Typography>
          <Typography className="blog-url">{blog.url}</Typography>
          <Typography className="blog-likes">likes {blog.likes}</Typography>
          {blog.user && (
            <Typography className="blog-owner">added by {blog.user.name}</Typography>
          )}
        </Stack>
      </CardContent>
      {user && (
        <CardActions>
          <Button onClick={() => onLike(blog)}>like</Button>
          {blog.user?.username === user.username && (
            <Button color="error" onClick={() => onRemove(blog)}>remove</Button>
          )}
        </CardActions>
      )}
    </Card>
  )
}

export default Blog