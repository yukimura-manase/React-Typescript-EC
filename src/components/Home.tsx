import 'firebase/compat/firestore'
import React,{ useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  useHistory } from 'react-router-dom'
import { addLike } from '../actions/ActionCreator'
import { createStyles, makeStyles } from '@material-ui/styles'

import { ramenObject, ramenArray, State } from './componentsTypes'

const useStyle = makeStyles(() =>
    createStyles({
        "button": {
            borderColor: "#faa61a",
            color: "#faa61a",
            fontWeight: 600,
            marginBottom: "8px",
            backgroundColor: "#fff",
            padding: "10px",
            "&:hover": {
                backgroundColor: "#faa61a",
                color: "#fff"
            }
        },
        "search": {
            textAlign: "center"
        },
        "card": {
            width: "350px",
            background: "#FFF",
            borderRadius: "5px",
            boxShadow: "0 2px 5px #ccc",
            marginBottom: "40px",
        },
        "card-list": {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            height: "auto",
            width: "auto",
            padding: "5%",

        },
        "card-content": {
            padding: "20px",
            textAlign: "center",
            fontWeight: 700,

        },
        "card-title": {
            fontSize: "20px",
            fontWeight: 700,
            marginTop: "20px",
            marginBottom: "20px",
            textAlign: "center"
        },
        "card-picutre": {
            width: "350px",
            height: "200px"

        },
        "text":{
            width:"250px",
            height:"35px",
            marginRight:"15px"            
        },
        "clearButton": {
            borderColor: "#faa61a",
            color: "#faa61a",
            fontWeight: 600,
            // marginBottom: "8px",
            backgroundColor: "#fff",
            padding: "10px",
            marginLeft:"15px",
            "&:hover": {
                backgroundColor: "#faa61a",
                color: "#fff"
            }
        },
        "randombutton": {
            borderColor: "#faa61a",
            color: "#faa61a",
            fontWeight: 600,
            backgroundColor: "#fff",
            padding: "10px",
            "&:hover": {
                backgroundColor: "#faa61a",
                color: "#fff"
            }
        },
        "lucky":{
            backgroundColor:"#ffead6",
            width:"60%",
            paddingTop:"15px",
            paddingBottom:"15px",
            marginLeft:"auto",
            marginRight:"auto",
            marginTop:"50px"
        },
        "likebutton":{
            borderColor: "#faa61a",
            color: "#faa61a",
            fontWeight: 600,
            marginBottom: "8px",
            backgroundColor: "#fff",
            padding: "10px",
            marginLeft:"15px",

            "&:hover": {
                backgroundColor: "#faa61a",
                color: "#fff"
            }
        },

    }),
);


// type State = {
//     StoreState:{
//         loginUser: object | null,
//         ramen: [ { id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ] | []
//     }
// }

const ramenSelector = (state:State) => {
    return state.StoreState.ramen
}

const loginSelector = (state:State) =>{ 
    return state.StoreState.loginUser
}

