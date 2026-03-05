import { useState } from 'react'

const Statistics = (props) => {
  if (props.all == 0) {
    return(
      <p>No feedback given</p>
    )
  }

  return(
    <div>
      <h1>statistics</h1>
      <StatisticLine text={"good"} value={props.good}/>
      <StatisticLine text={"neutral"} value={props.neutral}/>
      <StatisticLine text={"bad"} value={props.bad}/>
      <StatisticLine text={"all"} value={props.all}/>
      <StatisticLine text={"average"} value={props.average}/>
      <StatisticLine text={"positive"} value={props.positive}/>
    </div>
  )
}

const StatisticLine = (props) => {
  return(
    <div>{props.text} {props.value}</div>
  )
}

const Button = (props) => {
  return(
      <button onClick={props.onClick}>{props.text}</button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text={"good"} />
      <Button onClick={() => setNeutral(neutral + 1)} text={"neutral"} />
      <Button onClick={() => setBad(bad + 1)} text={"bad"} />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
   </div>
  )
}

export default App