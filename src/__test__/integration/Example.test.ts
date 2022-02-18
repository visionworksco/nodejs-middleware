/**
 * @group integration
 */

import { DateUtils } from '../../utils/DateUtils';

describe('Example', () => {
  test('Example', () => {
    const dateStr = '2021-12-23T16:17:52.643Z';
    DateUtils.fromISOString(dateStr);
    expect(true).toBe(true);
  });
});
