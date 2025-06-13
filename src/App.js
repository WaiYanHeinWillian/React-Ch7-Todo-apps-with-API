import './reset.css';
import './App.css';
import TodoForm from "./components/TodoForm.js"
import TodoList from "./components/TodoList.js"
import CheckAllAndRemaining from "./components/CheckAllAndRemaining.js"
import TodoFilters from "./components/TodoFilters.js"
import ClearCompletedBtn from "./components/TodoFilters.js"
import { useEffect, useState } from 'react';

function App() {

  let [todos,setTodos]=useState([]);

  useEffect(()=>{
    fetch('http://localhost:3001/todos')
    .then(res=>res.json())
    .then((todos)=>{
      setTodos(todos);
    })
  },[])

  let addTodo=(todo)=>{
    // update data at server side
    fetch('http://localhost:3001/todos',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(todo)
    })

    // update data at client side
    setTodos(preData=>[...preData,todo])
  };

  let deleteTodo=(todoId)=>{
    console.log("http://localhost:3001/todos/${todoId}")
    //server
    fetch(`http://localhost:3001/todos/${todoId}`,{
      method:"DELETE"
    })
    
    //client    
    setTodos(preState=>{
      return preState.filter(todo=>{
        return todo.id!=todoId
      })
    })
  }

  let updateTodo=(todo)=>{
    // server
    fetch(`http://localhost:3001/todos/${todo.id}`,{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(todo)
    })

    //client
    setTodos(preState=>{
      return preState.map((t)=>{
        if(t.id==todo.id){
          return todo;
        }
        return t;
      })
    })
  }

  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>

        <TodoForm addTodo={addTodo}/>

        <TodoList todos={todos} deleteTodo={deleteTodo} updateTodo={updateTodo}/>

        <CheckAllAndRemaining/>

        <div className="other-buttons-container">
        <TodoFilters/>

        <ClearCompletedBtn/>
          
        </div>
      </div>
    </div>
  );
}

export default App;
