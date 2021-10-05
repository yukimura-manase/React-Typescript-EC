export const SETLOGINUSER = 'setLoginUser'
export const DELETELOGINUSER = 'deleteLoginUser'
export const FETCHRAMEN = 'fetchRamen'
export const FETCHCARTITEM = 'fetchCartItem'
export const ADDLIKE = 'addLike'
export const DETAILRAMEN = 'detailRamen'
export const REMOVECART = 'removeCart'
export const REMOVELIKE = 'removeLike'
export const ADDNEWCART = 'addNewCart'
export const DELETECART = 'deleteCart'

type ramen = { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string }

type ramenProducts = [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]

type selectRamen = { id:number, size:string, topping:string[], number:number, total:any }

type cartItem = [
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
        cartItemList: [],
        likeItemList: []
    }
]

export const setLoginUser = (user: object)=> {
    return {
        type: SETLOGINUSER,
        user: user
    }
}

export const deleteLoginUser = ()=> {
    return {
        type: DELETELOGINUSER
    }
}

export const fetchRamen = (ramenProducts: ramenProducts)=> {
    return {
        type: FETCHRAMEN,
        ramenProducts: ramenProducts
    }
}

export const detailRamen = (selectRamen: selectRamen)=> {
    return {
        type: DETAILRAMEN,
        selectRamen: selectRamen
    }
}

export const fetchCartItem = (cartItem: cartItem)=> {
    return {
        type: FETCHCARTITEM,
        cartItem: cartItem
    }
}

export const addLike = (likeRamen: ramen)=> {
    return {
        type: ADDLIKE,
        likeRamen: likeRamen
    }
}

export const removeCart = (removeIndex: number)=> {
    return {
        type:REMOVECART,
        index:removeIndex
    }
}

export const removeLike = (index: number)=> {
    return {
        type:REMOVELIKE,
        index:index
    }
}

export const addNewCart = (newCart: cartItem ) => {
    return {
        type:ADDNEWCART,
        newCart:newCart
    }
}

export const deleteCart = () => {
    return{
        type:DELETECART
    }
}