export const Home: React.FC = ()=> {

    const classes: any = useStyle()

    const history = useHistory()
    const handleLink = (path: string) => history.push(path)

    const dispatch = useDispatch()

    const ramenData = useSelector(ramenSelector)

    const user = useSelector(loginSelector)

    const [ramenlist, setRamen] = useState<ramenArray>([]) // Stateから取ってきたラーメンデータを保持する

    useEffect(
        ()=>{
            setRamen(ramenData)
        },[ramenData]
    )

    const likeAdd = (likeRamen: ramenObject)=> {
        alert('お気に入りに追加されました！')
        dispatch(addLike(likeRamen))
    }

    const [word,setWord] = useState<string>('') // 入力ワードを保持する。

    const inputText = (e: any)=>{
        //console.log(e.target.value)
        setWord(e.target.value)
    }

    const clear = ()=> { // クリアボタン => 初期化処理
        setWord('')
    }

    const [findRamenlist, setNewRamen] = useState<ramenArray>([]) // default状態から、表示切替するための配列データを保持する

    // 検索処理
    const searchRamen = ()=>{

        let findRamen: any = ramenlist.filter(ramen => { // fileterで条件に合致するもので構成した配列を作成する！
            return ramen.name.match(word) //String.prototype.match() => 文字列型の一致するものを返す！
            }
        )

        if(findRamen.length === 0){
            alert('該当する商品はありません！')
        } else {
            setNewRamen(findRamen)
        }
    }

    // おすすめラーメンの表示
    const[ randomname, setRandom ] = useState('')
    const[ randompic,setRandom2 ]=useState('')

    const randomRamen=()=>{
        let random=ramenlist[Math.floor(Math.random() * ramenlist.length )]
        setRandom(`本日のオススメ  ${random.name}`)
        setRandom2(random.pic)
    }

    // 価格の高い順(降順)に並び替える機能
    // const High = () => {
    //     const high = ramenlist.sort((a, b) => { // 比較関数を用意
    //         return b.Msizeprice - a.Msizeprice
    //     })
    //     const high2 = findRamenlist.sort((a, b) => {
    //         return b.Msizeprice - a.Msizeprice
    //     })
    //     // console.log(high)
    //     // console.log(high2)
    //     // console.log([...ramenlist,high])
        
    //     //if('id' in ramenlist){
    //     setRamen([...ramenlist,high])
        
    //     setNewRamen(high2)
        
    //     //}
    // }

    // // 価格の安い順(昇順)に並び替える機能
    // const Low = () => {
    //     const low = ramenlist.sort((a, b) => {
    //         return a.Msizeprice - b.Msizeprice
    //     })
    //     const low2 = findRamenlist.sort((a, b) => {
    //         return a.Msizeprice - b.Msizeprice
    //     })
    //     // console.log(low)
    //     // console.log(low2)
        
    //     if('id' in ramenlist){
    //         setRamen([...ramenlist,low])
    //         setNewRamen(low2)
    //     }
    // }

    // 表示切替の関数コンポーネント(ChangeRamen)
    const ChangeRamen = ()=> { // 条件分岐の判断処理をする関数コンポーネント
        if(findRamenlist.length === 0){
            return ( // if文のreturn
                ramenlist.map( 
                    (ramen,index)=>{
                        return (
                            <div key={ramen.id} className={classes.card} >
                                <div className={classes['card-title']} >{ramen.name}</div>
                                <div><img src={ramen.pic} className={classes['card-picutre']} alt='' /></div>
                                <div className={classes['card-content']}>
                                    <div>Mサイズ：{ramen.Msizeprice}円</div>
                                    <div>Lサイズ：{ramen.Lsizeprice}円</div>
                                    <div>
                                        <button onClick={ ()=>{handleLink(`/detail/${ramen.id}`)} } className={classes.button} >商品詳細へ</button>
                                        {
                                            user === null ? 
                                            true:  <button onClick={ ()=>{ likeAdd(ramen) } } className={classes.likebutton} >お気に入り登録</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                )
            )
        } else {
            return ( // elseのreturn
                findRamenlist.map(
                    (ramen,index)=> {
                        return (
                            <div key={ramen.id} className={classes.card}>
                                <div className={classes['card-title']}>{ramen.name}</div>
                                <div><img src={ramen.pic} className={classes['card-picutre']} alt='' /></div>
                                <div className={classes['card-content']}>
                                    <div>Mサイズ：{ramen.Msizeprice}円</div>
                                    <div>Lサイズ：{ramen.Lsizeprice}円</div>
                                    <div>
                                        <button onClick={ ()=>{handleLink(`/detail/${ramen.id}`)} } className={classes.button} >商品詳細へ</button>
                                        {
                                            user === null ? 
                                            true:  <button onClick={ ()=>{ likeAdd(ramen) } } className={classes.likebutton} >お気に入り登録</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                )
            )
        }
    }
    
    return (
        <React.Fragment>

            <div className={classes.search}>
                <h1>ラーメン検索</h1>

                <div className={classes.lucky}>
                <button　className={classes.randombutton}　 onClick={ ()=>{randomRamen()}}　>迷っているあなたへ</button>
                <h2>{randomname}</h2>
                <h2><img src={randompic} alt='' className="pic"　/></h2>
                </div>


                <input type='text' placeholder='商品名を入力' value={word} onChange={ (event)=>{ inputText(event) } } className={classes.text} />
                <button onClick={ ()=> { searchRamen() } } className={classes.button} >検索</button>
                <button onClick={ ()=> { clear() } } className={classes.clearButton} >クリア</button>
                <h2>商品一覧</h2>
                {/* <button className={classes.button} onClick={() => { High() }} >高い順</button>  <button className={classes.button} onClick={() => { Low() }}>低い順</button> */}
                <div className={classes['card-list']} >{ ChangeRamen() }</div>
            </div>
        </React.Fragment>
    )
}