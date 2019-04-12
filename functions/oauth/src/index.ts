import * as random from 'lodash/random';

console.log('starting function');

export default (e, ctx, cb) => {
  console.log('processing event: %j', e);
  cb(null, { rand: random(0, 100) });
};