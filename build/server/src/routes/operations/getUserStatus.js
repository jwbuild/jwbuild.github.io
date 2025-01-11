import { createQuery } from '../../middleware/operations.js'
import getUserStatus from '../../queries/getUserStatus.js'

export default createQuery(getUserStatus)
