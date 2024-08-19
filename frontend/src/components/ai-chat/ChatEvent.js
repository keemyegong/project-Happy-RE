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
	// 이벤트 허가 텍스트는 페르소나 따라감
	const example_event = [
		"감정이 격해졌을 때는 깊이 생각하는것 보다, 잠시 마음을 비우는 게 좋을 것 같아요. 도움이 되는 감각 운동을 해보실래요?",
		"좋은 전투를 위해서는 때로는 머리를 비우는 것도 필요하지. 감각 운동을 하며 머리를 비우는 것은 어떤가?",
		"주인님, 마음이 복잡하실 때는 눈을 돌리는 것도 하나의 방법입니다. 감각 운동을 하며 잠시 마음을 비우는 것은 어떠신가요?",
		"고통을 잊는 방법 중 가장 좋은 것은 그대가 고통을 놓아주는 것이지. 감각 운동을 하며 잠시나마 모든 것을 놓아주는 것이 어떤가?",
		"마음에 먹구름이 드리우고 머리가 늪에 잠긴 것 같을 때는, 잠시 극의 막을 내리고 모든 것을 벗어나는 것이 어떤가?",
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
