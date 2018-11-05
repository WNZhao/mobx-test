import { observable, action, computed, observe } from 'mobx';
import React, {Component,Fragment} from 'react';
import ReactDOM from 'react-dom';
import {observer, PropTypes as ObservableProptypes } from 'mobx-react';
import PropTypes from 'prop-types';
import { finished } from 'stream';

/* 
   实体类
*/
class Todo {
    id = Math.random();
    // 标题 可以修改，所以要用observable修饰
    @observable title = '';
    // 是否已完成的标志位
    @observable finished =  false;

    constructor(title) {
        this.title = title;
    }
    // 更新finished的值
    @action.bound toggle() {
        this.finished = !this.finished;
    }
}

/* 
  Store对象
*/
class Store {
    @observable todos = [];

    @action.bound createTodo(title) {
        this.todos.unshift(new Todo(title))
    }
    @action.bound removeTodo(todo) {
        // mobx在上的remove
        this.todos.remove(todo)
    }
    // 未完成条目
    @computed get left() {
        return this.todos.filter(todo => !todo.finished).length
    }

    constructor() {
        observe(this.todos, change => {
            console.log(change)
        })
    }
}

var store = new Store();

@observer
class TodoItem extends Component {
    static propTypes = {
        todo: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            finished: PropTypes.bool.isRequired
        })
    }
    handleClick = (e) => {
        this.props.todo.toggle();
    }
    render() {
        const {todo:{finished,title}} = this.props;
        return <Fragment><input type="checkbox" className="toggle" readOnly checked={finished} defaultValue="" onClick={this.handleClick}/>
        <span className={["title",finished && "finished"].join(" ")}>{title}</span></Fragment>
    }
}

@observer
class TodoList extends Component {
    static propTypes = {
        store: PropTypes.shape({
            createTodo: PropTypes.func,
            todos: ObservableProptypes.observableArrayOf(ObservableProptypes.objectOrObservableObject).isRequired
        }).isRequired
    }
    state = {
        inputValue: ''
    }
    handleSubmit = (e) => {
        e.preventDefault();
        var store = this.props.store;
        var inputValue = this.state.inputValue;
        store.createTodo(inputValue);
        this.setState({inputValue: ''})
    }
    handleChange = (e) => {
        var inputValue = e.target.value;
        this.setState({
            inputValue
        })
    }
    render() {
        const store = this.props.store;
        const todos = store.todos;
        return <div className="todo-list">
           <header>
            <form onSubmit={this.handleSubmit}>
              <input type="text" onChange={this.handleChange} value={this.state.inputValue} className="input" placeholder="What needs to be finished" />
            </form>
           </header>
           <ul>
           {todos.map(todo=>{
               return <li className="todo-item" key={todo.id}>
                <TodoItem todo={todo} />
                <span className="delete" onClick={(e)=>store.removeTodo(todo)}>X</span>
               </li>
           })}
           </ul>
           <footer>
             {store.left} item(s) unfinished
           </footer>
        </div>
    }
}

ReactDOM.render(<TodoList store={store} />, document.getElementById('xx'))