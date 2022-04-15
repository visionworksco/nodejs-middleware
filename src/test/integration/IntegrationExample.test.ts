/**
 * @group integration
 */

import { DateUtils } from '../../api/utils/DateUtils';

describe('IntegrationExample', () => {
  test('IntegrationExample', () => {
    const dateStr = '2021-12-23T16:17:52.643Z';
    DateUtils.fromISOString(dateStr);
    expect(true).toBe(true);
  });
});
