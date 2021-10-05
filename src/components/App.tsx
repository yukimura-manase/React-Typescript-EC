import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import { useDispatch } from 'react-redux';

import { Header } from './Header'
import { Home } from './Home'
import { Detail } from './Detail'
import { Cart } from './Cart'
import { Like } from './Like'
import { Order } from './Order'
import { OrderFinish } from './OrderFinish'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth' // authentication機能にアクセス
import 'firebase/compat/firestore' // firestore機能にアクセス
import  '../service/firebase' // 設定ファイルを読み込み

import { setLoginUser, deleteLoginUser, fetchRamen, fetchCartItem } from '../actions/ActionCreator'

import { initialCart } from './componentsTypes' // 型定義のimport

import { createStyles,makeStyles } from '@material-ui/styles'; //materialUI

const useStyle = makeStyles(() =>
    createStyles({
      "header":{
        width:"35%",
      },
      "pic":{
        textAlign:"center",
        backgroundColor:"#faa61a"
      }
    }),
  );


const App = () => {

  const classes = useStyle()

  const dispatch = useDispatch()

  const setUser = (user : firebase.User)=> {
    dispatch(setLoginUser(user))
  }

  const deleteUser = () => {
    dispatch(deleteLoginUser())
  }

  const fetchProducts = ()=> {

    let ramenProducts: any = []
    
    firebase.firestore().collection(`products`)
      .get()
      .then(
        querySnapshot => { // クエリスナップショット => collection配列の中にあるdocument群
          //console.log(querySnapshot)
          querySnapshot.forEach(
            documentSnapshot=> { //ドキュメントスナップショット => 1つのdocument
              //console.log(documentSnapshot)
              ramenProducts.push(documentSnapshot.data()) // doc.data() => documentの中身
            }
          )
            //console.log(ramenProducts)
            dispatch(fetchRamen(ramenProducts))
        }   
      )
  }

  

  const setCart = ()=> {
    let cartItem: initialCart = [ // userが使用するカートデータの初期設定
      {
        id: "",
        orderDate: "",
        userName: "",
        mailAddress: "",
        addressNumber: "",
        address: "",
        phoneNumber: "",
        deliveryDate: "",
        deliveryTime: "",
        status: 0,
        cartItemList: [],
        likeItemList: []
      }
    ]
      dispatch(fetchCartItem(cartItem))
  }

  const fetchCart = (user: firebase.User)=> {

    let cartItem: any = [] // 上位のスコープに設定しておく！

    firebase.firestore().collection(`users/${user.uid}/carts`)
      .get()
      .then(
        querySnapshot => {
          //console.log(querySnapshot)

          if(querySnapshot.empty){ // 1回目は、true。2回目以降の利用はfalse => 初回ログインユーザーのみ型枠をaddされる！
            //console.log('初回ログインのみ起動')

            firebase.firestore().collection(`users/${user.uid}/carts`)
              .add(
                {
                  id: "",
                  orderDate: "",
                  userName: "",
                  mailAddress: "",
                  addressNumber: "",
                  address: "",
                  phoneNumber: "",
                  deliveryDate: "",
                  deliveryTime: "",
                  status: 0,
                  cartItemList: [],
                  likeItemList: []
                }
              )
                .then(
                  documentRefrence=>{ // ドキュメントリファレンスが返ってくる！(addメソッド後のthen)
                    //console.log(documentRefrence)
                    cartItem.push(
                      {
                        id: documentRefrence.id,
                        orderDate: "",
                        userName: "",
                        mailAddress: "",
                        addressNumber: "",
                        address: "",
                        phoneNumber: "",
                        deliveryDate: "",
                        deliveryTime: "",
                        status: 0,
                        cartItemList: [],
                        likeItemList: []
                      }
                    )
                  }
                )
          }
                
          querySnapshot.forEach(documentSnapshot=>{
              if(documentSnapshot.data().status === 0){ // 2回目以降のログイン時のstatus0のカートを発見して加工する処理
                //console.log('2回目以降')
                cartItem.push( { ...documentSnapshot.data(), id: documentSnapshot.id } )
              }
            }
          )
          
          dispatch(fetchCartItem(cartItem))

        }
    )

  }

  useEffect(
    ()=>{

        firebase.auth().onAuthStateChanged(user => {
          if(user){
            setUser(user)
            fetchCart(user)
          } else {
            deleteUser() // ログアウトユーザーのユーザーデータ&カート情報をStateから消す！
            setCart() // 空のカート情報をセットする。
          }
        })
        fetchProducts()
    }
  )

  return (
   <React.Fragment>
     <Router>

      <div className={classes.pic}>
        <img src={`${process.env.PUBLIC_URL}/pic/header_logo.png`} alt="Logo" className={classes.header} />
       </div>

      <Header/>

      <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/cart' exact component={Cart} />
          <Route path='/like' exact component={Like} />
          <Route path='/detail/:id' exact component={Detail} />
          <Route path='/order' exact component={Order} />
          <Route path='/orderfinish' exact component={OrderFinish} />
      </Switch>

     </Router>
   </React.Fragment>
  )
}

export default App;
