// export const permutations = (arr: number[]): any => {
//   if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
//   return arr.reduce(
//     (acc: number[][], item: number, i: number) =>
//       acc.concat(
//         permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((val: number[]) => [
//           item,
//           ...val,
//         ])
//       ),
//     []
//   );
// };

export const permutations = (arr) => {
  let ret = [];
  let strs = []

  for (let i = 0; i < arr.length; i = i + 1) {
    let rest = permutations(arr.slice(0, i).concat(arr.slice(i + 1)));

    if(!rest.length) {
      ret.push([arr[i]])
      strs.push([arr[i]].join(","));
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        const sub = [arr[i]].concat(rest[j]);
        const str = sub.join(",");
        if (strs.includes(str)) continue;
        ret.push(sub);
        strs.push(str);
      }
    }
  }
  return ret;
}

export const maskPermutations = (length: number): number[][] => {
  let arrays = [new Array(length).fill(1)];
  let base = new Array(length).fill(0);
  for (let i = 0; i < length - 1; i++) {
    base[i] = 1;
    const perms = permutations(base);
    console.log("Perms for", base, perms)
    arrays = arrays.concat(perms)
  }
  return arrays;
};
