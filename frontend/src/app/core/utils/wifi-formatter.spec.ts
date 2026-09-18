import { formatWifiPayload } from './wifi-formatter';
import { WifiConfig } from '../models/live-qr.model';

describe('formatWifiPayload', () => {
  it('should format a WPA connection correctly', () => {
    const config: WifiConfig = {
      ssid: 'MyNetwork',
      encryption: 'WPA',
      password: 'MySuperPassword123!',
      hidden: false
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:MySuperPassword123!;H:false;;');
  });

  it('should format a WEP connection correctly', () => {
    const config: WifiConfig = {
      ssid: 'OldNetwork',
      encryption: 'WEP',
      password: 'WEPPassword',
      hidden: true
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:T:WEP;S:OldNetwork;P:WEPPassword;H:true;;');
  });

  it('should format a nopass connection correctly without P tag', () => {
    const config: WifiConfig = {
      ssid: 'GuestNetwork',
      encryption: 'nopass',
      hidden: false
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:T:nopass;S:GuestNetwork;H:false;;');
  });

  it('should escape special characters in SSID and password', () => {
    const config: WifiConfig = {
      ssid: 'Net\\work;Name:Test,',
      encryption: 'WPA',
      password: 'Pass\\word;123:456,',
      hidden: false
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:T:WPA;S:Net\\\\work\\;Name\\:Test\\,;P:Pass\\\\word\\;123\\:456\\,;H:false;;');
  });
});
