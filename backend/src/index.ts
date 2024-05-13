import { html } from "hono/html";
import { todoData } from "../data/todos";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server/.";

const app = new Hono();

app.use("/*", cors());
const port = 3000;

serve({
    fetch: app.fetch,
    port
})

app.get("/todo", (c) => {
  const listItems = getListItems(todoData.todos);

  return c.html(html`${listItems}`);
});

app.post("/todo", async (c) => {
  const { newTodo } = await c.req.parseBody();
  todoData.createTodo(newTodo as string);

  const listItems = getListItems(todoData.todos);

  return c.html(html`${listItems}`);
});

app.put("/todo/:id", async (c) => {
  const todoId = await c.req.param("id");
  todoData.updateTodo(Number(todoId));

  const listItems = getListItems(todoData.todos);

  return c.html(html`${listItems}`);
});

app.delete("/todo/:id", async (c) => {
    const todoId = await c.req.param("id");
    todoData.deleteTodo(Number(todoId));

    const listItems = getListItems(todoData.todos);

    return c.html(html`${listItems}`);
});

function getListItems(todos: typeof todoData.todos) {
  return todos
    .sort((a, b) => a.id - b.id)
    .map(
      (todo) =>
        html`<li>
          <input type="checkbox" id="todo_${todo.id}
          ${todo.completed ? "checked" : ""}
          hx-input="http://localhost:3000/todo/${todo.id}" hx-trigger="click"
          hx-target="#todo-list" />
          <label for="todo_${todo.id}">${todo.title}</label>
          <button
            hx-delete="http://localhost:3000/todo/${todo.id}"
            hx-trigger="click"
            hx-target="#todo-list"
          >
            ❌
          </button>
        </li>`
    );
}
