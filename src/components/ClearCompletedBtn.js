import React from 'react'

export default function ClearCompletedBtn({ClearCompleted}) {
  
  return (
            <div>
                <button className="button" onClick={ClearCompleted}>Clear completed</button>
            </div>
  )
}
