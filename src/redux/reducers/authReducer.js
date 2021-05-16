import { GET_PROFILE, GET_VERSION } from '../action/authAction'

const initState = {
    profile: null
}

const authReducer = (state = initState, action) => {

    switch (action.type) {
        case GET_PROFILE:
            return {
                ...state,
                profile: action.payload.profile //รับค่าจาก action return ออกไปให้ view ที่ต้องการแสดง
            }

        case GET_VERSION:
            return {
                ...state,
                version: action.payload.version
            }
        default:
        return state
    }
}

export default authReducer