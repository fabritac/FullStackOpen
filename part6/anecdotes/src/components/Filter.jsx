import { useStoreActions } from '../store'
import { useAnecdotes } from '../store'

const Filter = () => {
    const { filter } = useAnecdotes()
    const { setFilter } = useStoreActions()

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Filter anecdotes"
                onChange={handleFilterChange}
                value={filter}
            />
        </div>
    )
}

export default Filter