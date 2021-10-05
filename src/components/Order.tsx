import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addNewCart, deleteCart } from "../actions/ActionCreator";
import '../../src/Order.css';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import { State, ramenArray, cartType, cartItemList, mergeRamen } from './componentsTypes'

import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const useStyle = makeStyles(() =>
	createStyles({
		"button": {
			borderColor: "#faa61a",
			color: "#302bla",
			fontWeight: 600,
			marginBottom: "8px",
			backgroundColor: "#fff",
			padding: "10px",
			"&:hover": {
				backgroundColor: "#faa61a",
				color: "#fff"
			}
		},
		"pic":{
            width: "350px",
            height: "200px"
        },
		"u":{
            textDecoration:"none",
            borderBottom:"double 5px #faa61a",
        },
		"table":{
			width:"100%"
		}


	}),
);

const loginSelector = (state: State)=> {
    return state.StoreState.loginUser
}

const cartSelector = (state: State) => {
    return state.StoreState.cart
}

const ramenSelector = (state: State)=> {
    return state.StoreState.ramen
}

export const Order = ():JSX.Element => {

    const classes = useStyle();

    const user = useSelector(loginSelector)
    
    let cartData: any = useSelector(cartSelector)

    const ramenData = useSelector(ramenSelector)

    const history = useHistory();
    const handleLink = (path: string) =>history.push(path);
    
    const dispatch = useDispatch()

    //支払い情報のstateたち
	const
	[ userName, setUserName ] = useState<string>(""),
	[ address, setAddress ] = useState<string>(""),
	[ addressNumber, setAddressNumber ] = useState<string>(""),
	[ phoneNumber, setPhoneNumber ] = useState<string>(""),
	[ deliveryDate, setDeliveryDate ] = useState<string>(""),
	[ deliveryTime, setDeliveryTime ] = useState<string>(""),
	[ mailAddress, setMailAddress ] = useState<string>(""),
	[ status, setStatus ] = useState<string>(""),
	[ errors, setErrors ] = useState<string[]>([]); // バリデーション・エラーチェック用の配列

     // 入力フォームと連動して、stateに入力値を保存するための関数たち
	const inputUserName = (e: any) => {
		setUserName(e.target.value);
	};
	const inputAddress = (e: any) => {
		setAddress(e.target.value);
	};
	const inputAddressNumber = (e: any) => {
		setAddressNumber(e.target.value);
	};
	const inputPhoneNumber = (e: any) => {
		setPhoneNumber(e.target.value);
	};
	const inputDeliveryDate = (e: any) => {
		setDeliveryDate(e.target.value);
	};
	const inputDeliveryTime = (e: any) => {
		setDeliveryTime(e.target.value);
	};
	const inputMailAddress = (e: any) => {
		setMailAddress(e.target.value);
	};
	const inputStatus = (e: any) => {
		setStatus(e.target.value);
	};


    const
	[ ramens, setRamen] = useState<ramenArray|[]>([]),
	[ carts, setCart ] = useState<cartItemList|[]>([]),
	[ carts2 , setCart2] = useState<mergeRamen|[]>([]);

    useEffect(
        () => {
            ramenData.length !== 0 && setRamen(ramenData)

            cartData.length !== 0 && setCart(cartData[0].cartItemList)

            if (cartData.length !== 0 && ramenData.length !== 0) {

                const cartIdList: number[] = carts.map(cart => cart.id) // cart内のidだけのリストを作成

                let matchRamen: any[] = cartIdList.map( // findした値の配列を生成する！ => matchラーメン配列
                    cartid => {
                        return ramens.find(ramen => cartid === ramen.id)
                    }
                )

                let mergeArray:any = [] // 入れ物用意

                    carts.forEach(cart => {
                    
                        //if(typeof matchRamen === 'object'){
                        let Match: any = matchRamen.find( (ramen: any) => ramen.id === cart.id) // idが一致するものを一つ格納！
    
                        const merged: any = { ...cart, ...Match }
    
                        mergeArray.push(merged)
                        //}
                    })
                    setCart2(mergeArray)
            }

	    }, [cartData, ramenData,carts,ramens] // 監視対象となる値
    )
    

    const updateCart = () => {

		firebase.firestore()
		.collection(`users/${user.uid}/carts`)
		.doc(cartData[0].id) // 付与されているidアクセスする。
		.update({
			...cartData[0],
			userName: userName,
			mailAddress: mailAddress,
			addressNumber: addressNumber,
			address: address,
			phoneNumber: phoneNumber,
			deliveryDate: deliveryDate,
			deliveryTime: deliveryTime,
			status: status,
		})
		
		
		dispatch(deleteCart()) //Reduxのstore内Cart情報を削除
	}

    const addCart = () => {

		const newCart: cartType = []
		
		firebase
		.firestore()
		.collection(`users/${user.uid}/carts`)
		.add({ // addそのものは1つのDocument(オブジェクト)を追加して、自動採番する
			id:"",
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
		})

		firebase
		.firestore()
		.collection(`users/${user.uid}/carts`)
		.get()
		.then( (snapshot: firebase.firestore.DocumentData ) => {
				snapshot.forEach( (doc:firebase.firestore.DocumentData) => {
					if (doc.data().status === 0) {
						newCart.push.call({ ...doc.data(), id: doc.id }) // callを使用することで、
					}
				})
			},
		)
		if('id' in newCart){
			dispatch(addNewCart(newCart))
	   	}
	}

    const totalTax = () => { // 消費税の合計を計算
		//console.log('totalTax')
		let tax: number[] = []
		carts.forEach(cart => {
			tax.push(cart.total * 0.1)
		})

		let totalTax = tax.reduce((sum, currentVal) => {
			return sum + currentVal;
		}, 0) // 初期値を設定している。
		return totalTax
	}

    const sumTotalPlice = () => { // 小計金額(total)ごとの消費税分を計算。
		//console.log('sumTotalPlice')
		let taxInclude: number[] = []
		carts.forEach(cart => {
			taxInclude.push(cart.total * 1.1)
		})
		let totalTaxIncludes = taxInclude.reduce((sum, currentVal) => {
			return sum + currentVal;
		}, 0)
		return Math.floor(totalTaxIncludes)
	}

	// カート情報の表示用コンポーネント
	const displaysCart = carts2.map((item, index) => {
		return (
			<tr className="cart-item" key={index}>
				<td className="cartName"> {item.name} </td>
				<td className="imgPosition"><img src={item.pic} className={classes.pic} alt='' /></td>
				<td> {item.size} </td>
				<td> {item.number} </td>
				<td className="cartTopping"> {item.topping} </td>
				<td> {item.total} </td>
			</tr>
		)
	})

	//バリデーション
	const attmark = (mailAddress: string) => {
		let val = (/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/);
		return val.test(mailAddress);
	}

	const yuubin = (addressNumber: string) => {
		let val = (/^\d{3}-\d{4}$/);
		return val.test(addressNumber);
	}

	const denwa = (phoneNumber: string) => {
		let val = (/^0\d{1,4}-\d{1,4}-\d{3,4}$/);
		return val.test(phoneNumber);
	}

	const order = (deliveryDate: string) => {
		let today = new Date()//今日の日付

		today = new Date(
			today.getFullYear(), //年
			today.getMonth(), //月
			today.getDate(), //日
			today.getHours(), //時間
		)

		let hopeDate = new Date(deliveryDate)

		let nowDay = today.getDate()
		
		let date = new Date(hopeDate)

		hopeDate = new Date(
			today.getMonth(), //月
			today.getDate(), //日
		)

		let selectDay = date.getDate()　//お届け希望の日付
		let nowHour = today.getHours() //現在の時間
		let i = Math.abs(Number(deliveryTime) - nowHour) //お届け希望の時間 - 今の時間

		//同じ日の処理
		if (nowDay === selectDay) {
			if (Number(deliveryTime) <= nowHour) {
				return false
			} else if (3 <= i) { //今の時間以降の場合
				return true
			} else {
				return false
			}
		}
		
		//違う日の処理 ( 昨日以前 or 明日以降 )
		else if (nowDay >= selectDay) {
			return false
		} else {
			return true
		}
	}

	//バリデーション => 仕様に沿っているかのチェック(検証・確認)
	const Validation = (e: any) => {

		setErrors([]) //対象にする配列を空にしてあげる

		let allErrors = []; // error対象を入れる配列

		//お名前エラー
		if (userName === "") {
			allErrors.push("名前を入力してください")
		}

		//アドレスエラー
		if ( mailAddress === "" ) {
			allErrors.push("アドレスを入力してください") }
		else if( !attmark( mailAddress ) ) {
			allErrors.push("メールアドレスの形式が不正です ('@', '.'は入っているか、スペースを空けていないか確認して下さい。) ") }

		//郵便番号エラー
		if (addressNumber === "") {
			allErrors.push("郵便番号を入力してください")
		} else if ( !yuubin(addressNumber) ) {
			allErrors.push("郵便番号はスペースは空けず、XXX-XXXXの形式で入力してください") }

		//住所エラー
		if (address === "") {
			allErrors.push("住所を入力してください")
		}

		//TELエラー
		if (phoneNumber === "") {
			allErrors.push("電話番号を入力してください")
		} else if (!denwa(phoneNumber)) {
			allErrors.push("電話番号はスペースは空けず、'0'始まりの XXX-XXXX-XXXX の形式で入力してください")
		}

		//お届け日エラー
		if (deliveryDate === "") {
			allErrors.push("配送日を入力してください")
		}
		//時間指定エラー
		else if (!order(deliveryDate)) {
			allErrors.push("今から3時間後の日時をご入力ください")
		}

		//お届け時間エラー
		if (deliveryTime === "") {
			allErrors.push("配送時間を入力してください")
		}

		//お支払いエラー
		if (!status) {
			allErrors.push("支払い方法を選択してください")
		}

		setErrors(allErrors);

		if (allErrors.length === 0) {
			updateCart();
			addCart();

			handleLink('/orderFinish')
		}
	}

    return (
	    <React.Fragment>

			<div className="main-title"><u className={classes.u}>注文確認画面</u></div>

			<div className="container">
					<table className={classes.table}>
						<tbody>
							<tr className="cart-title">
								<th>商品名</th>
								<th>商品イメージ</th>
								<th>サイズ</th>
								<th>数量</th>
								<th>トッピング</th>
								<th>価格(税抜)</th>
							</tr>

							{displaysCart}

						</tbody>
					</table>
			</div>

			<div className="container">
				<div className="tax">消費税 : {totalTax()} 円</div>
			</div>

			<div className="container">
				<div className="total-price"><u className={classes.u}>注文金額 (税込) : {sumTotalPlice()} 円</u></div>
			</div>

            <div className="box2">

                <div className="box2-title">お届け先情報</div>

                <div className="container">

                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <div>お名前<span className="must" /></div>
                                    <div>
                                        <input className="input" type="text" value={userName} onChange={inputUserName} placeholder="ラーメン太郎" />
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div>メールアドレス<span className="must" /></div>
                                    <div>
                                        <input className="input" type="text" value={mailAddress} onChange={inputMailAddress} placeholder="ramen@xxxx.com" />
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div>郵便番号<span className="must" /></div>
                                    <div>
                                        <input className="input" type="text" value={addressNumber} onChange={inputAddressNumber} placeholder="160-0022" />
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div>住所<span className="must" /></div>
                                    <div>
                                        <input className="input" type="text" value={address} onChange={inputAddress} placeholder="東京都新宿区新宿4-3-23 TOKYU REIT  新宿ビル8F" />
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div>電話番号<span className="must" /></div>
                                    <div>
                                        <input className="input" type="text" value={phoneNumber} onChange={inputPhoneNumber} placeholder="000-0000-0000" />
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div>配達日時<span className="must" /></div>
                                    <div>
                                        <input className="input" type="date" value={deliveryDate} onChange={inputDeliveryDate} />
                                    </div>
                                    <div className="time">
                                        <div className="time-item"><input type="radio" name="time" value="10" onChange={inputDeliveryTime} id="r10" /><label htmlFor="r10">&nbsp;10時</label></div>
                                        <div className="time-item"><input type="radio" name="time" value="11" onChange={inputDeliveryTime} id="r11" /><label htmlFor="r11">&nbsp;11時</label></div>
                                        <div className="time-item"><input type="radio" name="time" value="12" onChange={inputDeliveryTime} id="r12" /><label htmlFor="r12">&nbsp;12時</label></div>
                                        <div className="spacer"></div>
                                        <div className="time-item"><input type="radio" name="time" value="13" onChange={inputDeliveryTime} id="r13" /><label htmlFor="r13">&nbsp;13時</label></div>
                                        <div className="time-item"><input type="radio" name="time" value="14" onChange={inputDeliveryTime} id="r14" /><label htmlFor="r14">&nbsp;14時</label></div>
                                        <div className="time-item"><input type="radio" name="time" value="15" onChange={inputDeliveryTime} id="r15" /><label htmlFor="r15">&nbsp;15時</label></div>
                                        <div className="spacer"></div>
                                        <div className="time-item"><input type="radio" name="time" value="16" onChange={inputDeliveryTime} id="r16" /><label htmlFor="r16">&nbsp;16時</label></div>
                                        <div className="time-item"><input type="radio" name="time" value="17" onChange={inputDeliveryTime} id="r17" /><label htmlFor="r17">&nbsp;17時</label></div>
                                        <div className="time-item"><input type="radio" name="time" value="18" onChange={inputDeliveryTime} id="r18" /><label htmlFor="r18">&nbsp;18時</label></div>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>

                </div>

            </div>

            <div className="box2">

                <div className="box2-title">お支払い方法</div>

                <div className="container">
                    <table>
                        <tbody>

                            <tr>
                                <td>
                                    お支払い方法を選択してください。<span className="must" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="radio" name="pay" value="1" onChange={inputStatus} id="cashOnDelivery" /><label htmlFor="cashOnDelivery">代金引換</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="radio" name="pay" value="2" onChange={inputStatus} id="credit" /><label htmlFor="credit">クレジットカード決済</label>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            <div className="container">
                <div className="error">
                    {errors.map((error,index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div>
            </div>


            <div className="order-button">
                <Button className={classes.button} onClick={Validation} variant="contained" > 注文 </Button>
            </div>

        </React.Fragment>
    )
}


