import React from 'react';
import './Response.css';
import Button from '../Button/Button';
import { useContext } from 'react';
import { universeVariable } from '../../App';
import ChatEventMeditation from './ChatEventMeditation';
import ChatEventClicking from './ChatEventClicking';
import ChatEventStretching from './ChatEventStretching';
import ChatEventWatching from './ChatEventWatching';

const ChatEvent = ({ eventbtnDisabled, content, eventProceeding, eventStoping, eventEnd,setIsInputDisabled }) => {
	console.log(eventbtnDisabled);
	const universal = useContext(universeVariable);
	const example_event = [
		"감정이 격해졌을 때는 깊이 생각하는것 보다, 잠시 마음을 비우는 게 좋을 것 같아요. 도움이 되는 감각 운동을 해보실래요?",
		"이벤트 허가 텍스트 1사분면",
		"이벤트 허가 텍스트 2사분면",
		"이벤트 허가 텍스트 3사분면",
		"이벤트 허가 텍스트 4사분면",
	]
	return(
		<div className='ai-response-container'>
			{content !== '이벤트 허가' && 
			<p className='ai-response event-response'>
				{content === '명상' && 
				<ChatEventMeditation eventEnd={eventEnd} />
				}

				{content === '스트레칭' && 
				<ChatEventStretching eventEnd={eventEnd} setIsInputDisabled={setIsInputDisabled} />
				}
				{content === '공 세기' && 
				<ChatEventWatching eventEnd={eventEnd} setIsInputDisabled={setIsInputDisabled} />
				}
				{content === '해파리 누르기' && 
				<ChatEventClicking eventEnd={eventEnd} setIsInputDisabled={setIsInputDisabled} />
				}
			</p>}
			{content === '이벤트 허가' &&
			<p className='ai-response event'>
				<div className='my-2'>
					{example_event[localStorage.getItem("personaNumber")]}
				</div>
				
				<div className='event-response-button-container'>
					<Button disabled={eventbtnDisabled} className='btn light-btn small' content={"좋아!"} onClick={eventProceeding} />
					<Button disabled={eventbtnDisabled} className='btn dark-btn small' content={"지금은 괜찮아."} onClick={eventStoping} />
				</div> 

			</p>
			}
		</div>
	);
	
};

export default ChatEvent;
