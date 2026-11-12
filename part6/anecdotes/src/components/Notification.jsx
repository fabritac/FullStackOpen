const Notification = ({ message, type }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return (
    <div style={{ ...style, color: type === 'error' ? 'red' : 'green' }}>
      {message}
    </div>
  )
}

export default Notification