import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            let temp = action.payload
            if(temp){
                state.userData = temp
            }
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        },
        updateDetails : (state , action) => {
            state.userData.fullName = action.payload?.fullName;
            state.userData.userName = action.payload?.userName;
            
        }
     }
})

export const {login, logout , updateDetails } = authSlice.actions;

export default authSlice.reducer;