const NotificationError = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="error">
            {message}
        </div>
    )
}

const NotificationSuccess = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="success">
            {message}
        </div>
    )
}

export { NotificationError, NotificationSuccess }