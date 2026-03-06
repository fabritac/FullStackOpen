const Course = ({course}) => {
    return (
        <div>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </div>
    )
}

const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    )
}

const Content = ({parts}) => {
    return (
        <div>
          {parts.map(part =>
            <Part key={part.id} name={part.name} exercises={part.exercises} />
          )}
        </div>
    )
}

const Part = (props) => {
    return (
        <p>{props.name} {props.exercises}</p>
    )
}

const Total = ({parts}) => {
    const total = parts.reduce((acc, cur) => acc + cur.exercises, 0)
    return (
        <p><strong>Number of exercises {total}</strong></p>
    )
}

export default Course