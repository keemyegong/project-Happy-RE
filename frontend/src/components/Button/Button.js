import React from 'react';
import './Button.css'
// import propTypes from 'prop-types';

// Button 사용법 : <Button className='{원하는 클래스 이름 아래 참조}' content='{버튼내용}'/>
// className : dark-btn(어둡게) light-btn(밝게) 
// className : big(큰 버튼) middle(중간사이즈버튼-width 100%이나 위아래로 덜 길다) small(일반 버튼)
// Button.propTypes = {
//     className: propTypes.string,
//     content: propTypes.string
// }

const Button = (props)=>{
    return(
        <button className={props.className} onClick={props.onClick}>SEND</button>
    );
}

export default Button;
