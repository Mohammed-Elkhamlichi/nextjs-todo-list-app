import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTodoContext, useUserContext } from "../../context/state";
import apiUrlManager from "../../utils/apiUrlManager";

const TodoForm = ({ todoInput, handleAddTodoForm }) => {

   const router = useRouter();

   const [todoState, todoDispatch] = useTodoContext();
   const [userState, userDispatch] = useUserContext();
   const [todoTitle, setTodoTitle] = useState("");

   const handleUpdateTodoForm = async (e) => {
      try {
         if (todoState?.isUpdateTodo) {
            e.preventDefault();
            userDispatch({ type: "SET_JWT", jwt: localStorage.getItem("token") });
            const token = localStorage.getItem("token");
            if (token && token.length > 20) {
               axios
                  .patch(
                     `${apiUrlManager('todos/')}/${todoState?.todo._id}`,
                     {
                        completed: todoState.todo.completed,
                        title: todoTitle || todoState.todo.title,
                     },
                     { headers: { Authorization: `Todo ${token}` } }
                  )
                  .then((res) => {
                     const todo = res.data.todo;
                     const todos = res.data.todos;
                     todoDispatch({
                        type: "FORM_UPDATE_TODO_SUBMIT",
                        todo,
                        todos,
                        todoAlert: { msg: "todo has been update", classes: "bg-green-500" },
                     });
                     setTodoTitle("");
                  })
                  .catch((err) => console.log(err));
               todoInput.current.value = "";
            } else {
               router.push("/users/login");
            }
         }
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <form
         onSubmit={(e) => {
            todoState.isUpdateTodo ? handleUpdateTodoForm(e) : handleAddTodoForm(e);
         }}
         id="todo_form"
         className="flex flex-col sm:flex-row  w-full sm:w-2/3 m-auto my-5 justify-between items-center bg">
         <div className="w-10/12 mx-1 flex flex-row items-center">
            <input
               onChange={(e) => {
                  setTodoTitle(e.target.value);
               }}
               ref={todoInput}
               type="text"
               name="title"
               id="title"
               className="px-2 py-2 text-yellow-600 placeholder:text-yellow-600 placeholder:text-lg text-lg w-full outline-0 bod  rounded hover:outline-dotted hover:outline-slate-800 hover:shadow-xl  hover:shadow-slate-850"
               placeholder="Your Todo Title"
            />
         </div>
         <div className="w-1/4 mx-1 mt-5 sm:mt-0">
            <button type="submit" className="bg-yellow-500 my-4 py-3 px-10 rounded">
               {todoState?.isUpdateTodo && "Update"}
               {todoState?.isAddTodo && "Add"}
            </button>
         </div>
      </form>
   );
};

export default TodoForm;
