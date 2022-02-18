export class NumberUtils {
  static round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  static roundWithExp(value: number, exp: number): number {
    if (typeof exp === 'undefined' || +exp === 0) return Math.round(value);

    value = +value;
    exp = +exp;

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) return NaN;

    // Shift
    const valueSplitted = value.toString().split('e');
    value = Math.round(
      +(valueSplitted[0] + 'e' + (valueSplitted[1] ? +valueSplitted[1] + exp : exp)),
    );

    // Shift back
    const valueSplitted2 = value.toString().split('e');
    return +(valueSplitted2[0] + 'e' + (valueSplitted2[1] ? +valueSplitted2[1] - exp : -exp));
  }
}
