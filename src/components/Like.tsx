import React, {useState,useEffect} from 'react'
import { removeLike } from '../actions/ActionCreator';
import { useDispatch,useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles } from '@material-ui/styles';

import { State, likeItemListType, likeItemListOneType, } from './componentsTypes'
//ramenArray

import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const useStyle = makeStyles(() =>
    createStyles({
        "u":{
            textDecoration:"none",
            borderBottom:"double 5px #faa61a",
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
        "dis":{
            textAlign:"center"
            
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
            background:"#ffead6",
            textAlign:"center"
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
            width:"50%",
            paddingTop:"15px",
            paddingRight:'15px',
            paddingLeft:'15px',
            paddingBottom:"15px",
            marginLeft:"auto",
            marginRight:"auto",
            marginTop:"50px",
            textAlign:"center"
        },
    }),
);

const loginSelector = (state: State)=> {
    return state.StoreState.loginUser
}

const cartSelector = (state: State)=> {
    return state.StoreState.cart
}

const ramenSelector = (state: State)=> {
    return state.StoreState.ramen
}

export const Like = ()=> {

    const classes = useStyle()

    const history = useHistory()
    const handleLink = (path: string) => history.push(path)

    const dispatch = useDispatch()

    const ramenData = useSelector(ramenSelector)

    const user: firebase.User= useSelector(loginSelector)

    const cartData = useSelector(cartSelector)

    const 
    //[ ramens, setRamen ] = useState<ramenArray>([]),
    [ likes, setLike ] = useState<likeItemListType | []>([]),
    [ randomramen, setRandom ] = useState<string>(''),
    [ randomramen2, setRandom2 ] = useState<string>('')

    useEffect( ()=>{
        //ramenData.length !== 0 && setRamen(ramenData)

        cartData.length !== 0 &&  setLike(cartData[0].likeItemList)

    },[ramenData,cartData])

    
    const happy = ['??????','??????','??????',]
    const BestRamen = ()=>{
        let random = likes[Math.floor(Math.random() * likes.length )]
        let random2 = happy[Math.floor(Math.random() * happy.length )]
        //console.log(random)
        setRandom(`??????????????????????????????????????????????????????${random.name}???!! ????????????????????????????????????${random2}???`)
        setRandom2(random.pic)
    }

    const remove = (index: number)=>{
        dispatch(removeLike(index))
    
    }


    //type srcType =  React.ImgHTMLAttributes<HTMLImageElement>

    return(
        <React.Fragment>

            {
                user === null ? 
                <h2>?????????????????????(????????????????????????????????????????????????)</h2>:
                <div>
                    <div className={classes.dis}>
                        <h2><u className={classes.u}>{user.displayName}?????????????????????????????????</u></h2>
                        <span>
                            {/* <img src ={user.photoURL}></img> */}
                            {/* { srcType.src === string ? <img src={user.photoURL}></img> : false } */}
                            
                            {/* {typeof user === firebase.UserInfo.photoURL ? <img src={user.photoURL}></img> : false } */}
                        </span>
                    </div>
                    <div>
                        { likes.length === 0 ? <h2>??????????????????????????????????????????</h2>:
                        <div>
                            <div className={classes.lucky}>
                                <button onClick={ ()=>{BestRamen()} } className={classes.randombutton}>???????????????????????????????????????????????????</button>
                                <h3>{randomramen}</h3>
                                <h2><img src={randomramen2} alt='' className="pic" /></h2>
                            </div>
                            <table className={classes.tableWidth}>
                                <thead>
                                    <tr className={classes.cartTitle}>
                                        <th>
                                            <h2>?????????</h2>
                                        </th>
                                        <th>
                                            <h2>??????????????????</h2>
                                        </th>
                                        <th>
                                            <h2>??????</h2>
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                {
                                    likes.map( (like: likeItemListOneType,index: number)=>{
                                        return (
                                            <tbody className={classes.tableBody}???key={like.id}>
                                                <tr>
                                                    <td>
                                                        <div>{like.name}</div>
                                                    </td>
                                                    <td>
                                                        <div><img src={like.pic} className={classes.pic} alt='' ></img></div>
                                                    </td>
                                                    <td>
                                                        <div>{like.detail}</div>
                                                    </td>
                                                    <td>
                                                        <button onClick={()=> handleLink(`detail/${like.id}`)} className={classes.button}>???????????????</button>
                                                        <button onClick={ ()=>{remove(index)} } className={classes.button}>???????????????????????????</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )
                                    })
                                }
                             </table>
                        </div>
                        }
                    </div>

                </div>
             }
        </React.Fragment>
    )
}