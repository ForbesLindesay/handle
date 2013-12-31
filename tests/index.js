'use strict';

var test = require('tape');
var handle = require('../');

var ul = document.createElement('ul');
ul.setAttribute('style', 'display: none;');
document.body.appendChild(ul);

function click(element) {
  var event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
}


test('handle(element, event, function)', function (t) {
  t.plan(4);
  var li = document.createElement('li');
  ul.appendChild(li);
  var disposeA = handle(li, 'click', function (el, e) {
    disposeA();
    t.equal(el, li, 'the element the event is bound to is the first argument');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
  });
  var disposeB = handle(ul, 'click', function (el, e) {
    disposeB();
    t.equal(el, ul, 'the element the event is bound to is the first argument');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
    ul.removeChild(li);
  });
  click(li);
});

test('handle(elements, event, function)', function (t) {
  t.plan(6);
  var liA = document.createElement('li');
  ul.appendChild(liA);
  var liB = document.createElement('li');
  ul.appendChild(liB);
  var liC = document.createElement('li');
  ul.appendChild(liC);
  
  var i = 0;
  var list = {
    0: liA,
    1: liB,
    2: liC,
    length: 3
  };
  handle(list, 'click', function (element, e) {
    ul.removeChild(element);
    t.equal(element, list[i++], 'the element the event is bound to is the first argument');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
  });
  click(liA);
  click(liB);
  click(liC);
});

test('handle(selector, event, function)', function (t) {
  t.plan(4);
  handle('ul', 'click', function (element, e) {
    t.assert(element === ul, 'the element the event is bound to is the first argument');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
  });
  handle('ul > li', 'click', function (element, e) {
    t.assert(element === li, 'the element the event is bound to is the first argument');
    t.assert(typeof e.preventDefault === 'function', 'the second argument is the event args');
  });
  
  var li = document.createElement('li');
  ul.appendChild(li);
  click(li);
});
