import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService'

// Get user from localStorage //the jwtoken
const userItem = localStorage.getItem('user');
const user = JSON.parse(userItem)
const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    errors: {}

}

// Login user middleware
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {

    try {
        
        //Treat status senarios
        /*if(response.staus===200){
         
        }*/
        return await authService.login(user)

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('auth/logout', async () => {
    authService.logout()
})
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },

        setErrors: (state, action) => {
            state.errors = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.isSuccess = 'false'
                authService.logout(user)
            })
    },
})

export const { reset, updateForm, setErrors } = authSlice.actions
export default authSlice.reducer
