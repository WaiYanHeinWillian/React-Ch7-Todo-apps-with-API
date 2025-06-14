import './reset.css';
import './App.css';
import TodoForm from "./components/TodoForm.js"
import TodoList from "./components/TodoList.js"
import CheckAllAndRemaining from "./components/CheckAllAndRemaining.js"
import TodoFilters from "./components/TodoFilters.js"
import ClearCompletedBtn from "./components/ClearCompletedBtn.js"
import { useCallback, useEffect, useState } from 'react';

function App() {

  let [todos,setTodos]=useState([]);
  let [filteredTodos,setFilteredTodos]=useState(todos);

  useEffect(()=>{
    fetch('http://localhost:3001/todos')
    .then(res=>res.json())
    .then((todos)=>{
      setTodos(todos);
      setFilteredTodos(todos);
    })
  },[])

  let filterBy=useCallback(
        (filter)=>{
        if (filter=="All"){
          setFilteredTodos(todos);
        }
        if (filter=="Active"){
          setFilteredTodos(todos.filter(t=>!t.completed))
        }
        if (filter=="Completed"){
          setFilteredTodos(todos.filter(t=>t.completed))
        }
      },[todos])

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

  
  let checkAll=()=>{
    //server
    todos.forEach((t)=>{
      t.completed=true;
      updateTodo(t);
    })
    
    //client
    setTodos(preState=>{
      return preState.map(t=>{
        return {...t,completed:true}
      })
    })
  }
  
  let ClearCompleted=()=>{
    //server
    todos.forEach((t)=>{
      if(t.completed){
        deleteTodo(t.id);
      }
    })
    
    //client
    setTodos((preState)=>{
      return preState.filter(t=>!t.completed)
    })
  }

  let remainingCount=todos.filter((t)=>!t.completed).length;
  
  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>

        <TodoForm addTodo={addTodo}/>

        <TodoList todos={filteredTodos} deleteTodo={deleteTodo} updateTodo={updateTodo}/>

        <CheckAllAndRemaining remainingCount={remainingCount} checkAll={checkAll}/>

        <div className="other-buttons-container">
        <TodoFilters filterBy={filterBy}/>
        <ClearCompletedBtn ClearCompleted={ClearCompleted}/>
        </div>
      </div>
    </div>
  );
}

export default App;
