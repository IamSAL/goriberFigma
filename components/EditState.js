/**
 * Editing : we will save element states into an queue, and the length of queue
 * is fixed amount, for example, 0..99, each element will be insert into the top
 * of queue, queue.push, and when the queue is full, we will shift the queue,
 * to remove the oldest element from the queue, queue.shift, and then we will
 * do push.
 *
 * So the latest state will be at the top of queue, and the oldest one will be
 * at the bottom of the queue (0), and the top of queue is changed, could be
 * 1..99.
 *
 * The initialized action is "set", it will insert item into the top of queue,
 * even if it arrived the length of queue, it will queue.shift, but still do
 * the same thing, and queue only abandon the oldest element this time. When
 * the current is changed and new state is coming, then this time, top will be
 * current + 1.
 *
 * The prev action is to fetch "previous state" of the element, and it will use
 * "current" to do this job, first, we will --current, and then we will return
 * the item of it, because "current" always represent the "current state" of
 * element. When the current is equal 0, that means, we have fetched the last
 * element of the queue, and then it arrived at the bottom of the queue.
 *
 * The next action is to fetch "next state" after current element, and it will
 * use "current++" to do the job, when the current is equal to "top", it means
 * we have fetched the latest element, so we should stop.
 *
 * If the action changed from prev/next to "set", then we should reset top to
 * "current", and abandon all rest after that...
 *
 * Here we should know that, if we keep the reference in the queue, the item
 * in the queue will never be released.
 *
 *
 * @constructor
 */
function Editing() {
  this.queue = [];
  this.length = 4;
  this.bottom = 0;
  this.top = 0;
  this.current = 0;
  this.empty = true;

  // At the Begin of Queue
  this.BOQ = true;

  // At the End of Queue
  this.EOQ = true;

  // 0: set, 1: prev, 2: next
  this._action = 0;
  this._round = 0;
}

Editing.sharedInst = null;
Editing.getInst = function (owner) {
  if (Editing.sharedInst === null) {
    Editing.sharedInst = new Editing(owner);
  }

  return Editing.sharedInst;
};

/**
 * To set the item into the editing queue, and mark the EOQ, BOQ, so we know
 * the current position.
 *
 * @param item
 */
Editing.prototype.set = function (item) {
  console.log("=== Editing.set");

  var result = null;

  if (this._action != 0) {
    this.top = this.current + 1;
  }

  if (this.top >= this.length) {
    result = this.queue.shift();
    this.top = this.length - 1;
  }

  this._action = 0;
  this.queue[this.top] = item;
  this.current = this.top;
  this.top++;

  this.empty = false;
  this.EOQ = true;
  this.BOQ = false;

  console.log("==> INFO : ");
  console.log(item);
  console.log("===========");
  console.log("current: ", 0 + this.current);
  console.log("start: ", 0 + this.bottom);
  console.log("end: ", 0 + this.top);

  return result;
};

/**
 * To fetch the previous item just before current one
 *
 * @returns {item|boolean}
 */
Editing.prototype.prev = function () {
  console.log("=== Editing.prev");

  if (this.empty) {
    return false;
  }

  if (this.BOQ) {
    return false;
  }

  this._action = 1;

  this.current--;

  if (this.current == this.bottom) {
    this.BOQ = true;
  }

  var item = this.queue[this.current];
  this.EOQ = false;

  console.log("==> INFO : ");
  console.log(item);
  console.log("===========");
  console.log("current: ", 0 + this.current);
  console.log("start: ", 0 + this.bottom);
  console.log("end: ", 0 + this.top);

  return item;
};

/**
 * To fetch the next item just after the current one
 *
 * @returns {*|boolean}
 */
Editing.prototype.next = function () {
  console.log("=== Editing.next");

  if (this.empty) {
    return false;
  }

  if (this.EOQ) {
    return false;
  }

  this.current++;

  if (this.current == this.top - 1 && this.top < this.length) {
    this.EOQ = true;
  }

  if (this.current == this.top - 1 && this.top == this.length) {
    this.EOQ = true;
  }

  this._action = 2;

  var item = this.queue[this.current];
  this.BOQ = false;

  console.log("==> INFO : ");
  console.log(item);
  console.log("===========");
  console.log("current: ", 0 + this.current);
  console.log("start: ", 0 + this.bottom);
  console.log("end: ", 0 + this.top);

  return item;
};

/**
 * To empty the editing and reset all state
 */
Editing.prototype.clear = function () {
  this.queue = [];
  this.bottom = 0;
  this.top = 0;
  this.current = 0;
  this.empty = true;
  this.BOQ = true;
  this.EOQ = false;
};

export default Editing;
