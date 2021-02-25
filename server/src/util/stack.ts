// Why doesnt JavaScript have a Stack data structure lol

// Part of the stackeroo
interface StackNode<T> {
	value: T | null;
	next: StackNode<T> | null;
}

export default interface Stack<T> {
	top: StackNode<T> | null;
	bottom: StackNode<T> | null;
	size: number;
	push(val: T): void;
	pop(): StackNode<T> | null;
}

class StackNode<T> implements StackNode<T> {
	constructor(val: T) {
		this.value = val;
		this.next = null;
	}
}

export default class Stack<T = string> implements Stack<T> {
	public constructor() {
		this.size = 0;
		this.top = null;
		this.bottom = null;
	}

	public push(val: T) {
		const new_node = new StackNode(val);
		if (this.size == 0) {
			this.top = new_node;
			this.bottom = new_node;
		} else {
			new_node.next = this.top;
			this.top = new_node;
		}

		this.size += 1;
	}

	public pop() {
		if (this.size == 0) {
			return null;
		}

		const popped_node = this.top as StackNode<T>;
		this.top = popped_node.next;
		popped_node.next = null;

		this.size -= 1;
		return popped_node;
	}
}
