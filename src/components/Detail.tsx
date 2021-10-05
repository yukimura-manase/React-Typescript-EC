import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import React, { useState } from "react"
import { detailRamen } from '../actions/ActionCreator'

import { State } from './componentsTypes' // 型定義のimport

//materialUI
import { createStyles,makeStyles } from '@material-ui/styles';

const useStyle = makeStyles(() =>
    createStyles({
        "style":{
            textAlign:"center",
            paddingBottom:"20px",
            fontWeight:700
        },
        "picture":{
            width:"500px",
            height:"350px",
            paddingTop:"15px",
            paddingBottom:"15px"
        },
        "checkbox":{
            padding: "0.5em 1em",
            margin: "2em 0",
            color: "#232323",
            background: "#fff8e8",
            borderLeft: "solid 10px #faa61a",
            width:"85%",
            display:"inline-block"
        },
        "text":{
            fontSize:"25px",
        },
        "errortext":{
            color:"red",
            fontWeight:700
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
        "size":{
            paddingBottom:"15px",
            paddingTop:"15px"
        },
        "number":{
            fontSize:"18px",
            paddingBottom:"15px"

        },
        "price":{
            fontSize:"18px",
            paddingBottom:"15px"
        },
        "u":{
            textDecoration:"none",
            borderBottom:"double 5px #faa61a",
        }
    }),
);

// type State = {
//     StoreState:{
//         loginUser: object | null,
//         ramen: [
//             { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string }
//         ]
//     }
// }

const ramenSelector = (state:State) => {
    return state.StoreState.ramen
}

export const Detail: React.FC = ()=> {

    const classes = useStyle();

    const ramenData = useSelector(ramenSelector)
    //console.log(ramenData)

    type Parameter = { id: string}
    const {id}: Parameter = useParams()
    // console.log({id})
    // console.log(id)

    type ramenType = { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string }
    type detail = { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string }

    const selectRamen: detail | undefined = ramenData.find( (ramen:ramenType) => ramen.id === Number(id) )
    //console.log(selectRamen)

    // 選択されたサイズのデータを保持する
    const [size, setSize] = useState<string>('')

    const selectSize = (e: any)=>{
        //console.log(e)
        setSize(e.target.value)
    }
    //console.log(size)

    const [toppinglist, addTopping] = useState<string[]>([]) // トッピングを入れる配列

    const setTopping = (e: any)=> {
        if(toppinglist.includes(e.target.value)){ // toppinglistに選択したトッピングは、ある/ない？
            const newtoppinglist =toppinglist.filter(topping => topping !== e.target.value) // 選択されたトッピング以外の値の配列を作成する。
            addTopping(newtoppinglist)
        } else {
            addTopping([ ...toppinglist, e.target.value]) // falseならそのまま追加
        }
    }
    //console.log(toppinglist)

    const [num, setNum] = useState<number>(1)
    const setNumber = (e: any)=> {
        setNum(e.target.value)
    }

    //const [total, setTotal] = useState<number>(500)
    const totalPrice = () =>{
        if(size === 'M' && typeof selectRamen === 'object'){
            return (selectRamen.Msizeprice + toppinglist.length * 200) * num
        } else if(size === 'L'&& typeof selectRamen === 'object'){
            return (selectRamen.Lsizeprice + toppinglist.length * 300) * num
        }
    }
    //console.log(totalPrice)

    const [check, setCheck] = useState<string>('')

    const history = useHistory()
    const handleLink = (path: string) => history.push(path)

    const dispatch = useDispatch()

    type select = { id:number, size:string, topping:string[], number:number, total:number | undefined }

    const goCart = ()=> {
        if(size === ''){
            setCheck('サイズを選択してください！')
        } else {
            let dispatchRamen :select = { id:Number(id), size:size, topping:toppinglist, number:num, total:totalPrice() }
            
            dispatch(detailRamen(dispatchRamen))
            handleLink('/cart')
        }
    }

    return (
        <div className={classes.style}>
            <h2>ラーメン詳細画面</h2>

            <div className={classes.text}>{ typeof selectRamen === 'object' ? `商品名：${selectRamen.name}` : false }</div>
            <div>{ typeof selectRamen === 'object' ? <img src={selectRamen.pic} className={classes.picture} alt='' /> : false }</div>
            <div>{ typeof selectRamen === 'object' ? `商品説明：${selectRamen.detail}` : false }</div>

            <div className={classes.size}>サイズ選択</div>
            <label htmlFor='M'><input type='radio' name='radiobutton' id='M' value='M' onClick={ (e)=>{selectSize(e)} } />Mサイズ：{ typeof selectRamen === 'object' ? selectRamen.Msizeprice: false }円</label>
            <label htmlFor='L'><input type='radio' name='radiobutton' id='L' value='L' onClick={ (e)=>{selectSize(e)} } />Lサイズ：{ typeof selectRamen === 'object' ? selectRamen.Lsizeprice: false }円</label>

            <div className={classes.checkbox}>
                <div>トッピング：１つにつき M 200円(税抜) L 300円(税抜)</div>
                <label htmlFor='チャーシュー'><input type="checkbox" id='チャーシュー' value="チャーシュー" onChange={setTopping}/>チャーシュー</label>&nbsp;
                <label htmlFor='煮たまご'><input type="checkbox" id='煮たまご' value="煮たまご" onChange={setTopping}/>煮たまご</label>&nbsp;
                <label htmlFor='メンマ'><input type="checkbox" id='メンマ' value="メンマ"　onChange={setTopping}/>メンマ</label>&nbsp;
                <label htmlFor='のり'><input type="checkbox" id='のり' value="のり" onChange={setTopping}/>のり</label>&nbsp;
                <label htmlFor='もやし'><input type="checkbox" id='もやし' value="もやし" onChange={setTopping}/>もやし</label>&nbsp;
                <label htmlFor='ほうれん草'><input type="checkbox" id='ほうれん草' value="ほうれん草"　onChange={setTopping}/>ほうれん草</label>&nbsp;
                <label htmlFor='車麩'><input type="checkbox" id='車麩' value="車麩" onChange={setTopping}/>車麩</label>&nbsp;
                <label htmlFor='バター'><input type="checkbox" id='バター' value="バター"　onChange={setTopping}/>バター</label>&nbsp;
                <label htmlFor='白髪ねぎ'><input type="checkbox" id='白髪ねぎ' value="白髪ねぎ" onChange={setTopping}/>白髪ねぎ</label>&nbsp;
                <label htmlFor='紫たまねぎ'><input type="checkbox" id='紫たまねぎ' value="紫たまねぎ"　onChange={setTopping}/>紫たまねぎ</label>&nbsp;
                <label htmlFor='うずら煮卵'><input type="checkbox" id='うずら煮卵' value="うずら煮卵" onChange={setTopping}/>うずら煮卵</label>&nbsp;
                <label htmlFor='薫製たまご'><input type="checkbox" id='薫製たまご' value="薫製たまご" onChange={setTopping}/>薫製たまご</label>&nbsp;
                <label htmlFor='つみれ'><input type="checkbox" id='つみれ' value="つみれ" onChange={setTopping}/>つみれ</label>&nbsp;
                <label htmlFor='ワンタン'><input type="checkbox" id='ワンタン' value="ワンタン" onChange={setTopping}/>ワンタン</label>&nbsp;
                <label htmlFor='ザーサイ'><input type="checkbox" id='ザーサイ' value="ザーサイ" onChange={setTopping}/>ザーサイ</label>&nbsp;
                <label htmlFor='大トロチャーシュー'><input type="checkbox" id='大トロチャーシュー' value="大トロチャーシュー" onChange={setTopping}/>大トロチャーシュー</label>&nbsp;
                <label htmlFor='太麺に変更'><input type="checkbox" id='太麺に変更' value="太麺に変更" onChange={setTopping}/>太麺に変更</label>&nbsp;
                <label htmlFor='追い飯'><input type="checkbox" id='追い飯' value="追い飯" onChange={setTopping}/>追い飯</label>
            </div>

            <div>数量:
                    <select name="number"　onChange={setNumber} className={classes.number} >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                </div>

                <div className={classes.price}>選択商品の合計金額：{totalPrice()}円</div>

                <div><button onClick={ ()=>{ goCart() } } className={classes.button} >カートに入れる</button></div>
                <div className={classes.errortext}>{check}</div>

        </div>
    )
}