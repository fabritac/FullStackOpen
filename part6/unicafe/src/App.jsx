import { create } from 'zustand'

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100

  if (all == 0) {
    return (
      <p>No feedback given</p>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticLine text={"good"} value={good} />
        <StatisticLine text={"neutral"} value={neutral} />
        <StatisticLine text={"bad"} value={bad} />
        <StatisticLine text={"all"} value={all} />
        <StatisticLine text={"average"} value={average} />
        <StatisticLine text={"positive"} value={positive + " %"} />
      </tbody>
    </table>
  )
}

const StatisticLine = (props) => {
  return (
    <>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const useCounterStore = create(set => ({
  good: 0,
  incrementGood: () => set(state => ({ good: state.good + 1 })),
  bad: 0,
  incrementBad: () => set(state => ({ bad: state.bad + 1 })),
  neutral: 0,
  incrementNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
}))

const App = () => {
  const good = useCounterStore(state => state.good)
  const incrementGood = useCounterStore(state => state.incrementGood)

  const bad = useCounterStore(state => state.bad)
  const incrementBad = useCounterStore(state => state.incrementBad)

  const neutral = useCounterStore(state => state.neutral)
  const incrementNeutral = useCounterStore(state => state.incrementNeutral)

  return (
    <>
      <h1>give feedback</h1>
      <Button onClick={incrementGood} text={"good"} />
      <Button onClick={incrementNeutral} text={"neutral"} />
      <Button onClick={incrementBad} text={"bad"} />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App