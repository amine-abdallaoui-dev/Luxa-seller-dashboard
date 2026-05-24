import { configureStore } from '@reduxjs/toolkit'
import rootReducers from './Reducers/rootReducers'

   
    const store = configureStore({
        reducer : rootReducers,
         middleware : (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck : false
        })
        })

export default store
