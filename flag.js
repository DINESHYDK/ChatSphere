let vis = { option: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }] };
let obj = {
  ...vis,
    option: vis.option.map((temp, idx) => {
        return {...temp, a: 69}
    }),
};
console.log(obj);
