import { observable, action } from 'mobx';


export default class Store {
   @observable cache = {
        queue: []
    }
   @action.bound refresh(){
       this.cache.queue.push(1);
   }
}