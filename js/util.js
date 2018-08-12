'use strict';

const resolveTime = (m) => {
  if (m === undefined) return '--:--';
  return padStart(Math.floor(m / 60)) + ':' + padStart(m % 60);
}

const padStart = (n, m) => {
  return '0'.repeat(m - n.toString().length) + n;
}
