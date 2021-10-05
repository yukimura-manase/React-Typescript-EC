import React, {useState,useEffect} from 'react'
import { removeCart } from '../actions/ActionCreator';
import { useDispatch,useSelector } from 'react-redux';
import {useHistory} from "react-router-dom";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { State, ramenArray, cartItemList, mergeRamen, mergeRamenOne, cartType } from './componentsTypes' // 型定義のimport

import { createStyles,makeStyles } from '@material-ui/styles';

const useStyle = makeStyles(() =>
    createStyles({
        "text":{
            textAlign:"center",
            fontWeight:600
        },
        "button":{
            borderColor:"#faa61a",
            color:"#faa61a",
            fontWeight:600,
            marginBottom:"8px",
            backgroundColor:"#fff",
            padding:"10px",
            "&:hover":{
                backgroundColor:"#faa61a",
                color:"#fff"
            }
        },
        "pic":{
            width: "350px",
            height: "200px"
        },
        "tableWidth":{
            width:"80%",
            margin:"3px auto",
            paddingTop:"30px",
            paddingBottom:"30px"
        },
        "cartTitle":{
            background:"#ffab4c",
            fontSize:"10px",
            color:"#fff"

        },
        "tableBody":{
            background:"#ffead6"
        },
        "u":{
            textDecoration:"none",
            borderBottom:"double 5px #faa61a",
        },
        "price":{
            fontSize:"18px",
            paddingBottom:"15px"
        }

    }),
);

const ramenSelector = (state: State) => {
    return state.StoreState.ramen
}

const loginSelector = (state: State) =>{ 
    return state.StoreState.loginUser
}

const cartSelector = (state: State)=>{
    return state.StoreState.cart
}


export const Cart = ()=> {

    const classes = useStyle();

    const user: firebase.User = useSelector(loginSelector)
    
    const cartData: cartType = useSelector(cartSelector)

    const ramenData: ramenArray = useSelector(ramenSelector)

    const history = useHistory();
    const handleLink = (path: string) =>history.push(path);
    
    const dispatch = useDispatch()

   const [ ramens, setRamen ] = useState<ramenArray | []>([])
   const [ carts, setCart ] = useState<cartItemList | []>([])
   const [ carts2 , setCart2 ] = useState<mergeRamen | []>([])
    // console.log(ramens)
    // console.log(carts)
    // console.log(carts2)

   useEffect(
    ()=>{

        ramenData.length !==0 && setRamen(ramenData) // StoreStateのラーメンデータにデータが入ったらsetする！

        cartData.length !== 0 &&  setCart(cartData[0].cartItemList)

        //if( 'cartItemList' in cartData && 'id' in ramenData ){

            const cartIdList =  carts.map( cart => cart.id) //カート内の商品のIDの配列を生成

            let macthRamenData:any = cartIdList.map( cartid => {
                return ramens.find(ramen => cartid === ramen.id) // idリストの中身と一つ一つ
            })

            const mergeArray: any = [] // 入れ物用意

            carts.forEach(cart => {

                //if(typeof macthRamenData === 'object'){
                let idMatchRamen = macthRamenData.find( (ramendata: any) => ramendata.id === cart.id) // idが一致するものを一つ格納！
                const merged = { ...cart,...idMatchRamen }  
                mergeArray.push(merged)
                //}
            })

            cartData.length !== 0 && setCart2(mergeArray)

        //}

    },[cartData,ramenData,carts,ramens])


const totalTax = ()=>{ // 消費税の合計を計算
    let tax:number[] = []
    carts.forEach(cart => {
        tax.push(cart.total * 0.1)
    })

    let totalTax = tax.reduce( (sum: number, currentVal: number ) => {
        return sum + currentVal;
    },0) // 初期値を設定している。
    return totalTax
}

const sumTotalPlice = ()=>{ // 小計金額(total)ごとの消費税分を計算。
    let taxInclude:Array<number> = []
    carts.forEach(cart => {
    taxInclude.push(cart.total * 1.1)
    })
    let totalTaxIncludes = taxInclude.reduce( (sum: number,currentVal: number) => {
        return sum + currentVal;
    },0)
    return Math.floor(totalTaxIncludes)
}

const remove = (removeIndex: number)=>{
    
    const copyCart2:any = carts2.concat()
    copyCart2.splice(removeIndex,1)

    console.log(copyCart2)
    setCart2(copyCart2)

    dispatch(removeCart(removeIndex))

}

const login=()=>{
    const google_auth_provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(google_auth_provider)
}

const [ randomramen, setRandom ] = useState<string>('')

const happy = ['大吉','中吉','小吉',] // おみくじ配列

const randomRamen = ()=>{
    let random: any = carts2[Math.floor(Math.random() * carts2.length )]
    let random2 = happy[Math.floor(Math.random() * happy.length )]

    setRandom(`今日のハッピー・ラッキーラーメンは、「${random.name}」!! 　ラーメン・おみくじは「${random2}」`)
}



    return (
        <React.Fragment>
            {
                user instanceof Object ? 
                <div className={classes.text}>
                    <h2><u className={classes.u}>{user.displayName}さんのショッピングカート</u></h2>
                </div> :
                <h2 className={classes.text}><u className={classes.u}>ショッピングカート</u></h2>
            }
           
            {carts.length === 0 ? <h2>カートに商品がありません！</h2> :
            <div className={classes.text}>
               

                <table className={classes.tableWidth}>
                    <thead>
                        <tr className={classes.cartTitle}>
                            <th>
                                <h2>商品名</h2>
                            </th>
                            <th>
                                <h2>商品イメージ</h2>
                            </th>
                            <th>
                                <h2>サイズ</h2>
                            </th>
                            <th>
                                <h2>数量</h2>
                            </th>
                            <th>
                                <h2>トッピング</h2>
                            </th>
                            <th>
                                <h2>小計(税抜)</h2>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        carts2.map( (ailias: mergeRamenOne,index: number)=>{
                            return (
                            <tr key={index} className={classes.tableBody}>
                                <td>{ailias.name}</td>
                                <td><img src={ailias.pic} className={classes.pic} alt='' ></img></td>
                                <td>{ailias.size}</td>
                                <td>{ailias.number}</td>
                                <td>{ailias.topping}</td>
                                <td>{ailias.total}</td>
                                <td><button onClick={ ()=>{remove(index)} } className={classes.button}>削除</button></td>
                            </tr>
                            )
                        })
                    }
                    </tbody>
                </table>


                <div>消費税：{ totalTax() }円</div>
                <div className={classes.price}><u className={classes.u}>ご注文金額合計：{ sumTotalPlice() }円(税込)</u></div>
                <div>
                    <button onClick={ ()=>{randomRamen()} }　className={classes.button}>今日のハッピー・ラッキーラーメン♪♫</button>
                    <h3>{randomramen}</h3>
                </div>
                
                <div>
                    {
                        user === null ? 
                        <button onClick={ ()=>{login()} } className={classes.button}>まずはログイン！</button>:
                        <button onClick={ ()=>{ handleLink('/order')} } className={classes.button}>注文に進む！</button>
                    }
                </div>
            
            </div>
            }
</React.Fragment>
    )
}

