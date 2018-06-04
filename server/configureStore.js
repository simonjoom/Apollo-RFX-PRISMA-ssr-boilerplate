import { doesRedirect } from 'rfx/utils'
import configureStore from '../src/configureStore'

export default async (req, res) => {
  const { store, firstRoute, client } = configureStore(undefined, req.path)


  const route = firstRoute(); 

  try {
   /* store.getState=()=>{
      return client.getState()
    }*/

    const result = await store.dispatch(route);
    if (doesRedirect(result, res)) return false

    const { status } = store.getState().location
    res.status(status)

    return { store, client }
  } catch (error) {
    console.log("ce", error)
  }
}
