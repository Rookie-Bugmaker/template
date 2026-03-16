export function uuid(len: number, radix = 0): string {
  const chars: string[] = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    '',
  );
  const uuids: string[] = [];
  let i: number;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuids[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuids[8] = uuids[13] = uuids[18] = uuids[23] = '-';
    uuids[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuids[i]) {
        r = 0 | (Math.random() * 16);
        uuids[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  const result = uuids.join('');

  if (/^[0-9]+/.test(result)) {
    return uuid(len, radix);
  } else {
    return result;
  }
}
