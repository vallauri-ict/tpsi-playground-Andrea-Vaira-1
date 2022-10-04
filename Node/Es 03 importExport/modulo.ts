const PI = 3.14;
let months = ['Jan','Feb','Mar','Apr','Aug','Sep','Oct','Nov','Dec'];


export function sayHi(name) {
	return "Hi " + name 
}


export default class User {
	public title:string
	public name:string 
	constructor(title, name) {
		this.title = title;
		this.name = name;
	}
	public concat() {
		return this.title + ". " + this.name
	}
	public PI = 3.14
	public months = ['Jan','Feb','Mar','Apr','Aug','Sep','Oct','Nov','Dec'];
} 

export {PI, months};


