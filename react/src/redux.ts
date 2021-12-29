import { configureStore } from "@reduxjs/toolkit";
import mapReducer, { getBackwardMaps as DBgetBackwardMaps, getForwardMaps as DBgetForwardMaps, getMap as DBgetMap, setAll } from "./slices/map";

const store = configureStore({
  reducer: {
    map: mapReducer,
  },
});


document.addEventListener('mapDBReady',
  async () => {
   
    
   
   store.dispatch(setAll({
     map: await DBgetMap(),
     forward_maps: await DBgetForwardMaps(),
     backward_maps: await DBgetBackwardMaps(),
     DBready: true

   }))
  }
)

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
