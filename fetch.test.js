import assert from 'assert';

function test() {
    assert.strictEqual(true, true, 'This test will always pass');
}

function test2() {
    assert.strictEqual(true, true, 'Otra prueba valida');
}

test();
test2();