describe("multiply", function() {
  it("should return the product of two numbers", function() {
    expect(multiply(2,3)).toEqual(6);
    expect(multiply(-1,1)).toEqual(-1);
    expect(multiply(1,0)).toEqual(0);
    expect(multiply(-1,-1)).toEqual(1);
  });
});

describe("divide", function() {
  it("should return the value of a / b", function() {
    expect(divide(3,3)).toEqual(1);
    expect(divide(6,2)).toEqual(3);
  });
 
  it("should throw an error if you try to divide by 0", function() {
    expect(function() { divide(1,0); }).toThrow();
  });
});

describe("createList", function() {
  var items = [ 'apple', 'orange', 'pear' ];
 
  it("should return a jquery object containing an unordered list", function() {
    var list = createList(items);
    expect(list).toBeDefined();
    expect(list.jquery).toBeDefined();
    expect(list.length).toBe(1);
    expect(list[0].nodeName.toLowerCase()).toBe('ul');
  });
 
  it("should contain the correct number of list items", function() {
    var list = createList(items);
    expect(list.children().length).toBe(3);
    expect(list.children('li').length).toBe(list.children().length);
  });
 
  it("should properly populate the list items", function() {
    var list = createList(items);
    expect(list.children().eq(1).html()).toEqual('orange');
  });
 
  it("should only use an item if it is a string", function() {
    var list = createList([ 'apple', 1, false, {}, [], 'pear' ]);
    expect(list.children().length).toBe(2);
  });
 
  it("should add a click handler to its list items that adds a class of 'clicked'", function() {
    var list = createList(items),
        li = list.find('li').click();
 
    expect(li.hasClass('clicked')).toBeTruthy();
  });
 
  /*
  it("should only use items that are at least three characters long", function() {
    var list = createList([ 'a', 'long enough' ]);
    expect(list.children().length).toBe(1);
  });
  */
});

describe( "deepEqual test", function() {
	it('Two objects can be the same in value', function(){
		var obj = { foo: "bar" };
		expect(obj).toEqual({ foo: "bar" });
	});
});

var jasmineEnv = jasmine.getEnv();
var htmlReporter = new jasmine.HtmlReporter();
jasmineEnv.addReporter(htmlReporter);
jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
};

window.onload = function() {jasmineEnv.execute();};