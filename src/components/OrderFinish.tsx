import '../../src/OrderFinish.css';
import { createStyles,makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom' 
import React from 'react';

import { State } from './componentsTypes'

const useStyle = makeStyles(() =>
    createStyles({
		"button":{
            borderColor:"#faa61a",
            color:"#302bla",
            fontWeight:600,
            marginTop: "3%",
            marginBottom:"5%",
            backgroundColor:"#fff",
            padding:"10px",
            "&:hover":{
                backgroundColor:"#faa61a",
                color:"#fff"
            }
        },
	}),
);

const loginSelector = (state: State)=>{ // Storeのログインユーザー情報
    return state.StoreState.loginUser
}

export const OrderFinish = (): JSX.Element=> {
    const history = useHistory();
    
    const handleLink = (path: string) => history.push(path);

    const classes = useStyle();

    const user = useSelector(loginSelector)

    return (      
        <React.Fragment>
            <div className="container">		
                <div>

                    <div className='message-title'>Thank You</div>

                    <div className='message'>
                        {
                            user === null ? 
                            <div>
                                <h2>ラクラクラーメンをご利用頂きましてありがとうございます。</h2>
                                <h3>決済は正常に完了しました。</h3>
                            </div>:
                            <div>
                                <h2>{user.displayName}さん、ラクラクラーメンをご利用頂きましてありがとうございます。</h2>
                                <h3>決済は正常に完了しました。</h3>
                            </div>
                        }
                    </div>

                    <div className="button-position">					
                        <Button variant="contained" className={classes.button}  onClick={()=>handleLink('/') }><img src={ `${process.env.PUBLIC_URL}/img/home.png` } alt='' />&nbsp;&nbsp;戻る</Button>			
                    </div>

                    <div>
                        <img className="town-line" src={ `${process.env.PUBLIC_URL}/img/town.png` } alt='' />
                    </div>

                </div>
            </div>
        </React.Fragment>
    )
}