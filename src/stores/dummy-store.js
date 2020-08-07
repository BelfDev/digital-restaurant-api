/**
 * In-memory todos store.
 * For demo purposes, gets the logger injected.
 */
export default function createTodoStore(logger, db) {
    let __todos = ['Todo 1', 'Todo 2']
    let __ids = 1

    return {
        async find() {
            // logger.debug('Finding todos')
            // return {values: [...__todos]}
            const cuisines = await db.Cuisines.findAll({
                include: [
                    {
                        model: db.Images,
                        attributes: {
                            exclude: ['id']
                        }
                    }
                ],
                attributes: {
                    exclude: [
                        'imageId',
                    ]
                }
            });
            return {cuisines}
            // const images = await db.Images.findAll();
            // return  {images}
        },

        async get(id) {
            logger.debug(`Getting todo with id ${id}`)
            const found = __todos.find(x => x.id === id.toString())
            if (!found) {
                return null
            }
            return {...found}
        },

        async create(data) {
            const todo = {
                ...data,
                id: (__ids++).toString()
            }
            __todos.push(todo)
            logger.debug(`Created new todo`, todo)
            return todo
        },

        async update(id, data) {
            const todo = __todos.find(x => x.id === id.toString())
            Object.assign(todo, data)
            logger.debug(`Updated todo ${id}`, todo)
            return todo
        },

        async remove(id) {
            __todos = __todos.filter(x => x.id !== id.toString())
            logger.debug(`Removed todo ${id}`)
        }
    }
}
