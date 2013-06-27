test('trim()', function () {
  equal(trim(''), '', 'Пустая строка');
  ok(trim('   ') === '', 'Строка из пробельных символов');
  deepEqual(trim(), '', 'Без параметра');

  equal(trim(' x'), 'x', 'Начальные пробелы');
  equal(trim('x '), 'x', 'Концевые пробелы');
  equal(trim(' x '), 'x', 'Пробелы с обоих концов');
  equal(trim('    x  '), 'x', 'Табы');
  equal(trim('    x   y  '), 'x   y', 'Табы и пробелы внутри строки не трогаем');
});

test( "deepEqual test", function() {
  var obj = { foo: "bar" };
 
  deepEqual( obj, { foo: "bar" }, "Two objects can be the same in value" );
});