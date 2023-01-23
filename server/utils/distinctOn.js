export default function distinctOn(...props) {
  return (arr) =>
    arr.filter(
      (item, index, arr) =>
        arr.findIndex((x) => props.every((p) => x[p] === item[p])) === index
    );
}
