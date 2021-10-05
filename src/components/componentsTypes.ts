import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export type State = {
    StoreState:{
        loginUser: firebase.User,
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
                cartItemList: [ { id:number, size:string, topping:string[], number:number, total:number } ],
                likeItemList: [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]
            }
        ] | []
    }
}

export type ramenArray = [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ] | []

export type ramenObject = { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string }

export type initialCart = [
    {
      id: string,
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

export type cartType = [
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
        cartItemList: [ { id:number, size:string, topping:string[], number:number, total:number } ],
        likeItemList: [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]
    }
] | []

export type cartObject = {
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
    cartItemList: [ { id:number, size:string, topping:string[], number:number, total:number } ],
    likeItemList: [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]
}

export type cartItemList = [ { id:number, size:string, topping:string[], number:number, total:number } ]

export type cartItemObject = { id:number, size:string, topping:string[], number:number, total:number }

export type likeItemListType = [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]

export type likeItemListOneType = { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string }

export type mergeRamen = [ { id:number, size:string, topping:string[], number:number, total:number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]

export type mergeRamenOne = { id:number, size:string, topping:string[], number:number, total:number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string }

export type newCartType = [
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
        cartItemList: [ { id:number, size:string, topping:string[], number:number, total:number } ],
        likeItemList: [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]
    }
] 