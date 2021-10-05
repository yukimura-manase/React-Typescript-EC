import { SETLOGINUSER, DELETELOGINUSER, FETCHRAMEN, DETAILRAMEN, FETCHCARTITEM, ADDLIKE, REMOVECART, REMOVELIKE, DELETECART, ADDNEWCART } from '../actions/ActionCreator'
import firebase from 'firebase/compat/app'


type State = {
    loginUser: firebase.User | null,
    ramen: [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ] | [],
    cart: [
        {
            id : string
            orderDate: string,
            userName: string,
            mailAddress: string,
            addressNumber: string,
            address: string,
            phoneNumber: string,
            deliveryDate: string,
            deliveryTime: string,
            status: number,
            cartItemList: [ { id:number, size:string, topping:string[], number:number, total:number | undefined } ],
            likeItemList: [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]
        }
    ] | [] 
}

export const initialState: State = {
    loginUser:null,
    ramen: [],
    cart: []
}

type Actions = {
    type: string,
    user : firebase.User,
    ramenProducts : [{ id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string }],
    selectRamen : { id:number, size:string, topping:string[], number:number, total:number },
    cartItem :[
        {
            id : string
            orderDate: string,
            userName: string,
            mailAddress: string,
            addressNumber: string,
            address: string,
            phoneNumber: string,
            deliveryDate: string,
            deliveryTime: string,
            status: number,
            cartItemList: [ { id:number, size:string, topping:string[], number:number, total:number | undefined } ],
            likeItemList: [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]
        }
    ],
    likeRamen: { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string },
    removeIndex: number,
    index: number,
    newCart: object
}

type cartType = [
    {
        id : string
        orderDate: string,
        userName: string,
        mailAddress: string,
        addressNumber: string,
        address: string,
        phoneNumber: string,
        deliveryDate: string,
        deliveryTime: string,
        status: number,
        cartItemList: [ { id:number, size:string, topping:string[], number:number, total:number | undefined } ],
        likeItemList: [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]
    }
] | []

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action: Actions)=> {
    switch(action.type){

        case SETLOGINUSER: {
            return { ...state,loginUser:action.user }
        }

        case DELETELOGINUSER: {
            return { ...state,loginUser:null }
        }

        case FETCHRAMEN: {
            return { ...state, ramen:action.ramenProducts}
        }

        case FETCHCARTITEM: {
            return { ...state, cart:action.cartItem}
        }

        case DETAILRAMEN: {
            const copyCart = state.cart.slice()

            if(typeof action.selectRamen === 'object'){
                copyCart[0].cartItemList.push(action.selectRamen)
            }

            if(state.loginUser instanceof Object){ // typeof state.loginUser === 'object' だとnullの可能性でエラーになる！
                firebase.firestore()
                .collection(`users/${state.loginUser.uid}/carts`)
                .doc(copyCart[0].id)
                .update( { cartItemList: copyCart[0].cartItemList　} )
            }
            
            
            return { ...state, cart:copyCart }
        }

        case ADDLIKE: {
            const copyCart = state.cart.slice()
            copyCart[0].likeItemList.push(action.likeRamen)

            if(state.loginUser instanceof Object){
                firebase.firestore()
                .collection(`users/${state.loginUser.uid}/carts`)
                .doc(copyCart[0].id)
                .update( { likeItemList: copyCart[0].likeItemList } )
            }
            

            return { ...state, cart:copyCart }
        }

        case REMOVECART: {
            const copyCart = state.cart.slice()
            copyCart[0].cartItemList.splice(action.index,1)

            if(state.loginUser){ // nullの場合はfalseになる
            firebase.firestore()
                .collection(`users/${state.loginUser.uid}/carts`)
                .doc(copyCart[0].id) // 自動ID => copyCart[0].id
                .update( {cartItemList:copyCart[0].cartItemList} ) 
            }

            return { ...state, cart:copyCart }
        }

        case REMOVELIKE: {
            const copyCart = state.cart.slice()
            copyCart[0].likeItemList.splice(action.index,1)

            if(state.loginUser instanceof Object){ 
            firebase.firestore()
                .collection(`users/${state.loginUser.uid}/carts`)
                .doc(copyCart[0].id) // 自動ID => copyCart[0].id
                .update( {likeItemList:copyCart[0].likeItemList} ) 
            }

            return { ...state, cart:copyCart }
        }

        case DELETECART:{
            const NoCart: cartType = []
            return { ...state, cart:NoCart }
        }

        case ADDNEWCART:{
            return { ...state, cart: action.newCart }
        }


        default: return state
    }
}




