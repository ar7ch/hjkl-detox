// Runs the game's motion engine and par solver outside the browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const g = vm.runInNewContext(script + ';({ makeBuf, MOT, find, plan, DRILLS, SNIPPETS, lessonMove, explain, coach, mv })');

const B = g.makeBuf('foo.bar baz\n\n  qux(a, b)\nend');
const pos = s => [B.flat[s.i].l, B.flat[s.i].c];
const start = { i: 0, want: 0 };

test('word motions', () => {
  assert.deepEqual(pos(g.MOT.w(B, start)), [0, 3]);
  assert.deepEqual(pos(g.MOT.W(B, start)), [0, 8]);
  assert.deepEqual(pos(g.MOT.w(B, start, 4)), [1, 0]);
  assert.deepEqual(pos(g.MOT.e(B, start)), [0, 2]);
  const q = g.MOT.w(B, start, 5);
  assert.deepEqual(pos(q), [2, 2]);
  assert.deepEqual(pos(g.MOT.b(B, q)), [1, 0]);
  assert.deepEqual(pos(g.MOT.ge(B, q)), [1, 0]);
});

test('line, block and vertical motions', () => {
  const q = g.MOT.w(B, start, 5);
  assert.deepEqual(pos(g.MOT['%'](B, q)), [2, 10]);
  assert.deepEqual(pos(g.MOT['}'](B, start)), [1, 0]);
  assert.deepEqual(pos(g.find(B, q, 1, ',', 'f')), [2, 7]);
  assert.deepEqual(pos(g.find(B, q, 1, ',', 't')), [2, 6]);
  assert.deepEqual(pos(g.MOT.j(B, { i: 10, want: 10 }, 2)), [2, 10]);
});

test('every drill finds targets with a par of at least 2', () => {
  for (const text of g.SNIPPETS) {
    const buf = g.makeBuf(text);
    for (const d of g.DRILLS) {
      const p = g.plan(buf, g.mv(buf, buf.start[0]), d);
      assert.ok(p, `${d.id} found no target`);
      assert.ok(p.d >= 2);
    }
  }
});

test('lesson steps can be generated', () => {
  const buf = g.makeBuf(g.SNIPPETS[0]);
  for (const d of g.DRILLS) for (const [spec] of d.lessons) {
    let ok = false;
    for (let i = 0; i < 200 && !ok; i++) ok = !!g.lessonMove(buf, g.mv(buf, (i * 37) % buf.N), spec)?.t;
    assert.ok(ok, `${d.id}: ${spec}`);
  }
});

test('explanations and coaching', () => {
  assert.equal(g.explain('5j'), '5 lines down');
  assert.equal(g.explain('12G'), 'to line 12');
  assert.equal(g.explain('0'), 'to column 0');
  assert.deepEqual([...g.coach(['j', 'j', 'j', 'l'])], ['j×3 is 3j']);
});
