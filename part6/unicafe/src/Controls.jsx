import { useCounterControls } from "./store"

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const Controls = () => {
  const { incrementGood, incrementBad, incrementNeutral } = useCounterControls()

  return (
    <>
      <h1>give feddback</h1>
      <Button onClick={incrementGood} text={"good"} />
      <Button onClick={incrementNeutral} text={"neutral"} />
      <Button onClick={incrementBad} text={"bad"} />
    </>
  )
}

export default Controls